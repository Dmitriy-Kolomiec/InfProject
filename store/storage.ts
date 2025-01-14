import { setCookie } from 'nookies';

export function loadState<T>(key: string): T | undefined {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const jsonState = window.localStorage.getItem(key);
      if (!jsonState) {
        return undefined;
      }
      return JSON.parse(jsonState);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  return undefined;
}

export function saveState<T>(state: T, key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stringState = JSON.stringify(state);
      window.localStorage.setItem(key, stringState);
    } catch (error) {
      console.error(error);
    }
  }
}

export const saveCookieToken = (token: string) => {
  setCookie(null, 'accessToken', token, {
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
};
