// 设置 Provider：持久化选中词书、登录方式与登录态到 localStorage。

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  SettingsContext,
  DEFAULT_SETTINGS,
} from '@/context/settings-context';
import type { ISettings, LoginMethod } from '@/context/settings-context';
import type { LanguagePreference } from '@/context/settings-context';
import type { VocabBook } from '@/data/books';
import {
  DEFAULT_GLASS_OPACITY,
  clampFontScale,
  clampGlassOpacity,
  isAvatarId,
  isThemeId,
  isWallpaperId,
  type AvatarId,
  type ThemeId,
  type WallpaperId,
} from '@/lib/appearance';
import { store } from '@/lib/store';
import { cloudLogout } from '@/lib/cloud-sync';

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ISettings>(() => {
    const loaded = store.get<Partial<ISettings>>('settings', DEFAULT_SETTINGS);
    return {
      ...DEFAULT_SETTINGS,
      ...loaded,
      wallpaper: isWallpaperId(loaded.wallpaper) ? loaded.wallpaper : DEFAULT_SETTINGS.wallpaper,
      theme: isThemeId(loaded.theme) ? loaded.theme : DEFAULT_SETTINGS.theme,
      avatar: isAvatarId(loaded.avatar) ? loaded.avatar : DEFAULT_SETTINGS.avatar,
      fontScale: clampFontScale(loaded.fontScale ?? DEFAULT_SETTINGS.fontScale),
      glassOpacity: clampGlassOpacity(loaded.glassOpacity ?? DEFAULT_GLASS_OPACITY),
    };
  });

  useEffect(() => {
    store.set('settings', settings);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const opacity = clampGlassOpacity(settings.glassOpacity) / 100;
    const cardAlpha = Math.max(0.78, opacity);
    const softAlpha = Math.max(0.70, opacity - 0.2);
    const strongAlpha = Math.min(0.96, Math.max(0.90, opacity + 0.14));
    const sidebarAlpha = Math.max(0.82, opacity - 0.08);
    const workspaceAlpha = Math.max(0.90, opacity * 0.22);
    root.dataset.wallpaper = settings.wallpaper;
    root.dataset.theme = settings.theme;
    root.style.fontSize = `${Math.round(16 * settings.fontScale)}px`;
    root.style.setProperty('--glass-alpha', cardAlpha.toFixed(2));
    root.style.setProperty('--glass-alpha-soft', softAlpha.toFixed(2));
    root.style.setProperty('--glass-alpha-strong', strongAlpha.toFixed(2));
    root.style.setProperty('--glass-alpha-sidebar', sidebarAlpha.toFixed(2));
    root.style.setProperty('--glass-alpha-workspace', workspaceAlpha.toFixed(2));
    root.style.setProperty('--glass-alpha-percent', `${Math.round(cardAlpha * 100)}%`);
    root.style.setProperty('--glass-alpha-soft-percent', `${Math.round(softAlpha * 100)}%`);
    root.style.setProperty('--glass-alpha-strong-percent', `${Math.round(strongAlpha * 100)}%`);
    root.style.setProperty('--glass-alpha-sidebar-percent', `${Math.round(sidebarAlpha * 100)}%`);
    root.style.setProperty('--glass-alpha-workspace-percent', `${Math.round(workspaceAlpha * 100)}%`);
  }, [settings.fontScale, settings.glassOpacity, settings.theme, settings.wallpaper]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let frame = 0;
    let nextX = 24;
    let nextY = 12;
    const updateLight = () => {
      frame = 0;
      const root = document.documentElement;
      root.style.setProperty('--glass-light-x', `${nextX.toFixed(1)}%`);
      root.style.setProperty('--glass-light-y', `${nextY.toFixed(1)}%`);
    };
    const onPointerMove = (event: PointerEvent) => {
      nextX = (event.clientX / Math.max(window.innerWidth, 1)) * 100;
      nextY = (event.clientY / Math.max(window.innerHeight, 1)) * 100;
      if (!frame) frame = window.requestAnimationFrame(updateLight);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const setSelectedBook = useCallback((book: VocabBook) => {
    setSettings((s) => ({ ...s, selectedBookId: book.id }));
  }, []);

  const setDailyTarget = useCallback((n: number) => {
    setSettings((s) => ({ ...s, dailyTarget: Math.max(1, Math.min(100, n)) }));
  }, []);

  const setMemoryMode = useCallback((i: number) => {
    setSettings((s) => ({ ...s, memoryMode: i }));
  }, []);

  const setAccent = useCallback((a: 'us' | 'uk') => {
    setSettings((s) => ({ ...s, accent: a }));
  }, []);

  const setNickname = useCallback((nickname: string) => {
    setSettings((s) => ({ ...s, nickname: nickname.trim().slice(0, 20) }));
  }, []);

  const setWallpaper = useCallback((wallpaper: WallpaperId) => {
    setSettings((s) => ({ ...s, wallpaper }));
  }, []);

  const setTheme = useCallback((theme: ThemeId) => {
    setSettings((s) => ({ ...s, theme }));
  }, []);

  const setAvatar = useCallback((avatar: AvatarId) => {
    setSettings((s) => ({ ...s, avatar }));
  }, []);

  const setFontScale = useCallback((fontScale: number) => {
    setSettings((s) => ({ ...s, fontScale: clampFontScale(fontScale) }));
  }, []);

  const setGlassOpacity = useCallback((glassOpacity: number) => {
    setSettings((s) => ({ ...s, glassOpacity: clampGlassOpacity(glassOpacity) }));
  }, []);

  const setLanguage = useCallback((language: LanguagePreference) => {
    setSettings((s) => ({ ...s, language }));
  }, []);

  const login = useCallback((method: LoginMethod, accountId?: string) => {
    setSettings((s) => ({ ...s, loginMethod: method, loggedIn: true, accountId }));
  }, []);

  const logout = useCallback(() => {
    void cloudLogout();
    setSettings((s) => ({ ...s, loginMethod: null, loggedIn: false, accountId: undefined }));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setSelectedBook,
      setDailyTarget,
      setMemoryMode,
      setAccent,
      setNickname,
      setWallpaper,
      setTheme,
      setAvatar,
      setFontScale,
      setGlassOpacity,
      setLanguage,
      login,
      logout,
    }),
    [
      settings,
      setSelectedBook,
      setDailyTarget,
      setMemoryMode,
      setAccent,
      setNickname,
      setWallpaper,
      setTheme,
      setAvatar,
      setFontScale,
      setGlassOpacity,
      setLanguage,
      login,
      logout,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
