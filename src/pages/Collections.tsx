import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';

const categoryMap: Record<string, string> = {
  'all': 'All',
  'dtf-printer': 'DTF Printer',
  'uv-dtf-printer': 'UV DTF Printer',
  'uv-printer': 'UV Printer',
  'dtg-printer': 'DTG Printer',
  'equipment': 'Equipment',
  'consumables': 'Consumables',
  'parts-accessory': 'Parts & Accessory',
  'whats-new': "What's New",
  'extended-warranty': 'Extended Warranty'
};

const filterGroups = [
  { id: 'inStock', title: 'Availability', options: ['In stock'] },
  { id: 'printType', title: 'Print Type', options: ['DTF', 'DTG', 'UV', 'UV DTF'] },
  { id: 'printSize', title: 'Print Size', options: [
    '8.2" × 12.9"', 'Width: 6.7"(170mm)', 'Width: 8.2"(210mm)', 
    'Width: 8.3"(210mm)', 'Width: 11.3"(287mm)', 'Width: 11.7"(297mm)', 
    'Width: 11.8"(300mm)', 'Width: 13"(330mm)'
  ] },
  { id: 'resolution', title: 'Resolution', options: ['1440*1400 DPI (8 Pass)', '720*1440 DPI (16 Pass)', '720*1440 DPI (16 PASS)'] },
  { id: 'printSpeed', title: 'Print Speed', options: [
    'Letter/A4: 4.5min', 'Letter/A4: 7min', 'Letter/A4: 10min', 'Letter/A4: 12.5min',
    'Letter/A4: 14min', 'Letter/A4: 23 min', 'Letter/A4: 6min', 'Letter/A4: 7.5min', 'Letter/A4: 8~9min'
  ] },
  { id: 'printerHead', title: 'Printer Head', options: ['L800', 'L1800', 'LH-500', 'R1390', 'TX800', 'XP600'] },
  { id: 'substrateThickness', title: 'Substrate Thickness Allows', options: [
    '0-0.059" (0-15mm)', '0-4.33" (0-110mm)', '0-5.51" (0-140mm)'
  ] },
  { id: 'consumables', title: 'Consumables', options: ['Ink', 'Film', 'Powder', 'Coatings', 'Other liquids'] },
  { id: 'machineCategory', title: 'Machine Category', options: ['K13 Lite White', 'K13 Lite Pink', 'P13 Series', 'F13 Pro Series', 'F13 Series', 'F8 Series'] },
  { id: 'consumablesCategory', title: 'Consumables Category', options: ['DTF Consumables', 'UV DTF Consumables', 'UV Consumables', 'DTG Consumables'] }
];

