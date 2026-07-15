import { getWeddingDate } from "@/lib/date";

export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  durationMinutes?: number;
};

export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;

const ENGLISH_MONTH_LABELS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May.",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
] as const;

export type CalendarDayCell = {
  day: number | null;
  isSunday: boolean;
  isWeddingDay: boolean;
};

export function getEnglishMonthLabel(month: number) {
  return ENGLISH_MONTH_LABELS[month] ?? "Jan.";
}

export function buildWeddingMonthCalendar(dateTime: string): CalendarDayCell[] {
  const weddingDate = getWeddingDate(dateTime);

  if (Number.isNaN(weddingDate.getTime())) {
    return [];
  }

  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const weddingDay = weddingDate.getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: CalendarDayCell[] = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push({ day: null, isSunday: false, isWeddingDay: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekday = new Date(year, month, day).getDay();

    cells.push({
      day,
      isSunday: weekday === 0,
      isWeddingDay: day === weddingDay,
    });
  }

  return cells;
}

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function createIcsContent(event: CalendarEvent) {
  const startDate = new Date(event.startDateTime);
  const endDate = new Date(
    startDate.getTime() + (event.durationMinutes ?? 120) * 60 * 1000,
  );
  const createdAt = new Date();
  const uid = `${formatIcsDate(createdAt)}-${formatIcsDate(startDate)}@mobile-wedding`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//mobile-wedding//Wedding Calendar//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(createdAt)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(fileName: string, content: string) {
  const blob = new Blob([content], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
