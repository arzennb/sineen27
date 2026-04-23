import { 
  Store, Wifi, Package, DollarSign, User, ShoppingBag, 
  Plus, ShoppingCart, Activity, AlertTriangle 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { Badge } from "@/components/SimpleUI";
import { Product } from "@/lib/products";
import { Order } from "@/lib/orders";

interface OverviewTabProps {
  role: string | null;
  revenueStore: number;
  revenueOnline: number;
  totalCOGS: number;
  totalNetProfit: number;
  orders: Order[];
  products: Product[];
  setActiveTab: (t: string) => void;
}

export default function OverviewTab({ 
  role, revenueStore, revenueOnline, totalCOGS, totalNetProfit, orders, products, setActiveTab
}: OverviewTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
         <div>
            <h1 className="text-3xl font-bold text-slate-800">أهلاً بك، {role === 'admin' ? 'أيها المدير' : 'أيها الموظف'}</h1>
            <p className="text-slate-500 text-sm mt-1">لوحة القيادة والمتابعة الخاصة بمتجر سنين</p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => window.location.hash = "#pos"} className="px-6 h-12 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all flex items-center gap-2">
               <ShoppingCart className="h-4 w-4" />
               <span>بيع سريع</span>
            </button>
            {role === 'admin' && (
              <button onClick={() => window.location.hash = "#catalog"} className="px-6 h-12 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                 <Plus className="h-4 w-4" />
                 <span>إضافة منتج</span>
              </button>
            )}
         </div>
      </div>

      {/* Subtle KPI Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${role === 'admin' ? '4' : '3'} gap-4 md:gap-8`}>
        {(role === 'admin' ? [
          { title: "إيرادات المحل", val: revenueStore, icon: Store, isDzd: true, color: 'blue' },
          { title: "إيرادات الموقع", val: revenueOnline, icon: Wifi, isDzd: true, color: 'blue' },
          { title: "تكلفة السلع (COGS)", val: totalCOGS, icon: Package, isDzd: true, color: 'slate' },
          { title: "صافي الأرباح", val: totalNetProfit, icon: DollarSign, isDzd: true, color: 'emerald' },
        ] : [
          { title: "مبيعات الموقع", val: revenueOnline, icon: Wifi, isDzd: true, color: 'blue' },
          { title: "مبيعات المحل", val: revenueStore, icon: Store, isDzd: true, color: 'indigo' },
          { title: "إجمالي المبيعات", val: revenueOnline + revenueStore, icon: ShoppingBag, isDzd: true, color: 'emerald' }
        ]).map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="saneen-card p-6 md:p-8 relative overflow-hidden group">
               <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className={`h-12 w-12 rounded-lg bg-${card.color}-50 flex items-center justify-center text-${card.color}-600`}>
                     <Icon className="h-5 w-5" />
                  </div>
               </div>
               <h3 className="text-gray-500 text-xs font-bold mb-1 relative z-10">{card.title}</h3>
               <div className="text-2xl font-black text-gray-950 relative z-10 flex items-baseline gap-2">
                  {card.val.toLocaleString()}
                  {card.isDzd && <span className="text-[10px] text-gray-400">دج</span>}
               </div>
               <div className={`absolute bottom-0 left-0 h-1 bg-${card.color}-500 transition-all duration-500 w-0 group-hover:w-full`} />
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Activities & Charts */}
         <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="saneen-card p-8 min-h-[400px]">
               <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <h2 className="text-lg font-bold text-slate-800">تحليل المبيعات الأسبوعية</h2>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">آخر 7 أيام</span>
               </div>
               <div className="h-[300px] w-full" dir="ltr">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                     { name: 'السبت', sales: 12000 }, { name: 'الأحد', sales: 19000 }, 
                     { name: 'الاثنين', sales: 15000 }, { name: 'الثلاثاء', sales: 22000 }, 
                     { name: 'الأربعاء', sales: 18000 }, { name: 'الخميس', sales: 25000 }, 
                     { name: 'الجمعة', sales: (revenueOnline + revenueStore) || 30000 }
                   ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                     <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right' }} />
                     <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="saneen-card p-8">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                  <h2 className="text-lg font-bold text-slate-800">أحدث الطلبات القادمة</h2>
                  <button onClick={() => window.location.hash = "#orders"} className="text-xs font-bold text-blue-600 hover:underline">إدارة الطلبات</button>
               </div>
               <div className="space-y-3">
                  {orders.slice(0, 5).map(o => (
                     <div key={o.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 border border-transparent transition-all">
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${o.isOnlineOrder ? 'text-blue-500 bg-blue-50' : 'text-slate-500 bg-slate-100'}`}>
                              {o.isOnlineOrder ? <Wifi className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                           </div>
                           <div>
                              <p className="font-bold text-slate-800">{(o.customerName === "زبون محلي" || o.customerName === "بيع مباشر (المحل)" || o.customerName.includes("عميل محلي")) ? "بيع مباشر (المحل)" : o.customerName}</p>
                              <p className="text-xs text-slate-500">#{o.id} • {o.date}</p>
                           </div>
                        </div>
                        <span className="font-black">{o.totalDZD.toLocaleString()} <span className="text-[10px] text-slate-400">دج</span></span>
                     </div>
                  ))}
               </div>
            </div>

            {/* ADMIN ONLY: EMPLOYEE PERFORMANCE */}
            {role === 'admin' && (
            <div className="saneen-card p-8 mt-8">
               <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                  <h2 className="text-lg font-bold text-slate-800">أداء الموظفين والمبيعات</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-right">
                     <thead className="bg-slate-50 text-slate-500 text-xs">
                       <tr>
                          <th className="py-3 px-4 font-bold">الموظف</th>
                          <th className="py-3 px-4 font-bold">العمليات</th>
                          <th className="py-3 px-4 font-bold">العائدات بالمحل</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-sm">
                       {Array.from(
                         orders.reduce((acc, o) => {
                           if (o.cashierName && o.status !== 'ملغى' && !o.isOnlineOrder) {
                              if (!acc.has(o.cashierName)) acc.set(o.cashierName, { count: 0, revenue: 0 });
                              const entry = acc.get(o.cashierName);
                              if(entry) {
                                  entry.count += 1;
                                  entry.revenue += o.totalDZD;
                              }
                           }
                           return acc;
                         }, new Map<string, {count: number, revenue: number}>()).entries()
                       ).sort((a,b) => b[1].revenue - a[1].revenue).map(([name, data]) => (
                         <tr key={name} className="hover:bg-slate-50 transition-colors">
                           <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2"><User className="h-4 w-4 text-blue-500"/> {name}</td>
                           <td className="py-3 px-4 text-slate-500 font-bold">{data.count}</td>
                           <td className="py-3 px-4 text-emerald-600 font-black">{data.revenue.toLocaleString()} دج</td>
                         </tr>
                       ))}
                     </tbody>
                  </table>
               </div>
            </div>
            )}
         </div>

         {/* Right Column: Mini Charts & Storage */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-800 rounded-xl p-8 text-white">
               <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-300"><Activity className="h-4 w-4 text-blue-400" /> نسبة توزيع القنوات</h2>
               <div className="h-[200px] w-full flex items-center justify-center" dir="ltr">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie 
                         data={[
                           { name: 'الموقع الإلكتروني', value: revenueOnline || 40 },
                           { name: 'المحل الجسدي', value: revenueStore || 60 }
                         ]} 
                         cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none"
                      >
                         <Cell fill="#3b82f6" />
                         <Cell fill="#94a3b8" />
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-slate-300">الموقع</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div><span className="text-xs text-slate-300">المحل</span></div>
               </div>
            </div>

            <div className="saneen-card p-8">
               <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-slate-800"><AlertTriangle className="h-4 w-4 text-red-500" /> تنبيهات المخزون</h2>
               <div className="space-y-3">
                  {products.filter(p => Object.values(p.stock || {}).reduce((a,b)=>a+b,0) <= (p.reorderLevel || 5)).slice(0, 5).map(p => (
                     <div key={p.id} className="p-3 bg-red-50 rounded-lg flex justify-between items-center border border-red-100">
                        <span className="text-xs font-bold text-red-900 line-clamp-1">{p.name}</span>
                        <Badge variant="destructive" className="bg-red-500 font-bold shrink-0">{Object.values(p.stock).reduce((a,b)=>a+b,0)} قطع</Badge>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
