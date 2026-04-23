import { Save, Trash2, Plus, User } from "lucide-react";
import { Badge, Input } from "@/components/SimpleUI";
import { toast } from "sonner";

interface LogisticsTabProps {
  wilayaFees: Record<string, number>;
  renameWilaya: (old: string, next: string) => void;
  updateWilayaFee: (name: string, fee: number) => void;
  deleteWilaya: (name: string) => void;
  newWilayaName: string;
  setNewWilayaName: (v: string) => void;
  newWilayaFee: number;
  setNewWilayaFee: (v: number) => void;
  addWilaya: (n: string, f: number) => void;
  updatePassword: (oldP: string, newP: string) => void;
}

export default function LogisticsTab({
  wilayaFees, renameWilaya, updateWilayaFee, deleteWilaya, newWilayaName, 
  setNewWilayaName, newWilayaFee, setNewWilayaFee, addWilaya, updatePassword
}: LogisticsTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-right">
       <div className="flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-black mb-2 italic">إدارة الخدمات اللوجستية</h1>
             <p className="text-slate-400 font-bold text-sm">تخصيص الولايات، أسعار التوصيل، وإعدادات المتجر</p>
          </div>
          <Badge className="bg-gold/10 text-gold border-0 h-10 px-6 rounded-xl font-black">Executive Suite 2026</Badge>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 saneen-card overflow-hidden h-fit">
             <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-black text-lg">قائمة الولايات والأسعار</h3>
                <button className="text-xs font-black text-blue-600 hover:underline">المزامنة مع السحابة</button>
             </div>
             <div className="max-h-[650px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-right border-collapse">
                   <thead className="sticky top-0 bg-white border-b z-10 text-[11px] font-black text-slate-400">
                      <tr>
                         <th className="py-6 px-10">الولاية (اضغط للتعديل)</th>
                         <th className="py-6 px-10 text-center">تكلفة الشحن (دج)</th>
                         <th className="py-6 px-10 text-left">تحكم</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {Object.entries(wilayaFees).map(([name, fee]) => (
                         <tr key={name} className="hover:bg-slate-50 transition-all font-bold group">
                            <td className="py-6 px-10">
                               <input 
                                 className="bg-transparent border-b border-transparent focus:border-gold outline-none w-full text-sm font-black"
                                 defaultValue={name}
                                 onBlur={(e) => renameWilaya(name, e.target.value)}
                               />
                            </td>
                            <td className="py-6 px-10 text-center">
                               <div className="inline-flex items-center gap-2 bg-white border rounded-xl px-4 py-2">
                                  <input 
                                    type="number"
                                    className="w-16 bg-transparent outline-none text-center font-sans font-black text-xs"
                                    value={fee}
                                    onChange={(e) => updateWilayaFee(name, Number(e.target.value))}
                                  />
                                  <span className="text-[10px] text-slate-300">دج</span>
                               </div>
                            </td>
                            <td className="py-6 px-10 text-left">
                               <button onClick={() => {if(confirm(`حذف ${name}؟`)) deleteWilaya(name);}} className="p-2 text-red-200 hover:text-red-600 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          <div className="space-y-8">
             <div className="saneen-card p-10 border-2 border-gold/10 bg-white">
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                   <div className="h-10 w-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                      <Plus className="h-5 w-5" />
                   </div>
                   <h3 className="font-black text-lg text-slate-900">إضافة ولاية جديدة</h3>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <label className="text-[11px] font-black text-slate-400 block mb-3 uppercase tracking-wider">اسم المنطقة / الولاية</label>
                      <Input 
                        placeholder="مثال: 01 - أدرار" 
                        value={newWilayaName} 
                        onChange={e => setNewWilayaName(e.target.value)} 
                        className="saneen-input h-14 bg-slate-50 border-slate-200 text-black placeholder:text-slate-300 focus:border-gold focus:bg-white transition-all font-black" 
                      />
                   </div>
                   <div>
                      <label className="text-[11px] font-black text-slate-400 block mb-3 uppercase tracking-wider">تسعيرة الشحن (دج)</label>
                      <div className="relative">
                         <Input 
                           type="number" 
                           value={newWilayaFee} 
                           onChange={e => setNewWilayaFee(Number(e.target.value))} 
                           className="saneen-input h-14 bg-slate-50 border-slate-200 text-black focus:border-gold focus:bg-white transition-all font-sans font-black pl-16 text-right" 
                         />
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-300">دج</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => {
                        if(!newWilayaName) return;
                        addWilaya(newWilayaName, newWilayaFee);
                        setNewWilayaName("");
                        setNewWilayaFee(600);
                        toast.success("تم تحديث القائمة بنجاح");
                     }}
                     className="saneen-btn-gold w-full h-16 shadow-lg shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                   >
                      <Save className="h-5 w-5" /> تأكيد الإضافة
                   </button>
                </div>
             </div>

              {/* ACCOUNT SETTINGS - PASSWORD RESET */}
              <div className="saneen-card p-8 mt-10">
                 <h3 className="font-bold text-lg mb-6 border-b pb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" /> تغيير كلمة المرور
                 </h3>
                 <div className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-2 block">الحالية</label>
                       <Input id="old-pwd" type="password" placeholder="الكلمة الحالية..." className="w-full text-right bg-slate-50 border-slate-200 h-10" />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 mb-2 block">الجديدة</label>
                       <Input id="new-pwd" type="password" placeholder="الكلمة الجديدة..." className="w-full text-right bg-slate-50 border-slate-200 h-10" />
                    </div>
                    <button 
                       onClick={() => {
                          const oldP = (document.getElementById('old-pwd') as HTMLInputElement).value;
                          const newP = (document.getElementById('new-pwd') as HTMLInputElement).value;
                          if (!oldP || !newP) return toast.error('املأ جميع الحقول');
                          try {
                             updatePassword(oldP, newP);
                             toast.success('تم تغيير كلمة المرور بنجاح');
                             (document.getElementById('old-pwd') as HTMLInputElement).value = '';
                             (document.getElementById('new-pwd') as HTMLInputElement).value = '';
                          } catch (e: any) {
                             toast.error(e.message || 'حدث خطأ');
                          }
                       }}
                       className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
                    >
                       حفظ كلمة المرور
                    </button>
                 </div>
              </div>
          </div>
       </div>
    </div>
  );
}
