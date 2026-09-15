// 하객 화면과 서버에서 함께 사용하는 파일 제한입니다.
export const CHUNK_BYTES = 2 * 1024 * 1024;
export const MAX_FILE_BYTES = 500 * 1024 * 1024;
export const MAX_FILES = 30;
const formats: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  heic: "image/heic", heif: "image/heif", webp: "image/webp",
  mp4: "video/mp4", mov: "video/quicktime", m4v: "video/x-m4v",
};
export const ACCEPT = Object.keys(formats).map((ext) => `.${ext}`).join(",");
export function validateFile(name: unknown, size: unknown, type: unknown) {
  if (typeof name !== "string" || !name.trim() || name.length > 240) {
    throw new Error("파일 이름을 확인해 주세요.");
  }
  if (typeof size !== "number" || !Number.isSafeInteger(size) || size <= 0 || size > MAX_FILE_BYTES) {
    throw new Error("파일당 500MB 이하의 사진·동영상을 선택해 주세요.");
  }
  const mime = formats[name.split(".").pop()?.toLowerCase() ?? ""];
  if (!mime || (type && type !== "application/octet-stream" && type !== mime)) {
    throw new Error("JPG, PNG, HEIC, HEIF, WEBP, MP4, MOV, M4V 파일을 선택해 주세요.");
  }
  return {
    name: name.replace(/[\\/\x00-\x1f]/g, "_"), size, mime
  };
}

export function receivedOffset(range: string | null, size: number) {
  if (!range) {
    return 0;
  }
  const match = /^bytes=0-(\d+)$/.exec(range);
  const offset = match ? Number(match[1]) + 1 : NaN;
  if (!Number.isSafeInteger(offset) || offset < 1 || offset > size) {
    throw new Error("업로드 위치를 확인할 수 없습니다.");
  }
  return offset;
}
