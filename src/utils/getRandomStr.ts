import { getRandomNum } from './getRandomNum';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getRandomStr(length: number) {
  let res = '';

  for (let i = 0; i < length; i++) {
    const idx = getRandomNum(0, chars.length - 1);
    res += chars[idx];
  }

  return res;
}
