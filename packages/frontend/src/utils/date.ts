export function stringifyDateTime(date: Date): string {
  return [
    stringifyDate(date),
    `${stringifyHours(date)}:${date.getMinutes().toString().padStart(2, '0')}`,
  ].join(' ').trim();
}

export function stringifyDate(date: Date): string {
  // 오늘
  if (isToday(date)) {
    return '';
  }
  // 어제
  if (isYesterday(date)) {
    return '어제';
  }
  // 올해
  if (date.getFullYear() === new Date().getFullYear()) {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate()}일`;
  }
  return stringifyDateConsistent(date);
}

export function stringifyDateConsistent(date: Date): string {
  return `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월 ${date.getDate().toString().padStart(2, '0')}일`;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate()
    && date.getMonth() === today.getMonth()
    && date.getFullYear() === today.getFullYear();
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date(Date.now() - 86400000);
  return date.getDate() === yesterday.getDate()
    && date.getMonth() === yesterday.getMonth()
    && date.getFullYear() === yesterday.getFullYear();
}

export function stringifyHours(date: Date): string {
  const hours = date.getHours();
  return `${hours < 12 ? '오전' : '오후'} ${hours % 12 === 0 ? '12' : (hours % 12).toString().padStart(2, '0')}`;
}
