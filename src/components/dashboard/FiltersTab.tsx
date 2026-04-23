import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge, Input, Card } from "@/components/SimpleUI";

interface FiltersTabProps {
  categorySizes: Record<string, string[]>;
  categories: string[];
  newFilterValues: any;
  setNewFilterValues: (v: any) => void;
  updateFilter: (type: 'categorySizes' | 'categories', action: 'add' | 'remove', val: string, category?: string) => void;
  handleAddFilter: (type: 'categorySizes' | 'categories', category?: string) => void;
}

export default function FiltersTab({
  categorySizes, categories, newFilterValues, setNewFilterValues, updateFilter, handleAddFilter
}: FiltersTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || "");
  const currentSizes = categorySizes[selectedCategory] || [];
  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-right">
       <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black">إدارة فلاتر المنتجات</h1>
          <p className="text-xs text-slate-400 font-bold">التحكم في خيارات المقاسات وأنواع المنتجات</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sizes Management */}
          <Card className="saneen-card p-10 space-y-8">
             <div className="border-b pb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h3 className="font-black text-lg">أحجام المنتجات حسب النوع</h3>
                <select 
                   value={selectedCategory} 
                   onChange={e => setSelectedCategory(e.target.value)}
                   className="h-10 px-4 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:border-blue-500"
                >
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             
             {categories.length === 0 ? (
                <p className="text-slate-400 text-sm font-bold">يرجى إضافة أنواع المنتجات أولاً</p>
             ) : (
                <>
                   <div className="flex flex-wrap gap-2">
                      {currentSizes.length === 0 && <span className="text-slate-400 text-xs">لا توجد أحجام مخصصة لهذا النوع...</span>}
                      {currentSizes.map(s => (
                        <Badge key={s} className="bg-slate-100 text-black border-0 py-2 px-4 flex items-center gap-2 rounded-xl group transition-all hover:bg-red-50 hover:text-red-500">
                           {s}
                           <button onClick={() => updateFilter('categorySizes', 'remove', s, selectedCategory)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                   </div>
                   <div className="flex gap-2">
                      <Input placeholder={`إضافة مقاس لـ ${selectedCategory}...`} value={newFilterValues.categorySizes || ""} onChange={e => setNewFilterValues({...newFilterValues, categorySizes: e.target.value})} className="saneen-input h-12" />
                      <button onClick={() => handleAddFilter('categorySizes', selectedCategory)} className="bg-black text-white px-6 rounded-xl hover:bg-gold transition-all"><Plus className="h-4 w-4" /></button>
                   </div>
                </>
             )}
          </Card>

          {/* Categories Management */}
          <Card className="saneen-card p-10 space-y-8">
             <h3 className="font-black text-lg border-b pb-4">أنواع المنتجات</h3>
             <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <Badge key={c} className="bg-gold/10 text-gold border-0 py-2 px-4 flex items-center gap-2 rounded-xl group transition-all hover:bg-red-50 hover:text-red-500">
                     {c}
                     <button onClick={() => updateFilter('categories', 'remove', c)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
             </div>
             <div className="flex gap-2">
                <Input placeholder="إضافة نوع جديد..." value={newFilterValues.categories} onChange={e => setNewFilterValues({...newFilterValues, categories: e.target.value})} className="saneen-input h-12" />
                <button onClick={() => handleAddFilter('categories')} className="bg-black text-white px-6 rounded-xl hover:bg-gold transition-all"><Plus className="h-4 w-4" /></button>
             </div>
          </Card>
       </div>
    </div>
  );
}
