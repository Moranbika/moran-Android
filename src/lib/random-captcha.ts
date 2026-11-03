const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function randomCaptchaCode(): string {
  let code = '';
  for (let index = 0; index < 4; index += 1) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}
