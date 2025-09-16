'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

// Form schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      toast({
        title: 'Error',
        description: 'Invalid reset link. Please request a new reset link.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      
      await authApi.resetPassword(
        token,
        data.password,
        data.confirmPassword
      );
      
      toast({
        title: 'Password reset successful',
        description: 'Your password has been updated successfully.',
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] text-center">
          <Icons.alertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-semibold tracking-tight">Invalid Reset Link</h1>
          <p className="text-muted-foreground">
            The password reset link is invalid or has expired. Please request a new reset link.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Request a new reset link
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.lock className="mx-auto h-8 w-8" />
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter a new password for {email}
          </p>
        </div>
        
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={isPasswordVisible.password ? 'text' : 'password'}
                    disabled={isLoading}
                    {...register('password')}
                    className={cn('pr-10', {
                      'border-red-500': errors.password,
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsPasswordVisible({
                      ...isPasswordVisible,
                      password: !isPasswordVisible.password,
                    })}
                  >
                    {isPasswordVisible.password ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isPasswordVisible.password ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
                {errors?.password && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="••••••••"
                    type={isPasswordVisible.confirmPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    {...register('confirmPassword')}
                    className={cn('pr-10', {
                      'border-red-500': errors.confirmPassword,
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsPasswordVisible({
                      ...isPasswordVisible,
                      confirmPassword: !isPasswordVisible.confirmPassword,
                    })}
                  >
                    {isPasswordVisible.confirmPassword ? (
                      <Icons.eyeOff className="h-4 w-4" />
                    ) : (
                      <Icons.eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isPasswordVisible.confirmPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
                {errors?.confirmPassword && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Reset Password
              </Button>
            </div>
          </form>
          
          <div className="text-center text-sm">
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
