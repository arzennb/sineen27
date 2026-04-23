import React, { useState } from "react";
import { User, Trash2, TrendingUp, Calendar, Search, Key } from "lucide-react";
import { Input, Badge } from "@/components/SimpleUI";
import { toast } from "sonner";
import { Order } from "@/lib/orders";

interface UsersTabProps {
  users: any[];
  addUser: (u: string, p: string, r: string) => void;
  deleteUser: (id: string) => void;
  orders: Order[];
  setUserPassword: (id: string, p: string) => void;
}

export default function UsersTab({ users, addUser, deleteUser, orders, setUserPassword }: UsersTabProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const normalizedStart = startDate ? new Date(startDate) : null;
  if (normalizedStart) normalizedStart.setHours(0, 0, 0, 0);
  const normalizedEnd = endDate ? new Date(endDate) : null;
  if (normalizedEnd) normalizedEnd.setHours(23, 59, 59, 999);

  const getPerformance = (username: string) => {
    const userOrders = orders.filter(o => {
      const oDate = parseOrderDate(o.date);
      const isCashier = o.cashierName === username;
      const matchesStart = !normalizedStart || oDate >= normalizedStart;
      const matchesEnd = !normalizedEnd || oDate <= normalizedEnd;
      return isCashier && matchesStart && matchesEnd;
    });

    const total = userOrders.reduce((sum, o) => sum + o.totalDZD, 0);
    const count = userOrders.length;
    return { total, count, average: count ? total / count : 0 };
  };

  const performanceData = users
    .filter(u => u.role !== 'admin')
    .map(u => ({ ...u, ...getPerformance(u.username) }))
    .sort((a, b) => b.total - a.total);

  const topPerformer = performanceData[0]?.total > 0 ? performanceData[0] : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-white p-8 rounded-xl shadow-sm border border-slate-100">
           <div>
              <h1 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h1>
              <p className="text-sm text-slate-500 mt-1">إنشاء والتحكم في حسابات الموظفين للنظام</p>
           </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6 flex flex-col h-fit">
              <h2 className="font-bold text-lg border-b pb-4">إضافة مستخدم جديد</h2>
              <Input id="new-username" placeholder="اسم المستخدم" className="w-full h-12 text-right bg-slate-50" />
              <Input id="new-password" type="password" placeholder="كلمة المرور" className="w-full h-12 text-right bg-slate-50" />
              <div className="w-full h-12 text-right bg-slate-50 border rounded-lg px-4 flex items-center justify-between font-bold text-sm text-slate-500">
                 <span>موظف عادي (Employee)</span>
                 <span>الصلاحية:</span>
              </div>
              <button  
                onClick={() => {
                  const u = (document.getElementById('new-username') as HTMLInputElement).value;
                  const p = (document.getElementById('new-password') as HTMLInputElement).value;
                  if(!u || !p) return toast.error("املأ جميع الحقول");
                  addUser(u, p, 'employee');
                  toast.success("تم إضافة المستخدم بنجاح");
                  (document.getElementById('new-username') as HTMLInputElement).value = '';
                  (document.getElementById('new-password') as HTMLInputElement).value = '';
                }}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" /> تأكيد وإضافة
              </button>
           </div>
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-right border-collapse">
                 <thead className="bg-slate-50 text-slate-500 text-xs">
                    <tr>
                       <th className="py-4 px-6 font-bold">المستخدم</th>
                       <th className="py-4 px-6 font-bold">الدور</th>
                       <th className="py-4 px-6 text-left">إجراءات</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 italic">
                    {users.map(user => (
                       <tr key={user.id} className="hover:bg-slate-50">
                          <td className="py-4 px-6 font-bold text-slate-800">{user.username}</td>
                          <td className="py-4 px-6">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-black ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                {user.role === 'admin' ? 'مدير نظام' : 'موظف'}
                             </span>
                          </td>
                          <td className="py-4 px-6 text-left">
                              <div className="flex items-center justify-end gap-3">
                                 {user.role !== 'admin' && (
                                    <>
                                       <button 
                                         onClick={() => {
                                           const newP = prompt(`أدخل كلمة المرور الجديدة للمستخدم ${user.username}`);
                                           if (newP) {
                                              setUserPassword(user.id, newP);
                                              toast.success("تم تغيير كلمة المرور بنجاح");
                                           }
                                         }} 
                                         className="text-slate-400 hover:text-blue-600 transition-all p-1" 
                                         title="تغيير كلمة المرور"
                                       >
                                          <Key className="h-4 w-4" />
                                       </button>
                                       <button onClick={() => {if(confirm('حذف المستخدم؟')) deleteUser(user.id);}} className="text-slate-400 hover:text-red-600 transition-all p-1">
                                          <Trash2 className="h-4 w-4" />
                                       </button>
                                    </>
                                 )}
                              </div>
                           </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Employee Performance Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8 mt-10" dir="rtl">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <TrendingUp className="h-5 w-5" />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">أداء الموظفين</h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <Calendar className="h-4 w-4 text-slate-400" />
                                         <input 
                       type="date" 
                       value={startDate} 
                       onChange={e => {
                         const val = e.target.value;
                         setStartDate(val);
                         if (endDate && val > endDate) setEndDate(val);
                       }} 
                       className="bg-transparent text-xs font-bold outline-none px-2" 
                     />
                 </div>
                 <span className="text-slate-300 font-bold">إلى</span>
                 <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <Calendar className="h-4 w-4 text-slate-400" />
                                         <input 
                       type="date" 
                       value={endDate} 
                       onChange={e => {
                         const val = e.target.value;
                         setEndDate(val);
                         if (startDate && val < startDate) setStartDate(val);
                       }} 
                       className="bg-transparent text-xs font-bold outline-none px-2" 
                     />
                 </div>
                 {(startDate || endDate) && (
                   <button onClick={() => {setStartDate(""); setEndDate("");}} className="text-[10px] font-bold text-red-500 hover:underline">إعادة تعيين</button>
                 )}
              </div>
           </div>

           {topPerformer && (
             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-blue-600/20">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <TrendingUp className="h-8 w-8 text-white" />
                   </div>
                   <div>
                      <p className="text-blue-100 font-bold text-xs mb-1 uppercase tracking-widest">أفضل موظف مبيعاً</p>
                      <h3 className="text-2xl font-black">{topPerformer.username}</h3>
                   </div>
                </div>
                <div className="flex gap-10">
                   <div className="text-center">
                      <p className="text-blue-100 text-[10px] font-bold mb-1">إجمالي المبيعات</p>
                      <p className="text-2xl font-black">{topPerformer.total.toLocaleString()} دج</p>
                   </div>
                   <div className="text-center border-r border-white/20 pr-10">
                      <p className="text-blue-100 text-[10px] font-bold mb-1">عدد الطلبيات</p>
                      <p className="text-2xl font-black">{topPerformer.count}</p>
                   </div>
                </div>
             </div>
           )}

           <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                 <thead className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                    <tr>
                       <th className="py-4 px-6">الموظف</th>
                       <th className="py-4 px-6 text-center">عدد المبيعات</th>
                       <th className="py-4 px-6 text-center">إجمالي المبيعات</th>
                       <th className="py-4 px-6 text-center">متوسط الطلب</th>
                       <th className="py-4 px-6 text-center">الحالة</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {performanceData.map(user => (
                       <tr key={user.id} className="hover:bg-slate-50/50 transition-all font-bold group">
                          <td className="py-6 px-6">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                   <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm">{user.username}</span>
                             </div>
                          </td>
                          <td className="py-6 px-6 text-center font-sans">{user.count}</td>
                          <td className="py-6 px-6 text-center font-sans text-green-600">{user.total.toLocaleString()} دج</td>
                          <td className="py-6 px-6 text-center font-sans text-slate-400">{user.average.toLocaleString(undefined, {maximumFractionDigits:0})} دج</td>
                          <td className="py-6 px-6 text-center">
                             <Badge className={user.count > 0 ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"}>
                                {user.count > 10 ? 'نشط جداً' : user.count > 0 ? 'نشط' : 'لا يوجد مبيعات'}
                             </Badge>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
    </div>
  );
}
