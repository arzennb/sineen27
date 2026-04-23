import React from "react";
import { X, Save, Plus, Printer, Trash2, Upload } from "lucide-react";
import { Badge, Input } from "@/components/SimpleUI";
import { Product, PurchaseRecord } from "@/lib/products";
import { Order, algerianWilayas } from "@/lib/orders";
import { communesByWilaya } from "@/lib/communes";

const parseNum = (val: string) => {
  if (!val) return 0;
  const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  formData: Partial<Product>;
  setFormData: (v: any) => void;
  onSave: (e: React.FormEvent) => void;
  categorySizes: Record<string, string[]>;
  categories: string[];
}

export function ProductModal({
  isOpen, onClose, editingProduct, formData, setFormData, onSave, categorySizes, categories
}: ProductModalProps) {
  if (!isOpen) return null;

  const relevantSizes = categorySizes[formData.category || categories[0]] || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto no-print">
       <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
          <div className="p-8 border-b bg-slate-50 flex justify-between items-center text-right">
             <h2 className="text-xl font-bold">{editingProduct ? 'تعديل قطعة' : 'إضافة قطعة جديدة'}</h2>
             <button onClick={onClose} className="h-10 w-10 rounded-xl hover:bg-white flex items-center justify-center transition-all bg-slate-100"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={onSave} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide text-right" dir="rtl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div>
                      <label className="text-xs font-bold text-slate-500 mb-2 block text-right">اسم المنتج</label>
                      <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-12 text-right" required />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-xs font-bold text-slate-500 mb-2 block text-right">سعر البيع الأساسي (دج)</label>
                         <Input type="text" value={formData.basePriceDZD || ""} onChange={e => setFormData({ ...formData, basePriceDZD: parseNum(e.target.value) })} className="h-12 font-sans text-right" required />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-500 mb-2 block text-right">تكلفة السلعة (دج)</label>
                         <Input type="text" value={formData.costPriceDZD || ""} onChange={e => setFormData({ ...formData, costPriceDZD: parseNum(e.target.value) })} className="h-12 font-sans text-right" required />
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-500 mb-2 block text-right">صورة المنتج</label>
                      <div className="flex items-center gap-4 flex-row-reverse">
                         <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 relative">
                            {formData.image ? <img src={formData.image} alt="Preview" className="h-full w-full object-cover" /> : <Upload className="h-6 w-6 text-slate-300" />}
                            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                         </div>
                         <div className="flex-1 text-right">
                            <p className="text-xs font-medium text-slate-500 mb-2">ارفع صورة المنتج</p>
                            <input type="file" onChange={handleImageUpload} className="text-xs text-slate-500" accept="image/*" />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-4">
                      <div>
                         <label className="text-xs font-bold text-slate-500 mb-2 block text-right">نوع المنتج</label>
                         <select className="w-full h-12 border border-slate-200 rounded-xl px-4 font-bold text-right outline-none focus:border-blue-500" value={formData.category || categories[0] || ""} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-500 mb-2 block text-right">الوصف (اختياري)</label>
                         <textarea className="w-full p-4 border border-slate-200 rounded-xl text-right font-medium outline-none focus:border-blue-500 resize-none h-24" value={formData.description || ""} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="أضف وصفاً للمنتج..." />
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-500 mb-2 block text-right">الألوان</label>
                      <div className="flex flex-wrap gap-2 mb-3 justify-end items-center">
                         {(formData.colors || []).map(color => (
                            <Badge key={color} className="bg-slate-100 text-black border-0 py-2 px-3 flex items-center gap-2 rounded-lg">
                               <button type="button" onClick={() => setFormData({ ...formData, colors: (formData.colors || []).filter(c => c !== color) })}><X className="h-3 w-3" /></button>
                               {color}
                            </Badge>
                         ))}
                      </div>
                      <div className="flex gap-2 flex-row-reverse">
                         <Input placeholder="إضافة لون..." id="new-color-input" className="h-10 text-right" />
                         <button type="button" onClick={() => {
                            const input = document.getElementById('new-color-input') as HTMLInputElement;
                            if (input.value && !(formData.colors || []).includes(input.value)) {
                               setFormData({ ...formData, colors: [...(formData.colors || []), input.value] });
                               input.value = "";
                            }
                         }} className="bg-slate-800 text-white px-4 rounded-lg hover:bg-slate-700 transition-all font-bold">أضف</button>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                    <label className="text-[10px] font-black text-slate-400 mb-4 block uppercase tracking-widest text-center">تنبيه المخزون المنخفض (لهذا المنتج)</label>
                    <div className="flex items-center justify-center gap-4">
                       <Input 
                         type="text" 
                         placeholder="اتركه فارغاً لاستخدام الحد العام"
                         value={formData.reorderLevel || ""} 
                         onChange={e => setFormData({ ...formData, reorderLevel: parseNum(e.target.value) })} 
                         className="h-12 w-full text-center font-sans font-black text-xs bg-white" 
                       />
                    </div>
                 </div>

                 <div className="space-y-6">
                   <label className="text-xs font-bold text-slate-400 mb-4 block uppercase text-center">المقاسات والأسعار</label>
                   {relevantSizes.length === 0 && <span className="text-[10px] text-red-500 w-full text-center block">لا توجد مقاسات مضافة لهذا النوع من المنتجات</span>}
                   <div className="space-y-3">
                      {relevantSizes.map(s => (
                         <div key={s} className="bg-white p-4 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-3 flex-row-reverse">
                               <span className="text-sm font-bold">{s.toLowerCase().startsWith('standard') || s.toLowerCase().startsWith('stander') ? 'الكمية والسعر' : `مقاس ${s}`}</span>
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-slate-400">الكمية:</span>
                                  <input type="text" className="w-14 border rounded-lg px-2 py-1 font-bold font-sans text-xs text-center" value={formData.stock?.[s] || 0} onChange={e => setFormData({ ...formData, stock: { ...(formData.stock || {}), [s]: parseNum(e.target.value) } })} />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed">
                                <div>
                                   <label className="text-[10px] font-bold text-slate-400 block text-center">سعر البيع</label>
                                   <Input type="text" placeholder={formData.basePriceDZD?.toString() || "0"} value={formData.sizePrices?.[s] || ""} onChange={e => setFormData({ ...formData, sizePrices: { ...(formData.sizePrices || {}), [s]: parseNum(e.target.value) } })} className="h-10 font-sans text-xs text-center mt-1" />
                                </div>
                                <div>
                                   <label className="text-[10px] font-bold text-slate-400 block text-center">سعر الشراء</label>
                                   <Input type="text" placeholder={formData.costPriceDZD?.toString() || "0"} value={formData.sizeCostPrices?.[s] || ""} onChange={e => setFormData({ ...formData, sizeCostPrices: { ...(formData.sizeCostPrices || {}), [s]: parseNum(e.target.value) } })} className="h-10 font-sans text-xs text-center mt-1" />
                                </div>
                             </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
             <button type="submit" className="bg-slate-900 text-white w-full h-14 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3"><Save className="h-5 w-5" /> حفظ المنتج</button>
          </form>
       </div>
    </div>
  );
}

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  editData: Partial<Order>;
  setEditData: (v: any) => void;
  onSave: () => void;
  products: Product[];
  addItem: (p: Product, s: string) => void;
  removeItem: (idx: number) => void;
}

export function OrderEditModal({
  isOpen, onClose, order, editData, setEditData, onSave, products, addItem, removeItem
}: OrderEditModalProps) {
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 no-print overflow-y-auto">
       <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50 text-right" dir="rtl">
             <h2 className="text-xl font-bold">تعديل طلبية #{order.id}</h2>
             <button onClick={onClose} className="h-10 w-10 rounded-xl hover:bg-white flex items-center justify-center transition-all bg-slate-200"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 text-right" dir="rtl">
             <div className="space-y-6">
                <div className="space-y-4">
                   <h3 className="font-bold text-slate-700 border-b pb-2 text-sm italic">بيانات العميل</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-slate-400">الاسم</label><Input value={editData.customerName} onChange={e => setEditData({ ...editData, customerName: e.target.value })} className="h-12 font-bold text-right" /></div>
                      <div><label className="text-xs font-bold text-slate-400">الهاتف</label><Input value={editData.customerPhone} onChange={e => setEditData({ ...editData, customerPhone: e.target.value })} className="h-12 font-sans font-bold text-right" /></div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400">الولاية</label>
                        <select className="w-full h-12 border border-slate-200 rounded-xl px-4 font-bold text-right outline-none focus:border-blue-500" value={editData.customerWilaya || ""} onChange={e => { const w = e.target.value; setEditData({ ...editData, customerWilaya: w, customerAddress: communesByWilaya[w]?.[0] || "" }); }}>
                          {algerianWilayas.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400">البلدية</label>
                        <select className="w-full h-12 border border-slate-200 rounded-xl px-4 font-bold text-right outline-none focus:border-blue-500" value={editData.customerAddress || ""} onChange={e => setEditData({ ...editData, customerAddress: e.target.value })}>
                          {(communesByWilaya[editData.customerWilaya || ""] || []).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>
                </div>
                <div className="space-y-3">
                   <h3 className="font-bold text-slate-700 border-b pb-2 text-sm italic">السلع المطلوبة</h3>
                   {editData.items?.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border">
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        <div className="text-right flex-1 px-4">
                           <p className="font-bold text-xs">{item.productName}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{item.size && !item.size.toLowerCase().startsWith('standard') && !item.size.toLowerCase().startsWith('stander') ? `مقاس ${item.size} • ` : ''}{item.price.toLocaleString()} دج</p>
                        </div>
                        <span className="font-bold text-sm font-sans mx-2">x{item.quantity}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border">
                <h3 className="font-bold text-slate-700 border-b pb-2 text-sm italic text-center">إضافة المزيد</h3>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                   {products.map(p => (
                      <div key={p.id} className="p-3 bg-white rounded-xl border flex justify-between items-center shadow-sm">
                         <div className="flex gap-1">
                            {p.sizes.map(s => (
                               <button key={s} onClick={() => addItem(p, s)} className="px-2 py-1 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-[9px] font-bold transition-colors">{s}</button>
                            ))}
                         </div>
                         <p className="font-bold text-xs text-right">{p.name}</p>
                      </div>
                   ))}
                </div>
                <div className="pt-6 border-t space-y-4">
                   <div className="flex justify-between font-bold text-lg">
                      <span className="font-sans">{editData.totalDZD?.toLocaleString()} دج</span>
                      <span>الإجمالي الجديد:</span>
                   </div>
                   <button onClick={onSave} className="bg-blue-600 text-white w-full h-14 rounded-xl font-bold hover:bg-blue-700 shadow-md flex items-center justify-center gap-3"><Save className="h-5 w-5" /> حفظ المعلومات</button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 invoice-print-root">
       {/* Explicit Backdrop (No Print) */}
       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm no-print" onClick={onClose} />
       
       <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col mb-20 animate-in zoom-in duration-300">
          {/* HEADER BAR (No Print) */}
          <div className="p-4 bg-slate-50 border-b flex justify-between items-center no-print">
             <div className="flex gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="h-10 px-6 bg-blue-600 text-white rounded-lg text-xs font-black hover:bg-blue-700 shadow-md flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" /> طباعة اﻵن
                </button>
                <button 
                  onClick={onClose} 
                  className="h-10 px-4 bg-white border rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  إغلاق
                </button>
             </div>
             <h3 className="font-bold text-slate-800 text-sm">معاينة الفاتورة</h3>
          </div>

          {/* PRINTABLE AREA */}
          <div id="invoice-content" className="p-12 bg-white text-right" dir="rtl">
             <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
                <div className="text-right">
                   <h1 className="text-3xl font-black mb-1">سنين للعبايات</h1>
                   <p className="text-[10px] text-gray-500 font-bold font-sans">SANEEN ABAYA</p>
                </div>
                <div className="text-left font-sans">
                   <h2 className="text-xl font-bold mb-1 uppercase">INVOICE</h2>
                   <p className="text-[10px] font-bold text-gray-400">#{order.id} | {order.date}</p>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                   <h3 className="font-bold border-b border-black mb-2">الزبون:</h3>
                   <p className="font-bold text-sm">{order.customerName}</p>
                   {order.customerPhone && <p className="font-sans">{order.customerPhone}</p>}
                   <p className="text-gray-500">{order.customerWilaya}{order.customerAddress ? ` - ${order.customerAddress}` : ''}</p>
                </div>
                <div className="text-left">
                   <h3 className="font-bold border-b border-black mb-2 text-left">التفاصيل:</h3>
                   <p>{order.isOnlineOrder ? 'متجر إلكتروني' : 'بيع مباشر'}</p>
                   <p>التوصيل: {order.deliveryType}</p>
                </div>
             </div>
 
             <table className="w-full mb-8">
                <thead>
                   <tr className="text-right border-b-2 border-black text-[10px] font-bold">
                      <th className="py-2">المنتج</th>
                      <th className="py-2 text-center">الكمية</th>
                      <th className="py-2 text-left">السعر</th>
                   </tr>
                </thead>
                <tbody className="divide-y text-[11px]">
                   {order.items.map((it, idx) => (
                      <tr key={idx}>
                         <td className="py-3">
                            <p className="font-bold">{it.productName}</p>
                            {it.size && !it.size.toLowerCase().startsWith('standard') && !it.size.toLowerCase().startsWith('stander') && <p className="text-[9px] text-gray-400">المقاس: {it.size}</p>}
                         </td>
                         <td className="py-3 text-center font-bold font-sans">{it.quantity}</td>
                         <td className="py-3 text-left font-bold font-sans">{it.price.toLocaleString()} دج</td>
                      </tr>
                   ))}
                </tbody>
             </table>
 
             <div className="w-full max-w-[200px] mr-auto space-y-2 pt-4 border-t-2 border-black">
                <div className="flex justify-between text-[11px]">
                   <span>المجموع:</span>
                   <span className="font-sans font-bold">{order.totalDZD.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-2 border-t border-black border-double">
                   <span>الإجمالي:</span>
                   <span className="font-sans">{order.totalDZD.toLocaleString()} دج</span>
                </div>
             </div>
 
             <div className="mt-12 text-center border-t border-dashed pt-4 text-gray-400">
                <p className="text-[10px] font-bold">شكراً لثقتكم - سنين للعبايات</p>
             </div>
          </div>
       </div>
    </div>
  );
}

export interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categorySizes: Record<string, string[]>;
  editingPurchase: Partial<PurchaseRecord> | null;
  purchaseData: Partial<PurchaseRecord>;
  setPurchaseData: (v: any) => void;
  onSave: (e: React.FormEvent) => void;
}

export function PurchaseModal({ isOpen, onClose, products, categorySizes, editingPurchase, purchaseData, setPurchaseData, onSave }: PurchaseModalProps) {
  if (!isOpen) return null;

  const selectedProduct = products.find(p => p.id === purchaseData.productId);
  const relevantSizes = categorySizes[selectedProduct?.category || ""] || [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto no-print">
       <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
          <div className="p-6 border-b bg-slate-50 flex justify-between items-center text-right">
             <h2 className="text-xl font-bold">{editingPurchase ? 'تعديل فاتورة مشتريات' : 'إضافة فاتورة مشتريات جديدة'}</h2>
             <button type="button" onClick={onClose} className="h-10 w-10 rounded-xl hover:bg-white flex items-center justify-center transition-all bg-slate-100"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={onSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide text-right" dir="rtl">
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 mb-2 block text-right">المنتج المستلم</label>
                   <select 
                     disabled={!!editingPurchase}
                     className="w-full h-12 border border-slate-200 rounded-xl px-4 font-bold text-right outline-none focus:border-blue-500 disabled:bg-slate-100" 
                     value={purchaseData.productId || ""} 
                     onChange={e => {
                        const p = products.find(x => x.id === e.target.value);
                        setPurchaseData({ ...purchaseData, productId: p?.id, productName: p?.name, costPriceDZD: p?.costPriceDZD });
                     }} 
                     required
                   >
                      <option value="" disabled>اختر المنتج...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                   </select>
                   <p className="text-[10px] text-slate-400 mt-1">سيتم إضافة الكميات مباشرة إلى مخزون هذا المنتج</p>
                </div>
                
                <div>
                   <label className="text-xs font-bold text-slate-500 mb-2 block text-right">تكلفة الوحدة في هذه الفاتورة (دج)</label>
                   <Input type="text" value={purchaseData.costPriceDZD || ""} onChange={e => setPurchaseData({ ...purchaseData, costPriceDZD: parseNum(e.target.value) })} className="h-12 font-sans text-right" required />
                </div>
             </div>

             {selectedProduct && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                   <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-slate-400 uppercase text-center block w-full">الكميات الواردة في هذه الفاتورة</label>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      {relevantSizes.length === 0 && <span className="text-[10px] text-red-500 w-full text-center block">لا توجد مقاسات مضافة لهذا النوع من المنتجات</span>}
                      {relevantSizes.map(s => (
                         <div key={s} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center flex-row-reverse">
                            <span className="text-sm font-bold">{s.toLowerCase().startsWith('standard') || s.toLowerCase().startsWith('stander') ? 'الكمية الواردة' : `مقاس ${s}`}</span>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-bold text-slate-400">الكمية:</span>
                               <input type="text" min="0" className="w-16 border rounded-lg px-2 py-1.5 font-bold font-sans text-xs text-center" value={purchaseData.stockAdded?.[s] || ""} placeholder="0" onChange={e => setPurchaseData({ ...purchaseData, stockAdded: { ...(purchaseData.stockAdded || {}), [s]: parseNum(e.target.value) } })} />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}
             
             <button disabled={!selectedProduct} type="submit" className="bg-blue-600 disabled:opacity-50 text-white w-full h-14 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-4"><Save className="h-5 w-5" /> حفظ في السجل وتحديث المخزون</button>
          </form>
       </div>
    </div>
  );
}
