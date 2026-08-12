"use client";

import Image from "next/image";
import { useState } from "react";

import { getWeddingDate } from "@/lib/date";
import type { Wedding } from "@/types/wedding";

type DateSectionProps = {
  wedding: Wedding;
};

const TICKET_WIDTH = 290;
const TICKET_HEIGHT = 549;

const PUNCH_RADIUS = 10;
const CORNER_RADIUS = 22;

/* 우표 가장자리 펀치. 지름 20px 원의 중심이 티켓 위·아래 모서리에 정확히
   걸리도록 잡아, 절반만 티켓에 물리게 합니다. */
const PUNCH_LEFT_OFFSETS = [34.5, 67.9, 101.3, 134.7, 168.1, 201.5, 234.9];

const WEEKDAY_ABBREVIATIONS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

/** 원 하나를 evenodd 서브패스로 그립니다. 바깥 사각형에서 이만큼 뚫립니다. */
function getHoleSubPath(centerX: number, centerY: number, radius: number) {
  const diameter = radius * 2;

  return `M${centerX - radius} ${centerY}a${radius} ${radius} 0 1 0 ${diameter} 0a${radius} ${radius} 0 1 0 ${-diameter} 0`;
}

/**
 * 티켓 실루엣을 만드는 마스크입니다.
 *
 * 구멍을 배경색 원으로 '덮어서' 흉내 내면 카드 그림자와 절대 맞지 않습니다.
 * 그림자는 사각형이라, 원을 티켓 안쪽만 그리면 구멍 바깥 절반만 어두워
 * 얼룩이 되고, 원을 온전히 그리면 이번엔 그림자 위에 원판이 떠 보입니다.
 * 어느 쪽이든 '원의 색'을 배경에 맞추는 문제라 답이 없습니다.
 *
 * 그래서 실제로 뚫습니다. 뚫린 자리에는 그림자까지 포함한 진짜 배경이
 * 그대로 비치므로 색이 어긋날 여지가 없고, 그림자도 아래 drop-shadow가
 * 이 실루엣을 따라 그려 구멍 모양대로 파입니다.
 *
 * radial-gradient 여러 장을 mask-composite로 합치는 방법도 있지만, 그건
 * 구형 웹뷰에서 합성 모드가 빠지면 구멍이 통째로 사라집니다. SVG 한 장이면
 * 합성이 필요 없어 -webkit-mask-image만 지원하면 그대로 동작합니다.
 */
function getTicketMaskImage() {
  const holes = [
    ...PUNCH_LEFT_OFFSETS.flatMap((left) => [
      getHoleSubPath(left + PUNCH_RADIUS, 0, PUNCH_RADIUS),
      getHoleSubPath(left + PUNCH_RADIUS, TICKET_HEIGHT, PUNCH_RADIUS),
    ]),
    getHoleSubPath(0, 0, CORNER_RADIUS),
    getHoleSubPath(TICKET_WIDTH, 0, CORNER_RADIUS),
    getHoleSubPath(0, TICKET_HEIGHT, CORNER_RADIUS),
    getHoleSubPath(TICKET_WIDTH, TICKET_HEIGHT, CORNER_RADIUS),
  ].join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TICKET_WIDTH}" height="${TICKET_HEIGHT}">` +
    `<path fill="white" fill-rule="evenodd" d="M0 0h${TICKET_WIDTH}v${TICKET_HEIGHT}H0Z${holes}"/>` +
    `</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const TICKET_MASK_IMAGE = getTicketMaskImage();

const TICKET_MASK_STYLE = {
  maskImage: TICKET_MASK_IMAGE,
  WebkitMaskImage: TICKET_MASK_IMAGE,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

/* 그림자는 면이 아니라 이 레이어가 냅니다. 면에 box-shadow를 주면 마스크가
   그림자까지 잘라 없애고, 애초에 사각형이라 구멍 모양을 따르지도 않습니다.
   drop-shadow를 바깥 래퍼에 걸고 마스크는 안쪽 판에만 걸어, 그림자가 잘리지
   않으면서 구멍 뚫린 실루엣을 그리게 합니다.
   drop-shadow에는 spread가 없어 box-shadow의 -8px만큼 blur를 줄였습니다. */
const TICKET_SHADOW_FILTER = "drop-shadow(0 14px 26px rgba(60, 52, 48, 0.3))";

const FACE_CLASS_NAME = [
  "absolute inset-0 overflow-hidden",
  // 카카오톡 인앱 웹뷰(구형 WebKit)는 -webkit- 접두사가 있어야 뒷면이 비칩니다.
  "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
].join(" ");

function getTicketDate(dateTime: string) {
  const date = getWeddingDate(dateTime);

  if (Number.isNaN(date.getTime())) {
    return "날짜 입력 예정";
  }

  const weekday = WEEKDAY_ABBREVIATIONS[date.getDay()];

  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${weekday}.`;
}

