/* eslint-disable class-methods-use-this */
import { useHistory } from 'react-router-dom';

import { clamp } from './math';

type History = ReturnType<typeof useHistory>;

const classroomHashSyllableRegex = '[BHJKLMNPST][AEIOU][KLMNPSTZ]';
const classroomHashRegex = `(${classroomHashSyllableRegex}-${classroomHashSyllableRegex}-${classroomHashSyllableRegex})`;
export const classroomPrefixRegex = new RegExp(`^/classrooms/${classroomHashRegex}`);
const classroomRegex = new RegExp(`^/classrooms/${classroomHashRegex}$`);
const classroomMembersRegex = new RegExp(`^/classrooms/${classroomHashRegex}/members$`);
const classroomSettingsRegex = new RegExp(`^/classrooms/${classroomHashRegex}/settings$`);

class AppHistory {
  history: string[] = [];

  private pointer: number = 0;

  search: URLSearchParams = new URLSearchParams();

  reset(href: string, history?: History) {
    let pathname = href.split('?')[0];
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }
    this.history = AppHistory.generateHistory(pathname);
    this.pointer = this.history.length - 1;

    const query = href.split('?').slice(1).join('?');
    this.search = new URLSearchParams(query);

    if (history) {
      this.followInitialHistory(history);
    }
  }

  private static generateHistory(pathname: string) {
    // /
    if (pathname === '/') {
      return ['/'];
    }

    // /classrooms/:hash/members
    if (classroomMembersRegex.test(pathname)) {
      const hash = pathname.match(classroomRegex)![1];
      return ['/', `/classrooms/${hash}`, pathname];
    }

    // /classrooms/:hash/settings
    if (classroomSettingsRegex.test(pathname)) {
      const hash = pathname.match(classroomRegex)![1];
      return ['/', `/classrooms/${hash}`, pathname];
    }

    // /profile/connect
    if (pathname === '/profile/connect') {
      return ['/', '/profile', '/profile/connect'];
    }

    if ([
      '/classrooms/new',
      '/profile',
      '/login',
      '/welcome',
      '/welcome/done',
    ].includes(pathname) || classroomRegex.test(pathname)) {
      return ['/', pathname];
    }

    return ['/', '/404'];
  }

  searchToString() {
    const string = this.search.toString();
    if (!string) return '';
    return `?${string}`;
  }

  followInitialHistory(history: History) {
    // eslint-disable-next-line no-restricted-syntax
    for (const pathname of this.history) {
      if (pathname === '/') {
        history.replace('/');
      } else {
        history.push(`${pathname}${this.searchToString()}`);
      }
    }
  }

  get pathname() {
    return this.history[this.pointer];
  }

  goBack(history: History) {
    history.goBack();
  }

  go(number: number, history: History) {
    if (number === 0) return;
    const move = clamp(-this.pointer, number, this.history.length - 1 - this.pointer);
    this.pointer += move;
    history.go(move);
  }

  goMain(history: History) {
    if (this.pathname === '/') {
      this.pointer = 0;
      return;
    }
    this.go(-Infinity, history);
  }

  goForward(history: History) {
    history.goForward();
  }

  repairInternal(pathname: string) {
    const index = this.history.findIndex((path) => path === pathname);
    this.pointer = Math.max(0, index);
  }

  push(href: string, history: History) {
    let pathname = href.split('?')[0];
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }
    const query = href.split('?').slice(1).join('?');
    this.search = new URLSearchParams(query);

    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push(pathname);
    history.push(`${pathname}${this.searchToString()}`);
    this.pointer = this.history.length - 1;
  }

  replace(href: string, history: History) {
    let pathname = href.split('?')[0];
    if (pathname.endsWith('/') && pathname !== '/') {
      pathname = pathname.slice(0, -1);
    }
    const query = href.split('?').slice(1).join('?');
    this.search = new URLSearchParams(query);

    this.history = this.history.slice(0, this.pointer + 1);
    this.history[this.pointer] = pathname;
    history.replace(`${pathname}${this.searchToString()}`);
  }
}

const appHistory = new AppHistory();
export default appHistory;
