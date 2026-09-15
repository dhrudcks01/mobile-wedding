import { CHUNK_BYTES } from "./upload-rules";
type UploadProgress = {
  done: boolean;
  offset: number;
};
export class TransferError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function requestUploadApi(path: string, init: RequestInit) {
  const response = await fetch(`/api/photos/${path}`, {
    ...init, signal: AbortSignal.timeout(60000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new TransferError(data.error ?? "전송하지 못했습니다. 다시 시도해 주세요.", response.status);
  }
  return data;
}

export async function createUploadSession(file: File, guest: string): Promise<string> {
  const data = await requestUploadApi("session", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: file.name, size: file.size, type: file.type, guest
    })
  });
  return data.session;
}

// 한 파일을 작은 조각으로 나누어 순서대로 보냅니다. 실패하면 최대 3회 재시도합니다.
export async function uploadFile(file: File, session: string, onProgress: (percent: number) => void) {
  const headers = { "x-upload-session": session };
  let failures = 0;
  let state: UploadProgress | undefined;
  while (true) {
    try {
      if (!state) {
        state = await requestUploadApi("chunk", { method: "POST", headers }) as UploadProgress;
      }
      if (!Number.isSafeInteger(state.offset) || state.offset < 0 || state.offset > file.size) {
        throw new Error("전송 위치를 확인할 수 없습니다.");
      }
      if (state.done) {
        onProgress(100);
        return;
      }
      onProgress(Math.min(99, Math.floor(state.offset / file.size * 100)));
      if (state.offset === file.size) {
        throw new Error("저장 완료를 확인 중입니다. 다시 시도해 주세요.");
      }
      const previous = state.offset;
      state = await requestUploadApi("chunk", {
        method: "PUT", headers: {
          ...headers, "x-upload-offset": String(previous), "Content-Type": "application/octet-stream"
        }, body: file.slice(previous, previous + CHUNK_BYTES)
      }) as UploadProgress;
      if (!state.done && state.offset <= previous) {
        throw new Error("전송이 지연되고 있습니다.");
      }
      failures = 0;
    } catch (error) {
      if (error instanceof TransferError && error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      if (++failures > 3) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** failures));
      state = undefined; // 응답이 끊겼다면 Drive에 실제로 저장된 위치부터 다시 시작합니다.
    }
  }
}
