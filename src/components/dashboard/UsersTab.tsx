import { User, Trash2 } from "lucide-react";
import { Input } from "@/components/SimpleUI";
import { toast } from "sonner";

interface UsersTabProps {
  users: any[];
  addUser: (u: string, p: string, r: string) => void;
  deleteUser: (id: string) => void;
}

export default function UsersTab({ users, addUser, deleteUser }: UsersTabProps) {
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
                            {user.role !== 'admin' && (
                               <button onClick={() => {if(confirm('حذف المستخدم؟')) deleteUser(user.id);}} className="text-red-200 hover:text-red-600">
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            )}
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
