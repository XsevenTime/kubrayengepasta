"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, PackageOpen, Truck, CheckCircle2, ClipboardList, ChefHat, XCircle, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TrackingPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;
        setLoading(true);
        setError(null);
        setOrderData(null);

        try {
            const formattedNumber = orderNumber.trim().toUpperCase();
            const { data, error: sbError } = await supabase.from('orders').select('status, admin_note').eq('order_number', formattedNumber).single();
            if (sbError || !data) setError("Sipariş bulunamadı. Lütfen numaranızı kontrol edin.");
            else setOrderData(data);
        } catch (err) {
            setError("Bağlantı hatası oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const StatusDisplay = () => {
        if (!orderData) return null;
        let icon, text, color;
        switch (orderData.status) {
            case 'Sipariş Alındı': icon = <ClipboardList size={48} className="text-gray-500 mb-4" />; text = "Sipariş Alındı"; color = "bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border-2 border-gray-100 text-gray-700"; break;
            case 'Hazırlanıyor': icon = <ChefHat size={48} className="text-yellow-500 mb-4" />; text = "Pastanız Hazırlanıyor"; color = "bg-yellow-50 shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)] border-2 border-yellow-200 text-yellow-800"; break;
            case 'Hazır': icon = <PackageOpen size={48} className="text-orange-500 mb-4" />; text = "Teslimata Hazır"; color = "bg-orange-50 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.2)] border-2 border-orange-200 text-orange-800"; break;
            case 'Yolda': icon = <Truck size={48} className="text-blue-500 mb-4 animate-bounce" />; text = "Siparişiniz Yola Çıktı"; color = "bg-blue-50 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.2)] border-2 border-blue-200 text-blue-800"; break;
            case 'Teslim Edildi': icon = <CheckCircle2 size={48} className="text-green-500 mb-4" />; text = "Teslim Edildi"; color = "bg-green-50 shadow-[0_10px_30px_-10px_rgba(34,197,94,0.2)] border-2 border-green-200 text-green-800"; break;
            case 'Reddedildi': icon = <XCircle size={48} className="text-red-500 mb-4" />; text = "Sipariş İptal Edildi"; color = "bg-red-50 shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)] border-2 border-red-200 text-red-800"; break;
            default: return null;
        }

        return (
            <div className="mt-8 flex flex-col gap-5">
                <div className={`p-10 rounded-[2.5rem] ${color} flex flex-col items-center justify-center text-center transition-all duration-500 transform hover:scale-[1.02]`}>
                    <div className="bg-white p-4 rounded-full shadow-sm mb-2 flex items-center justify-center">{icon}</div>
                    <h3 className="text-3xl font-normal font-[family-name:var(--font-pacifico)] drop-shadow-sm">{text}</h3>
                    <p className="mt-3 opacity-80 text-sm font-medium">Sipariş numarası: <span className="font-bold bg-white/50 px-2 py-1 rounded-md">{orderNumber.toUpperCase()}</span></p>
                </div>

                {orderData.admin_note && (
                    <div className="p-6 rounded-3xl bg-brand-50 border-2 border-brand-200 flex gap-4 text-left w-full text-brand-800 shadow-md items-start transform hover:-translate-y-1 transition-transform">
                        <div className="bg-white p-3 text-brand-500 rounded-full shrink-0 shadow-sm mt-0.5">
                            <FileText size={24} />
                        </div>
                        <div>
                            <span className="text-xs uppercase font-black text-brand-500 tracking-wider block mb-1">Loya Pâtisserie'den Not</span>
                            <p className="font-semibold text-brand-900">{orderData.admin_note}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 bg-background min-h-[100dvh] pb-16 relative overflow-hidden">
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-200/50 blob-shape-rev mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/3"></div>

            <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-brand-100">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
                    <Link href="/" className="text-brand-500 hover:bg-brand-100 bg-brand-50 p-2.5 rounded-full transition-colors mr-4 shadow-sm border border-brand-100">
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h1 className="text-2xl font-normal text-brand-600 font-[family-name:var(--font-pacifico)] flex items-center justify-center gap-3 w-full absolute left-0 right-0 pointer-events-none drop-shadow-sm">
                        Sipariş Sorgula <Search className="text-brand-400" size={24} />
                    </h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 mt-12 w-full relative z-10">
                <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-white">
                    <h2 className="text-3xl font-normal text-center text-brand-600 mb-3 font-[family-name:var(--font-pacifico)] drop-shadow-sm">
                        Nerede Kaldı?
                    </h2>
                    <p className="text-center text-gray-500 mb-8 font-medium">
                        Siparişinizi tamamlarken verilen sipariş numarasını giriniz.
                    </p>

                    <form onSubmit={handleSearch} className="space-y-5">
                        <div className="space-y-2">
                            <input
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="Örn: LOYA-1A2B"
                                className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-bold text-center text-lg placeholder:font-medium placeholder:text-gray-400 uppercase tracking-widest text-brand-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !orderNumber.trim()}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-bold text-lg py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(242,24,91,0.5)] flex justify-center items-center group relative overflow-hidden hover:-translate-y-1"
                        >
                            {loading ? (
                                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Search size={22} className="group-hover:scale-110 transition-transform" />
                                    Sorgula
                                </span>
                            )}
                        </button>
                    </form>

                    {error && <div className="mt-6 text-center text-red-600 font-bold bg-red-50 p-4 rounded-2xl border-2 border-red-100">{error}</div>}

                    <StatusDisplay />
                </div>
            </div>
        </div>
    );
}
