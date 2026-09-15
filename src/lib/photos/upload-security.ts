import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { CHUNK_BYTES, MAX_FILE_BYTES } from "./upload-rules";
export class UploadError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new UploadError("아직 사진을 받을 준비 중입니다. 잠시 후 다시 방문해 주세요.", 503);
  }
  return value;
}

export function isUploadOpen() {
  const end = Date.parse(process.env.UPLOAD_CLOSES_AT ?? "");
  try {
    const origin = new URL(process.env.UPLOAD_ORIGIN ?? "");
    if (!["http:", "https:"].includes(origin.protocol) || origin.origin !== process.env.UPLOAD_ORIGIN) {
      return false;
    }
  } catch {
    return false;
  }
  return process.env.UPLOAD_ENABLED === "true" && Number.isFinite(end) && end > Date.now() &&
    (process.env.UPLOAD_SESSION_SECRET?.length ?? 0) >= 32 &&
    ["UPLOAD_ORIGIN", "UPLOAD_EVENT_KEY", "UPLOAD_SESSION_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_DRIVE_FOLDER_ID"].every((key) => Boolean(process.env[key]));
}

function equal(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

// 모든 업로드 API에서 접수 기간, 사이트 주소, QR 행사 키를 검사합니다.
export function checkUploadRequest(request: Request) {
  if (!isUploadOpen()) {
    throw new UploadError("현재 사진·동영상 접수가 열려 있지 않습니다.", 503);
  }
  if (request.headers.get("origin") !== required("UPLOAD_ORIGIN")) {
    throw new UploadError("업로드 페이지에서 다시 시도해 주세요.", 403);
  }
  if (!equal(request.headers.get("x-event-key") ?? "", required("UPLOAD_EVENT_KEY"))) {
    throw new UploadError("행사장 QR 코드로 다시 접속해 주세요.", 403);
  }
}
export type UploadSession = {
  url: string;
  size: number;
  mime: string;
  id: string;
  expires: number;
};
function secret() {
  const value = required("UPLOAD_SESSION_SECRET");
  if (value.length < 32) {
    throw new UploadError("업로드 설정을 확인 중입니다.", 503);
  }
  return createHash("sha256").update(value).digest();
}

// Drive 연결 정보가 브라우저에서 변조되지 않도록 암호화합니다.
export function encodeUploadSession(session: UploadSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secret(), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(session)), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

export function decodeUploadSession(value: string | null): UploadSession {
  try {
    if (!value || value.length > 6000) {
      throw new Error();
    }
    const data = Buffer.from(value, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", secret(), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const session = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString()) as UploadSession;
    const url = new URL(session.url);
    if (url.origin !== "https://www.googleapis.com" || url.pathname !== "/upload/drive/v3/files" || session.expires < Date.now() || !Number.isSafeInteger(session.size) || session.size <= 0 || session.size > MAX_FILE_BYTES) {
      throw new Error();
    }
    return session;
  } catch {
    throw new UploadError("업로드 연결이 만료되었습니다. 파일을 다시 선택해 주세요.", 410);
  }
}

// 파일 전체를 메모리에 읽지 않고 요청당 최대 2MiB까지만 받습니다.
export async function readRequestBody(request: Request, limit = CHUNK_BYTES) {
  const reader = request.body?.getReader();
  if (!reader) {
    throw new UploadError("파일 데이터가 없습니다.");
  }
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      length += value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new UploadError("전송 크기가 너무 큽니다.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, length);
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}

export function uploadErrorResponse(error: unknown) {
  return error instanceof UploadError ? jsonResponse({ error: error.message }, error.status) : jsonResponse({ error: "일시적으로 전송하지 못했습니다. 다시 시도해 주세요." }, 502);
}
