export function isDeviceAuthorizationEnabled(
  configuredValue: string | boolean | undefined,
  publicStoreBuild: boolean,
): boolean {
  if (publicStoreBuild) return false;
  if (configuredValue === true) return true;
  const normalized = String(configuredValue ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === 'enabled';
}
