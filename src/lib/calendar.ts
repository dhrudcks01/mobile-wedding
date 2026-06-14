export type CalendarEvent = {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  durationMinutes?: number;
};

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
