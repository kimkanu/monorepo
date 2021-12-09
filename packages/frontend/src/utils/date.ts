import i18n from '../i18n';

export function stringifyDateTime(date: Date): string {
  return [
    stringifyDate(date),
    stringifyTime(date),
  ].join(' ').trim();
}

export function stringifyDate(date: Date): string {
  // 오늘
  if (isToday(date)) {
    return '';
  }
  // 어제
  if (isYesterday(date)) {
    if (i18n.language === 'en') {
      return 'yesterday';
    }
    return '어제';
  }
  // 올해
  if (date.getFullYear() === new Date().getFullYear()) {
    if (i18n.language === 'en') {
      return Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
    return Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(date);
  }
  return stringifyDateConsistent(date);
}

export function stringifyDateConsistent(date: Date): string {
  if (i18n.language === 'en') {
    return Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
  }
  return Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' }).format(date);
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

export function stringifyTime(date: Date): string {
  if (i18n.language === 'en') {
    return Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(date);
  }
  return Intl.DateTimeFormat('ko-KR', { timeStyle: 'short' }).format(date);
}

export function isSameDate(date1:number, date2:number): boolean {
  const dateA = new Date(date1);
  const dateB = new Date(date2);
  if (dateA.getFullYear() !== dateB.getFullYear()) {
    return false;
  } if (dateA.getMonth() !== dateB.getMonth()) {
    return false;
  } if (dateA.getDate() !== dateB.getDate()) {
    return false;
  } if (dateA.getHours() !== dateB.getHours()) {
    return false;
  } if (dateA.getMinutes() !== dateB.getMinutes()) {
    return false;
  }
  return true;
}
