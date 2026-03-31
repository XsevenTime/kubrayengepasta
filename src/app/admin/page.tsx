"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "loya123") {
            localStorage.setItem("admin_auth", "true");
            router.push("/admin/dashboard");
        } else {
            setError("Şifre hatalı, lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-200/40 blob-shape mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-200/50 blob-shape-rev mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/4 translate-y-1/4"></div>

            <div className="z-10 bg-white/80 backdrop-blur-xl p-10 sm:p-12 rounded-[3rem] shadow-[0_20px_60px_-10px_rgba(242,24,91,0.15)] w-full max-w-sm border-2 border-white text-center">
                <div className="relative w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30">
                    <Lock size={32} />
                    <Sparkles className="absolute -top-2 -right-1 text-accent-400 animate-pulse" size={24} />
                </div>
                <h1 className="text-3xl font-normal text-brand-600 mb-8 font-[family-name:var(--font-pacifico)] drop-shadow-sm">
                    Yönetici Girişi
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2 text-left">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium text-center text-lg tracking-widest text-brand-700"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 font-bold text-sm text-center bg-red-50 py-3 rounded-2xl border border-red-100">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all shadow-[0_8px_20px_-6px_rgba(242,24,91,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(242,24,91,0.4)] flex justify-center items-center gap-2 group hover:-translate-y-1"
                    >
                        Giriş Yap
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
}
