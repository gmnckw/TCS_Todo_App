import { AUTH_STORAGE_KEY } from '../config/constants';

const EMPTY_AUTH = Object.freeze({ token: null, user: null });

export const readStoredAuth = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_AUTH;
  } catch {
    return EMPTY_AUTH;
  }
};

export const writeStoredAuth = ({ token, user }) => {
  if (token) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
