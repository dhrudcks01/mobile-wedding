"use client";

import { useEffect, useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { Section } from "@/components/common/Section";
import { Toast } from "@/components/common/Toast";
import type { Wedding, WeddingAccount } from "@/types/wedding";

type AccountSectionProps = {
  wedding: Wedding;
};

type CopyFeedback = {
  message: string;
  tone: "success" | "error";
};

const TOAST_VISIBLE_MS = 2400;

function getDisplayText(value: string, fallback = "입력 예정") {
  return value.trim() || fallback;
}

function getAccountDescription(account: WeddingAccount) {
  return `${account.bank} ${account.number} ${account.holder}`.trim();
}

function AccountCard({
  account,
  onFeedback,
}: {
  account: WeddingAccount;
  onFeedback: (feedback: CopyFeedback) => void;
}) {
  const hasAccountNumber = account.number.trim().length > 0;
  const accountNumberLabel = hasAccountNumber
    ? account.number
    : "계좌번호 입력 예정";

  return (
    <article className="rounded-[26px] border border-[var(--color-line)] bg-white/70 p-5 text-left shadow-[0_14px_36px_rgba(91,69,55,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--color-accent)]">
            {account.label}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--color-text)]">
            {getDisplayText(account.bank, "은행명 입력 예정")}
          </h3>
        </div>
        <CopyButton
          aria-label={`${account.label} 계좌번호 복사`}
          failureMessage={
            hasAccountNumber
              ? "계좌번호를 복사하지 못했습니다."
              : "복사할 계좌번호가 아직 없습니다."
          }
          onFeedback={onFeedback}
          successMessage={`${account.label} 계좌번호를 복사했습니다.`}
          text={account.number}
        />
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-4">
          <dt className="shrink-0 text-[var(--color-text-muted)]">예금주</dt>
          <dd className="font-medium text-[var(--color-text)]">
            {getDisplayText(account.holder, "예금주 입력 예정")}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="shrink-0 text-[var(--color-text-muted)]">계좌번호</dt>
          <dd
            className={`break-all text-right font-medium ${
              hasAccountNumber
                ? "text-[var(--color-text)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {accountNumberLabel}
          </dd>
        </div>
      </dl>

      <p className="mt-4 rounded-[18px] bg-[var(--color-surface-muted)] px-4 py-3 text-xs leading-6 text-[var(--color-text-muted)]">
        {hasAccountNumber
          ? getAccountDescription(account)
          : "실제 계좌번호 입력 전까지 공개되지 않습니다."}
      </p>
    </article>
  );
}

export function AccountSection({ wedding }: AccountSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<CopyFeedback | null>(null);
  const accounts = wedding.accounts;

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
    }, TOAST_VISIBLE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  if (accounts.length === 0) {
    return null;
  }

  return (
    <Section
      className="bg-[var(--color-surface-muted)]"
      eyebrow="Account"
      title="마음 전하실 곳"
      description="축의금 계좌는 필요할 때만 펼쳐 확인할 수 있습니다."
    >
      <div className="mt-9 overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-white/65 text-left shadow-[0_18px_50px_rgba(91,69,55,0.08)]">
        <button
          aria-controls="account-list"
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition hover:bg-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent-strong)]"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span>
            <span className="block text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)]">
              ACCOUNT
            </span>
            <span className="mt-2 block text-lg font-semibold text-[var(--color-text)]">
              계좌번호 보기
            </span>
            <span className="mt-2 block text-sm leading-6 text-[var(--color-text-muted)]">
              {isOpen
                ? "신랑측과 신부측 계좌를 확인할 수 있습니다."
                : "개인정보 보호를 위해 기본으로 접어두었습니다."}
            </span>
          </span>
          <span className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-xs font-medium text-[var(--color-text)]">
            {isOpen ? "접기" : "펼치기"}
          </span>
        </button>

        {isOpen ? (
          <div
            className="grid gap-3 border-t border-[var(--color-line)] px-4 py-4"
            id="account-list"
          >
            {accounts.map((account) => (
              <AccountCard
                account={account}
                key={`${account.side}-${account.label}`}
                onFeedback={setFeedback}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Toast message={feedback?.message ?? ""} tone={feedback?.tone} />
    </Section>
  );
}
