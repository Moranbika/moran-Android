import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { enUS, zhCN } from 'date-fns/locale';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useI18n } from '@/context/i18n-context';
import { cn } from '@/lib/utils';

interface DatePopoverProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
}

function parseDateKey(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day, 12);
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function DatePopover({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: DatePopoverProps) {
  const { locale, t } = useI18n();
  const [state, setState] = useState<'closed' | 'open' | 'closing'>('closed');
  const [position, setPosition] = useState<{ left: number; top: number; width: number; maxHeight: number } | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const selected = parseDateKey(value);

  const close = useCallback(() => {
    setState((current) => {
      if (current !== 'open') return current;
      closeTimer.current = window.setTimeout(() => setState('closed'), 180);
      return 'closing';
    });
  }, []);

  const toggle = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (state === 'open') close();
    else {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const width = Math.min(318, window.innerWidth - 24);
        const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
        const top = rect.bottom + 8;
        setPosition({
          left,
          top,
          width,
          maxHeight: Math.max(220, window.innerHeight - top - 84),
        });
      }
      setState('open');
    }
  };

  useEffect(() => {
    if (state === 'closed') return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !panelRef.current?.contains(target)) close();
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onEscape);
    };
  }, [close, state]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const display = selected
    ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(selected)
    : placeholder;

  return (
    <div ref={rootRef} className={cn('date-popover', className)}>
      <button
        type="button"
        ref={triggerRef}
        className="date-popover-trigger"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={state === 'open'}
        onClick={toggle}
      >
        <CalendarDays className="h-4 w-4 text-primary" />
        <span className={cn('min-w-0 truncate', !selected && 'text-muted-foreground')}>{display}</span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', state === 'open' && 'rotate-180')} />
      </button>

      {state !== 'closed' && position && createPortal(
        <div
          ref={panelRef}
          className="date-popover-panel"
          data-state={state}
          role="dialog"
          aria-label={ariaLabel}
          style={{
            left: position.left,
            top: position.top,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
        >
          <Calendar
            mode="single"
            showOutsideDays={false}
            locale={locale.startsWith('zh') ? zhCN : enUS}
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(formatDateKey(date));
              close();
            }}
            className="date-popover-calendar"
          />
          {selected && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                close();
              }}
              className="date-popover-clear"
            >
              <X className="h-3.5 w-3.5" />
              {t('清除日期')}
            </button>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}
