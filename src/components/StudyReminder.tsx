import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/settings-context';
import { getTodayStr, useProgress } from '@/context/progress-context';
import { useI18n } from '@/context/i18n-context';
import {
  removeCalendarReminder,
  scheduleCalendarReminder,
} from '@/lib/native-permissions';
import {
  calendarPermissionGranted,
  PERMISSION_CHANGED_EVENT,
} from '@/lib/permission-consent';

const REMINDER_HOUR = 18;
const SNOOZE_MS = 30 * 60 * 1000;

export default function StudyReminder() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const { progress } = useProgress();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [consentTick, setConsentTick] = useState(0);
  const today = getTodayStr();
  const activity = progress.dailyActivity[today] ?? {
    newWords: 0,
    reviews: 0,
  };
  const studied = activity.newWords + activity.reviews > 0;

  useEffect(() => {
    const handler = () => setConsentTick((value) => value + 1);
    window.addEventListener(PERMISSION_CHANGED_EVENT, handler);
    return () => window.removeEventListener(PERMISSION_CHANGED_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!settings.loggedIn || !calendarPermissionGranted()) return;
    const key = `cet6-practice:calendar-reminder:${today}`;
    let existing: string | null = null;
    try {
      existing = localStorage.getItem(key);
    } catch {
      // Ignore storage failures and keep the in-app reminder.
    }
    if (studied) {
      if (existing) {
        void removeCalendarReminder(existing);
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignore storage failures.
        }
      }
      return;
    }
    if (existing) return;
    const now = new Date();
    if (now.getHours() >= REMINDER_HOUR) return;
    const start = new Date(now);
    start.setHours(REMINDER_HOUR, 0, 0, 0);
    if (start.getTime() <= now.getTime()) return;
    void scheduleCalendarReminder({
      title: t('莫兰学习提醒'),
      description: t('完成今日学习计划。'),
      startTime: start.getTime(),
      endTime: start.getTime() + 15 * 60 * 1000,
    }).then((eventId) => {
      if (!eventId) return;
      try {
        localStorage.setItem(key, eventId);
      } catch {
        // Ignore storage failures.
      }
    });
  }, [consentTick, settings.loggedIn, studied, t, today]);

  useEffect(() => {
    if (!settings.loggedIn || studied || pathname !== '/') {
      setOpen(false);
      return;
    }

    const check = () => {
      if (new Date().getHours() < REMINDER_HOUR) return;
      try {
        const snoozeUntil = Number(localStorage.getItem(`cet6-practice:study-reminder:${today}`) ?? 0);
        if (snoozeUntil > Date.now()) return;
      } catch {
        // Continue without persistence if the WebView blocks storage.
      }
      setOpen(true);
      try {
        if (
          typeof window !== 'undefined'
          && 'Notification' in window
          && Notification.permission === 'granted'
          && !calendarPermissionGranted()
          && !sessionStorage.getItem(`cet6-practice:reminder-notified:${today}`)
        ) {
          new Notification(t('莫兰学习提醒'), {
            body: t('今天还没开始学习，完成一组单词再休息吧。'),
          });
          sessionStorage.setItem(`cet6-practice:reminder-notified:${today}`, '1');
        }
      } catch {
        // Notifications are optional; the in-app reminder still works.
      }
    };

    check();
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, [pathname, settings.loggedIn, studied, today]);

  if (!open) return null;

  const snooze = () => {
    try {
      localStorage.setItem(`cet6-practice:study-reminder:${today}`, String(Date.now() + SNOOZE_MS));
    } catch {
      // Ignore storage failures.
    }
    setOpen(false);
  };

  return createPortal(
    <div
      className="study-reminder-layer fixed inset-0 z-[25] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="study-reminder-title"
      data-study-reminder
    >
      <div className="study-reminder-card relative w-full max-w-md rounded-[26px] p-6 pr-14 text-foreground">
        <button
          type="button"
          aria-label={t('关闭提醒')}
          onClick={snooze}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/6 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
          <Bell className="h-6 w-6" />
        </span>
        <h2 id="study-reminder-title" className="mt-4 text-xl font-semibold">{t('今天还没开始学习')}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t('已经过了 18:00，你的今日学习计划还是 0 进度。先完成一组单词，再安心休息。')}
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            className="flex-1"
            onClick={() => {
              snooze();
              navigate('/vocab');
            }}
          >
            <BookOpen className="mr-2 h-4 w-4" /> {t('去学习')}
          </Button>
          <Button variant="outline" className="flex-1" onClick={snooze}>
            {t('30 分钟后提醒')}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