export default function Collections() {
  const { categoryId = 'all' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentCategoryName = categoryMap[categoryId] || 'All';
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    collection: true,
    inStock: true,
    printType: true,
    printSize: true,
    resolution: true,
    printSpeed: true,
    printerHead: true,
    substrateThickness: true,
    consumables: true,
    machineCategory: true,
    consumablesCategory: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (filterId: string, option: string) => {
    const currentValues = searchParams.getAll(filterId);
    if (currentValues.includes(option)) {
      searchParams.delete(filterId);
      currentValues.filter(v => v !== option).forEach(v => searchParams.append(filterId, v));
    } else {
      searchParams.append(filterId, option);
    }
    setCurrentPage(1);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Base list of products filtered by the route category (e.g. /collections/dtf-printer)
  const categoryProducts = useMemo(() => {
    if (currentCategoryName === 'All') return products;
    return products.filter(p => p.sections.includes(currentCategoryName));
  }, [currentCategoryName]);

  // The filtered products array applying all checkbox dimensions
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product: any) => {
      let match = true;
      for (const group of filterGroups) {
        const activeValues = searchParams.getAll(group.id);
        if (activeValues.length > 0) {
          if (group.id === 'inStock') {
             if (activeValues.includes('In stock') && !product.inStock) match = false;
          } else {
             if (!activeValues.includes(product[group.id])) match = false;
          }
        }
      }
      return match;
    });
  }, [categoryProducts, searchParams]);

  // Compute exact counts for all checkboxes based on categoryProducts (unfiltered by other checkboxes as standard, or intersected? 
  // User says "Numbers must be accurate". We'll compute total matches across root category.
  const getFilterCount = (filterId: string, option: string) => {
    return categoryProducts.filter((product: any) => {
       if (filterId === 'inStock') {
         return option === 'In stock' ? product.inStock : !product.inStock;
       }
       return product[filterId] === option;
    }).length;
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startCount = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endCount = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 font-sans">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-black hover:underline transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">Shop</span>
        <span className="text-gray-300">/</span>
        <span className="text-black">{currentCategoryName}</span>
      </div>

      <h1 className="text-[32px] font-bold text-black mb-10">{currentCategoryName}</h1>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-[300px] flex-shrink-0">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg text-black">Filter</h2>
            <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
          </div>

          <div className="space-y-0">
            {/* Collection Navigation Filters */}
            <div className="border-b border-gray-100 py-4">
              <button onClick={() => toggleSection('collection')} className="flex items-center justify-between w-full text-left font-bold text-[15px] mb-3">
                Collection
                {openSections.collection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections.collection && (
                <div className="space-y-3 mt-4 text-[14px]">
                  {Object.entries(categoryMap).filter(([k]) => k !== 'all').map(([k, v]) => (
                    <Link 
                      key={k} 
                      to={`/collections/${k}${searchParams.toString() ? '?' + searchParams.toString() : ''}`}
                      className={`block ${currentCategoryName === v ? 'text-[#E85A24] font-medium' : 'text-gray-600 hover:text-black'} transition-colors pl-4 border-l-2 ${currentCategoryName === v ? 'border-[#E85A24]' : 'border-transparent'}`}
                    >
                      {v}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Filters Options */}
            {filterGroups.map(group => {
              const totalInGroup = group.options.reduce((acc, opt) => acc + getFilterCount(group.id, opt), 0);
              // Hide group if no products in this category support these filters (optional, but cleaner)
              if (totalInGroup === 0 && group.id !== 'inStock') return null;

              return (
                <div key={group.id} className="border-b border-gray-100 py-4">
                  <button onClick={() => toggleSection(group.id)} className="flex items-center justify-between w-full text-left font-bold text-[15px] mb-3">
                    {group.title}
                    {openSections[group.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[group.id] && (
                    <div className="space-y-3 mt-4">
                      {group.options.map((option, idx) => {
                        const count = getFilterCount(group.id, option);
                        if (count === 0 && group.id !== 'inStock') return null;
                        const isChecked = searchParams.getAll(group.id).includes(option);
                        return (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(group.id, option)}
                              className="rounded-sm border-gray-300 w-[18px] h-[18px] text-[#E85A24] focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer" 
                            />
                            <span className={`text-[14px] ${isChecked ? 'text-black' : 'text-gray-600'} group-hover:text-black transition-colors flex-1`}>
                              {option}
                              {group.id !== 'inStock' && <span className="ml-1 text-gray-400">({count})</span>}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={clearFilters} className="flex-1 py-3 text-sm font-bold border border-gray-300 rounded hover:bg-gray-50 transition-colors">Clear</button>
            <button className="flex-1 py-3 text-sm font-bold bg-[#E85A24] hover:bg-[#d44e1e] text-white rounded transition-colors duration-200">Apply</button>
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="flex-1 w-full mt-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 font-medium">Showing {startCount} - {endCount} of {filteredProducts.length} products</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-black">Sort by:</span>
              <select className="border border-gray-300 rounded text-sm py-2 pl-3 pr-8 focus:border-black focus:ring-0 transition-colors">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No products found matching your active filters.</p>
              <button onClick={clearFilters} className="mt-4 text-[#E85A24] hover:underline">Clear all filters</button>
            </div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
               {currentProducts.map((product) => (
                 <Link 
                   to={`/products/${product.slug}`} 
                   key={product.id} 
                   className="group block"
                 >
                   <div className="relative mb-3 aspect-[4/3] bg-gray-50 flex items-center justify-center p-4 overflow-hidden rounded-t-sm">
                     <img 
                       src={product.image} 
                       alt={product.name}
                       className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                     />
                     {product.badge && (
                       <Badge className={`absolute top-3 left-3 px-2 py-1 text-[11px] font-bold rounded-sm border-none shadow-none text-white ${product.badge === 'NEW ARRIVAL' ? 'bg-[#98db51]' : 'bg-[#E85A24]'}`}>
                         {product.badge}
                       </Badge>
                     )}
                   </div>
                   <div className="px-1">
                     <h3 className="font-medium text-[15px] leading-snug mb-2 line-clamp-2 text-black group-hover:text-[#E85A24] transition-colors">
                       {product.name}
                     </h3>
                     <div className="flex items-end gap-2">
                       <span className="text-[#E85A24] font-bold text-[16px]">{product.price}</span>
                       {product.originalPrice && (
                         <span className="text-gray-400 text-sm line-through pb-0.5">{product.originalPrice}</span>
                       )}
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              <button 
                onClick={() => {
                  setCurrentPage(Math.max(1, currentPage - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="w-10 h-10 border border-gray-200 rounded-sm flex items-center justify-center hover:border-black disabled:opacity-50 disabled:hover:border-gray-200 transition-colors text-black"
              >
                <ChevronLeft className="w-5 h-5 opacity-70" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-sm text-[15px] font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-black text-white border border-black' 
                      : 'border border-gray-200 hover:border-black text-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => {
                  setCurrentPage(Math.min(totalPages, currentPage + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="w-10 h-10 border border-gray-200 rounded-sm flex items-center justify-center hover:border-black disabled:opacity-50 disabled:hover:border-gray-200 transition-colors text-black"
              >
                <ChevronRight className="w-5 h-5 opacity-70" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
