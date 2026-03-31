"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, CakeSlice, Sparkles, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrderPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
            const orderNumber = `CAKE-${randomStr}`;

            let referenceImageUrl = null;

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${orderNumber}-${Math.random()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('orders_images')
                    .upload(fileName, file);

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                } else if (uploadData) {
                    const { data } = supabase.storage.from('orders_images').getPublicUrl(fileName);
                    referenceImageUrl = data.publicUrl;
                }
            }

            const orderData = {
                org_id: '11111111-1111-1111-1111-111111111111',
                order_number: orderNumber,
                cake_type: formData.get("cake_type") as string,
                reference_image_url: referenceImageUrl,
                number_of_people: parseInt(formData.get("number_of_people") as string, 10),
                delivery_date: formData.get("delivery_date") as string,
                delivery_time: formData.get("delivery_time") as string,
                customer_name: formData.get("customer_name") as string,
                customer_phone: formData.get("customer_phone") as string,
                customer_address: formData.get("customer_address") as string,
                instagram_username: formData.get("instagram_username") as string,
                order_notes: formData.get("order_notes") as string,
                payment_method: formData.get("payment_method") as string,
            };

            const { error: dbError } = await supabase.from('orders').insert([orderData]);

            if (dbError) throw dbError;

            setOrderSuccess(orderNumber);
        } catch (err: any) {
            setError(err.message || "Sipariş oluşturulurken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-200 blob-shape mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
                <div className="z-10 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl max-w-md w-full text-center border-2 border-white">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 transform rotate-6">
                        <CheckCircle2 size={48} strokeWidth={2} />
                        <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={24} />
                    </div>
                    <h2 className="text-4xl font-normal text-brand-600 mb-2 font-[family-name:var(--font-pacifico)] drop-shadow-sm">Harika!</h2>
                    <p className="text-gray-600 mb-6 font-medium text-lg">Siparişiniz sevgiyle alındı.</p>
                    <div className="text-2xl font-mono font-bold text-brand-600 bg-brand-50 border-2 border-brand-200 py-3 px-6 rounded-2xl inline-block mb-8 shadow-sm">
                        {orderSuccess}
                    </div>
                    <p className="text-sm text-gray-500 mb-8">Bu sipariş numarası ile durum takibi yapabilirsiniz.</p>
                    <Link href="/" className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-[0_8px_20px_-6px_rgba(242,24,91,0.5)] w-full hover:-translate-y-1">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-background min-h-[100dvh] pb-16 relative overflow-hidden">
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-brand-200/50 blob-shape mix-blend-multiply filter blur-3xl opacity-40 -translate-x-1/2"></div>

            <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-brand-100">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
                    <Link href="/" className="text-brand-500 hover:bg-brand-100 bg-brand-50 p-2.5 rounded-full transition-colors mr-4 shadow-sm border border-brand-100">
                        <ArrowLeft size={22} strokeWidth={2.5} />
                    </Link>
                    <h1 className="text-2xl font-normal text-brand-600 font-[family-name:var(--font-pacifico)] flex items-center justify-center gap-3 w-full absolute left-0 right-0 pointer-events-none drop-shadow-sm">
                        Sipariş Ver <CakeSlice className="text-brand-400" size={24} />
                    </h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 mt-10 w-full relative z-10">
                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-5 rounded-2xl border-2 border-red-200 font-medium font-sans">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-white p-6 sm:p-10 space-y-10 relative">

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-brand-600 border-b-2 border-brand-100 pb-3 flex items-center gap-2">
                            <span className="bg-brand-100 text-brand-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
                            Pasta Detayları
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Pasta Türü *</label>
                                <select required name="cake_type" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium text-gray-700">
                                    <option value="">Tatlı seçiminizi yapın...</option>
                                    <option value="Çikolatalı ve Frambuazlı">Çikolatalı ve Frambuazlı</option>
                                    <option value="Beyaz Çikolatalı ve Meyveli">Beyaz Çikolatalı ve Meyveli</option>
                                    <option value="Rulo Pasta">Rulo Pasta</option>
                                    <option value="Krokanlı ve Karamelli">Krokanlı ve Karamelli</option>
                                    <option value="Özel Tasarım Şeker Hamurlu">Özel Tasarım (Şeker Hamurlu)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kişi Sayısı *</label>
                                <input required type="number" name="number_of_people" min="1" max="100" placeholder="Örn: 10" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Örnek Görsel</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full border-2 border-dashed border-brand-300 rounded-2xl px-4 py-8 flex flex-col items-center justify-center text-center bg-brand-50/50 hover:bg-brand-100 transition-colors group">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-brand-400 group-hover:text-brand-600">
                                        <Upload size={24} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-bold text-brand-700">{file ? file.name : "Görsel yüklemek için tıklayın veya sürükleyin"}</span>
                                    <span className="text-xs font-medium text-brand-400 mt-1">PNG, JPG, max 5MB</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Teslimat Tarihi *</label>
                                <input required type="date" name="delivery_date" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium text-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Teslimat Saati *</label>
                                <input required type="time" name="delivery_time" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium text-gray-700" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-brand-600 border-b-2 border-brand-100 pb-3 flex items-center gap-2">
                            <span className="bg-brand-100 text-brand-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
                            İletişim Bilgileri
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Ad Soyad *</label>
                                <input required type="text" name="customer_name" placeholder="Adınız Soyadınız" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Telefon *</label>
                                <input required type="tel" name="customer_phone" placeholder="0555 555 55 55" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Açık Adres *</label>
                            <textarea required name="customer_address" rows={3} placeholder="Mahalle, Sokak, Kapı No, İlçe/İl" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium resize-none"></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Instagram Kullanıcı Adı</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500 font-bold">@</span>
                                <input type="text" name="instagram_username" placeholder="kullanici_adi" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl pl-10 pr-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-brand-600 border-b-2 border-brand-100 pb-3 flex items-center gap-2">
                            <span className="bg-brand-100 text-brand-500 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">3</span>
                            Ödeme & Notlar
                        </h2>

                        <div className="space-y-2 w-full sm:w-1/2">
                            <label className="text-sm font-bold text-gray-700">Ödeme Yöntemi *</label>
                            <select required name="payment_method" className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium text-gray-700 cursor-pointer">
                                <option value="Havale">Havale / EFT</option>
                                <option value="Kapıda Ödeme">Kapıda Ödeme</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Ek Notlar</label>
                            <textarea name="order_notes" rows={2} placeholder="Pastanın üzerine yazılacak yazı, alerjen durumu vb." className="w-full bg-brand-50/50 border-2 border-brand-100 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 outline-none transition-all font-medium resize-none"></textarea>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-bold text-lg py-5 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(242,24,91,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(242,24,91,0.4)] flex justify-center items-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden"></div>
                            {isSubmitting ? (
                                <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                            ) : (
                                <span className="relative z-10 flex items-center gap-2">
                                    <Heart size={22} className="fill-white animate-pulse" /> Siparişi Tamamla
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
