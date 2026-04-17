import React, { createContext, useContext, useState, useEffect } from "react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  name: string;
  basePriceDZD: number;
  sizePrices: Record<string, number>;
  discountPercent: number;
  image: string;
  description: string;
  fabric: string;
  fabricType: string;
  cut: string;
  colors: string[];
  sizes: string[];
  category: string;
  featured: boolean;
  isPublished: boolean;
  stock: Record<string, number>;
  reorderLevel: number;
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
    fabric: "كريب إنترنت سعودي",
    fabricType: "إنترنت",
    cut: "كلوش",
    colors: ["أسود", "ذهبي"],
    sizes: ["52", "54", "56", "58", "60"],
    category: "فاخر",
    featured: true,
    isPublished: true,
    stock: { "52": 4, "54": 12, "56": 8, "58": 2, "60": 1 },
    reorderLevel: 3,
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
    fabric: "ندى ياباني",
    fabricType: "كريب",
    cut: "بشت",
    colors: ["أسود", "كحلي"],
    sizes: ["54", "56", "58"],
    category: "كلاسيك",
    featured: true,
    isPublished: true,
    stock: { "54": 15, "56": 20, "58": 5 },
    reorderLevel: 5,
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
    fabric: "حرير مغسول",
    fabricType: "حرير",
    cut: "دبل كلوش",
    colors: ["أخضر زيتي"],
    sizes: ["50", "52", "54"],
    category: "رسمي",
    featured: false,
    isPublished: true,
    stock: { "50": 2, "52": 0, "54": 1 },
    reorderLevel: 3
  },
  {
    id: "prod-4",
    name: "عباءة 'نور' المفتوحة للمناسبات",
    basePriceDZD: 18000,
    sizePrices: { "54": 18000, "56": 18000, "58": 18000 },
    discountPercent: 0,
    image: product4,
    description: "إطلالة استثنائية ملائمة للحفلات بفضل قماش الكريب المدمج مع اللمعة الخفيفة. تأتي مع شيط كامل مطابق.",
    fabric: "كريب جاكار",
    fabricType: "كريب",
    cut: "مفتوح",
    colors: ["أسود"],
    sizes: ["54", "56", "58"],
    category: "فاخر",
    featured: true,
    isPublished: true,
    stock: { "54": 4, "56": 6, "58": 3 },
    reorderLevel: 2
  },
  {
    id: "prod-5",
    name: "طقم الصلاة الإسلامي المستور (قطعتين)",
    basePriceDZD: 4500,
    sizePrices: { "Standard": 4500 },
    discountPercent: 0,
    image: product5,
    description: "طقم صلاة متكامل (خمار عريض وتنورة) بقماش قطني بارد جداً، عملي وسهل الارتداء فور سماع الأذان.",
    fabric: "قطن ربيعي",
    fabricType: "قطن",
    cut: "أخرى",
    colors: ["وردي فاتح", "رمادي مسود"],
    sizes: ["Standard"],
    category: "كلاسيك",
    featured: false,
    isPublished: true,
    stock: { "Standard": 45 },
    reorderLevel: 10
  },
  {
    id: "prod-6",
    name: "عباءة 'الكوثر' بتفاصيل الزم",
    basePriceDZD: 11000,
    sizePrices: { "52": 11000, "54": 11000, "56": 11000 },
    discountPercent: 5,
    image: product6,
    description: "تصميم متميز بتزميم عصري على مستوى المعصم ليمنحك راحة تامة وعملية أثناء الحركة.",
    fabric: "كريب كوري",
    fabricType: "كريب",
    cut: "فراشة",
    colors: ["بني داكن", "أسود"],
    sizes: ["52", "54", "56"],
    category: "بشت",
    featured: false,
    isPublished: true,
    stock: { "52": 5, "54": 8, "56": 12 },
    reorderLevel: 4
  }
];

interface ProductsContextType {
  products: Product[];
  sizes: string[];
  cuts: string[];
  fabrics: string[];
  categories: string[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sellInStore: (productId: string, size: string) => void;
  returnToStock: (productId: string, size: string, quantity?: number) => void;
  getProductPrice: (product: Product, size: string) => number;
  updateFilter: (type: 'sizes' | 'cuts' | 'fabrics' | 'categories', action: 'add' | 'remove', value: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<string[]>(["52", "54", "56", "58", "60"]);
  const [cuts, setCuts] = useState<string[]>(["كلوش", "بشت", "فراشة", "أخرى"]);
  const [fabrics, setFabrics] = useState<string[]>(["كريب", "حرير", "إنترنت", "كتان"]);
  const [categories, setCategories] = useState<string[]>(["الكل", "كلاسيك", "بشت", "فراشة", "رسمي", "فاخر"]);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("saneen_products_v4");
      let parsed = savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS;
      setProducts(parsed);

      const savedFilters = localStorage.getItem("saneen_filters");
      if (savedFilters) {
        const f = JSON.parse(savedFilters);
        if (f.sizes) setSizes(f.sizes);
        if (f.cuts) setCuts(f.cuts);
        if (f.fabrics) setFabrics(f.fabrics);
        if (f.categories) setCategories(f.categories);
      }
    } catch (e) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const saveFilters = (newSizes: string[], newCuts: string[], newFabrics: string[], newCats: string[]) => {
    localStorage.setItem("saneen_filters", JSON.stringify({ sizes: newSizes, cuts: newCuts, fabrics: newFabrics, categories: newCats }));
  };

  const updateFilter = (type: 'sizes' | 'cuts' | 'fabrics' | 'categories', action: 'add' | 'remove', value: string) => {
    let nSizes = [...sizes], nCuts = [...cuts], nFabrics = [...fabrics], nCats = [...categories];
    
    if (action === 'add') {
      if (type === 'sizes') nSizes.push(value);
      if (type === 'cuts') nCuts.push(value);
      if (type === 'fabrics') nFabrics.push(value);
      if (type === 'categories') nCats.push(value);
    } else {
      if (type === 'sizes') nSizes = nSizes.filter(v => v !== value);
      if (type === 'cuts') nCuts = nCuts.filter(v => v !== value);
      if (type === 'fabrics') nFabrics = nFabrics.filter(v => v !== value);
      if (type === 'categories') nCats = nCats.filter(v => v !== value);
    }

    setSizes(nSizes); setCuts(nCuts); setFabrics(nFabrics); setCategories(nCats);
    saveFilters(nSizes, nCuts, nFabrics, nCats);
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

  return (
    <ProductsContext.Provider value={{ 
      products, sizes, cuts, fabrics, categories, 
      addProduct, updateProduct, deleteProduct, sellInStore, returnToStock, getProductPrice, updateFilter 
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

