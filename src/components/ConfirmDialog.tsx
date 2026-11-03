// 二次确认弹窗：学习量过多时确认。左红"再想想"取消，右灰"我确定"确认。

import type { ReactNode } from 'react';
import { useI18n } from '@/context/i18n-context';

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title = '学习量过多',
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <h3 className="text-lg font-bold">{t(title)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {typeof message === 'string' ? t(message) : message ?? t('确定要学这么多吗？一次学习量过大容易记不牢、容易疲劳。')}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
          >
            {t('再想想')}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-muted px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted/70"
          >
            {t('我确定')}
          </button>
        </div>
      </div>
    </div>
  );
}
