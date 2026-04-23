import React, { useState, useMemo } from "react";
import { 
  Store, Wifi, Package, DollarSign, User, ShoppingBag, 
  Plus, ShoppingCart, Activity, AlertTriangle, Calendar
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
  orders: Order[];
  products: Product[];
  setActiveTab: (t: string) => void;
  globalReorderLevel: number;
}

export default function OverviewTab({ 
  role, orders, products, setActiveTab, globalReorderLevel
}: OverviewTabProps) {
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Default to today
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);



  const lowStockProducts = useMemo(() => {
    return products.filter(p => {
      const totalStock = Object.values(p.stock || {}).reduce((a,b)=>a+b,0);
      // Use the product's custom level if set, otherwise use the global default
      return totalStock <= (p.reorderLevel || globalReorderLevel);
    }).sort((a,b) => {
      const totalA = Object.values(a.stock || {}).reduce((x,y)=>x+y,0);
      const totalB = Object.values(b.stock || {}).reduce((x,y)=>x+y,0);
      return totalA - totalB;
    });
  }, [products, globalReorderLevel]);

  const parseOrderDate = (dateStr: string) => {
    let d: Date;
    if (dateStr.includes("-")) {
      d = new Date(dateStr);
    } else {
      const [day, m, y] = dateStr.split("/").map(Number);
      d = new Date(y, m - 1, day);
    }
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const stats = useMemo(() => {
    const sDate = startDate ? new Date(startDate) : null;
    if (sDate) sDate.setHours(0,0,0,0);
    const eDate = endDate ? new Date(endDate) : null;
    if (eDate) eDate.setHours(23,59,59,999);

    const filteredOrders = orders.filter(o => {
      const oDate = parseOrderDate(o.date);
      const matchesStart = !sDate || oDate >= sDate;
      const matchesEnd = !eDate || oDate <= eDate;
      return matchesStart && matchesEnd;
    });

    const revOnline = filteredOrders.filter(o => o.isOnlineOrder && o.status !== 'ملغى').reduce((sum, o) => sum + o.totalDZD, 0);
    const revStore = filteredOrders.filter(o => !o.isOnlineOrder && o.status !== 'ملغى').reduce((sum, o) => sum + o.totalDZD, 0);
    
    const cogs = filteredOrders.reduce((total, order) => {
      if (order.status === 'ملغى') return total;
      return total + (order.items?.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId || p.name === item.productName);
        if (!product) return sum;
        const cost = (item.size && product.sizeCostPrices && product.sizeCostPrices[item.size]) 
          ? product.sizeCostPrices[item.size] 
          : product.costPriceDZD;
        return sum + (cost * item.quantity);
      }, 0) || 0);
    }, 0);

    return {
      revenueOnline: revOnline,
      revenueStore: revStore,
      totalCOGS: cogs,
      totalNetProfit: (revOnline + revStore) - cogs,
      filteredOrders
    };
  }, [orders, products, startDate, endDate]);

  const { revenueOnline, revenueStore, totalCOGS, totalNetProfit, filteredOrders } = stats;
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-4">
         <div>
            <h1 className="text-3xl font-bold text-slate-800">أهلاً بك، {role === 'admin' ? 'أيها المدير' : 'أيها الموظف'}</h1>
            <p className="text-slate-500 text-sm mt-1">لوحة القيادة والمتابعة الخاصة بمتجر سنين</p>
         </div>
         
         <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2">
               <Calendar className="h-4 w-4 text-slate-400" />
               <input 
                 type="date" 
                 value={startDate} 
                 onChange={e => {
                   const val = e.target.value;
                   setStartDate(val);
                   if (endDate && val > endDate) setEndDate(val);
                 }} 
                 className="bg-transparent text-xs font-bold outline-none" 
               />
            </div>
            <span className="text-slate-300 font-bold">إلى</span>
            <div className="flex items-center gap-2">
               <Calendar className="h-4 w-4 text-slate-400" />
               <input 
                 type="date" 
                 value={endDate} 
                 onChange={e => {
                   const val = e.target.value;
                   setEndDate(val);
                   if (startDate && val < startDate) setStartDate(val);
                 }} 
                 className="bg-transparent text-xs font-bold outline-none" 
               />
            </div>
            {(startDate || endDate) && (
              <button onClick={() => {setStartDate(""); setEndDate("");}} className="text-[10px] font-bold text-red-500 hover:underline border-r pr-4 mr-2">مسح الفلتر</button>
            )}
         </div>

         <div className="flex gap-4">
            <button onClick={() => window.location.hash = "#pos"} className="px-6 h-12 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all flex items-center gap-2">
               <ShoppingCart className="h-4 w-4" />
               <span>بيع سريع</span>
            </button>
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
                  <h2 className="text-lg font-bold text-slate-800">تحليل المبيعات</h2>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{startDate && endDate ? `${startDate} إلى ${endDate}` : 'كل الأوقات'}</span>
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
                  {orders.slice(0, 4).map(o => (
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
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800"><AlertTriangle className="h-4 w-4 text-red-500" /> تنبيهات المخزون</h2>
                  {lowStockProducts.length > 0 && (
                    <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-1 rounded-lg">{lowStockProducts.length} منتجات</span>
                  )}
               </div>

               <div className="space-y-4">
                  {lowStockProducts.length === 0 ? (
                    <div className="py-10 text-center space-y-3">
                       <div className="h-12 w-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="h-6 w-6" />
                       </div>
                       <p className="text-xs font-bold text-slate-400">المخزون ممتاز حالياً</p>
                    </div>
                  ) : (
                    <>
                      {lowStockProducts.slice(0, 4).map(p => {
                         const totalStock = Object.values(p.stock).reduce((a,b)=>a+b,0);
                         return (
                            <div key={p.id} className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group">
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-black text-slate-800 line-clamp-1 flex-1">{p.name}</span>
                                  <Badge className={`${totalStock === 0 ? 'bg-red-600' : 'bg-orange-500'} text-white font-black text-[10px]`}>{totalStock} قطع</Badge>
                               </div>
                               <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.entries(p.stock).map(([size, qty]) => (
                                     <span key={size} className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${qty <= 1 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'}`}>
                                        {size}: {qty}
                                     </span>
                                  ))}
                               </div>
                               <button 
                                 onClick={() => {window.location.hash = "#purchases"}}
                                 className="w-full mt-4 py-2 bg-slate-50 text-[10px] font-black text-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-100"
                               >
                                  إضافة مخزون جديد
                               </button>
                            </div>
                         );
                      })}
                      
                      {lowStockProducts.length > 4 && (
                        <button 
                          onClick={() => setShowAllAlerts(true)}
                          className="w-full py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all border-2 border-dashed border-blue-100"
                        >
                           عرض كل المنتجات المنخفضة ({lowStockProducts.length})
                        </button>
                      )}
                    </>
                  )}
               </div>
            </div>

            {/* MODAL FOR ALL ALERTS */}
            {showAllAlerts && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAllAlerts(false)} />
                 <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-8 border-b flex items-center justify-between bg-slate-50">
                       <h3 className="text-xl font-black flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-red-500" /> قائمة نواقص المخزون</h3>
                       <button onClick={() => setShowAllAlerts(false)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white transition-all text-slate-400">✕</button>
                    </div>
                    <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
                       {lowStockProducts.map(p => {
                          const total = Object.values(p.stock).reduce((a,b)=>a+b,0);
                          return (
                            <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                     <img src={p.image} className="h-full w-full object-cover" alt="" />
                                  </div>
                                  <div>
                                     <p className="font-black text-slate-900 text-sm">{p.name}</p>
                                     <p className="text-[10px] text-slate-500 font-bold mt-1">الفئة: {p.category}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <div className="text-left">
                                     <Badge className={`${total === 0 ? 'bg-red-600' : 'bg-orange-500'} text-white font-black text-xs`}>{total} قطع</Badge>
                                  </div>
                                  <button onClick={() => {setShowAllAlerts(false); window.location.hash = "#purchases";}} className="h-10 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">شراء</button>
                               </div>
                            </div>
                          )
                       })}
                    </div>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
