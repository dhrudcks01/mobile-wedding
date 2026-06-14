"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/common/Button";
import { copyTextToClipboard } from "@/lib/share";

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
      await copyTextToClipboard(text);
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
