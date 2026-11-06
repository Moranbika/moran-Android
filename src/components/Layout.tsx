// EXPORTS: Layout
// 全局布局：薄雾学习场景 + 轻玻璃侧栏和移动底栏。

import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  ChevronRight,
  CloudDownload,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Library,
  Minus,
  MoreHorizontal,
  Settings2,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/context/progress-context';
import { useI18n } from '@/context/i18n-context';
import StudyReminder from '@/components/StudyReminder';
import PermissionConsent from '@/components/PermissionConsent';
import ProcessingLoader from '@/components/ProcessingLoader';
import {
  contentRefreshOutcome,
  useContent,
  type ContentRefreshOutcome,
} from '@/context/content-context';
import { DATA_REFRESH_EVENT } from '@/hooks/use-animated-progress';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  end: boolean;
  description?: string;
}

const NAV: readonly NavItem[] = [
  { path: '/', label: '首页', icon: LayoutDashboard, end: true },
  { path: '/plan', label: '今日计划', icon: CalendarCheck2, end: false },
  { path: '/books', label: '词书库', icon: Library, end: false },
  { path: '/vocab', label: '词汇', icon: BookOpen, end: false },
  { path: '/progress', label: '学习记录', icon: BarChart3, end: false },
];

const PRIMARY_NAV = NAV.filter((item) => ['/', '/plan', '/books', '/vocab'].includes(item.path));
const MORE_NAV: NavItem[] = [
  ...NAV.filter((item) => ['/progress'].includes(item.path)).map((item) => ({
    ...item,
    description: '遗忘曲线与统计',
  })),
  { path: '/updates', label: '更新中心', icon: CloudDownload, end: false, description: '云端内容与发布版本' },
  { path: '/settings', label: '设置', icon: Settings2, end: false, description: '外观、账号与提醒' },
];
const DESKTOP_MORE_NAV = MORE_NAV;
const MOBILE_MORE_NAV: NavItem[] = MORE_NAV;
const MOBILE_PRIMARY_NAV = PRIMARY_NAV;

function isActive(pathname: string, item: NavItem): boolean {
  return item.end ? pathname === item.path : pathname.startsWith(item.path);
}

