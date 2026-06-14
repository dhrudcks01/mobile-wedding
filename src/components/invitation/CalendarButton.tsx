"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { createIcsContent, downloadIcsFile } from "@/lib/calendar";
import type { Wedding } from "@/types/wedding";

type CalendarButtonProps = {
  wedding: Wedding;
};

export function CalendarButton({ wedding }: CalendarButtonProps) {
  const [message, setMessage] = useState("");

  function handleDownload() {
    try {
      const title = `${wedding.couple.groom.name} & ${wedding.couple.bride.name} 결혼식`;
      const location = [
        wedding.event.venueName,
        wedding.event.hallName,
        wedding.event.address,
      ]
        .filter(Boolean)
        .join(" ");
      const content = createIcsContent({
        title,
        location,
        startDateTime: wedding.event.dateTime,
        description: `${wedding.event.displayDate}\n${location}`,
      });

      downloadIcsFile("wedding-invitation.ics", content);
      setMessage("캘린더 파일을 만들었습니다.");
    } catch {
      setMessage("캘린더 파일을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="mt-8">
      <Button
        aria-label="예식 일정을 캘린더 파일로 저장하기"
        className="w-full"
        onClick={handleDownload}
      >
        캘린더에 저장하기
      </Button>
      {message ? (
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
