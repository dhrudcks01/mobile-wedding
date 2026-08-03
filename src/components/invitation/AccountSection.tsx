"use client";

import { useEffect, useState } from "react";

import { CopyButton } from "@/components/common/CopyButton";
import { Section } from "@/components/common/Section";
import { Toast } from "@/components/common/Toast";
import type {
  Wedding,
  WeddingAccount,
  WeddingSide,
} from "@/types/wedding";

type AccountSectionProps = {
  wedding: Wedding;
};

type CopyFeedback = {
  message: string;
  tone: "success" | "error";
};

const TOAST_VISIBLE_MS = 2400;
const ACCOUNT_SIDES: WeddingSide[] = ["groom", "bride"];

function getSideLabel(side: WeddingSide) {
  return side === "groom" ? "신랑 측" : "신부 측";
}

function getAccountRole(account: WeddingAccount, wedding: Wedding) {
  const coupleName =
    account.side === "groom"
      ? wedding.couple.groom.name
      : wedding.couple.bride.name;

  return account.holder.trim() === coupleName.trim()
    ? account.side === "groom"
      ? "신랑"
      : "신부"
    : "혼주";
}

function AccountRow({
  account,
  onFeedback,
  wedding,
}: {
  account: WeddingAccount;
  onFeedback: (feedback: CopyFeedback) => void;
  wedding: Wedding;
}) {
  const accountRole = getAccountRole(account, wedding);

  return (
    <article className="rounded-[6px] bg-[var(--color-surface-raised)] p-4 text-left shadow-[0_12px_32px_rgba(65,55,50,0.08)]">
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[var(--color-surface-sunken)] px-3 py-1 text-[10px] text-[var(--color-text-muted)]">
            {accountRole}
          </span>
          <strong className="font-korean-serif text-[15px] text-[var(--section-text)]">
            {account.holder}
          </strong>
        </div>
      </div>

      <div className="mt-4 flex min-h-12 items-center justify-between gap-3 rounded-[4px] bg-[var(--color-surface-sunken)] px-4">
        <p className="min-w-0 text-[12px] leading-5 text-[var(--color-text)]">
          <span>{account.bank}</span>{" "}
          <span className="break-all">{account.number}</span>
        </p>
        <CopyButton
          aria-label={`${accountRole} ${account.holder} 계좌번호 복사`}
          className="min-h-8 shrink-0 border-0 bg-transparent px-2 text-[10px] text-[var(--color-text-muted)] shadow-none hover:bg-black/5"
          onFeedback={onFeedback}
          successMessage={`${account.holder}님의 계좌번호를 복사했습니다.`}
          text={account.number}
        >
          계좌복사
        </CopyButton>
      </div>
    </article>
  );
}

export function AccountSection({ wedding }: AccountSectionProps) {
  const accounts = wedding.accounts.filter(
    (account) => account.number.trim().length > 0,
  );
  const availableSides = ACCOUNT_SIDES.filter((side) =>
    accounts.some((account) => account.side === side),
  );
  const [selectedSide, setSelectedSide] = useState<WeddingSide>(
    availableSides[0] ?? "groom",
  );
  const [feedback, setFeedback] = useState<CopyFeedback | null>(null);
  const activeSide = availableSides.includes(selectedSide)
    ? selectedSide
    : availableSides[0];
  const visibleAccounts = accounts.filter(
    (account) => account.side === activeSide,
  );

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), TOAST_VISIBLE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  if (accounts.length === 0 || !activeSide) {
    return null;
  }

  return (
    <Section
      className="movie-paper pb-28 pt-24"
      description={"전해주시는 축하의 마음은 소중하게 간직하여\n좋은 부부의 모습으로 보답하겠습니다."}
      eyebrow="Information"
      title="Account"
    >
      <div
        className="mt-12"
        data-reveal="fade-up"
        data-reveal-duration="1200"
      >
        <div
          aria-label="계좌 구분"
          className="grid border-b border-[var(--section-line)]"
          role="tablist"
          style={{ gridTemplateColumns: `repeat(${availableSides.length}, minmax(0, 1fr))` }}
        >
          {availableSides.map((side) => {
            const isActive = activeSide === side;

            return (
              <button
                aria-controls={`account-panel-${side}`}
                aria-selected={isActive}
                className={[
                  "relative min-h-12 text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent-strong)]",
                  isActive
                    ? "font-semibold text-[var(--section-text)] after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:bg-[var(--color-accent-strong)]"
                    : "text-[var(--section-muted)]",
                ].join(" ")}
                id={`account-tab-${side}`}
                key={side}
                onClick={() => setSelectedSide(side)}
                role="tab"
                type="button"
              >
                {getSideLabel(side)}
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`account-tab-${activeSide}`}
          className="mt-5 grid gap-4"
          id={`account-panel-${activeSide}`}
          role="tabpanel"
        >
          {visibleAccounts.map((account, index) => (
            <AccountRow
              account={account}
              key={`${account.side}-${account.holder}-${index}`}
              onFeedback={setFeedback}
              wedding={wedding}
            />
          ))}
        </div>
      </div>

      <Toast message={feedback?.message ?? ""} tone={feedback?.tone} />
    </Section>
  );
}
