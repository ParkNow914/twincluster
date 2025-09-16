'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

// Form schema
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  companyName: z.string().min(2, 'Company name is required'),
  phoneNumber: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: signUp, isLoading } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      phoneNumber: '',
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, agreeTerms, ...userData } = data;
      await signUp(userData);
      
      toast({
        title: 'Registration successful',
        description: 'Please check your email to verify your account.',
      });
      
      router.push('/auth/verify-email');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred during registration',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create your account
          </p>
        </div>
        
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    disabled={isLoading}
                    {...register('fullName')}
                    className={cn({
                      'border-red-500': errors.fullName,
                    })}
                  />
                  {errors?.fullName && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                
                <div className="grid gap-1">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Inc."
                    disabled={isLoading}
                    {...register('companyName')}
                    className={cn({
                      'border-red-500': errors.companyName,
                    })}
                  />
                  {errors?.companyName && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register('email')}
                  className={cn({
                    'border-red-500': errors.email,
                  })}
                />
                {errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  placeholder="(00) 00000-0000"
                  disabled={isLoading}
                  {...register('phoneNumber')}
                />
              </div>
              
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeTerms"
                  {...register('agreeTerms')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="agreeTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors?.agreeTerms && (
                    <p className="text-xs text-red-600">
                      {errors.agreeTerms.message}
                    </p>
                  )}
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button variant="outline" type="button" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.microsoft className="mr-2 h-4 w-4" />
              )}
              Microsoft
            </Button>
          </div>
        </div>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
