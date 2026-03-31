"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, RefreshCcw, Eye, Search, CakeSlice, X, FileText } from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("admin_auth") !== "true") {
            router.push("/admin");
        } else {
            fetchOrders();
        }
    }, [router]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        router.push("/admin");
    };

    const updateStatus = async (id: string, newStatus: string) => {
        await supabase.from("orders").update({ status: newStatus }).eq("id", id);
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    };

    const saveAdminNote = async () => {
        if (!selectedOrder) return;
        await supabase.from("orders").update({ admin_note: selectedOrder.admin_note }).eq("id", selectedOrder.id);
        fetchOrders();
        alert("Not başarıyla müşteriye iletildi!");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Sipariş Alındı": return "bg-gray-100 text-gray-800 border-gray-200";
            case "Hazırlanıyor": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Hazır": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Yolda": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Teslim Edildi": return "bg-green-100 text-green-800 border-green-200";
            case "Reddedildi": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const filteredOrders = orders.filter(
        o =>
            o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-[100dvh] bg-brand-50/30 flex flex-col font-sans">
            <header className="bg-white/80 backdrop-blur-md border-b-2 border-brand-100 sticky top-0 z-10 shadow-[0_4px_20px_-10px_rgba(242,24,91,0.1)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-100 text-brand-500 p-2 rounded-xl">
                            <CakeSlice size={28} />
                        </div>
                        <h1 className="text-2xl font-normal text-brand-600 font-[family-name:var(--font-pacifico)] drop-shadow-sm mt-1">Loya</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-brand-600 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-brand-500 font-bold shadow-sm"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline text-sm">Çıkış Yap</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full overflow-x-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
                    <h2 className="text-3xl font-normal text-gray-800 font-[family-name:var(--font-pacifico)] drop-shadow-sm self-start sm:self-auto">Tüm Siparişler</h2>

                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={20} />
                            <input
                                type="text"
                                placeholder="İsim veya Sipariş No..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-5 py-3 border-2 border-brand-100 bg-white rounded-2xl outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 font-medium transition-all"
                            />
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="bg-white border-2 border-brand-100 p-3.5 rounded-2xl text-brand-500 hover:text-white hover:bg-brand-500 hover:border-brand-500 transition-all duration-300 shadow-sm transform hover:scale-105"
                            title="Yenile"
                        >
                            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border-2 border-white overflow-hidden">
                    <div className="overflow-x-auto p-2 scrollbar-hide">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="border-b-2 border-brand-50 text-xs sm:text-sm font-bold text-brand-600 bg-brand-50/50 rounded-t-2xl">
                                    <th className="px-4 sm:px-6 py-5 rounded-tl-2xl">Müşteri/No</th>
                                    <th className="px-4 sm:px-6 py-5 hidden md:table-cell">Pasta Türü</th>
                                    <th className="px-4 sm:px-6 py-5 hidden sm:table-cell">Tahmini Teslimat</th>
                                    <th className="px-4 sm:px-6 py-5">Durum</th>
                                    <th className="px-4 sm:px-6 py-5 text-right rounded-tr-2xl">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-brand-50">
                                {loading && orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-brand-400 font-bold text-lg">
                                            <RefreshCcw className="animate-spin inline-block mr-3" size={24} /> Yükleniyor...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-medium text-lg">Sipariş bulunamadı.</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-brand-50/50 transition-colors group">
                                            <td className="px-4 sm:px-6 py-5">
                                                <div className="text-sm font-bold text-gray-800">{order.customer_name}</div>
                                                <div className="font-mono text-xs font-bold text-brand-500 mt-1">{order.order_number}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 hidden md:table-cell">
                                                <div className="text-sm text-gray-700 line-clamp-1 font-bold">{order.cake_type}</div>
                                                <div className="text-xs text-brand-400 font-bold">{order.number_of_people} Kişilik</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 hidden sm:table-cell">
                                                <div className="text-sm text-gray-700 font-bold">{new Date(order.delivery_date).toLocaleDateString("tr-TR")}</div>
                                                <div className="text-xs font-bold text-accent-500 bg-accent-100 inline-block px-2 py-0.5 rounded-md mt-1">{order.delivery_time}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    className={`text-xs font-bold px-3 py-2 rounded-xl border-2 outline-none cursor-pointer appearance-none transition-all focus:ring-2 focus:ring-brand-200 ${getStatusColor(order.status)}`}
                                                >
                                                    <option value="Sipariş Alındı">Sipariş Alındı</option>
                                                    <option value="Hazırlanıyor">Hazırlanıyor</option>
                                                    <option value="Hazır">Hazır</option>
                                                    <option value="Yolda">Yolda</option>
                                                    <option value="Teslim Edildi">Teslim Edildi</option>
                                                    <option value="Reddedildi">Reddedildi</option>
                                                </select>
                                            </td>
                                            <td className="px-4 sm:px-6 py-5 text-right">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-3 bg-white border-2 border-brand-100 text-brand-500 hover:bg-brand-500 hover:text-white rounded-xl transition-all shadow-sm group-hover:shadow-md transform hover:-translate-y-0.5 inline-block"
                                                    title="Detaylar"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {selectedOrder && (
                <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-white relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-6 right-6 p-3 bg-gray-100 text-gray-500 hover:text-white hover:bg-red-500 rounded-full transition-all transform hover:rotate-90 hover:scale-110 shadow-sm"
                        >
                            <X size={20} className="stroke-[3]" />
                        </button>

                        <div className="p-8 sm:p-10">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30 rounded-2xl flex items-center justify-center transform -rotate-3">
                                    <CakeSlice size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-normal text-brand-600 font-[family-name:var(--font-pacifico)] drop-shadow-sm mt-1">Sipariş Detayı</h2>
                                    <p className="text-brand-400 font-mono font-bold text-sm bg-brand-50 inline-block px-3 py-1 rounded-lg mt-1 border border-brand-100">{selectedOrder.order_number}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-black text-brand-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-brand-300"></span> Pasta Bilgileri
                                        </h3>
                                        <div className="bg-brand-50/50 p-5 rounded-[2rem] border-2 border-brand-50 space-y-4 shadow-sm">
                                            <div><span className="text-gray-400 text-xs font-bold uppercase block">Tür</span><span className="font-bold text-gray-800 text-lg">{selectedOrder.cake_type}</span></div>
                                            <div className="flex justify-between">
                                                <div><span className="text-gray-400 text-xs font-bold uppercase block">Kişi Sayısı</span><span className="font-bold text-brand-500 bg-brand-100 px-2 py-0.5 rounded-md">{selectedOrder.number_of_people} Kişilik</span></div>
                                                <div className="text-right"><span className="text-gray-400 text-xs font-bold uppercase block">Ödeme</span><span className="font-bold text-gray-800">{selectedOrder.payment_method}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-brand-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-brand-300"></span> Teslimat
                                        </h3>
                                        <div className="bg-brand-50/50 p-5 rounded-[2rem] border-2 border-brand-50 space-y-4 shadow-sm">
                                            <div className="flex justify-between">
                                                <div><span className="text-gray-400 text-xs font-bold uppercase block">Tarih</span><span className="font-bold text-gray-800">{new Date(selectedOrder.delivery_date).toLocaleDateString('tr-TR')}</span></div>
                                                <div className="text-right"><span className="text-gray-400 text-xs font-bold uppercase block">Saat</span><span className="font-bold text-accent-600 bg-accent-100 px-2 py-0.5 rounded-md">{selectedOrder.delivery_time}</span></div>
                                            </div>
                                            <div><span className="text-gray-400 text-xs font-bold uppercase block">Adres</span><span className="font-bold text-gray-800 leading-snug">{selectedOrder.customer_address}</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-black text-brand-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-brand-300"></span> Müşteri
                                        </h3>
                                        <div className="bg-brand-50/50 p-5 rounded-[2rem] border-2 border-brand-50 space-y-4 shadow-sm">
                                            <div><span className="text-gray-400 text-xs font-bold uppercase block">Ad Soyad</span><span className="font-bold text-gray-800">{selectedOrder.customer_name}</span></div>
                                            <div className="flex justify-between">
                                                <div><span className="text-gray-400 text-xs font-bold uppercase block">Telefon</span><span className="font-bold text-gray-800">{selectedOrder.customer_phone}</span></div>
                                                {selectedOrder.instagram_username && (
                                                    <div className="text-right"><span className="text-gray-400 text-xs font-bold uppercase block">Instagram</span><span className="font-bold text-brand-500">{selectedOrder.instagram_username}</span></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {(selectedOrder.order_notes || selectedOrder.reference_image_url) && (
                                        <div>
                                            <h3 className="text-xs font-black text-brand-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-brand-300"></span> Ekler
                                            </h3>
                                            <div className="bg-gradient-to-br from-brand-50 to-brand-100 p-5 rounded-[2rem] border-2 border-white space-y-4 shadow-inner">
                                                {selectedOrder.order_notes && (
                                                    <div>
                                                        <span className="text-brand-400 text-xs font-extrabold uppercase block mb-1">Müşteri Notu</span>
                                                        <p className="text-brand-900 font-bold text-sm bg-white p-4 rounded-2xl shadow-sm italic">&ldquo;{selectedOrder.order_notes}&rdquo;</p>
                                                    </div>
                                                )}
                                                {selectedOrder.reference_image_url && (
                                                    <div>
                                                        <span className="text-brand-400 text-xs font-extrabold uppercase block mb-2">Örnek Görsel</span>
                                                        <a href={selectedOrder.reference_image_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border-4 border-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                                                            <img src={selectedOrder.reference_image_url} alt="Referans Pasta" className="w-full h-auto object-cover max-h-48" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 mt-6 border-t-2 border-brand-50">
                                        <span className="text-brand-500 text-sm font-bold uppercase tracking-widest block mb-3">Durumu Güncelle</span>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                            className={`w-full text-sm font-bold px-5 py-4 rounded-2xl border-2 outline-none cursor-pointer appearance-none transition-all focus:ring-4 focus:ring-brand-500/20 shadow-sm ${getStatusColor(selectedOrder.status)}`}
                                        >
                                            <option value="Sipariş Alındı">Sipariş Alındı</option>
                                            <option value="Hazırlanıyor">Hazırlanıyor</option>
                                            <option value="Hazır">Hazır</option>
                                            <option value="Yolda">Yolda</option>
                                            <option value="Teslim Edildi">Teslim Edildi</option>
                                            <option value="Reddedildi">Reddedildi</option>
                                        </select>
                                    </div>

                                    <div className="pt-6 mt-6 border-t-2 border-brand-50 bg-white rounded-[2rem] p-5 shadow-[0_10px_30px_-10px_rgba(242,24,91,0.15)] border border-brand-50">
                                        <span className="text-brand-600 text-sm font-black uppercase tracking-widest block mb-3 flex items-center gap-2"><FileText size={16} /> Müşteriye Not İlet</span>
                                        <textarea
                                            value={selectedOrder.admin_note || ""}
                                            onChange={(e) => setSelectedOrder({ ...selectedOrder, admin_note: e.target.value })}
                                            placeholder="Sipariş takip ekranında müşterinin görebileceği bir not bırakın..."
                                            className="w-full text-sm font-medium px-5 py-4 bg-brand-50/30 rounded-2xl border-2 border-brand-100 outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-400 resize-none h-24 transition-all"
                                        />
                                        <button
                                            onClick={saveAdminNote}
                                            className="mt-4 w-full bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-500 hover:to-brand-700 shadow-md hover:shadow-[0_10px_20px_-10px_rgba(242,24,91,0.6)] text-white font-bold py-3.5 rounded-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            Notu Kaydet ve Yayınla
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
