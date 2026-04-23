import React, { createContext, useContext, useState, useEffect } from "react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface PurchaseRecord {
  id: string;
  date: string;
  productId: string;
  productName: string;
  costPriceDZD: number;
  stockAdded: Record<string, number>;
  totalCost: number;
}
export interface Product {
  id: string;
  name: string;
  basePriceDZD: number;
  sizePrices: Record<string, number>;
  discountPercent: number;
  image: string;
  description?: string;
  colors: string[];
  sizes: string[];
  category: string;
  featured: boolean;
  isPublished: boolean;
  stock: Record<string, number>;
  reorderLevel: number;
  costPriceDZD: number; // سعر التكلفة للقطعة الواحدة (قاعدة)
  sizeCostPrices?: Record<string, number>; // سعر التكلفة لكل مقاس إن كان مختلفاً
  washInstructions?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "عباءة 'شيهانة' بتطريز ملكي خليجي",
    basePriceDZD: 14500,
    sizePrices: { "52": 14500, "54": 14500, "56": 15000, "58": 15000, "60": 15500 },
    discountPercent: 10,
    image: product1,
    description: "عباءة فاخرة مصممة بعناية فائقة وتطريز يدوي على الأطراف، مناسبة للأعراس واللقاءات الرسمية.",
    colors: ["أسود", "ذهبي"],
    sizes: ["52", "54", "56", "58", "60"],
    category: "عباءة",
    featured: true,
    isPublished: true,
    stock: { "52": 4, "54": 12, "56": 8, "58": 2, "60": 1 },
    reorderLevel: 3,
    costPriceDZD: 8200,
    washInstructions: "غسيل جاف فقط للحفاظ على التطريز."
  },
  {
    id: "prod-2",
    name: "عباءة 'لميس' بشت ندى ناعم",
    basePriceDZD: 9800,
    sizePrices: { "54": 9800, "56": 9800, "58": 10500 },
    discountPercent: 0,
    image: product2,
    description: "عباءة بشت عملية جداً بقصة كلاسيكية مريحة، مثالية للعمل والدوام اليومي. قماشها لا يحتاج للكي المستمر.",
    colors: ["أسود", "كحلي"],
    sizes: ["54", "56", "58"],
    category: "قميص",
    featured: true,
    isPublished: true,
    stock: { "52": 10, "54": 15, "56": 12, "58": 6 },
    reorderLevel: 5,
    costPriceDZD: 5800,
    washInstructions: "غسيل بالماء البارد بمسحوق مخصص للعباءات الداكنة."
  },
  {
    id: "prod-3",
    name: "فستان بتطريز خفيف 'حورية'",
    basePriceDZD: 12500,
    sizePrices: { "50": 12500, "52": 12500, "54": 12500 },
    discountPercent: 15,
    image: product3,
    description: "فستان أنيق جداً بخامة ناعمة منسدلة. يوفر تغطية كاملة وشكلاً راقياً يبرز دون تكلف.",
    colors: ["أخضر زيتي"],
    sizes: ["50", "52", "54"],
    category: "عباءة",
    featured: false,
    isPublished: true,
    stock: { "50": 2, "52": 0, "54": 1 },
    reorderLevel: 3,
    costPriceDZD: 7000
  },
  {
    id: "prod-4",
    name: "عباءة 'نور' المفتوحة للمناسبات",
    basePriceDZD: 18000,
    sizePrices: { "54": 18000, "56": 18000, "58": 18000 },
    discountPercent: 0,
    image: product4,
    description: "إطلالة استثنائية ملائمة للحفلات بفضل قماش الكريب المدمج مع اللمعة الخفيفة. تأتي مع شيط كامل مطابق.",
    colors: ["أسود"],
    sizes: ["54", "56", "58"],
    category: "عباءة",
    featured: true,
    isPublished: true,
    stock: { "54": 2, "56": 4, "58": 3, "60": 1 },
    reorderLevel: 2,
    costPriceDZD: 11000
  },
  {
    id: "prod-5",
    name: "طقم الصلاة الإسلامي المستور (قطعتين)",
    basePriceDZD: 4500,
    sizePrices: { "Standard": 4500 },
    discountPercent: 0,
    image: product5,
    description: "طقم صلاة متكامل (خمار عريض وتنورة) بقماش قطني بارد جداً، عملي وسهل الارتداء فور سماع الأذان.",
    colors: ["وردي فاتح", "رمادي مسود"],
    sizes: ["Standard"],
    category: "طقم صلاة",
    featured: true,
    isPublished: true,
    stock: { "Standard": 25 },
    reorderLevel: 10,
    costPriceDZD: 2100
  },
  {
    id: "prod-6",
    name: "عباءة 'الكوثر' بتفاصيل الزم",
    basePriceDZD: 11000,
    sizePrices: { "52": 11000, "54": 11000, "56": 11000 },
    discountPercent: 5,
    image: product6,
    description: "تصميم متميز بتزميم عصري على مستوى المعصم ليمنحك راحة تامة وعملية أثناء الحركة.",
    colors: ["بني داكن", "أسود"],
    sizes: ["52", "54", "56"],
    category: "قميص",
    featured: false,
    isPublished: true,
    stock: { "54": 5, "56": 8, "58": 12, "60": 4 },
    reorderLevel: 4,
    costPriceDZD: 7500
  }
];

