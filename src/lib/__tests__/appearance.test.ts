import { describe, expect, it } from 'vitest';
import {
  AVATARS,
  DEFAULT_GLASS_OPACITY,
  THEMES,
  WALLPAPERS,
  clampGlassOpacity,
  isAvatarId,
  isThemeId,
  isWallpaperId,
} from '../appearance';

describe('appearance settings', () => {
  it('offers distinct built-in wallpapers', () => {
    expect(WALLPAPERS).toHaveLength(12);
    expect(new Set(WALLPAPERS.map((wallpaper) => wallpaper.id)).size).toBe(WALLPAPERS.length);
  });

  it('offers distinct themes and avatars', () => {
    expect(THEMES).toHaveLength(8);
    expect(AVATARS).toHaveLength(6);
    expect(isThemeId('sunset')).toBe(true);
    expect(isThemeId('forest')).toBe(true);
    expect(isThemeId('unknown')).toBe(false);
    expect(isAvatarId('leaf')).toBe(true);
    expect(isAvatarId('unknown')).toBe(false);
  });

  it('rejects unknown wallpaper ids', () => {
    expect(isWallpaperId('lake')).toBe(true);
    expect(isWallpaperId('unknown')).toBe(false);
    expect(isWallpaperId(undefined)).toBe(false);
  });

  it('keeps glass opacity in a readable range', () => {
    expect(clampGlassOpacity(12)).toBe(20);
    expect(clampGlassOpacity(68)).toBe(68);
    expect(clampGlassOpacity(99)).toBe(90);
    expect(clampGlassOpacity('invalid')).toBe(DEFAULT_GLASS_OPACITY);
  });
});
