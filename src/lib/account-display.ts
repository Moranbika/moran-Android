export function maskAccountId(accountId?: string): string {
  const value = accountId?.trim() ?? '';
  if (/^\d{11}$/.test(value)) return `${value.slice(0, 3)}****${value.slice(-4)}`;
  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return value;
}
