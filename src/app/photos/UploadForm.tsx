"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ACCEPT, MAX_FILES, MAX_FILE_BYTES, validateFile } from "@/lib/photos/upload-rules";
import { createUploadSession, uploadFile } from "@/lib/photos/upload-client";
import styles from "./photos.module.css";

type UploadItem = {
  id: string;
  file: File;
  status: "waiting" | "sending" | "done" | "error";
  progress: number;
  session?: string;
  error?: string;
};

function getStatusText(item: UploadItem) {
  if (item.status === "done") return "전달 완료 ✓";
  if (item.status === "sending") return `${item.progress}% 전달 중`;
  if (item.status === "error") return "다시 시도해 주세요";
  return "전달 대기";
}

export function UploadForm({ isOpen }: { isOpen: boolean }) {
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  // React 상태가 갱신되기 전의 빠른 더블 클릭도 막습니다.
  const uploadInProgress = useRef(false);

  useEffect(() => {
    if (!isUploading) return;
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [isUploading]);

  function updateFile(id: string, changes: Partial<UploadItem>) {
    setFiles((current) => current.map((item) => {
      if (item.id === id) return { ...item, ...changes };
      return item;
    }));
  }

  function removeFile(id: string) {
    setFiles((current) => current.filter((item) => item.id !== id));
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (uploadInProgress.current) return;

    const newFiles: UploadItem[] = [];
    const errors: string[] = [];
    for (const file of selectedFiles) {
      if (files.length + newFiles.length >= MAX_FILES) {
        errors.push(`한 번에 최대 ${MAX_FILES}개까지 선택할 수 있어요.`);
        break;
      }
      const duplicate = [...files, ...newFiles].some((item) =>
        item.file.name === file.name &&
        item.file.size === file.size &&
        item.file.lastModified === file.lastModified
      );
      if (duplicate) continue;

      try {
        validateFile(file.name, file.size, file.type);
        newFiles.push({ id: crypto.randomUUID(), file, status: "waiting", progress: 0 });
      } catch (error) {
        const reason = error instanceof Error ? error.message : "파일을 확인해 주세요.";
        errors.push(`${file.name}: ${reason}`);
      }
    }
    setFiles((current) => [...current, ...newFiles]);
    setMessage(errors.join("\n"));
  }

  // 파일별로 연결 만들기 → 전송 → 완료 표시. 실패한 파일만 다시 보냅니다.
  async function handleUpload() {
    if (uploadInProgress.current || !hasConsent || !isOpen) return;
    uploadInProgress.current = true;
    setIsUploading(true);
    setMessage("");

    try {
      for (const item of files) {
        if (item.status === "done") continue;
        updateFile(item.id, { status: "sending", error: undefined });
        try {
          const session = item.session ?? await createUploadSession(item.file, guestName);
          updateFile(item.id, { session });
          await uploadFile(item.file, session, (progress) => {
            updateFile(item.id, { progress });
          });
          updateFile(item.id, { status: "done", progress: 100 });
        } catch (error) {
          updateFile(item.id, {
            status: "error",
            error: error instanceof Error ? error.message : "연결을 확인하고 다시 시도해 주세요.",
          });
        }
      }
    } finally {
      uploadInProgress.current = false;
      setIsUploading(false);
    }
  }

  const completedCount = files.filter((item) => item.status === "done").length;
  const pendingCount = files.length - completedCount;
  const allCompleted = completedCount > 0 && pendingCount === 0;
  const canUpload = isOpen && hasConsent && pendingCount > 0 && !isUploading;
  let buttonText = "추억 전달하기";
  if (pendingCount > 0) buttonText = `${pendingCount}개의 추억 전달하기`;
  if (allCompleted) buttonText = "감사합니다. 추억을 잘 받았어요";
  if (isUploading) buttonText = "소중한 순간을 전달하고 있어요…";

  return (
    <section className={styles.form} aria-label="사진과 동영상 전달">
      {!isOpen && (
        <p className={styles.notice}>지금은 사진·동영상 접수 준비 중이거나 접수가 종료되었습니다.</p>
      )}

      <label className={styles.name}>
        보내는 분 <span>선택</span>
        <input
          maxLength={40}
          value={guestName}
          disabled={isUploading}
          placeholder="입력한 이름의 폴더에 사진을 모아 드려요"
          autoComplete="name"
          onChange={(event) => setGuestName(event.target.value)}
        />
      </label>

      <p className={styles.hint}>같은 이름은 같은 폴더에 저장됩니다. 미입력 시 익명으로 저장됩니다.</p>

      <label className={styles.picker}>
        <span className={styles.plus} aria-hidden="true">＋</span>
        <strong>사진 · 동영상 선택</strong>
        <span>여러 개를 한 번에 고를 수 있어요</span>
        <input
          type="file"
          accept={ACCEPT}
          multiple
          disabled={isUploading || !isOpen}
          onChange={handleFileSelect}
          aria-label="사진과 동영상 파일 선택"
        />
      </label>
      <p className={styles.hint}>
        원본으로 전달됩니다 · 파일당 최대 {MAX_FILE_BYTES / 1024 / 1024}MB · 최대 {MAX_FILES}개
      </p>

      {message && <p role="alert" className={styles.notice}>{message}</p>}
      {files.length > 0 && (
        <>
          <div className={styles.summary}>
            <span>선택한 추억 {files.length}개</span>
            <span aria-live="polite">전달 완료 {completedCount}개</span>
          </div>
          <ul className={styles.list}>
            {files.map((item) => (
              <li key={item.id}>
                <div className={styles.fileTop}>
                  <span className={styles.fileName}>{item.file.name}</span>
                  {!isUploading && (
                    <button
                      type="button"
                      className={styles.remove}
                      aria-label={`${item.file.name} 목록에서 지우기`}
                      onClick={() => removeFile(item.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className={styles.fileMeta}>
                  <span>{(item.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  <span>{getStatusText(item)}</span>
                </div>
                <progress max={100} value={item.progress} aria-label={`${item.file.name} 전송 진행률`} />
                {item.error && <p className={styles.error}>{item.error}</p>}
              </li>
            ))}
          </ul>
        </>
      )}

      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={hasConsent}
          disabled={isUploading}
          onChange={(event) => setHasConsent(event.target.checked)}
        />
        <span>
          선택한 사진·동영상과 입력한 이름을 신랑·신부에게 전달하는 데 동의합니다.
          사진은 이 페이지에 공개되지 않습니다.
        </span>
      </label>
      <button type="button" className={styles.submit} disabled={!canUpload} onClick={handleUpload}>
        {buttonText}
      </button>
      <p className={styles.hint}>
        완료될 때까지 화면을 열어 두세요.<br />
        전송이 끊기면 같은 화면에서 다시 시도할 수 있어요.
      </p>
      {allCompleted && <p role="status" className={styles.thanks}>함께해 주신 마음까지 오래 간직할게요.</p>}
    </section>
  );
}