function getTicketTime(dateTime: string) {
  const timeMatch = dateTime.match(/T(\d{2}):(\d{2})/);

  if (!timeMatch) {
    return "시간 입력 예정";
  }

  const hour = Number(timeMatch[1]);
  const minute = timeMatch[2];
  const meridiem = hour >= 12 ? "PM" : "AM";
  const hour12 = String(hour % 12 || 12).padStart(2, "0");

  return `${hour12}:${minute} ${meridiem}`;
}

export function DateSection({ wedding }: DateSectionProps) {
  // 상태는 이 하나뿐입니다. 클릭할 때마다 180씩 더해 같은 방향으로 계속 돕니다.
  // 0/180 토글로 만들면 뒷면에서 앞면으로 돌아올 때 방향이 반대로 꺾입니다.
  const [flip, setFlip] = useState(0);

  const ticketImage =
    wedding.images.ticket.trim() ||
    wedding.images.poster.trim() ||
    wedding.images.hero.trim() ||
    "/images/hero.jpg";
  const groomName = wedding.intro.groom.name.trim() || "Groom";
  const brideName = wedding.intro.bride.name.trim() || "Bride";
  const ticketDate = getTicketDate(wedding.event.dateTime);
  const ticketTime = getTicketTime(wedding.event.dateTime);
  // 티켓 뒷면 주소 칸은 231px뿐이라 괄호 안 지번까지 넣으면 줄이 넘어갑니다.
  // 전체 주소는 Location 섹션에서 그대로 보여줍니다.
  const ticketAddress = wedding.event.address.split("(")[0].trim();

  return (
    <section className="movie-paper px-6 pb-[120px] pt-16">
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <p className="flex flex-col items-center leading-none text-[#7a7365]">
          <span className="font-serif-en ml-[0.32em] text-[19px] uppercase tracking-[0.32em]">
            An
          </span>
          <span className="font-script text-[52px]">Invitation</span>
          <span className="flex items-baseline gap-[9px]">
            <span className="font-serif-en text-[18px] uppercase tracking-[0.28em]">
              For
            </span>
            <span className="font-script text-[32px]">you</span>
          </span>
        </p>

        <button
          aria-label="티켓을 뒤집어 예식 일시와 장소 보기"
          className="mt-9 block border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent] [perspective:1500px]"
          onClick={() => setFlip((current) => current + 180)}
          style={{ width: TICKET_WIDTH, height: TICKET_HEIGHT }}
          type="button"
        >
          <div
            className="relative h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0.1,0.2,1)] [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${flip}deg)` }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ filter: TICKET_SHADOW_FILTER }}
            >
              <div
                className="absolute inset-0 bg-[var(--color-surface)]"
                style={TICKET_MASK_STYLE}
              />
            </div>

            <div
              className={`${FACE_CLASS_NAME} bg-[#1c1b1a]`}
              style={TICKET_MASK_STYLE}
            >
              <Image
                alt={`${groomName}과 ${brideName} 웨딩 사진`}
                className="object-cover contrast-[1.02] grayscale"
                fill
                loading="lazy"
                sizes="290px"
                src={ticketImage}
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,13,12,0.5)_0%,rgba(14,13,12,0)_30%,rgba(14,13,12,0)_74%,rgba(14,13,12,0.42)_100%)]" />

              <div className="absolute inset-x-0 top-[30px] flex flex-col items-center gap-2 leading-tight">
                <span className="font-script text-[20px] text-[#f3efe9]">
                  The Wedding of
                </span>
                <span className="font-serif-en ml-[0.14em] text-[20px] tracking-[0.14em] text-[#f7f4ee] [font-variant:small-caps]">
                  {groomName} &amp; {brideName}
                </span>
              </div>
            </div>

            {/* 뒷면 이미지에도 같은 자리에 구멍이 투명으로 뚫려 있지만,
                이미지가 도착하기 전이나 좌표가 미세하게 어긋날 때를 대비해
                면에도 같은 마스크를 걸어 둡니다. 배경색은 두지 않습니다.
                두면 그 색이 구멍을 도로 메웁니다. */}
            <div
              className={`${FACE_CLASS_NAME} [transform:rotateY(180deg)]`}
              style={TICKET_MASK_STYLE}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="object-cover"
                fill
                loading="lazy"
                sizes="290px"
                src="/images/ticket-back-kraft.png"
              />

              <span className="absolute left-[57px] top-[77px] whitespace-nowrap text-[17px] font-semibold leading-tight text-[#22221f]">
                {ticketDate}
              </span>
              <span className="absolute left-[57px] top-[103px] whitespace-nowrap text-[18px] font-semibold leading-tight text-[#22221f]">
                {ticketTime}
              </span>
              <span className="absolute left-[59px] top-[421px] flex flex-col gap-[3px] text-left leading-tight">
                <span className="text-[15px] font-semibold text-[#22221f]">
                  {wedding.event.venueName || "예식 장소 입력 예정"}
                </span>
                <span className="text-[12.5px] text-[#33332f]">
                  {ticketAddress}
                </span>
              </span>
            </div>
          </div>
        </button>

        <p className="mt-[34px] text-[14px] text-[#8a5941]">
          Touch Me!
        </p>
      </div>
    </section>
  );
}
