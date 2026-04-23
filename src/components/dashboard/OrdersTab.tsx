import { Printer, Edit, Trash2, Wifi } from "lucide-react";
import { Badge, Input } from "@/components/SimpleUI";
import { Order, OrderStatus } from "@/lib/orders";

interface OrdersTabProps {
  orderSearch: string;
  setOrderSearch: (v: string) => void;
  orderTabFilter: string;
  setOrderTabFilter: (v: "all" | "online" | "store") => void;
  filteredOrders: Order[];
  updateStatus: (id: string, s: OrderStatus) => void;
  setSelectedOrder: (o: Order) => void;
  setIsInvoiceOpen: (v: boolean) => void;
  editOrderInPOS: (o: Order) => void;
  deleteOrder: (id: string) => void;
  role: string | null;
}

export default function OrdersTab({
  role, orderSearch, setOrderSearch, orderTabFilter, setOrderTabFilter,
  filteredOrders, updateStatus, setSelectedOrder, setIsInvoiceOpen,
  editOrderInPOS, deleteOrder
}: OrdersTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-right">
       <div className="flex flex-col lg:flex-row justify-between items-center gap-8 saneen-card p-10">
          <div className="space-y-4">
              <h1 className="text-2xl font-black">سجل المبيعات</h1>
              <div className="flex items-center gap-2">
                  {[{ id: 'all', label: 'الكل' }, { id: 'online', label: 'الموقع' }, { id: 'store', label: 'المحل' }].map(tab => (
                    <button key={tab.id} onClick={() => setOrderTabFilter(tab.id as any)} className={`px-6 py-2 rounded-xl text-[12px] font-bold ${orderTabFilter === tab.id ? 'bg-black text-white' : 'hover:bg-slate-50'}`}>{tab.label}</button>
                  ))}
              </div>
          </div>
          <Input placeholder="بحث برقم الطلب..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="saneen-input w-full lg:w-80" />
       </div>
      <div className="saneen-card overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[800px]">
             <thead className="bg-slate-50 text-slate-400 text-[11px] font-bold">
               <tr>
                 <th className="py-8 px-10">رقم الطلب</th>
                 <th className="py-8 px-10">الزبون</th>
                 <th className="py-8 px-10 text-center">المصدر</th>
                 <th className="py-8 px-10 text-center">المبلغ</th>
                 <th className="py-8 px-10 text-center">الحالة</th>
                 <th className="py-8 px-10 text-center">إجراءات</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-all font-bold">
                    <td className="py-8 px-10 font-sans">#{o.id}</td>
                    <td className="py-8 px-10">{(o.customerName === "زبون محلي" || o.customerName === "بيع مباشر (المحل)" || o.customerName.includes("عميل محلي")) ? "بيع مباشر (المحل)" : o.customerName}</td>
                    <td className="py-8 px-10 text-center">{o.isOnlineOrder ? <Badge className="bg-blue-50 text-blue-600">الموقع</Badge> : <Badge className="bg-orange-50 text-orange-600">المحل</Badge>}</td>
                    <td className="py-8 px-10 text-center font-sans tracking-tight">{o.totalDZD.toLocaleString()} دج</td>
                    <td className="py-8 px-10 text-center">
                        {o.isOnlineOrder ? (
                          <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)} className="border rounded-xl px-4 py-2 outline-none cursor-pointer text-[11px] font-black">
                            {["قيد التحضير", "تم التسليم", "ملغى"].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <Badge className="bg-green-50 text-green-600 font-black">مكتمل</Badge>
                        )}
                    </td>
                    <td className="py-8 px-10 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <button className="px-3 h-10 border rounded-xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all" title="طباعة" onClick={() => {setSelectedOrder(o); setIsInvoiceOpen(true);}}>
                            <Printer className="h-4 w-4" />
                            <span className="text-[10px] font-bold">طباعة</span>
                          </button>
                          
                          {!o.isOnlineOrder && (
                            <>
                              <button className="h-10 w-10 border rounded-xl flex items-center justify-center hover:bg-[#C5A059] hover:text-white transition-all" title="تعديل في POS" onClick={() => editOrderInPOS(o)}><Edit className="h-4 w-4" /></button>
                              <button className="h-10 w-10 border rounded-xl flex items-center justify-center text-red-200 hover:bg-red-600 hover:text-white transition-all" title="حذف" onClick={() => {if(confirm('متأكد من حذف هذا السجل؟')) deleteOrder(o.id);}}><Trash2 className="h-4 w-4" /></button>
                            </>
                          )}
                          
                          {o.isOnlineOrder && (
                            <button className="h-10 w-10 border rounded-xl flex items-center justify-center opacity-20 cursor-not-allowed" title="لا يمكن تعديل طلبات الموقع"><Wifi className="h-4 w-4" /></button>
                          )}
                       </div>
                    </td>
                  </tr>
               ))}
             </tbody>
          </table>
      </div>
    </div>
  );
}
