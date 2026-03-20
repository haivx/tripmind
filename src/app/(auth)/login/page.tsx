'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  borderRadius: '10px',
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginForm) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
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
          Sign in
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Enter your email and password to continue
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
            autoComplete="current-password"
            style={INPUT_STYLE}
            className="placeholder:text-white/20 focus-visible:ring-[#E11D48]/40 focus-visible:border-[#E11D48]/60"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs" style={{ color: '#f87171' }}>{errors.password.message}</p>
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
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium transition-colors duration-200 hover:text-white"
          style={{ color: '#FB7185' }}
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
