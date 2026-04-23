import React, { useState, useEffect } from "react";
import { Lock, User as UserIcon, LayoutDashboard, Database, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useProducts, Product } from "@/lib/products";
import { useOrders, Order, OrderStatus } from "@/lib/orders";
import AdminNavbar from "@/components/AdminNavbar";
import { toast } from "sonner";

// Import Modular Tabs
import OverviewTab from "@/components/dashboard/OverviewTab";
import POSTab from "@/components/dashboard/POSTab";
import CatalogTab from "@/components/dashboard/CatalogTab";
import OrdersTab from "@/components/dashboard/OrdersTab";
import FiltersTab from "@/components/dashboard/FiltersTab";
import LogisticsTab from "@/components/dashboard/LogisticsTab";
import UsersTab from "@/components/dashboard/UsersTab";
import PurchasesTab from "@/components/dashboard/PurchasesTab";

// Import Modular Modals
import { ProductModal, OrderEditModal, InvoiceModal, PurchaseModal } from "@/components/dashboard/Modals";

export default function Dashboard() {
  // 1. ALL HOOKS MUST BE CALLED AT THE TOP (Rules of Hooks)
  const { role, currentUser, login, addUser, users, deleteUser, updatePassword, setUserPassword } = useAuth();
  const productsContext = useProducts();
  const ordersContext = useOrders();
  const location = useLocation();

  // Authentication State
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [editOrderData, setEditOrderData] = useState<Partial<Order>>({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<any>(null);
  const [purchaseData, setPurchaseData] = useState<any>({});
  
  // POS & Filtering States
  const [posSearch, setPosSearch] = useState("");
  const [posCart, setPosCart] = useState<{product: Product, size: string, quantity: number, price: number}[]>([]);
  const [flippedProductId, setFlippedProductId] = useState<string | null>(null);
  const [autoPrint, setAutoPrint] = useState(true);
  const [newFilterValues, setNewFilterValues] = useState({ sizes: "", categories: "" });
  const [newWilayaName, setNewWilayaName] = useState("");
  const [newWilayaFee, setNewWilayaFee] = useState(600);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderTabFilter, setOrderTabFilter] = useState<"all" | "online" | "store">("all");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // 2. EFFECTS
  useEffect(() => {
    const h = location.hash.replace('#', '') || "overview";
    const validTabs = ["overview", "pos", "catalog", "orders", "filters", "settings", "users", "purchases"];
    if (validTabs.includes(h)) setActiveTab(h);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.hash]);

  // 3. EVENT HANDLERS
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      login(loginForm.username, loginForm.password);
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (err: any) {
      toast.error("خطأ في اسم المستخدم أو كلمة المرور");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Helper handles (definitions can stay here)
  const getProductPriceLocal = (p: Product, s: string) => {
    if (!productsContext) return 0;
    return productsContext.getProductPrice(p, s);
  };

  const editOrderInPOS = (order: Order) => {
    if (order.isOnlineOrder) {
      toast.error("لا يمكن تعديل طلبيات الموقع من هنا");
      return;
    }
    
    // 1. Convert order items to POS cart format
    const newCart = order.items.map(item => {
      const product = products.find(p => p.id === item.productId || p.name === item.productName);
      return {
        product: product || { id: item.productId, name: item.productName, basePriceDZD: item.price, sizes: [item.size], stock: { [item.size]: 999 } } as any,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      };
    });
    
    // 2. Set state
    setPosCart(newCart);
    setEditingOrder(order);
    
    // 3. Switch to POS tab
    window.location.hash = "#pos";
    toast.info(`تعديل الطلب #${order.id}`);
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    setPosCart([]);
  };

  // 4. CONDITIONAL RETURNS FOR AUTH & LOADING
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-md">
           <div className="text-center mb-10">
              <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                 <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 italic">SANEEN</h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">Management Suite</p>
           </div>
           <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
              <form onSubmit={handleLogin} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-wider">اسم المستخدم</label>
                    <input type="text" required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none focus:border-blue-500 transition-all" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="admin" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-wider">كلمة المرور</label>
                    <input type="password" required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold outline-none focus:border-blue-500 transition-all" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" />
                 </div>
                 <button type="submit" disabled={isLoggingIn} className="w-full h-14 bg-blue-600 text-white rounded-xl font-black shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                    {isLoggingIn ? "جاري الدخول..." : "دخول"}
                 </button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  if (!productsContext || !ordersContext) {
    return <div className="min-h-screen flex items-center justify-center font-bold">جاري تحميل البيانات...</div>;
  }

  // 5. DATA EXTRACTION (AFTER HOOKS & LOADING)
  const { products, addProduct, updateProduct, deleteProduct, getProductPrice, sellInStore, returnToStock, updateFilter, categorySizes, categories, purchases, addPurchase, updatePurchase, deletePurchase, globalReorderLevel, setGlobalReorderLevel } = productsContext;
  const { orders, addOrder, updateStatus, updateOrder, deleteOrder, wilayaFees, updateWilayaFee, addWilaya, deleteWilaya, renameWilaya } = ordersContext;


  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.basePriceDZD || !formData.costPriceDZD) {
      toast.error("يرجى ملء البيانات المطلوبة");
      return;
    }
    const finalData = { ...formData, sizes: categorySizes[formData.category || ''] || [], colors: formData.colors?.length ? formData.colors : [] };
    
    // User cannot add new filters from here anymore, handled in filters tab.
    
    if (editingProduct) updateProduct(editingProduct.id, finalData);
    else addProduct(finalData as Omit<Product, "id">);
    setIsAddModalOpen(false);
    toast.success("تم الحفظ");
  };

  const handlePurchaseSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseData.productId || !purchaseData.costPriceDZD) {
      toast.error("يرجى ملء البيانات المطلوبة");
      return;
    }
    
    if (editingPurchase) {
       updatePurchase(editingPurchase.id, purchaseData);
       toast.success("تم تعديل الفاتورة وتحديث المخزون بنجاح");
    } else {
       addPurchase(purchaseData);
       toast.success("تم إضافة الفاتورة وتحديث المخزون بنجاح");
    }
    
    setIsPurchaseModalOpen(false);
  };

  const handleAddFilter = (type: 'categorySizes' | 'categories', categoryForSize?: string) => {
    const val = (newFilterValues as any)[type];
    if (!val) return;
    updateFilter(type, 'add', val, categoryForSize);
    setNewFilterValues({ ...newFilterValues, [type]: "" });
    toast.success("تمت إضافة الفلتر");
  };

  // 6. FINAL RENDER
  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20" dir="rtl">
      <AdminNavbar />
      <main className="max-w-[1600px] mx-auto px-6 pt-24">
        {activeTab === "overview" && (
          <OverviewTab role={role} orders={orders} products={products} setActiveTab={(t) => { window.location.hash = t }} globalReorderLevel={globalReorderLevel} />
        )}
        {activeTab === "pos" && (
          <POSTab posSearch={posSearch} setPosSearch={setPosSearch} filteredPosProducts={products.filter(p => p.name.includes(posSearch))} flippedProductId={flippedProductId} setFlippedProductId={setFlippedProductId}
            addToPosCart={(p, s) => {
                const pr = getProductPrice(p, s);
                setPosCart(prev => {
                  const ex = prev.find(i => i.product.id === p.id && i.size === s);
                  if (ex) return prev.map(i => i === ex ? {...i, quantity: i.quantity + 1} : i);
                  return [...prev, { product: p, size: s, quantity: 1, price: pr }];
                });
            }} 
            autoPrint={autoPrint} setAutoPrint={setAutoPrint} posCart={posCart} setPosCart={setPosCart}
            updatePosCartQty={(idx, d) => setPosCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, item.quantity + d) } : item))}
            removeFromPosCart={(idx) => setPosCart(prev => prev.filter((_, i) => i !== idx))}
            processPosSale={() => {
                if (posCart.length === 0) return;
                
                const orderData = {
                  customerName: editingOrder ? editingOrder.customerName : "زبون محلي", 
                  customerPhone: editingOrder ? editingOrder.customerPhone : "0000000000", 
                  customerWilaya: editingOrder ? editingOrder.customerWilaya : "بيع مباشر", 
                  deliveryType: editingOrder ? editingOrder.deliveryType : "محل",
                  items: posCart.map(i => ({ productName: i.product.name, productId: i.product.id, quantity: i.quantity, price: i.price, size: i.size })),
                  totalDZD: posCart.reduce((sum, i) => sum + (i.price * i.quantity), 0), 
                  isOnlineOrder: false, 
                  deliveryFee: 0, 
                  status: "مكتمل", 
                  cashierName: currentUser?.username || 'Unknown'
                };

                if (editingOrder) {
                   // Update existing order keeping the same ID
                   updateOrder(editingOrder.id, orderData as any);
                   setEditingOrder(null);
                   toast.success("تم تحديث الطلب بنجاح");
                } else {
                   // Create new order
                   addOrder(orderData as any);
                   // Update stock (only for NEW sales for now, keeping it simple)
                   posCart.forEach(i => { for(let n=0; n<i.quantity; n++) sellInStore(i.product.id, i.size); });
                   toast.success("تم البيع بنجاح");
                }
                
                setPosCart([]);
            }}
            editingOrder={editingOrder}
            cancelEdit={cancelEdit}
          />
        )}
        {activeTab === "catalog" && (
          <CatalogTab role={role} products={products} openAddModal={() => { setEditingProduct(null); setFormData({ name: "", basePriceDZD: 0, costPriceDZD: 0, category: categories[0] || "", stock: {}, sizePrices: {}, sizeCostPrices: {}, colors: [] }); setIsAddModalOpen(true); }} openEditModal={(p) => { setEditingProduct(p); setFormData(p); setIsAddModalOpen(true); }} deleteProduct={deleteProduct} getProductPrice={getProductPrice} />
        )}
        {activeTab === "purchases" && (
          <PurchasesTab products={products} purchases={purchases} deletePurchase={deletePurchase} openPurchaseModal={(p) => {
             setEditingPurchase(p || null);
             setPurchaseData(p || { stockAdded: {} });
             setIsPurchaseModalOpen(true);
          }} />
        )}
        {activeTab === "orders" && (
          <OrdersTab 
            role={role} 
            orderSearch={orderSearch} 
            setOrderSearch={setOrderSearch} 
            orderTabFilter={orderTabFilter} 
            setOrderTabFilter={setOrderTabFilter}
            filteredOrders={orders.filter(o => {
              const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                   (o.customerPhone && o.customerPhone.includes(orderSearch)) || 
                                   (o.customerName && o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()));
              
              // Role-based visibility: Employee sees online orders + their own store orders
              const isEmployee = role === 'employee';
              const canSeeOrder = !isEmployee || o.isOnlineOrder || o.cashierName === currentUser?.username;
              
              if (!canSeeOrder) return false;

              if (orderTabFilter === "online") return matchesSearch && o.isOnlineOrder;
              if (orderTabFilter === "store") return matchesSearch && !o.isOnlineOrder;
              return matchesSearch;
            })} 
            updateStatus={updateStatus} 
            setSelectedOrder={setSelectedOrder} 
            setIsInvoiceOpen={setIsInvoiceOpen} 
            editOrderInPOS={editOrderInPOS} 
            deleteOrder={deleteOrder} 
          />
        )}
        {activeTab === "filters" && (
          <FiltersTab categorySizes={categorySizes} categories={categories} newFilterValues={newFilterValues} setNewFilterValues={setNewFilterValues} updateFilter={updateFilter as any} handleAddFilter={handleAddFilter as any} />
        )}
        {activeTab === "settings" && (
          <LogisticsTab role={role} wilayaFees={wilayaFees} renameWilaya={renameWilaya} updateWilayaFee={updateWilayaFee} deleteWilaya={deleteWilaya} newWilayaName={newWilayaName} setNewWilayaName={setNewWilayaName} newWilayaFee={newWilayaFee} setNewWilayaFee={setNewWilayaFee} addWilaya={addWilaya} updatePassword={updatePassword} globalReorderLevel={globalReorderLevel} setGlobalReorderLevel={setGlobalReorderLevel} />
        )}
        {activeTab === "users" && role === 'admin' && (
          <UsersTab users={users} addUser={addUser} deleteUser={deleteUser} orders={orders} setUserPassword={setUserPassword} />
        )}
      </main>
      <ProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} editingProduct={editingProduct} formData={formData} setFormData={setFormData} onSave={handleSaveProduct} categorySizes={categorySizes} categories={categories} />
      <PurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} products={products} categorySizes={categorySizes} editingPurchase={editingPurchase} purchaseData={purchaseData} setPurchaseData={setPurchaseData} onSave={handlePurchaseSave} />
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
    </div>
  );
}