interface ProductsContextType {
  products: Product[];
  categorySizes: Record<string, string[]>;
  categories: string[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sellInStore: (productId: string, size: string) => void;
  returnToStock: (productId: string, size: string, quantity?: number) => void;
  getProductPrice: (product: Product, size: string) => number;
  updateFilter: (type: 'categorySizes' | 'categories', action: 'add' | 'remove', value: string, category?: string) => void;
  purchases: PurchaseRecord[];
  addPurchase: (p: Omit<PurchaseRecord, "id" | "date">) => void;
  updatePurchase: (id: string, updates: Partial<PurchaseRecord>) => void;
  deletePurchase: (id: string) => void;
  globalReorderLevel: number;
  setGlobalReorderLevel: (v: number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [globalReorderLevel, setGlobalReorderLevelState] = useState(5);
  const [categorySizes, setCategorySizes] = useState<Record<string, string[]>>({
    "سجادة": ["صغير", "متوسط", "كبير", "1x1.5m", "2x3m"],
    "طقم صلاة": ["Standard", "XL"],
    "عمامة": ["صغير", "كبير", "54", "56", "58"],
    "قميص": ["S", "M", "L", "XL", "XXL"],
    "عباءة": ["52", "54", "56", "58", "60"]
  });
  const [categories, setCategories] = useState<string[]>(["سجادة", "طقم صلاة", "عمامة", "قميص", "عباءة"]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);

  useEffect(() => {
    /* 
      BACKEND INTEGRATION POINT: 
      Replace this localStorage loading logic with an async API fetch:
      fetch('/api/products').then(res => res.json()).then(data => setProducts(data))
    */
    try {
      const savedProducts = localStorage.getItem("saneen_products_v4");
      let parsed = savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS;
      setProducts(parsed);

      const savedFilters = localStorage.getItem("saneen_filters");
      if (savedFilters) {
        const f = JSON.parse(savedFilters);
        if (f.categorySizes) {
          setCategorySizes(f.categorySizes);
        } else if (f.sizes && f.categories) {
          const fallback: Record<string, string[]> = {};
          f.categories.filter((c: string) => c !== "الكل").forEach((c: string) => fallback[c] = f.sizes);
          setCategorySizes(fallback);
        }
        if (f.categories) setCategories(f.categories.filter((v: string) => v !== "الكل"));
      }
      
      const savedPurchases = localStorage.getItem("saneen_purchases");
      if (savedPurchases) setPurchases(JSON.parse(savedPurchases));

      const savedGlobalReorder = localStorage.getItem("saneen_global_reorder");
      if (savedGlobalReorder) setGlobalReorderLevelState(parseInt(savedGlobalReorder, 10));
    } catch (e) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const setGlobalReorderLevel = (v: number) => {
    setGlobalReorderLevelState(v);
    localStorage.setItem("saneen_global_reorder", v.toString());
  };

  const saveFilters = (newCatSizes: Record<string, string[]>, newCats: string[]) => {
    localStorage.setItem("saneen_filters", JSON.stringify({ categorySizes: newCatSizes, categories: newCats }));
  };

  const updateFilter = (type: 'categorySizes' | 'categories', action: 'add' | 'remove', value: string, category?: string) => {
    if (type === 'categorySizes' && category) {
      let nCatSizes = { ...categorySizes };
      let list = nCatSizes[category] ? [...nCatSizes[category]] : [];
      
      if (action === 'add') list.push(value);
      else list = list.filter(v => v !== value);
      
      nCatSizes[category] = list;
      setCategorySizes(nCatSizes);
      saveFilters(nCatSizes, categories);
    } else if (type === 'categories') {
      let nCats = [...categories];
      if (action === 'add') nCats.push(value);
      else nCats = nCats.filter(v => v !== value);
      
      const filteredCats = nCats.filter(v => v !== "الكل");
      setCategories(filteredCats);
      saveFilters(categorySizes, filteredCats);
    }
  };

  const getProductPrice = (product: Product, size: string) => {
    if (!product) return 0;
    const base = product.basePriceDZD || 0;
    const originalPrice = (size && product.sizePrices && product.sizePrices[size]) ? product.sizePrices[size] : base;
    if (product.discountPercent > 0) return Math.round(originalPrice * (1 - product.discountPercent / 100));
    return originalPrice;
  };

  const saveAndSet = (newProducts: Product[]) => {
    setProducts(newProducts);
    /* 
       BACKEND INTEGRATION POINT: 
       Replace localStorage.setItem with a PUT/POST request to your API
    */
    localStorage.setItem("saneen_products_v4", JSON.stringify(newProducts));
  };

  const addProduct = (p: Omit<Product, "id">) => {
    const newProduct = { ...p, id: Date.now().toString() };
    saveAndSet([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    saveAndSet(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    saveAndSet(products.filter(p => p.id !== id));
  };

  const sellInStore = (productId: string, size: string) => {
    saveAndSet(products.map(p => {
      if (p.id === productId && p.stock?.[size] > 0) return { ...p, stock: { ...p.stock, [size]: p.stock[size] - 1 } };
      return p;
    }));
  };

  const returnToStock = (productId: string, size: string, quantity: number = 1) => {
    saveAndSet(products.map(p => {
      if (p.id === productId) return { ...p, stock: { ...p.stock, [size]: (p.stock?.[size] || 0) + quantity } };
      return p;
    }));
  };

  const savePurchases = (newPurchases: PurchaseRecord[]) => {
     setPurchases(newPurchases);
     localStorage.setItem("saneen_purchases", JSON.stringify(newPurchases));
  };

  const addPurchase = (data: Omit<PurchaseRecord, "id" | "date">) => {
     const newPurchase = { ...data, id: Date.now().toString(), date: new Date().toISOString() };
     savePurchases([newPurchase, ...purchases]);
     
     const newProducts = products.map(p => {
       if (p.id === data.productId) {
         const newStock = { ...p.stock };
         const newSizes = [...(p.sizes || [])];
         Object.entries(data.stockAdded).forEach(([s, q]) => {
           if (q > 0 && !newSizes.includes(s)) newSizes.push(s);
           newStock[s] = (newStock[s] || 0) + q;
         });
         return { ...p, stock: newStock, sizes: newSizes };
       }
       return p;
     });
     saveAndSet(newProducts);
  };

  const updatePurchase = (id: string, updates: Partial<PurchaseRecord>) => {
     const oldPurchase = purchases.find(p => p.id === id);
     if (!oldPurchase) return;
     
     const newPurchase = { ...oldPurchase, ...updates };
     savePurchases(purchases.map(p => p.id === id ? newPurchase : p));

     if (updates.stockAdded) {
       const newProducts = products.map(p => {
         if (p.id === oldPurchase.productId) {
           const newStock = { ...p.stock };
           const newSizes = [...(p.sizes || [])];
           // Revert old stock
           Object.entries(oldPurchase.stockAdded).forEach(([s, q]) => {
             newStock[s] = Math.max(0, (newStock[s] || 0) - q);
           });
           // Add new stock
           Object.entries(updates.stockAdded!).forEach(([s, q]) => {
             if (q > 0 && !newSizes.includes(s)) newSizes.push(s);
             newStock[s] = (newStock[s] || 0) + q;
           });
           return { ...p, stock: newStock, sizes: newSizes };
         }
         return p;
       });
       saveAndSet(newProducts);
     }
  };

  const deletePurchase = (id: string) => {
     const oldPurchase = purchases.find(p => p.id === id);
     if (!oldPurchase) return;

     savePurchases(purchases.filter(p => p.id !== id));

     const newProducts = products.map(p => {
       if (p.id === oldPurchase.productId) {
         const newStock = { ...p.stock };
         Object.entries(oldPurchase.stockAdded).forEach(([s, q]) => {
           newStock[s] = Math.max(0, (newStock[s] || 0) - q);
         });
         return { ...p, stock: newStock };
       }
       return p;
     });
     saveAndSet(newProducts);
  };

  return (
    <ProductsContext.Provider value={{ 
      products, categorySizes, categories, purchases,
      addProduct, updateProduct, deleteProduct, sellInStore, returnToStock, getProductPrice, updateFilter,
      addPurchase, updatePurchase, deletePurchase, globalReorderLevel, setGlobalReorderLevel
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts must be used within ProductsProvider");
  return context;
}

