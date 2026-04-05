import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';
import { products } from '../data/products';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

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
    'Letter/A4: 4.5min', 'Letter/A4: 6min', 'Letter/A4: 7min', 'Letter/A4: 7.5min', 
    'Letter/A4: 8~9min', 'Letter/A4: 10min', 'Letter/A4: 12.5min', 'Letter/A4: 14min', 'Letter/A4: 23 min', 'Letter/A4: 23min'
  ] },
  { id: 'printerHead', title: 'Printer Head', options: ['L800', 'L1800', 'LH-500', 'R1390', 'TX800', 'XP600'] },
  { id: 'substrateThickness', title: 'Substrate Thickness Allows', options: [
    '0-0.059" (0-15mm)', '0-4.33" (0-110mm)', '0-5.51" (0-140mm)'
  ] },
  { id: 'consumablesType', title: 'Consumables', options: ['Ink', 'Film', 'Powder', 'Coatings', 'Other liquids'] },
  { id: 'machineCategory', title: 'Machine Category', options: ['K13 Lite White', 'K13 Lite Pink', 'P13 Series', 'F13 Pro Series', 'F13 Series', 'F8 Series'] },
  { id: 'consumablesCategory', title: 'Consumables Category', options: ['DTF Consumables', 'UV DTF Consumables', 'UV Consumables', 'DTG Consumables'] }
];

