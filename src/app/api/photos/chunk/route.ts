import { checkUploadRequest, uploadErrorResponse, jsonResponse, readRequestBody, decodeUploadSession, UploadError } from "@/lib/photos/upload-security";
import { requestDrive, getUploadResult } from "@/lib/photos/google-drive";
import { CHUNK_BYTES } from "@/lib/photos/upload-rules";
export const runtime = "nodejs";
export const maxDuration = 60;
// 재시도 전에 Drive가 어디까지 받았는지 확인합니다.
export async function POST(request: Request) {
  try {
    checkUploadRequest(request);
    const session = decodeUploadSession(request.headers.get("x-upload-session"));
    const response = await requestDrive(session.url, { method: "PUT", headers: { "Content-Length": "0", "Content-Range": `bytes */${session.size}` } });
    return jsonResponse(await getUploadResult(response, session));
  } catch (error) {
    return uploadErrorResponse(error);
  }
}

// 사진 또는 동영상의 다음 조각(최대 2MiB)을 Drive로 보냅니다.
export async function PUT(request: Request) {
  try {
    checkUploadRequest(request);
    const session = decodeUploadSession(request.headers.get("x-upload-session"));
    const raw = request.headers.get("x-upload-offset") ?? "";
    if (!/^\d+$/.test(raw)) {
      throw new UploadError("전송 위치가 올바르지 않습니다.");
    }
    const offset = Number(raw);
    if (!Number.isSafeInteger(offset) || offset < 0 || offset >= session.size) {
      throw new UploadError("전송 위치가 올바르지 않습니다.");
    }
    const data = await readRequestBody(request);
    if (!data.length || offset + data.length > session.size || (offset + data.length < session.size && data.length !== CHUNK_BYTES)) {
      throw new UploadError("전송 크기가 올바르지 않습니다.");
    }
    const response = await requestDrive(session.url, {
      method: "PUT", headers: {
        "Content-Type": session.mime, "Content-Length": String(data.length), "Content-Range": `bytes ${offset}-${offset + data.length - 1}/${session.size}`
      },
      body: new Uint8Array(data),
    });
    return jsonResponse(await getUploadResult(response, session));
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
