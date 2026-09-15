import { checkUploadRequest, uploadErrorResponse, jsonResponse, readRequestBody, UploadError } from "@/lib/photos/upload-security";
import { createDriveSession } from "@/lib/photos/google-drive";
import { validateFile } from "@/lib/photos/upload-rules";
export const runtime = "nodejs";
export const maxDuration = 60;
// 사진 한 개의 정보를 검증하고 Drive 업로드 연결을 만듭니다.
export async function POST(request: Request) {
  try {
    checkUploadRequest(request);
    let data;
    try {
      data = JSON.parse((await readRequestBody(request, 4096)).toString());
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError("파일 정보를 확인해 주세요.");
    }
    if (!data || typeof data !== "object") {
      throw new UploadError("파일 정보를 확인해 주세요.");
    }
    let file;
    try {
      file = validateFile(data.name, data.size, data.type);
    } catch (error) {
      throw new UploadError(error instanceof Error ? error.message : "지원하지 않는 파일입니다.");
    }
    if (typeof data.guest !== "string" || data.guest.length > 40) {
      throw new UploadError("이름은 40자 이내로 입력해 주세요.");
    }
    return jsonResponse({ session: await createDriveSession(file, data.guest.trim()) });
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
