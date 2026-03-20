'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Sparkles } from 'lucide-react'

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupForm = z.infer<typeof signupSchema>

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  borderRadius: '10px',
}

export default function SignupPage() {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(values: SignupForm) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div
        className="w-full rounded-2xl p-8 text-center"
        style={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.25)' }}
        >
          <CheckCircle className="w-7 h-7" style={{ color: '#E11D48' }} />
        </div>
        <h2
          className="text-xl font-bold text-white mb-2"
          style={{ fontFamily: 'var(--font-sora), sans-serif' }}
        >
          Check your email
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
          We sent a confirmation link to your email. Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium transition-colors duration-200 hover:text-white"
          style={{ color: '#FB7185' }}
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-2xl p-8"
      style={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: 'var(--font-sora), sans-serif', letterSpacing: '-0.02em' }}
        >
          Create account
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Start planning your next trip
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            style={INPUT_STYLE}
            className="placeholder:text-white/20 focus-visible:ring-[#E11D48]/40 focus-visible:border-[#E11D48]/60"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs" style={{ color: '#f87171' }}>{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            style={INPUT_STYLE}
            className="placeholder:text-white/20 focus-visible:ring-[#E11D48]/40 focus-visible:border-[#E11D48]/60"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs" style={{ color: '#f87171' }}>{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            style={INPUT_STYLE}
            className="placeholder:text-white/20 focus-visible:ring-[#E11D48]/40 focus-visible:border-[#E11D48]/60"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs" style={{ color: '#f87171' }}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-white font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-px mt-2"
          style={{
            background: '#E11D48',
            boxShadow: '0 0 24px rgba(225,29,72,0.35)',
            borderRadius: '10px',
            fontFamily: 'var(--font-sora), sans-serif',
          }}
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium transition-colors duration-200 hover:text-white"
          style={{ color: '#FB7185' }}
        >
          Sign in
        </Link>
      </p>

      {/* Feature hint */}
      <div
        className="mt-6 pt-5 flex items-center gap-2.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(225,29,72,0.12)' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#E11D48' }} />
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          AI-powered trip planning, itineraries, and budget tracking — free forever.
        </p>
      </div>
    </div>
  )
}
