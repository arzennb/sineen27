import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Box } from "lucide-react";
import { Product, PurchaseRecord } from "@/lib/products";
import { Card, Input, Badge } from "@/components/SimpleUI";

interface PurchasesTabProps {
  products: Product[];
  purchases: PurchaseRecord[];
  openPurchaseModal: (purchase?: PurchaseRecord) => void;
  deletePurchase: (id: string) => void;
}

export default function PurchasesTab({ products, purchases, openPurchaseModal, deletePurchase }: PurchasesTabProps) {
  const [search, setSearch] = useState("");
  const filteredPurchases = purchases.filter(p => p.productName.includes(search) || p.date.includes(search));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
       <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black mb-1">سجل المشتريات</h1>
            <p className="text-xs text-slate-400 font-bold">إدارة فواتير السلع الواردة وإضافتها للمخزون بدقة</p>
          </div>
          <button onClick={() => openPurchaseModal()} className="bg-blue-600 text-white px-6 h-12 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
             <Plus className="h-5 w-5" />
             <span>فاتورة جديدة</span>
          </button>
       </div>
       
       <div className="relative w-full max-w-md">
          <Input placeholder="ابحث برقم الفاتورة أو اسم المنتج..." value={search} onChange={e => setSearch(e.target.value)} className="h-12 w-full pr-10 text-right font-bold text-sm" />
          <Search className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" />
       </div>
       
       {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <Box className="h-16 w-16 mb-4 opacity-20" />
             <p className="font-bold">لا توجد فواتير مشتريات بعد</p>
          </div>
       ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                   <tr className="text-xs font-black text-slate-500">
                     <th className="py-4 px-6">التاريخ</th>
                     <th className="py-4 px-6">المنتج</th>
                     <th className="py-4 px-6">الكميات الواردة</th>
                     <th className="py-4 px-6 text-center">التكلفة (للوحدة)</th>
                     <th className="py-4 px-6 text-center">الإجمالي</th>
                     <th className="py-4 px-6 text-center">إجراءات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-sm">
                   {filteredPurchases.map(p => {
                      const date = new Date(p.date).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
                      const totalQty = Object.values(p.stockAdded).reduce((a, b) => a + b, 0);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                           <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500 font-sans">{date}</td>
                           <td className="py-4 px-6 text-slate-900">{p.productName}</td>
                           <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1">
                                 {Object.entries(p.stockAdded).map(([s, q]) => q > 0 ? (
                                    <Badge key={s} className="bg-blue-50 text-blue-700 border-0 text-[10px] py-1">{s.toLowerCase().startsWith('standard') || s.toLowerCase().startsWith('stander') ? `الكمية: ${q}` : `مقاس ${s}: ${q}`}</Badge>
                                 ) : null)}
                                 <Badge className="bg-slate-100 text-slate-600 border-0 text-[10px] py-1">المجموع: {totalQty}</Badge>
                              </div>
                           </td>
                           <td className="py-4 px-6 text-center text-slate-600 font-sans">{p.costPriceDZD?.toLocaleString() || 0} دج</td>
                           <td className="py-4 px-6 text-center font-black font-sans text-blue-600">{(p.totalCost || (p.costPriceDZD * totalQty)).toLocaleString()} دج</td>
                           <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                 <button onClick={() => openPurchaseModal(p)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="تعديل"><Edit className="h-4 w-4" /></button>
                                 <button onClick={() => { if(window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟ (سيتم خصم الكميات من المخزون)')) deletePurchase(p.id); }} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="حذف"><Trash2 className="h-4 w-4" /></button>
                              </div>
                           </td>
                        </tr>
                      )
                   })}
                </tbody>
              </table>
            </div>
          </div>
       )}
    </div>
  )
}
