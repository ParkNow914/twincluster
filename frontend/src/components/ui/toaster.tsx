'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();
  const { theme } = useTheme();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all',
              {
                'bg-background text-foreground': theme === 'light',
                'bg-gray-800 text-white': theme === 'dark',
                'border-red-500': props.variant === 'destructive',
                'border-green-500': props.variant === 'success',
                'border-amber-500': props.variant === 'warning',
                'border-blue-500': props.variant === 'info',
              }
            )}
          >
            <div className="flex-1 space-y-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