function TitleBar() {
  const [isMax, setIsMax] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const controls = (window as any).windowControls;
    if (!controls) return;
    controls.isMaximized().then(setIsMax);
    controls.onMaximizeChange(setIsMax);
  }, []);

  const controls = (window as any).windowControls;

  return (
    <div
      className="desktop-titlebar relative z-20 hidden h-9 shrink-0 items-center justify-between text-foreground lg:flex"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 pl-4">
        <GraduationCap className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground/58">{t('莫兰')}</span>
      </div>
      <div
        className="flex h-full items-center"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          type="button"
          aria-label={t('最小化')}
          onClick={() => controls?.minimize()}
          className="flex h-full w-11 items-center justify-center text-foreground/42 transition-colors hover:bg-white/40 hover:text-foreground"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={isMax ? t('还原窗口') : t('最大化')}
          onClick={() => controls?.maximize()}
          className="flex h-full w-11 items-center justify-center text-foreground/42 transition-colors hover:bg-white/40 hover:text-foreground"
        >
          <Square className="h-3 w-3" fill="currentColor" />
        </button>
        <button
          type="button"
          aria-label={t('关闭窗口')}
          onClick={() => controls?.close()}
          className="flex h-full w-11 items-center justify-center text-foreground/42 transition-colors hover:bg-destructive hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function MobileNav({ pathname, onActiveTab }: { pathname: string; onActiveTab?: () => void }) {
  const [moreState, setMoreState] = useState<'closed' | 'open' | 'closing'>('closed');
  const [sheetDragY, setSheetDragY] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);
  const moreRef = useRef<HTMLElement | null>(null);
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const sheetDragStartRef = useRef<number | null>(null);
  const sheetDragYRef = useRef(0);
  const { t } = useI18n();
  const moreActive = MOBILE_MORE_NAV.some((item) => isActive(pathname, item));
  const moreOpen = moreState === 'open';

  const closeMore = () => {
    setMoreState((current) => {
      if (current !== 'open') return current;
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => setMoreState('closed'), 190);
      return 'closing';
    });
  };

  const toggleMore = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (moreState === 'open') closeMore();
    else {
      setSheetDragY(0);
      sheetDragYRef.current = 0;
      setMoreState('open');
    }
  };

  const beginSheetDrag = (event: React.TouchEvent<HTMLDivElement>) => {
    if (moreState !== 'open') return;
    const touch = event.touches[0];
    if (!touch) return;
    sheetDragStartRef.current = touch.clientY;
    sheetDragYRef.current = 0;
    setSheetDragging(true);
  };

  const moveSheetDrag = (event: React.TouchEvent<HTMLDivElement>) => {
    if (sheetDragStartRef.current == null) return;
    const touch = event.touches[0];
    if (!touch) return;
    const delta = Math.max(0, Math.min(180, touch.clientY - sheetDragStartRef.current));
    if (delta > 0) event.preventDefault();
    sheetDragYRef.current = delta;
    setSheetDragY(delta);
  };

  const endSheetDrag = () => {
    if (sheetDragStartRef.current == null) return;
    const shouldClose = sheetDragYRef.current > 64;
    sheetDragStartRef.current = null;
    setSheetDragging(false);
    setSheetDragY(0);
    sheetDragYRef.current = 0;
    if (shouldClose) closeMore();
  };

  useEffect(() => {
    if (!moreOpen) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const insideCard = moreRef.current?.contains(target);
      const insideTrigger = moreTriggerRef.current?.contains(target);
      if (!insideCard && !insideTrigger) {
        closeMore();
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMore();
    };
    document.addEventListener('pointerdown', closeOutside, true);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside, true);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [moreOpen]);

  useEffect(() => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setSheetDragging(false);
    setSheetDragY(0);
    sheetDragYRef.current = 0;
    sheetDragStartRef.current = null;
    setMoreState('closed');
  }, [pathname]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <div className="mobile-liquid-shell lg:hidden" data-ui>
      <div className="mobile-liquid-nav" data-ui>
        <nav className="mobile-nav mobile-nav-core flex h-[60px] w-full items-end justify-around px-2 pb-1" aria-label={t('移动端主导航')}>
          {MOBILE_PRIMARY_NAV.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                aria-label={t(item.label)}
                onClick={(event) => {
                  if (!active) return;
                  event.preventDefault();
                  onActiveTab?.();
                }}
                className={cn(
                  'relative flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-0.5 text-[11px] font-medium transition-[color,background-color,transform] duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45',
                  active
                    ? 'text-primary'
                    : 'text-foreground/68 hover:bg-primary/6 hover:text-foreground',
                )}
              >
                {active && <span aria-hidden="true" className="absolute inset-x-3 inset-y-1 rounded-[14px] bg-primary/10" />}
                <Icon className="relative h-[17px] w-[17px]" strokeWidth={active ? 2 : 1.7} />
                <span className="relative">{t(item.label === '学习记录' ? '记录' : item.label === '今日计划' ? '计划' : item.label)}</span>
              </NavLink>
            );
          })}
          <button
            ref={moreTriggerRef}
            type="button"
            aria-label={t('更多')}
            aria-expanded={moreOpen}
            onClick={toggleMore}
            className={cn(
              'mobile-more-trigger relative flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-1 rounded-[16px] px-0.5 text-[11px] font-medium transition-[color,background-color,transform] duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45',
              moreActive || moreState !== 'closed' ? 'text-primary' : 'text-foreground/68 hover:bg-primary/6 hover:text-foreground',
            )}
          >
            {(moreActive || moreState !== 'closed') && (
              <span aria-hidden="true" className="absolute inset-x-3 inset-y-1 rounded-[14px] bg-primary/10" />
            )}
            <MoreHorizontal className="relative h-[18px] w-[18px]" strokeWidth={moreActive || moreState !== 'closed' ? 2.2 : 1.8} />
            <span className="relative">{t('更多')}</span>
          </button>
        </nav>
      </div>

      {moreState !== 'closed' && (
        <>
          <div
            className="mobile-more-scrim fixed inset-0 z-30 lg:hidden"
            data-state={moreState}
            aria-hidden="true"
          />
          <aside
            ref={moreRef}
            className="mobile-more-sheet fixed z-40 overflow-hidden border border-white/70 shadow-[0_22px_60px_rgba(20,54,48,0.22)]"
            data-state={moreState}
            aria-label={t('更多功能')}
          >
          <div
            className={cn('mobile-more-sheet-content p-3', sheetDragging && 'is-dragging')}
            style={{ '--sheet-drag': `${sheetDragY}px` } as React.CSSProperties}
          >
            <div
              className="mobile-more-sheet-grabber -mt-1 -mb-1"
              onTouchStart={beginSheetDrag}
              onTouchMove={moveSheetDrag}
              onTouchEnd={endSheetDrag}
              onTouchCancel={endSheetDrag}
              aria-hidden="true"
            >
              <span />
            </div>
            <div className="pt-2">
              <h2 className="text-lg font-semibold">{t('更多功能')}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{t('记录、更新与设置')}</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MOBILE_MORE_NAV.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(pathname, item);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={closeMore}
                    className={cn(
                      'mobile-more-card group flex min-h-[68px] items-center gap-3 rounded-[18px] border p-3 text-left transition-colors',
                      active && 'is-active',
                      index === MOBILE_MORE_NAV.length - 1 && 'sm:col-span-2',
                    )}
                  >
                    <span className="mobile-more-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] text-primary">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm font-semibold', active && 'text-primary')}>{t(item.label)}</span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">{t(item.description ?? '')}</span>
                    </span>
                    {active
                      ? <span className="shrink-0 rounded-full bg-primary/12 px-2 py-0.5 text-[10px] text-primary">{t('当前')}</span>
                      : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/45" />}
                  </NavLink>
                );
              })}
            </div>
            <div className="mobile-more-hint mt-3 flex items-center gap-2 rounded-[16px] px-3 py-2 text-[11px] text-foreground/60">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t('选择下一步，保持今天的节奏')}
            </div>
          </div>
          </aside>
        </>
      )}
    </div>
  );
}