export default function Collections() {
  const { pathname } = useLocation();
  const categoryId = pathname.split('/').pop() || 'all';
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { currency, formatConverted } = useCurrency();
  
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
    consumablesType: true,
    machineCategory: true,
    consumablesCategory: true,
  });

  const currentPageStr = searchParams.get('page');
  const currentPage = currentPageStr ? parseInt(currentPageStr, 10) : 1;
  const setCurrentPage = (page: number) => {
    if (page === 1) searchParams.delete('page');
    else searchParams.set('page', page.toString());
    setSearchParams(searchParams, { replace: true });
  };
  const itemsPerPage = 21;

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
    return products.filter(p => p.filters?.collection === currentCategoryName);
  }, [currentCategoryName]);

  // The filtered products array applying all checkbox dimensions
  const filteredProducts = useMemo(() => {
    const unfiltered = categoryProducts.filter((product: any) => {
      let match = true;
      for (const group of filterGroups) {
        const activeValues = searchParams.getAll(group.id);
        if (activeValues.length > 0) {
          if (group.id === 'inStock') {
             if (activeValues.includes('In stock') && (!product.filters?.availability || product.filters.availability !== 'in-stock')) match = false;
          } else {
             // OR logic within section: Product must match AT LEAST ONE of the active values in this group
             const productVal = product.filters?.[group.id];
             if (!activeValues.includes(productVal)) match = false;
          }
        }
      }
      return match;
    });

    // Sort: All printers first (any printer collection), then maintain original order
    return [...unfiltered].sort((a: any, b: any) => {
      const printerCollections = ['DTF Printer', 'UV DTF Printer', 'UV Printer', 'DTG Printer'];
      const aIsPrinter = printerCollections.includes(a.filters?.collection);
      const bIsPrinter = printerCollections.includes(b.filters?.collection);
      
      if (aIsPrinter && !bIsPrinter) return -1;
      if (!aIsPrinter && bIsPrinter) return 1;
      
      const newIds = ['garment-jig-dtg', 'gift-card', 'dtf-powder', 'dtf-ink-250ml', 'uv-white-ink-500ml', 'uvdtf-white-ink-500ml', 'uvdtf-ink-500ml', 'nozzle-protection-liquid', 'dtf-cleaner-ink', 'cleaning-kits', 'uv-cleaner-ink', 'adhesion-promoter', 'uv-varnish-ink', 'uv-printer-ink-500ml', 'dtf-gilt-veil-transfer-film', 'dtf-chameleon-transfer-film', 'dtf-luminous-transfer-film', 'dtf-glitter-transfer-film', 'uvdtf-hot-stamping-sliver-film', 'dtf-pretreat-transfer-film', 'dtf-pretreat-roll-13inch', 'dtf-pretreat-sheet-a4', 'uvdtf-hot-stamping-gold-film', 'uvdtf-clear-ab-film', 'dtf-pretreat-roll-8inch', 'dtf-pretreat-sheet-a3', 'transfer-ab-film-uv-laminator', 'dtf-cooling-block', 'printhead-moisturizing-device', 'printer-ink-carriage-dtf', 'ink-sac-tubes-dtf', 'usb-dongle-rip', 'printer-motherboard', 'printer-cartridges-12pcs', 'white-ink-circulation-pump', 'original-print-head', 'ink-sac-tubes-uv', 'remote-expert-service', 'film-holder-13inch', 'oven-heating-plate', 'ink-waste-pump-oven', 'oven-temperature-controller', 'extended-warranty-service', 'power-socket-switch', 'printer-ink-tank', 'printer-ink-tank-agitator', 'printhead-capping-unit', 'oven-exhaust-gas-filter', 'printer-control-board', 'printer-power-board', 'printhead-driver-board', 'printer-startup-button-board', 'printer-switching-power-supply'];
      const aIsNew = newIds.includes(a.id);
      const bIsNew = newIds.includes(b.id);
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      return 0;
    });
  }, [categoryProducts, searchParams]);

  // Compute exact counts for all checkboxes based on categoryProducts (unfiltered by other checkboxes as standard, or intersected? 
  // User says "Numbers must be accurate". We'll compute total matches across root category.
  // Compute exact counts for all checkboxes based on categoryProducts
  // We compute cross-group AND logic, but ignore the current group to support OR logic counting
  const getFilterCount = (groupId: string, option: string) => {
    // 1. Filter by all OTHER active groups
    const crossGroupFiltered = categoryProducts.filter((product: any) => {
      let m = true;
      for (const g of filterGroups) {
        if (g.id === groupId) continue; // Ignore the group we are counting for
        const activeValues = searchParams.getAll(g.id);
        if (activeValues.length > 0) {
          if (g.id === 'inStock') {
            if (activeValues.includes('In stock') && (!product.filters?.availability || product.filters.availability !== 'in-stock')) m = false;
          } else {
            const productVal = product.filters?.[g.id];
            if (!activeValues.includes(productVal)) m = false;
          }
        }
      }
      return m;
    });

    // 2. Count matches within the remaining products
    return crossGroupFiltered.filter((product: any) => {
       if (groupId === 'inStock') {
         return option === 'In stock' ? product.filters?.availability === 'in-stock' : product.filters?.availability !== 'in-stock';
       }
       return product.filters?.[groupId] === option;
    }).length;
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startCount = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endCount = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 font-sans">
      <div className="flex items-center gap-2 text-sm mb-[30px] font-medium text-gray-500">
        <Link to="/" className="hover:text-black hover:underline transition-colors decoration-gray-400 underline-offset-4 underline">Home</Link>
        <span className="text-gray-300 font-light">/</span>
        <Link to="/collections/all" className="hover:text-black hover:underline transition-colors decoration-gray-400 underline-offset-4 underline">Shop</Link>
        <span className="text-gray-300 font-light">/</span>
        <span className="text-black font-normal underline decoration-black underline-offset-4">{currentCategoryName}</span>
      </div>

      <h1 className="text-[32px] font-bold text-black mb-[44px]">{currentCategoryName}</h1>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Mobile Filter Button and Drawer Layout */}
        <div className="lg:hidden w-full flex items-center justify-between mb-4">
           <Sheet>
             <SheetTrigger className="flex items-center gap-2 border border-black rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
               <SlidersHorizontal className="w-4 h-4" />
               Filter and sort
             </SheetTrigger>
             <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl flex flex-col bg-white overflow-hidden">
               <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
                 <SheetTitle>Filter and sort</SheetTitle>
               </SheetHeader>
               <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-0">
                    {/* Collection Mobile */}
                    <div className="border-b border-gray-100 py-3">
                      <button onClick={() => toggleSection('collection')} className="flex items-center justify-between w-full text-left font-bold text-[15px] text-black">
                        Collection
                        <ChevronDown className={`w-[18px] h-[18px] text-gray-400 transition-transform duration-200 ${openSections.collection ? 'rotate-180' : ''}`} />
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.collection ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="space-y-[14px] text-[15px] pb-2">
                          {Object.entries(categoryMap).filter(([k]) => k !== 'whats-new' && k !== 'extended-warranty').map(([k, v]) => {
                            const isChecked = currentCategoryName === v;
                            const targetUrl = isChecked || v === 'All'
                              ? `/collections/all${searchParams.toString() ? '?' + searchParams.toString() : ''}`
                              : `/collections/${k}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

                            return (
                              <Link 
                                key={k} 
                                to={targetUrl}
                                className="flex items-center gap-3 group cursor-pointer"
                              >
                                <div className={`relative flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${isChecked ? 'border-[#E85A24] bg-[#E85A24]' : 'border-gray-300 bg-white'}`}>
                                  {isChecked && (
                                    <svg className="w-[10px] h-[10px] text-white absolute" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-[14px] transition-colors flex-1 font-normal ${isChecked ? 'text-black' : 'text-[#333333] group-hover:text-black'}`}>
                                  {v}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Mobile Dynamic Filters Options */}
                    {filterGroups.map(group => {
                      // If the whole entire group has no matching products in the base category, hide it.
                      // We don't hide individual options that are 0 anymore so they can show the unavailable cursor.
                      const baseGroupCount = group.options.reduce((acc, opt) => acc + categoryProducts.filter((p:any) => {
                        const productVal = p.filters?.[group.id];
                        if (Array.isArray(productVal)) {
                          return productVal.includes(opt);
                        }
                        return productVal === opt;
                      }).length, 0);
                      if (baseGroupCount === 0 && group.id !== 'inStock') return null;

                      return (
                        <div key={group.id} className="border-b border-gray-100 py-4">
                          <button onClick={() => toggleSection(group.id)} className="flex items-center justify-between w-full text-left font-bold text-[15px] text-black">
                            {group.title}
                            <ChevronDown className={`w-[18px] h-[18px] text-gray-400 transition-transform duration-200 ${openSections[group.id] ? 'rotate-180' : ''}`} />
                          </button>
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[group.id] ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                          >
                            <div className="space-y-[14px] pb-2">
                              {group.options.map((option, idx) => {
                                const count = getFilterCount(group.id, option);
                                const isChecked = searchParams.getAll(group.id).includes(option);
                                
                                if (group.id === 'inStock') {
                                  return (
                                    <label key={idx} className={`flex items-center gap-3 ${count === 0 && !isChecked ? 'opacity-50' : 'cursor-pointer'} group`}>
                                      <Switch 
                                        checked={isChecked}
                                        onCheckedChange={() => handleCheckboxChange(group.id, option)}
                                        className="data-[state=checked]:bg-[#4294ff]" 
                                      />
                                      <span className="text-[15px] text-[#333333] transition-colors flex-1">
                                        {option}
                                      </span>
                                    </label>
                                  )
                                }

                                return (
                                  <label 
                                    key={idx} 
                                    onClick={(e) => { e.preventDefault(); handleCheckboxChange(group.id, option); }}
                                    className={`flex items-center gap-3 ${count === 0 && !isChecked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}
                                  >
                                    <div className={`relative flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${isChecked ? 'border-[#E85A24] bg-[#E85A24]' : 'border-gray-300 bg-white'}`}>
                                       {isChecked && (
                                         <svg className="w-[10px] h-[10px] text-white absolute" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                         </svg>
                                       )}
                                    </div>
                                    <span className="text-[14px] text-[#333333] transition-colors flex-1 font-normal">
                                      {option}
                                      <span className="ml-[6px] text-[#888888] text-[13px]">({count})</span>
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
               <div className="p-4 border-t flex gap-4 bg-white mt-auto">
                  <button onClick={clearFilters} className="flex-1 py-3 text-sm font-bold border border-gray-300 rounded hover:bg-gray-50 transition-colors">Clear</button>
                  <SheetClose asChild>
                    <button className="flex-1 py-3 text-sm font-bold bg-[#E85A24] hover:bg-[#d44e1e] text-white rounded transition-colors duration-200">Apply</button>
                  </SheetClose>
               </div>
             </SheetContent>
           </Sheet>
           <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
        </div>

        {/* Left Sidebar Filters Desktop */}
        <div className="hidden lg:block w-[240px] flex-shrink-0">
          
          {/* Only show Desktop "Filter" header, hide on lg and above */}
          <div className="hidden lg:flex items-center justify-between mb-2">
            <h2 className="text-[32px] font-bold text-black opacity-0">...</h2> {/* Spacer for alignment */}
          </div>

          <div className="space-y-0">
            {/* Collection Navigation Filters */}
            <div className="border-b border-gray-100 py-3">
              <button onClick={() => toggleSection('collection')} className="flex items-center justify-between w-full text-left font-bold text-[15px] text-black">
                Collection
                <ChevronDown className={`w-[18px] h-[18px] text-gray-400 transition-transform duration-200 ${openSections.collection ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections.collection ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
              >
                <div className="space-y-[14px] text-[15px] pb-2">
                  {Object.entries(categoryMap).filter(([k]) => k !== 'whats-new' && k !== 'extended-warranty').map(([k, v]) => {
                    const isChecked = currentCategoryName === v;
                    const targetUrl = isChecked || v === 'All'
                      ? `/collections/all${searchParams.toString() ? '?' + searchParams.toString() : ''}`
                      : `/collections/${k}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

                    return (
                      <Link 
                        key={k} 
                        to={targetUrl}
                        className="flex items-center gap-3 group cursor-pointer"
                      >
                        <div className={`relative flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${isChecked ? 'border-[#E85A24] bg-[#E85A24]' : 'border-gray-300 bg-white'}`}>
                          {isChecked && (
                            <svg className="w-[10px] h-[10px] text-white absolute" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-[14px] transition-colors flex-1 font-normal ${isChecked ? 'text-black' : 'text-[#333333] group-hover:text-black'}`}>
                          {v}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dynamic Filters Options */}
            {filterGroups.map(group => {
              // Hide group ONLY if no products in this entire base category support these filters
              // E.g. in "Consumables" category, we shouldn't show "Printer Head".
              const baseGroupCount = group.options.reduce((acc, opt) => acc + categoryProducts.filter((p:any) => p.filters?.[group.id] === opt).length, 0);
              if (baseGroupCount === 0 && group.id !== 'inStock') return null;

              return (
                <div key={group.id} className="border-b border-gray-100 py-4">
                  <button onClick={() => toggleSection(group.id)} className="flex items-center justify-between w-full text-left font-bold text-[15px] text-black">
                    {group.title}
                    <ChevronDown className={`w-[18px] h-[18px] text-gray-400 transition-transform duration-200 ${openSections[group.id] ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[group.id] ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="space-y-[14px] pb-2">
                      {group.options.map((option, idx) => {
                        const count = getFilterCount(group.id, option);
                        const isChecked = searchParams.getAll(group.id).includes(option);
                        
                        // Treat Availability explicitly as a toggle switch
                        if (group.id === 'inStock') {
                          return (
                            <label key={idx} className={`flex items-center gap-3 ${count === 0 && !isChecked ? 'opacity-50' : 'cursor-pointer'} group`}>
                              <Switch 
                                checked={isChecked}
                                onCheckedChange={() => handleCheckboxChange(group.id, option)}
                                className="data-[state=checked]:bg-[#4294ff]" 
                              />
                              <span className="text-[15px] text-[#333333] transition-colors flex-1">
                                {option}
                              </span>
                            </label>
                          )
                        }

                        return (
                          <label 
                            key={idx} 
                            onClick={(e) => { e.preventDefault(); handleCheckboxChange(group.id, option); }}
                            title={count === 0 && !isChecked ? 'This combination has zero results' : undefined}
                            className={`flex items-center gap-3 ${count === 0 && !isChecked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'}`}
                          >
                            {/* Custom exact square checkbox */}
                            <div className={`relative flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border ${isChecked ? 'border-[#E85A24] bg-[#E85A24]' : 'border-gray-300 bg-white'}`}>
                               {isChecked && (
                                 <svg className="w-[10px] h-[10px] text-white absolute" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                   <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                 </svg>
                               )}
                            </div>
                            <span className="text-[14px] text-[#333333] transition-colors flex-1 font-normal">
                              {option}
                              <span className="ml-[6px] text-[#888888] text-[13px]">({count})</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-8 pb-5">
             {searchParams.toString().length > 0 ? (
                // Only show clear if there are search filters applied
               <button onClick={clearFilters} className="text-sm text-gray-600 underline font-medium hover:text-black self-start">Clear all</button>
             ) : null}
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="flex-1 w-full m-0 min-w-0">
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
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 gap-y-12">
               {currentProducts.map((product) => {
                 // Calculate savings
                 let savingsAmount = null;
                 if (product.originalPrice && product.originalPrice !== '——') {
                   const originalPriceNum = convertPrice(product.originalPrice, currency.divisor);
                   const priceNum = convertPrice(product.price, currency.divisor);
                   if (originalPriceNum > priceNum) {
                     savingsAmount = 'Save ' + formatConverted(originalPriceNum - priceNum);
                   }
                 }

                 return (
                  <Link 
                    to={product.link && product.link !== '#' ? (product.link.startsWith('/') ? product.link : `/products/${product.link}`) : `/products/${product.id}`} 
                   key={product.id} 
                   className="group flex flex-col h-full bg-white relative"
                 >
                   <div className="relative mb-4 aspect-square bg-gray-50 flex items-center justify-center p-4 overflow-hidden rounded-sm">
                     <img 
                       src={product.image} 
                       alt={product.title}
                       loading="lazy"
                       onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/a1a1aa.png?text=Image'; }}
                       className={`max-w-full max-h-full object-contain transition-all duration-500 absolute inset-0 w-full h-full p-4 ${product.hoverImage ? 'group-hover:opacity-0 scale-100 group-hover:scale-105' : 'group-hover:scale-105'}`}
                     />
                      {product.hoverImage && (
                        <img
                          src={product.hoverImage}
                          alt={product.title}
                          loading="lazy"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/a1a1aa.png?text=Image'; }}
                          className="max-w-full max-h-full object-contain transition-all duration-500 absolute inset-0 w-full h-full p-4 opacity-0 group-hover:opacity-100 scale-105"
                        />
                      )}
                      {product.badge && (
                       <Badge className={`absolute top-2 left-2 px-2 py-1 text-[11px] font-bold rounded-sm border-none shadow-none text-white ${product.badge.includes('New') || product.badge.includes('NEW') || product.badge.includes('ARRIVAL') || product.badge.includes('Sale') ? 'bg-[#E85A24]' : 'bg-[#4294ff]'}`}>
                         {product.badge}
                       </Badge>
                     )}
                   </div>
                   <div className="px-1 flex-1 flex flex-col">
                     <h3 className="font-medium text-[15px] leading-snug mb-2 line-clamp-2 text-black group-hover:text-[#E85A24] transition-colors">
                       {product.title}
                     </h3>
                     <div className="flex flex-col gap-1 mt-auto">
                        <div className="flex items-end gap-2 flex-wrap">
                          <span className="text-[#E85A24] font-bold text-[16px]">{product.price ? formatConverted(convertPrice(product.price, currency.divisor)) : '-'}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 text-[13px] line-through pb-0.5">{formatConverted(convertPrice(product.originalPrice, currency.divisor))}</span>
                          )}
                          {savingsAmount && (
                            <span className="text-xs font-bold text-[#98db51] bg-[#f2faea] px-1.5 py-0.5 rounded-sm">{savingsAmount}</span>
                          )}
                        </div>
                        <button 
                          onClick={(e) => {
                            if (product.buttonText.toLowerCase() === 'add to cart') {
                              e.preventDefault();
                              e.stopPropagation();
                              if(product.price) {
                                addToCart({
                                  id: product.id,
                                  name: product.title,
                                  price: product.price,
                                  image: product.image,
                                  quantity: 1
                                });
                              }
                            }
                          }}
                          className={`mt-3 w-full py-2.5 px-4 text-sm font-bold text-center rounded transition-colors duration-200 ${
                          product.buttonStyle === 'outline' 
                            ? 'border border-[#E85A24] text-[#E85A24] hover:bg-[#E85A24] hover:text-white' 
                            : 'bg-[#E85A24] text-white hover:bg-[#d44e1e] border border-[#E85A24]'
                        }`}>
                          {product.buttonText}
                        </button>
                     </div>
                   </div>
                 </Link>
               )})}
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
