'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingRedirect, setPendingRedirect] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (pendingRedirect && session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
                setLoading(false);
                setError(null);
                setPendingRedirect(false);
                router.replace('/admin/dashboard');
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [pendingRedirect, router, supabase.auth]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);
        setPendingRedirect(true);

        try {
            // 1. Sign in with Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError) throw authError;

            // 2. Verified if user is actually an admin
            // The middleware will handle protection, but good to check here for better UX
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('role')
                .eq('user_id', authData.user.id)
                .eq('is_active', true)
                .single();

            if (adminError || !adminData) {
                throw new Error('Unauthorized: Access restricted to administrators.');
            }

            // 3. Redirect to Dashboard
            setPendingRedirect(false);
            router.replace('/admin/dashboard');
            router.refresh();

        } catch (err: unknown) {
            console.error('Login failed:', err);
            setPendingRedirect(false);
            const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
            if (message.includes('Invalid login credentials')) {
                setError('Invalid email or password.');
            } else {
                setError(message);
            }

            if (message.includes('Unauthorized')) {
                await supabase.auth.signOut();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#fff7f5_0%,#fffaf8_46%,#f9fbff_100%)] flex items-center justify-center px-4 py-8">
            <div className="max-w-md w-full bg-white rounded-[28px] shadow-[0_26px_60px_rgba(227,30,36,0.08)] overflow-hidden border border-red-100">
                <div className="px-8 py-8">
                    <div className="mb-6">
                        <Link href="/" className="mb-6 inline-flex w-fit items-center">
                            <Image
                                src="/logo 1.png"
                                alt="Sindoor Saubhagya"
                                width={150}
                                height={50}
                                className="h-auto w-auto object-contain"
                                priority
                            />
                        </Link>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 mb-4 text-red-600 shadow-[0_16px_30px_rgba(227,30,36,0.10)]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-500">Admin portal</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-3">Sign in to dashboard</h2>
                        <p className="text-slate-500 mt-2 text-sm leading-7">Use your administrator credentials to manage approvals and users.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-start gap-2 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block h-14 w-full pl-12 pr-4 rounded-2xl border border-slate-200 bg-[#fdfcfc] text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="block h-14 w-full pl-12 pr-14 rounded-2xl border border-slate-200 bg-[#fdfcfc] text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-50"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-red-500"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center h-14 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_20px_36px_rgba(227,30,36,0.24)]"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
                <div className="bg-[#fff8f7] px-8 py-4 border-t border-red-100">
                    <p className="text-xs text-center text-slate-500">
                        Authorized personnel only. All activities are monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}
