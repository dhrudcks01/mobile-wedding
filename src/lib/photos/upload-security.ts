import "server-only";
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";
import { wedding } from "@/data/wedding";
import { uploadConfig } from "./upload-config";
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
  const end = Date.parse(uploadConfig.closesAt);
  const googleSettings = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_DRIVE_FOLDER_ID",
  ];
  return uploadConfig.enabled && Number.isFinite(end) && end > Date.now() &&
    googleSettings.every((name) => Boolean(process.env[name]?.trim()));
}

// 행사 키 없이 접속할 수 있습니다. 다른 웹사이트에서 보내는 브라우저 요청은 거부합니다.
// Origin 검사는 봇 방어나 사용자 인증을 대신하지 않습니다.
export function checkUploadRequest(request: Request) {
  if (!isUploadOpen()) {
    throw new UploadError("현재 사진·동영상 접수가 열려 있지 않습니다.", 503);
  }
  const origin = request.headers.get("origin");
  const siteOrigin = new URL(wedding.meta.url).origin;
  const isLocalDevelopment = process.env.NODE_ENV === "development" &&
    origin === new URL(request.url).origin;
  if (origin !== siteOrigin && !isLocalDevelopment) {
    throw new UploadError("업로드 페이지에서 다시 시도해 주세요.", 403);
  }
}
export type UploadSession = {
  url: string;
  size: number;
  mime: string;
  id: string;
  expires: number;
};
// 서버에 이미 있는 Google 비밀값에서 업로드 전용 암호화 키를 파생합니다.
// 별도 키 등록이 필요 없으며 원본 Google 비밀값은 브라우저에 보내지 않습니다.
// Google 비밀값/클라이언트/폴더를 바꾸면 진행 중인 업로드 연결도 만료됩니다.
function secret() {
  return createHmac("sha256", required("GOOGLE_CLIENT_SECRET"))
    .update(JSON.stringify([
      "mobile-wedding/photos/session/v1",
      required("GOOGLE_CLIENT_ID"),
      required("GOOGLE_DRIVE_FOLDER_ID"),
    ]))
    .digest();
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
