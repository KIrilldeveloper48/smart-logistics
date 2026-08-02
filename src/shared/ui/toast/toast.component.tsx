import { useEffect } from 'react';
import { CircleCheckIcon, CircleXIcon, XIcon } from 'lucide-react';
import { cn } from '@/shared/lib';
import { Button } from '../button.component';
import type { TToastProps } from './toast.types';

export function Toast({ isOpen, message, variant, onOpenChange, duration = 5_000 }: TToastProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => onOpenChange(false), duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, isOpen, onOpenChange]);

  if (!isOpen) {
    return null;
  }

  const isError = variant === 'error';
  const Icon = isError ? CircleXIcon : CircleCheckIcon;

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-60 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 text-sm shadow-lg',
        isError
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700',
      )}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 break-words">{message}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="-mt-1 -mr-1"
        onClick={() => onOpenChange(false)}
      >
        <XIcon aria-hidden="true" />
        <span className="sr-only">Закрыть уведомление</span>
      </Button>
    </div>
  );
}
