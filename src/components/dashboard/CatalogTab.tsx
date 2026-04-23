import { Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/SimpleUI";
import { Product } from "@/lib/products";

interface CatalogTabProps {
  products: Product[];
  openAddModal: () => void;
  openEditModal: (p: Product) => void;
  deleteProduct: (id: string) => void;
  getProductPrice: (p: Product, s: string) => number;
  role: string | null;
}

export default function CatalogTab({
  role, products, openAddModal, openEditModal, deleteProduct, getProductPrice
}: CatalogTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
       <div className="flex justify-between items-center saneen-card p-10">
          <h1 className="text-2xl font-black text-gray-900">إدارة المنتجات</h1>
          <button onClick={openAddModal} className="saneen-btn-gold h-14">إضافة قطعة جديدة <Plus className="h-5 w-5" /></button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {products.map(p => (
            <div key={p.id} className="saneen-card group overflow-hidden border-slate-100/50 hover:shadow-xl hover:border-[#A68966]/20 transition-all">
               <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                  {p.image && <img src={p.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
                      <button onClick={() => openEditModal(p)} className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-all shadow-xl"><Edit className="h-6 w-6"/></button>
                      <button onClick={() => {if(confirm('هل تريد حذف هذا المنتج نهائياً؟')) deleteProduct(p.id);}} className="h-14 w-14 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 className="h-6 w-6"/></button>
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                     <Badge className="bg-white/90 backdrop-blur text-black border-0 font-bold px-3 py-1.5 rounded-lg shadow-sm">{p.category}</Badge>
                     {p.discountPercent > 0 && <Badge className="bg-red-500 text-white border-0 font-bold px-3 py-1.5 rounded-lg shadow-sm">-{p.discountPercent}%</Badge>}
                  </div>
               </div>
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                     <h4 className="text-lg font-black leading-tight text-gray-900 group-hover:text-[#A68966] transition-colors">{p.name}</h4>
                     <div className="text-right">
                        <div className="text-sm font-black text-gray-900">{getProductPrice(p, p.sizes[0]).toLocaleString()} دج</div>
                        {p.discountPercent > 0 && <div className="text-[10px] text-slate-400 line-through font-bold">{(p.basePriceDZD).toLocaleString()} دج</div>}
                     </div>
                  </div>
                  <div className="flex justify-between items-center py-4 px-5 bg-[#F8F7F4] rounded-2xl border border-[#E5E0D8]/30">
                     <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${Object.values(p.stock).reduce((a,b)=>a+b,0) > 5 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-[10px] font-black text-[#8E8B83] uppercase tracking-wider">المخزون</span>
                     </div>
                     <span className="text-sm font-black text-gray-900">{Object.values(p.stock).reduce((a,b)=>a+b,0)} قطعة</span>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}
