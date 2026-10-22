import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

export default function PhotographerLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) throw loginError

      const { data: access, error: accessError } = await supabase
        .from('photographer_access')
        .select('staff_role, is_active')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (accessError) throw accessError

      if (
        !access ||
        !access.is_active ||
        !['photographer', 'admin', 'super_admin'].includes(
          access.staff_role
        )
      ) {
        await supabase.auth.signOut()
        throw new Error(
          'This account is not authorized to access the photographer portal.'
        )
      }

      navigate('/photographer/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#00152E] via-[#002B5C] to-[#001226] px-5 py-16">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-300/40 bg-white/10 text-amber-300 shadow-xl shadow-black/20 backdrop-blur-sm">
            <Camera size={36} strokeWidth={1.6} />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-300 sm:text-sm">
            AMANO National Convention 2026
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Photographer Portal
          </h1>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />

          {/* <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-blue-100/75 sm:text-base">
            Your gateway to managing and preserving the moments that define
            our convention.
          </p> */}
        </div>

        {/* Login card */}
        <form
          onSubmit={handleLogin}
          className="space-y-5 rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-blue-100/65">
              Sign in using your authorized staff account.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="staff-email"
              className="mb-2 block text-sm font-medium text-blue-50"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/50"
              />

              <input
                id="staff-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 bg-[#001A38]/60 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-blue-100/30 focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/15"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="staff-password"
              className="mb-2 block text-sm font-medium text-blue-50"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-200/50"
              />

              <input
                id="staff-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/15 bg-[#001A38]/60 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-blue-100/30 focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 px-5 py-3.5 font-bold text-[#002B5C] shadow-lg shadow-amber-500/10 transition duration-300 hover:-translate-y-0.5 hover:from-amber-200 hover:to-yellow-400 hover:shadow-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#002B5C]/30 border-t-[#002B5C]" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to Portal
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </>
            )}
          </button>

          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-amber-300"
            />
            <p className="text-xs leading-5 text-blue-100/65">
              Secure staff access only. Accounts must be authorized by the
              AMANO administrator. Public registration is unavailable.
            </p>
          </div>
        </form>

        {/* Return link */}
        <div className="mt-7 text-center">
          <Link
            to="/gallerie"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-100/70 transition hover:text-amber-300"
          >
            <span aria-hidden="true">←</span>
            Return to the convention gallery
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-blue-100/35">
          Connect · Network · Build · Advance
        </p>
      </div>
    </section>
  )
}