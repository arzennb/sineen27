import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Layers, Settings, LogOut, ArrowLeft, ScanLine, Truck } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { Users as UsersIcon } from "lucide-react";

export default function AdminNavbar() {
  const { hash } = useLocation();
  const { role, logout } = useAuth();

  const links = [
    { to: "/dashboard#overview", hash: "#overview", label: "نظرة عامة", icon: LayoutDashboard },
    { to: "/dashboard#pos", hash: "#pos", label: "نظام البيع", icon: ScanLine },
    { to: "/dashboard#catalog", hash: "#catalog", label: "المنتجات", icon: Package },
    { to: "/dashboard#purchases", hash: "#purchases", label: "المشتريات", icon: Truck },
    { to: "/dashboard#orders", hash: "#orders", label: "الطلبـات", icon: ShoppingCart },
    { to: "/dashboard#filters", hash: "#filters", label: "الفلاتر", icon: Layers },
    { to: "/dashboard#settings", hash: "#settings", label: "إعدادات الربط", icon: Settings },
    { to: "/dashboard#users", hash: "#users", label: "المستخدمين", icon: UsersIcon },
  ].filter(link => {
    if (role === 'employee' && link.hash === '#users') return false;
    return true;
  });

  return (
    <>
    <nav className="bg-white border-b border-gray-200 h-16 fixed top-0 w-full z-[60] shadow-sm">
      <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard#overview" className="flex items-center gap-2 transition-all">
            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-none mb-0.5">SANEEN</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Dashboard</span>
            </div>
          </Link>
          
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = hash === link.hash || (hash === "" && link.hash === "#overview");
              
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-semibold ${
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : ''}`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-2">
             <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-green-700 uppercase">Live System</span>
          </div>
          <div className="h-8 w-px bg-gray-100 mx-2" />
          <Link 
            to="/" 
            className="h-10 px-4 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            المتجر
          </Link>
          <button 
            onClick={() => { logout(); window.location.href = "/dashboard"; }}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>

    {/* MOBILE BOTTOM TABS */}
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-[60] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
       <div className="flex justify-around items-center h-[72px] px-2 overflow-x-auto">
         {links.map((link) => {
            const Icon = link.icon;
            const isActive = hash === link.hash || (hash === "" && link.hash === "#overview");
            return (
               <Link key={link.to} to={link.to} className={`flex flex-col items-center justify-center p-2 min-w-[64px] gap-1.5 transition-all ${isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  <div className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-50 text-blue-600' : ''}`}>
                     <Icon className={`h-5 w-5 ${isActive ? 'scale-110 drop-shadow-sm' : ''}`} />
                  </div>
                  <span className={`text-[10px] whitespace-nowrap ${isActive ? 'font-black' : 'font-bold'}`}>{link.label}</span>
               </Link>
            )
         })}
       </div>
    </div>
    </>
  );
}
