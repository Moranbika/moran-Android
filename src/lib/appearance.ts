export const WALLPAPERS = [
  { id: 'dawn', name: '清晨湖雾', description: '薄雾、晨光与安静的湖岸' },
  { id: 'meadow', name: '春日原野', description: '柔绿山丘与零星野花' },
  { id: 'lake', name: '镜湖晨光', description: '清凉水面与远山微光' },
  { id: 'rain', name: '雨后天青', description: '玻璃水珠与湿润叶片' },
  { id: 'coast', name: '海盐海岸', description: '青蓝海面与暖色沙滩' },
  { id: 'garden', name: '柑橘花园', description: '日光、叶片与淡黄果实' },
  { id: 'sunset', name: '落日熔金', description: '橘红晚霞与暖金湖面' },
  { id: 'dusk', name: '暮紫微光', description: '靛蓝暮色与紫粉云层' },
  { id: 'ink', name: '水墨远山', description: '墨灰山影与米白留白' },
  { id: 'desert', name: '沙丘金线', description: '暖沙、赭石与金色日光' },
  { id: 'ocean', name: '深海蓝洞', description: '深蓝海水与冷青光束' },
  { id: 'blossom', name: '樱粉晨风', description: '粉白花云与浅玫瑰晨光' },
] as const;

export type WallpaperId = (typeof WALLPAPERS)[number]['id'];

export const THEMES = [
  { id: 'mist', name: '青雾', description: '默认青绿玻璃' },
  { id: 'sunset', name: '落日', description: '暖橘与玫瑰' },
  { id: 'ink', name: '水墨', description: '墨灰与米白' },
  { id: 'ocean', name: '深海', description: '蓝绿与冷调' },
  { id: 'forest', name: '苔林', description: '苔绿与暖木' },
  { id: 'plum', name: '梅影', description: '灰紫与柔粉' },
  { id: 'sand', name: '沙岩', description: '暖沙与陶土' },
  { id: 'slate', name: '雾蓝', description: '灰蓝与银白' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const AVATARS = [
  { id: 'leaf', name: '青叶', emoji: '🌿', gradient: 'from-emerald-200 to-teal-300' },
  { id: 'sun', name: '晨光', emoji: '🌅', gradient: 'from-amber-200 to-orange-300' },
  { id: 'wave', name: '海浪', emoji: '🌊', gradient: 'from-sky-200 to-cyan-300' },
  { id: 'star', name: '星光', emoji: '✨', gradient: 'from-violet-200 to-fuchsia-300' },
  { id: 'book', name: '书页', emoji: '📖', gradient: 'from-stone-200 to-amber-200' },
  { id: 'moon', name: '月夜', emoji: '🌙', gradient: 'from-indigo-200 to-slate-300' },
] as const;

export type AvatarId = (typeof AVATARS)[number]['id'];

export const FONT_SCALES = [
  { value: 0.9, label: '小' },
  { value: 1, label: '标准' },
  { value: 1.08, label: '大' },
  { value: 1.16, label: '特大' },
] as const;

export const DEFAULT_GLASS_OPACITY = 52;

export function isWallpaperId(value: unknown): value is WallpaperId {
  return WALLPAPERS.some((wallpaper) => wallpaper.id === value);
}

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function isAvatarId(value: unknown): value is AvatarId {
  return AVATARS.some((avatar) => avatar.id === value);
}

export function clampFontScale(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.round(Math.max(0.85, Math.min(1.2, parsed)) * 100) / 100;
}

export function clampGlassOpacity(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_GLASS_OPACITY;
  return Math.round(Math.max(20, Math.min(90, parsed)));
}
