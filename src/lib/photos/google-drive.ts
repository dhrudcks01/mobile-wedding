import "server-only";
import { receivedOffset } from "./upload-rules";
import { required, UploadError, encodeUploadSession, type UploadSession } from "./upload-security";
let cachedToken: {
  token: string;
  until: number;
} | undefined;
async function getAccessToken() {
  if (cachedToken && cachedToken.until > Date.now()) {
    return cachedToken.token;
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", body: new URLSearchParams({
      client_id: required("GOOGLE_CLIENT_ID"), client_secret: required("GOOGLE_CLIENT_SECRET"),
      refresh_token: required("GOOGLE_REFRESH_TOKEN"), grant_type: "refresh_token",
    }), cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new UploadError("저장소 연결을 확인 중입니다. 잠시 후 다시 시도해 주세요.", 503);
  }
  const data = await response.json();
  if (typeof data.access_token !== "string") {
    throw new UploadError("저장소 연결 오류입니다.", 503);
  }
  cachedToken = { token: data.access_token, until: Date.now() + Math.max(0, Number(data.expires_in) - 60) * 1000 };
  return cachedToken.token;
}

export async function requestDrive(url: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${await getAccessToken()}`);
  return fetch(url, {
    ...init, headers, redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(25000)
  });
}

// 1. Drive에서 파일 ID를 받고, 2. 이어 올리기 연결을 만든 후, 3. 암호화해 반환합니다.
export async function createDriveSession(file: {
  name: string;
  size: number;
  mime: string;
}, guest: string) {
  const ids = await requestDrive("https://www.googleapis.com/drive/v3/files/generateIds?count=1&space=drive&type=files");
  if (!ids.ok) {
    throw new UploadError("저장소에 연결할 수 없습니다.", 502);
  }
  const id = (await ids.json()).ids?.[0];
  if (typeof id !== "string") {
    throw new UploadError("저장소 응답 오류입니다.", 502);
  }
  const response = await requestDrive("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,size", {
    method: "POST", headers: {
      "Content-Type": "application/json", "X-Upload-Content-Type": file.mime, "X-Upload-Content-Length": String(file.size)
    },
    body: JSON.stringify({
      id, name: `${new Date().toISOString().replace(/[:.]/g, "-")}_${file.name}`,
      parents: [required("GOOGLE_DRIVE_FOLDER_ID")], mimeType: file.mime,
      description: guest ? `하객: ${guest}` : "결혼식 하객 사진·동영상"
    }),
  });
  const url = response.headers.get("location");
  if (!response.ok || !url) {
    throw new UploadError("업로드를 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.", 502);
  }
  return encodeUploadSession({
    url, size: file.size, mime: file.mime, id, expires: Date.now() + 24 * 60 * 60 * 1000
  });
}

async function isFileSaved(session: UploadSession) {
  const response = await requestDrive(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(session.id)}?fields=id,size`);
  if (!response.ok) {
    return false;
  }
  const file = await response.json();
  return file.id === session.id && Number(file.size) === session.size;
}

export async function getUploadResult(response: Response, session: UploadSession) {
  if (response.status === 308) {
    return { done: false, offset: receivedOffset(response.headers.get("range"), session.size) };
  }
  if (response.ok || response.status === 404 || response.status === 410) {
    // 마지막 응답이 유실되어도 같은 파일 ID를 조회해 중복 업로드를 막습니다.
    if (await isFileSaved(session)) {
      return { done: true, offset: session.size };
    }
    if (response.status === 404 || response.status === 410) {
      throw new UploadError("연결이 만료되었습니다. 파일을 다시 선택해 주세요.", 410);
    }
  }
  throw new UploadError("전송을 확인하지 못했습니다. 다시 시도해 주세요.", 502);
}
