const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

function getLocalDateStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getWeddingDate(dateTime: string) {
  const match = dateTime.match(ISO_DATE_PATTERN);

  if (match) {
    const [, year, month, day] = match;

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return getLocalDateStart(new Date(dateTime));
}

export function getDaysUntil(targetDateTime: string, baseDate = new Date()) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const targetDate = getWeddingDate(targetDateTime);
  const today = getLocalDateStart(baseDate);

  return Math.ceil((targetDate.getTime() - today.getTime()) / millisecondsPerDay);
}

export function getDdayLabel(targetDateTime: string, baseDate = new Date()) {
  const daysUntil = getDaysUntil(targetDateTime, baseDate);

  if (Number.isNaN(daysUntil)) {
    return "날짜 입력 예정";
  }

  if (daysUntil > 0) {
    return `D-${daysUntil}`;
  }

  if (daysUntil === 0) {
    return "D-Day";
  }

  return `D+${Math.abs(daysUntil)}`;
}
