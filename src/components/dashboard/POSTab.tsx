import { Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Badge } from "@/components/SimpleUI";
import { Product } from "@/lib/products";
import { toast } from "sonner";

interface POSTabProps {
  posSearch: string;
  setPosSearch: (v: string) => void;
  filteredPosProducts: Product[];
  flippedProductId: string | null;
  setFlippedProductId: (id: string | null) => void;
  addToPosCart: (p: Product, s: string) => void;
  autoPrint: boolean;
  setAutoPrint: (v: boolean) => void;
  posCart: any[];
  setPosCart: (v: any[]) => void;
  updatePosCartQty: (idx: number, delta: number) => void;
  removeFromPosCart: (idx: number) => void;
  processPosSale: () => void;
  editingOrder: any | null;
  cancelEdit: () => void;
}

export default function POSTab({
  posSearch, setPosSearch, filteredPosProducts, flippedProductId, 
  setFlippedProductId, addToPosCart, autoPrint, setAutoPrint, 
  posCart, setPosCart, updatePosCartQty, removeFromPosCart, processPosSale,
  editingOrder, cancelEdit
}: POSTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-8 space-y-6">
         <div className="saneen-card p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
               <h1 className="text-2xl font-black text-gray-900">{editingOrder ? 'تعديل الطلب' : 'محطة البيع'}</h1>
               {editingOrder && (
                 <Badge className="bg-orange-50 text-orange-600 border-orange-100 font-bold px-3 py-1">#{editingOrder.id}</Badge>
               )}
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               {editingOrder && (
                 <button onClick={cancelEdit} className="text-xs font-bold text-red-500 hover:underline">إلغاء التعديل</button>
               )}
               <Input placeholder="بحث عن منتج..." value={posSearch} onChange={e => setPosSearch(e.target.value)} className="saneen-input w-full md:w-80" />
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto max-h-[70vh]">
            {filteredPosProducts.map(p => (
              <div key={p.id} className="saneen-card group cursor-pointer" onClick={() => setFlippedProductId(flippedProductId === p.id ? null : p.id)}>
                 <div className="aspect-[4/5] relative bg-slate-50 overflow-hidden">
                     {flippedProductId === p.id ? (
                        <div className="absolute inset-0 bg-black p-6 flex flex-col justify-center gap-2">
                           {Object.entries(p.stock).filter(([_, q]) => q > 0).map(([s, q]) => (
                              <button key={s} onClick={(e) => { e.stopPropagation(); addToPosCart(p, s); setFlippedProductId(null); }} className="h-10 bg-white/10 text-white text-[10px] font-bold hover:bg-[#C5A059] rounded-lg">{s.toLowerCase().startsWith('standard') || s.toLowerCase().startsWith('stander') ? `متوفر (${q})` : `مقاس ${s} (${q})`}</button>
                           ))}
                        </div>
                     ) : (
                        <img src={p.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     )}
                 </div>
                 <div className="p-4 flex justify-between items-center">
                    <h4 className="font-bold text-xs truncate max-w-[100px]">{p.name}</h4>
                    <span className="text-xs font-black">{p.basePriceDZD.toLocaleString()} دج</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
      <div className="lg:col-span-4">
         <div className="saneen-card h-[calc(100vh-180px)] flex flex-col sticky top-28">
            <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-black">سلة المشتريات</h3>
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => {
                       const newVal = !autoPrint;
                       setAutoPrint(newVal);
                       localStorage.setItem("saneen_auto_print", String(newVal));
                       toast.success(newVal ? "تم تفعيل الطباعة" : "تم إيقاف الطباعة");
                     }}
                     className={`h-8 px-4 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${autoPrint ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                   >
                     <Printer className="h-3 w-3" />
                     {autoPrint ? "الطباعة مفعلة" : "الطباعة متوقفة"}
                   </button>
                   <Button variant="outline" size="sm" onClick={() => setPosCart([])} className="h-8 text-xs font-black">إفراغ</Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {posCart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-50 shadow-sm">
                     <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold truncate">{item.product.name}{item.size && !item.size.toLowerCase().startsWith('standard') && !item.size.toLowerCase().startsWith('stander') ? ` (${item.size})` : ''}</h4>
                        <div className="flex items-center gap-4 mt-2">
                           <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                              <button onClick={() => updatePosCartQty(idx, -1)} className="h-6 w-6 flex items-center justify-center bg-white rounded shadow-sm text-xs">-</button>
                              <span className="text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => updatePosCartQty(idx, 1)} className="h-6 w-6 flex items-center justify-center bg-white rounded shadow-sm text-xs">+</button>
                           </div>
                           <span className="text-xs font-black">{(item.price * item.quantity).toLocaleString()} دج</span>
                        </div>
                     </div>
                     <button onClick={() => removeFromPosCart(idx)} className="text-red-200 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
               ))}
            </div>
            <div className="p-8 bg-black text-white rounded-t-3xl">
                <div className="flex justify-between items-center text-xl font-black mb-8">
                   <span>المجموع</span>
                   <span>{posCart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()} دج</span>
                </div>
                <button onClick={processPosSale} disabled={posCart.length === 0} className={`saneen-btn-gold w-full h-16 text-lg ${editingOrder ? 'gold-gradient' : ''}`}>
                   <Printer className="h-6 w-6" /> 
                   {editingOrder ? 'تحديث الطلبية والحفظ' : 'تأكيد وطباعة'}
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}