export const Layout = () => {
  const { pathname } = useLocation();
  const { streakCount } = useProgress();
  const { refresh } = useContent();
  const { t } = useI18n();
  const webTest = __MORAN_WEB_TEST__;
  const workspaceRef = useRef<HTMLElement | null>(null);
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'refreshing' | 'complete'>('idle');
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const [pullOutcome, setPullOutcome] = useState<ContentRefreshOutcome | null>(null);
  const [pullVersion, setPullVersion] = useState(0);
  const pullStartYRef = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);
  const pullResetTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const pullThreshold = 84;
  const pullProgress = pullState === 'refreshing' || pullState === 'complete'
    ? 1
    : Math.min(1, pullDistance / pullThreshold);

  useEffect(() => () => {
    mountedRef.current = false;
    if (pullResetTimerRef.current) window.clearTimeout(pullResetTimerRef.current);
  }, []);

  useLayoutEffect(() => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollTop = 0;
      workspaceRef.current.scrollLeft = 0;
    }
    const page = pageContentRef.current;
    if (!page) return;

    const pageRoot = page.firstElementChild as HTMLElement | null;
    const candidates = pageRoot && pageRoot.children.length > 1
      ? Array.from(pageRoot.children)
      : Array.from(page.children);
    const blocks = candidates.filter((item): item is HTMLElement => (
      item instanceof HTMLElement
      && !['SCRIPT', 'STYLE', 'LINK'].includes(item.tagName)
      && window.getComputedStyle(item).position !== 'fixed'
    ));
    if (!blocks.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      blocks.forEach((block) => {
        block.dataset.contentReveal = 'visible';
      });
      return;
    }

    blocks.forEach((block, index) => {
      block.dataset.contentReveal = 'pending';
      block.style.setProperty('--reveal-delay', `${index * 80}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.contentReveal = 'visible';
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px',
    });
    const viewportHeight = workspaceRef.current?.clientHeight ?? window.innerHeight;
    blocks.forEach((block, index) => {
      const rect = block.getBoundingClientRect();
      if (index < 2 || (rect.top < viewportHeight * 0.96 && rect.bottom > 0)) {
        block.dataset.contentReveal = 'visible';
      } else {
        observer.observe(block);
      }
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateKeyboardState = () => {
      const occluded = window.innerHeight - viewport.height - viewport.offsetTop;
      setKeyboardOpen(occluded > 160);
    };
    updateKeyboardState();
    viewport.addEventListener('resize', updateKeyboardState);
    viewport.addEventListener('scroll', updateKeyboardState);
    return () => {
      viewport.removeEventListener('resize', updateKeyboardState);
      viewport.removeEventListener('scroll', updateKeyboardState);
    };
  }, []);

  const handlePullStart = (event: React.TouchEvent<HTMLElement>) => {
    if (pullState === 'refreshing' || (workspaceRef.current?.scrollTop ?? 0) > 0) return;
    const touch = event.touches[0];
    if (!touch) return;
    pullStartYRef.current = touch.clientY;
    pullDistanceRef.current = 0;
    setPullState('pulling');
  };

  const handlePullMove = (event: React.TouchEvent<HTMLElement>) => {
    if (pullStartYRef.current == null || pullState === 'refreshing') return;
    const touch = event.touches[0];
    if (!touch) return;
    const delta = touch.clientY - pullStartYRef.current;
    if (delta <= 0) {
      pullDistanceRef.current = 0;
      setPullDistance(0);
      return;
    }
    const next = Math.min(128, delta * 0.62);
    pullDistanceRef.current = next;
    setPullDistance(next);
  };

  const finishPull = () => {
    if (pullStartYRef.current == null) return;
    pullStartYRef.current = null;
    if (pullDistanceRef.current < pullThreshold) {
      setPullState('idle');
      setPullDistance(0);
      return;
    }

    setPullState('refreshing');
    setPullDistance(96);
    setRefreshProgress(0);
    setPullOutcome(null);
    const startedAt = performance.now();
    const request = refresh((value) => {
      if (mountedRef.current) setRefreshProgress(value);
    }, { notify: false })
      .then((result) => {
        setPullOutcome(contentRefreshOutcome(result));
        setPullVersion(result.version);
      })
      .catch(() => setPullOutcome('offline'));
    void request
      .finally(() => {
        const wait = Math.max(0, 650 - (performance.now() - startedAt));
        window.setTimeout(() => {
          if (!mountedRef.current) return;
          window.dispatchEvent(new Event(DATA_REFRESH_EVENT));
          setRefreshProgress(100);
          setPullState('complete');
          setPullDistance(96);
          pullResetTimerRef.current = window.setTimeout(() => {
            if (mountedRef.current) {
              setPullState('idle');
              setPullDistance(0);
              setRefreshProgress(0);
            }
          }, 420);
        }, wait);
      });
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-transparent text-foreground">
      <div className="moran-backdrop pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="moran-backdrop-art absolute inset-0" />
        <div className="moran-backdrop-wash absolute inset-0" />
      </div>

      {!webTest && <TitleBar />}

      <div
        className={cn(
          'app-frame relative z-10 flex min-h-0 flex-1 gap-0 p-0 lg:gap-3 lg:p-3',
          webTest ? 'lg:pt-3' : 'lg:pt-0',
        )}
      >
        <aside className="app-sidebar-shell app-sidebar app-glass hidden h-full w-[248px] shrink-0 flex-col overflow-hidden rounded-[28px] lg:flex">
          <Link
            to="/"
            className="flex items-center gap-3 px-5 pb-5 pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-semibold tracking-[-0.02em]">{t('莫兰')}</span>
              <span className="mt-0.5 block text-xs text-foreground/50">{t('英语词汇学习')}</span>
            </span>
          </Link>
          {webTest && (
            <span className="mx-5 mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-2.5 py-1 text-[10px] font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t('网页测试版')}
            </span>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label={t('主导航')}>
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={cn(
                    'flex min-h-11 items-center gap-3 rounded-[16px] px-3 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45',
                    active
                      ? 'bg-primary/10 text-foreground'
                      : 'text-foreground/62 hover:bg-primary/6 hover:text-foreground',
                  )}
                >
                  <Icon className={cn('h-[18px] w-[18px]', active && 'text-primary')} />
                  <span>{t(item.label)}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mx-3 mb-2 rounded-[20px] border border-white/55 bg-white/22 p-2">
            <p className="px-1.5 pt-0.5 text-[10px] font-medium tracking-wide text-foreground/40">{t('更多')}</p>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {DESKTOP_MORE_NAV.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    title={t(item.description ?? '')}
                    className={cn(
                      'flex min-h-[52px] flex-col justify-between rounded-[14px] border p-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45',
                      active
                        ? 'border-primary/35 bg-primary/10 text-primary'
                        : 'border-white/45 bg-white/18 text-foreground/58 hover:bg-white/38 hover:text-foreground',
                    )}
                  >
                    <Icon className={cn('h-[15px] w-[15px]', active && 'text-primary')} />
                    <span>{t(item.label)}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 p-3">
            <div className="rounded-[18px] bg-white/28 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Flame className="h-4 w-4 text-primary" />
                {t('连续学习 {n} 天', { n: streakCount })}
              </div>
            </div>
          </div>
        </aside>

        <div className="app-workspace-shell app-workspace app-glass app-glass-soft min-w-0 flex-1 overflow-hidden rounded-none lg:rounded-[28px]">
          <main
            ref={workspaceRef}
            className="app-main-scroll scrollbar-hidden relative h-full overflow-y-auto px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(0.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-8 lg:pt-2"
            style={{ overscrollBehaviorY: 'contain' }}
            onTouchStart={handlePullStart}
            onTouchMove={handlePullMove}
            onTouchEnd={finishPull}
            onTouchCancel={finishPull}
          >
            <div
              className={`pull-refresh${pullState === 'refreshing' || pullState === 'complete' ? ' is-loading' : ''}`}
              style={{
                opacity: pullState === 'idle' ? 0 : 1,
                transform: 'translate3d(-50%, 0, 0)',
              }}
              aria-live="polite"
              aria-hidden={pullState === 'idle'}
            >
              {pullState === 'refreshing' || pullState === 'complete' ? (
                <div className="pull-refresh-loader-card">
                  <ProcessingLoader
                    progress={refreshProgress}
                    active={pullState === 'refreshing'}
                    label={pullState === 'complete'
                      ? pullOutcome === 'updated'
                        ? t('内容已更新至 v{version}', { version: pullVersion })
                        : pullOutcome === 'offline'
                          ? t('网络不可用，已保留本地内容')
                          : pullOutcome === 'disabled'
                            ? t('当前构建未启用云端更新')
                            : t('内容已是最新 · v{version}', { version: pullVersion })
                      : t('正在更新内容')}
                  />
                </div>
              ) : (
                <>
                  <div className="pull-refresh-sky" style={{ '--pull-progress': pullProgress } as React.CSSProperties}>
                    <span className="pull-refresh-sun" />
                    <span className="pull-refresh-horizon" />
                  </div>
                  <span className="pull-refresh-label">
                    {pullProgress >= 1 ? t('松手更新') : t('下拉刷新')}
                  </span>
                </>
              )}
            </div>
            <div
              ref={pageContentRef}
              style={{
                transform: pullDistance > 0 ? `translate3d(0, ${pullDistance}px, 0)` : undefined,
                transition: pullState === 'pulling' ? 'none' : 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <StudyReminder />
      <PermissionConsent />
      {!keyboardOpen && (
        <MobileNav
          pathname={pathname}
          onActiveTab={() => workspaceRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      )}
    </div>
  );
};
