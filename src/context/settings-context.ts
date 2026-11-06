// 应用设置：当前选择的词书、登录方式与登录态。
// 账号登录为真实本地登录（邮箱+密码），微信/QQ/Apple 为第三方入口，
// 真实第三方 OAuth 需开放平台应用与云端回调服务。

import { createContext, useContext } from 'react';
import type { VocabBook } from '@/data/books';
import type { AvatarId, ThemeId, WallpaperId } from '@/lib/appearance';

export type LoginMethod = 'wechat' | 'qq' | 'apple' | 'account';
export type LanguagePreference = 'zh' | 'en' | 'system';

export interface ISettings {
  selectedBookId: string;
  loginMethod: LoginMethod | null;
  loggedIn: boolean;
  dailyTarget: number;
  memoryMode: number; // 0 中英 1 英中 2 听音
  accent: 'us' | 'uk'; // 发音：美音 / 英音
  accountId?: string;
  nickname: string;
  wallpaper: WallpaperId;
  theme: ThemeId;
  avatar: AvatarId;
  fontScale: number;
  glassOpacity: number;
  language: LanguagePreference;
}

export interface ISettingsContextValue {
  settings: ISettings;
  setSelectedBook: (book: VocabBook) => void;
  setDailyTarget: (n: number) => void;
  setMemoryMode: (i: number) => void;
  setAccent: (a: 'us' | 'uk') => void;
  setNickname: (nickname: string) => void;
  setWallpaper: (wallpaper: WallpaperId) => void;
  setTheme: (theme: ThemeId) => void;
  setAvatar: (avatar: AvatarId) => void;
  setFontScale: (scale: number) => void;
  setGlassOpacity: (opacity: number) => void;
  setLanguage: (language: LanguagePreference) => void;
  login: (method: LoginMethod, accountId?: string) => void;
  logout: () => void;
}

export const DEFAULT_SETTINGS: ISettings = {
  selectedBookId: 'core',
  loginMethod: null,
  loggedIn: false,
  dailyTarget: 15,
  memoryMode: 0,
  accent: 'us',
  nickname: '',
  wallpaper: 'dawn',
  theme: 'mist',
  avatar: 'leaf',
  fontScale: 1,
  glassOpacity: 52,
  language: 'system',
};

export const SettingsContext = createContext<ISettingsContextValue | null>(null);

export function useSettings(): ISettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
