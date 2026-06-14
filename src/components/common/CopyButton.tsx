"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/common/Button";

type CopyFeedback = {
  message: string;
  tone: "success" | "error";
};

type CopyButtonProps = Omit<ButtonProps, "children" | "onClick" | "type"> & {
  children?: string;
  failureMessage?: string;
  onFeedback?: (feedback: CopyFeedback) => void;
  successMessage?: string;
  text: string;
};

async function copyText(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("empty_copy_text");
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(trimmedText);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = trimmedText;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    const isCopied = document.execCommand("copy");

    if (!isCopied) {
      throw new Error("fallback_copy_failed");
    }
  } finally {
    document.body.removeChild(textArea);
  }
}

export function CopyButton({
  children = "복사",
  disabled,
  failureMessage = "복사하지 못했습니다. 직접 선택해서 복사해 주세요.",
  onFeedback,
  successMessage = "복사했습니다.",
  text,
  ...buttonProps
}: CopyButtonProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    setIsCopying(true);

    try {
      await copyText(text);
      onFeedback?.({ message: successMessage, tone: "success" });
    } catch {
      onFeedback?.({ message: failureMessage, tone: "error" });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Button
      disabled={disabled || isCopying}
      onClick={handleCopy}
      size="sm"
      type="button"
      variant="secondary"
      {...buttonProps}
    >
      {isCopying ? "복사 중" : children}
    </Button>
  );
}
