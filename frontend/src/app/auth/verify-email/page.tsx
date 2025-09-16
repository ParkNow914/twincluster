'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { toast } from '@/components/ui/use-toast';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [emailToResend, setEmailToResend] = useState(email || '');
  
  // Verify email on component mount if token is present
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;
      
      try {
        await authApi.verifyEmail(token);
        setIsVerified(true);
        toast({
          title: 'Email verified',
          description: 'Your email has been verified successfully.',
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
        
      } catch (error) {
        toast({
          title: 'Verification failed',
          description: error instanceof Error ? error.message : 'Failed to verify email',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyEmail();
  }, [token, router]);
  
  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailToResend) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsResending(true);
      
      await authApi.resendVerificationEmail(emailToResend);
      
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend verification email',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-6 text-center">
          <Icons.mail className="h-12 w-12 animate-pulse text-primary" />
          <h1 className="text-2xl font-semibold">Verifying your email...</h1>
          <p className="text-muted-foreground">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }
  
  if (isVerified) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-6 text-center">
          <div className="rounded-full bg-green-100 p-4">
            <Icons.checkCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold">Email Verified Successfully!</h1>
          <p className="text-muted-foreground">
            Your email has been verified. You can now sign in to your account.
          </p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.mail className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.
          </p>
        </div>
        
        <div className="mt-6 rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium">Didn't receive the email?</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Enter your email below and we'll send you a new verification link.
          </p>
          
          <form onSubmit={handleResendVerification} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={emailToResend}
                onChange={(e) => setEmailToResend(e.target.value)}
                disabled={isResending}
                required
              />
            </div>
            
            <Button type="submit" disabled={isResending} className="w-full">
              {isResending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Resend Verification Email
            </Button>
          </form>
        </div>
        
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
  );
}
