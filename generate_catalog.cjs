const fs = require('fs');
const path = require('path');

// Raw data arrays from prompt
const productsData = [
  // DTF Printer
  { id: 1, name: 'Procolored K13 Lite DTF Printer 13" A3 - White', sale: 'Rs.569,300.00', original: 'Rs.854,000.00', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 2, name: 'Procolored K13 Lite DTF Printer 13" A3 & Oven - White', sale: 'Rs.711,600.00', original: 'Rs.1,024,600.00', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 3, name: 'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium - White', sale: 'Rs.797,100.00', original: 'Rs.1,138,800.00', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 4, name: 'Procolored K13 Lite DTF Printer 13" A3 - Pink', sale: 'Rs.569,300.00', original: 'Rs.854,000.00', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 5, name: 'Procolored K13 Lite DTF Printer 13" A3 & Oven - Pink', sale: 'Rs.711,600.00', original: 'Rs.1,024,600.00', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 6, name: 'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium - Pink', sale: 'Rs.797,100.00', original: 'Rs.1,138,800.00', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 7, name: 'Procolored F8 Panda DTF Printer 8.2" A4 L800', sale: 'Rs.540,800.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 8, name: 'Procolored F8 Panda DTF Printer 8.2" A4 L800 & Oven', sale: 'Rs.683,200.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 9, name: 'Procolored F13 Panda DTF Printer 13" A3 L1800 & Oven', sale: 'Rs.854,000.00', original: 'Rs.996,400.00', badge: '⭐ Best Seller — Fan Appreciation Sale (Rs.142,400.00)', button: 'Add to cart' },
  { id: 10, name: 'Procolored F13 Panda DTF Printer 13" A3 L1800 & Oven Premium', sale: 'Rs.996,400.00', original: 'Rs.1,138,800.00', badge: '⭐ Best Seller — Fan Appreciation Sale (Rs.142,400.00)', button: 'Add to cart' },
  { id: 11, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600', sale: 'Rs.1,366,500.00', original: 'Rs.1,480,500.00', badge: 'F13 Pro Spring Sale (Rs.114,000.00)', button: 'Add to cart' },
  { id: 12, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & Oven', sale: 'Rs.1,480,500.00', original: 'Rs.1,622,900.00', badge: 'F13 Pro Spring Sale (Rs.142,400.00)', button: 'Add to cart' },
  { id: 13, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & DTF Shaker Bundle', sale: 'Rs.1,822,200.00', original: 'Rs.1,964,600.00', badge: 'F13 Pro Spring Sale (Rs.142,400.00)', button: 'Add to cart' },
  { id: 14, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & Oven Premium', sale: 'Rs.1,622,800.00', original: 'Rs.1,765,200.00', badge: 'F13 Pro Spring Sale (Rs.142,400.00)', button: 'Add to cart' },
  { id: 15, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & Bracket', sale: 'Rs.1,480,400.00', original: 'Rs.1,594,400.00', badge: 'F13 Pro Spring Sale (Rs.114,000.00)', button: 'Add to cart' },
  { id: 16, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 + Stand + Oven', sale: 'Rs.1,594,400.00', original: 'Rs.1,736,800.00', badge: 'F13 Pro Spring Sale (Rs.142,400.00)', button: 'Add to cart' },
  { id: 17, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 + Stand + Shaker Oven', sale: 'Rs.1,879,100.00', original: 'Rs.2,078,500.00', badge: 'F13 Pro Spring Sale (Rs.199,400.00)', button: 'Add to cart' },
  { id: 18, name: 'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 + Stand + Oven Premium', sale: 'Rs.1,708,200.00', original: 'Rs.1,879,100.00', badge: 'F13 Pro Spring Sale (Rs.170,900.00)', button: 'Add to cart' },
  { id: 19, name: 'Procolored P13 DTF Printer 13" A3 XP600', sale: 'Rs.1,024,800.00', original: 'Rs.1,224,200.00', badge: '🆕 New Arrival — P13 Exclusive Deal (Rs.199,400.00)', button: 'Add to cart' },
  { id: 20, name: 'Procolored P13 DTF Printer 13" A3 XP600 & Oven', sale: 'Rs.1,138,700.00', original: 'Rs.1,309,600.00', badge: '🆕 New Arrival — P13 Exclusive Deal (Rs.170,900.00)', button: 'Add to cart' },
  { id: 21, name: 'Procolored P13 DTF Printer 13" A3 XP600 & DTF Shaker Bundle', sale: 'Rs.1,480,500.00', original: 'Rs.1,622,900.00', badge: '🆕 New Arrival — P13 Exclusive Deal (Rs.142,400.00)', button: 'Add to cart' },
  { id: 22, name: 'Procolored P13 DTF Printer 13" A3 XP600 & Oven Premium', sale: 'Rs.1,224,100.00', original: 'Rs.1,423,500.00', badge: '🆕 New Arrival — P13 Exclusive Deal (Rs.199,400.00)', button: 'Add to cart' },
  { id: 23, name: 'Procolored P13 DTF Printer 13" A3 XP600 (MacOS)', sale: 'Rs.1,224,200.00', original: '—', badge: '🆕 New Arrival 🔜 Coming Soon', button: 'Select Opts' },
  { id: 24, name: 'Procolored P13 DTF Printer 13" A3 XP600 & Oven (MacOS)', sale: 'Rs.1,309,600.00', original: '—', badge: '🆕 New Arrival 🔜 Coming Soon', button: 'Select Opts' },
  { id: 25, name: 'Procolored P13 DTF Printer 13" A3 XP600 & DTF Shaker Bundle (MacOS)', sale: 'Rs.1,708,300.00', original: '—', badge: '🆕 New Arrival 🔜 Coming Soon', button: 'Select Opts' },
  { id: 26, name: 'Procolored K Series DTF Printer', sale: 'Rs.569,300.00', original: '—', badge: '🆕 New Arrival 🔜 Coming Soon', button: 'Select Opts' },
  
  // UV DTF Printer
  { id: 27, name: 'Procolored VF13 Pro Panda UV DTF Printer 13" A3+ Dual XP600 2-in-1', sale: 'Rs.1,964,600.00', original: '—', badge: '', button: 'Select Opts' },
  
  // UV Printer
  { id: 28, name: 'Procolored V4 UV Printer 4.7" A5 L800', sale: 'Rs.654,700.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 29, name: 'Procolored V6 Panda UV Printer 6.7" A4 L800', sale: 'Rs.1,024,900.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 30, name: 'Procolored V11 UV Printer 11.4" A3 R1390', sale: 'Rs.1,480,500.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 31, name: 'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800', sale: 'Rs.1,708,300.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 32, name: 'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800 & Jigs', sale: 'Rs.1,907,600.00', original: 'Rs.1,947,500.00', badge: 'Save Rs.39,900', button: 'Add to cart' },

  // DTG Printer
  { id: 33, name: 'Procolored T8 Panda DTG Printer 8.2" A4 L800', sale: 'Rs.1,024,900.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 34, name: 'Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800', sale: 'Rs.1,708,300.00', original: '—', badge: '', button: 'Select Opts' },

  // Equipment
  { id: 35, name: 'Procolored Smokeless Oven for DTF Printer - Premium', sale: 'Rs.284,500.00', original: '—', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 36, name: 'Procolored Oven For DTF Printer - Upgraded', sale: 'Rs.170,600.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 37, name: 'Procolored Powder Shaking And Drying All-In-One Machine For DTF Printer', sale: 'Rs.512,300.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 38, name: 'Procolored Oven Heating Plate - Fit For Procolored Oven', sale: 'Rs.56,700.00', original: '—', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 39, name: 'Procolored Oven Temperature Controller - Fit For Procolored Oven', sale: 'Rs.16,900.00', original: '—', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 40, name: 'Procolored Oven Exhaust Gas Filter', sale: 'Rs.14,000.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 41, name: 'Procolored DTF Cooling Block', sale: 'Rs.14,000.00', original: '——', badge: '', button: 'Add to cart' },
  { id: 42, name: 'Printer Bracket For Procolored DTF Pro and Mini UV DTF Printers', sale: 'Rs.142,100.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 43, name: 'Procolored Jigs For UV Printer', sale: 'Rs.227,600.00', original: 'Rs.241,800.00', badge: 'Save Rs.14,200', button: 'Select Opts' },
  { id: 44, name: 'Procolored A3/A4 Garment Jig For DTG Printer', sale: 'Rs.36,800.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 45, name: 'Procolored Film Holder Fit For 13" DTF Roll Film', sale: 'Rs.33,900.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 46, name: 'Procolored Printer Protective For Printhead Moisturizing Device', sale: 'Rs.42,500.00', original: '——', badge: '', button: 'Select Opts' },

  // Consumables
  { id: 47, name: 'Procolored Direct to Transfer Film Ink 500ml', sale: 'Rs.65,300.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 48, name: 'Procolored Direct to Transfer Film Ink 250ml', sale: 'Rs.36,800.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 49, name: 'Procolored White Ink for DTF Printing', sale: 'Rs.14,000.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 50, name: 'Procolored Direct to Transfer Film Powder', sale: 'Rs.10,900.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 51, name: 'Procolored White Ink for UV Printing 500ml', sale: 'Rs.16,900.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 52, name: 'Procolored White Ink for UV DTF Printing 500ml', sale: 'Rs.16,900.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 53, name: 'Procolored Ink for UV DTF Printer 500ml', sale: 'Rs.53,900.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 54, name: 'Procolored Nozzle Protection Moisturizing Liquid/Printhead Cleaning Fluid 500ml', sale: 'Rs.16,900.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 55, name: 'Procolored Ink Cleaner (DTF) DTF Cleaner Ink 500ml', sale: 'Rs.19,700.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 56, name: 'Procolored Ink Adhesion Promoter UV/DTG Pretreatment Liquid 500ml', sale: 'Rs.16,900.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 57, name: 'Procolored Ink Cleaner (UV) UV Cleaner Ink 500ml', sale: 'Rs.19,700.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 58, name: 'Procolored UV Varnish Ink 500ml', sale: 'Rs.16,900.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 59, name: 'Procolored Ink for UV Printer 500ml', sale: 'Rs.53,900.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 60, name: 'Procolored Direct to Garment Textile Ink 500ml', sale: 'Rs.65,300.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 61, name: 'Procolored DTF Gilt Veil Transfer Roll Film 11.8 Inch x 328 FT', sale: 'Rs.53,900.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 62, name: 'Procolored DTF Chameleon Transfer Roll Film 11.8 Inch x 328 FT', sale: 'Rs.48,200.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 63, name: 'Procolored DTF Luminous Transfer Roll Film 11.8 Inch x 328 FT', sale: 'Rs.56,700.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 64, name: 'Procolored DTF Glitter Transfer Roll Film 11.8 Inch x 328 FT', sale: 'Rs.48,200.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 65, name: 'Procolored UV DTF Transfer Hot Stamping Silver Film', sale: 'Rs.65,300.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 66, name: 'Procolored DTF PreTreat Transfer Roll Film 13 Inch x 328 FT', sale: 'Rs.48,200.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 67, name: 'Procolored DTF PreTreat Transfer Sheet Film - fit for A4 DTF Printer', sale: 'Rs.19,700.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 68, name: 'Procolored UV DTF Transfer Hot Stamping Gold Film', sale: 'Rs.56,700.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 69, name: 'Procolored UV DTF Transfer Clear AB Film', sale: 'Rs.45,300.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 70, name: 'Procolored Transfer AB Film - Only for UV Laminator', sale: 'Rs.56,700.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 71, name: 'Procolored DTF PreTreat Transfer Roll Film 8.2 Inch x 328 FT', sale: 'Rs.25,400.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 72, name: 'Procolored DTF PreTreat Transfer Sheet Film - fit for A3 DTF Printer', sale: 'Rs.25,400.00', original: '—', badge: '', button: 'Add to cart' },
  { id: 73, name: 'Cleaning Kits', sale: 'Rs.14,000.00', original: '—', badge: '', button: 'Add to cart' },

  // Parts & Accessory
  { id: 74, name: 'Procolored Printer Control Board', sale: 'Rs.51,000.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 75, name: 'Procolored Printer Power Board', sale: 'Rs.28,200.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 76, name: 'Procolored Printhead Driver Board', sale: 'Rs.170,600.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 77, name: 'Procolored Printer Startup Button Board', sale: 'Rs.28,200.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 78, name: 'Procolored Printer Motherboard', sale: 'Rs.42,500.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 79, name: 'Procolored Printer Switching Power Supply - L1800/R1390', sale: 'Rs.28,200.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 80, name: 'Procolored Original Print Head Brand New 100%', sale: 'Rs.91,200.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 81, name: 'Procolored Printhead Capping Unit - Fit For Procolored Printer', sale: 'Rs.14,000.00', original: '—', badge: '🆕 New Arrival', button: 'Select Opts' },
  { id: 82, name: 'Procolored White Ink Circulation Pump/Ink Waste Pump - Fit For Procolored Printer', sale: 'Rs.22,500.00', original: '—', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 83, name: 'Procolored White Ink Circulation Pump/Ink Waste Pump', sale: 'Rs.19,700.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 84, name: 'Procolored Printer Ink Carriage for DTF Printer', sale: 'Rs.28,200.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 85, name: 'Procolored Printer Ink Tank', sale: 'Rs.14,000.00', original: '—', badge: '🆕 New Arrival', button: 'Select Opts' },
  { id: 86, name: 'Procolored Printer Ink Tank with Agitator', sale: 'Rs.22,500.00', original: '—', badge: '🆕 New Arrival', button: 'Select Opts' },
  { id: 87, name: 'Procolored Power Socket with Switch - Fit For Procolored Printer', sale: 'Rs.11,200.00', original: '—', badge: '🆕 New Arrival', button: 'Add to cart' },
  { id: 88, name: 'Procolored Printer Cartridges (12PCS)', sale: 'Rs.11,200.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 89, name: 'Procolored Printer 6x120cm Ink Sac Tubes With Cartridges - Fit For DTF Printer', sale: 'Rs.25,400.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 90, name: 'Procolored Printer 6x120cm Ink Sac Tubes With Cartridges', sale: 'Rs.19,700.00', original: '—', badge: '', button: 'Select Opts' },
  { id: 91, name: 'USB Dongle for Procolored RIP V2.3 or later', sale: 'Rs.39,600.00', original: '—', badge: '', button: 'Select Opts' },

  // Extended Warranty & Services
  { id: 92, name: 'Procolored Remote Expert Service', sale: 'Rs.14,300.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 93, name: 'Procolored Extended Warranty Service', sale: 'Rs.199,100.00', original: '——', badge: '', button: 'Select Opts' },
  { id: 94, name: 'Procolored Gift Card', sale: 'Rs.28,475.24', original: '——', badge: '', button: 'Select Opts' },
  { id: 95, name: 'Procolored Selected Material 10% Discount Card', sale: 'Rs.14,300.00', original: 'Rs.22,800.00', badge: '🔜 Coming Soon', button: 'Select Opts' },
  { id: 96, name: 'SHIPPING COST DHL Air Express', sale: 'Rs.10,000.00', original: '——', badge: '', button: 'Add to cart' },
];

function determineFilters(p) {
  let f = {
    collection: null,
    availability: null,
    printType: null,
    printSize: null,
    resolution: null,
    printSpeed: null,
    printerHead: null,
    substrateThickness: null,
    consumablesType: null,
    machineCategory: null,
    consumablesCategory: null
  };

  // Determine availability
  if (p.badge && (p.badge.includes('Coming Soon') || p.badge.includes('🔜'))) {
    f.availability = 'out-of-stock';
  } else {
    f.availability = 'in-stock';
  }

  // Determine categories via rules
  // 1-26: DTF Printer
  if (p.id >= 1 && p.id <= 26) {
    f.collection = 'DTF Printer';
    f.printType = 'DTF';
    
    if (p.name.includes('F8')) {
      f.printSize = 'Width: 8.2"(210mm)';
      f.resolution = '1440*1400 DPI (8 Pass)';
      f.printSpeed = 'Letter/A4: 12.5min';
      f.printerHead = 'L800';
      f.machineCategory = 'F8 Series';
    } else if (p.name.includes('F13 Panda')) {
      f.printSize = 'Width: 13"(330mm)';
      f.resolution = '720*1440 DPI (16 Pass)';
      f.printSpeed = 'Letter/A4: 7min';
      f.printerHead = 'L1800';
      f.machineCategory = 'F13 Series';
    } else if (p.name.includes('F13 Pro')) {
      f.printSize = 'Width: 13"(330mm)';
      f.resolution = '720*1440 DPI (16 Pass)';
      f.printSpeed = 'Letter/A4: 4.5min';
      f.printerHead = 'XP600';
      f.machineCategory = 'F13 Pro Series';
    } else if (p.name.includes('K13 Lite')) {
      f.printSize = 'Width: 13"(330mm)';
      f.resolution = '720*1440 DPI (16 Pass)';
      f.printSpeed = 'Letter/A4: 4.5min';
      f.printerHead = 'LH-500';
      f.machineCategory = p.name.includes('Pink') ? 'K13 Lite Pink' : 'K13 Lite White';
    } else if (p.name.includes('P13')) {
      f.printSize = 'Width: 13"(330mm)';
      f.resolution = '720*1440 DPI (16 Pass)';
      f.printSpeed = 'Letter/A4: 4.5min';
      f.printerHead = 'XP600';
      f.machineCategory = 'P13 Series';
    } else if (p.name.includes('K Series')) {
      f.printSize = 'Width: 13"(330mm)';
      f.printerHead = 'LH-500';
      f.machineCategory = null; // No resolution/speed given in rules
    }
  }
  
  // 27: UV DTF Printer
  if (p.id === 27) {
    f.collection = 'UV DTF Printer';
    f.printType = 'UV DTF';
    f.printSize = 'Width: 13"(330mm)';
    f.printerHead = 'XP600';
    f.resolution = '720*1440 DPI (16 Pass)';
    f.printSpeed = 'Letter/A4: 4.5min';
  }

  // 28-32: UV Printer
  if (p.id >= 28 && p.id <= 32) {
    f.collection = 'UV Printer';
    f.printType = 'UV';
    if (p.name.includes('V4')) {
      f.printSize = 'Width: 6.7"(170mm)';
      f.printerHead = 'L800';
      f.resolution = '1440*1400 DPI (8 Pass)';
      f.printSpeed = 'Letter/A4: 23 min';
    } else if (p.name.includes('V6')) {
      f.printSize = 'Width: 6.7"(170mm)';
      f.printerHead = 'L800';
      f.resolution = '1440*1400 DPI (8 Pass)';
      f.printSpeed = 'Letter/A4: 14min';
    } else if (p.name.includes('V11 UV')) {
      f.printSize = 'Width: 11.3"(287mm)';
      f.printerHead = 'R1390';
      f.resolution = '1440*1400 DPI (8 Pass)';
      f.printSpeed = 'Letter/A4: 10min';
      f.substrateThickness = '0-5.51" (0-140mm)';
    } else if (p.name.includes('V11 Pro UV')) {
      f.printSize = 'Width: 11.3"(287mm)';
      f.printerHead = 'TX800';
      f.resolution = '720*1440 DPI (16 Pass)';
      f.printSpeed = 'Letter/A4: 4.5min';
      f.substrateThickness = '0-4.33" (0-110mm)';
    }
  }

  // 33-34: DTG Printer
  if (p.id >= 33 && p.id <= 34) {
    f.collection = 'DTG Printer';
    f.printType = 'DTG';
    if (p.name.includes('T8')) {
      f.printSize = 'Width: 8.2"(210mm)';
      f.printerHead = 'L800';
      f.resolution = '1440*1400 DPI (8 Pass)';
      f.printSpeed = 'Letter/A4: 12.5min';
    } else if (p.name.includes('T11 Pro')) {
      f.printSize = 'Width: 11.8"(300mm)';
      f.printerHead = 'TX800';
      f.resolution = '720*1440 DPI (16 Pass)';
      f.printSpeed = 'Letter/A4: 7min';
    }
  }

  // 35-46: Equipment
  if (p.id >= 35 && p.id <= 46) {
    f.collection = 'Equipment';
    f.availability = 'in-stock';
  }

  // 47-73: Consumables
  if (p.id >= 47 && p.id <= 73) {
    f.collection = 'Consumables';
    f.availability = 'in-stock';
    
    // Explicit mapping table from prompt
    const consMap = {
      47: { type: 'Ink', cat: 'DTF Consumables' }, // Direct to Transfer Film Ink 500ml
      48: { type: 'Ink', cat: 'DTF Consumables' }, // Direct to Transfer Film Ink 250ml
      49: { type: 'Ink', cat: 'DTF Consumables' }, // White Ink for DTF Printing
      50: { type: 'Powder', cat: 'DTF Consumables' }, // Direct to Transfer Film Powder
      51: { type: 'Ink', cat: 'UV Consumables' }, // White Ink for UV Printing 500ml
      52: { type: 'Ink', cat: 'UV DTF Consumables' }, // White Ink for UV DTF Printing 500ml
      53: { type: 'Ink', cat: 'UV DTF Consumables' }, // Ink for UV DTF Printer 500ml
      54: { type: 'Other liquids', cat: 'DTF Consumables' }, // Nozzle Protection Moisturizing Liquid 500ml
      55: { type: 'Other liquids', cat: 'DTF Consumables' }, // Ink Cleaner DTF 500ml
      56: { type: 'Coatings', cat: 'UV Consumables' }, // Ink Adhesion Promoter 500ml
      57: { type: 'Other liquids', cat: 'UV Consumables' }, // Ink Cleaner UV 500ml
      58: { type: 'Ink', cat: 'UV Consumables' }, // UV Varnish Ink 500ml
      59: { type: 'Ink', cat: 'UV Consumables' }, // Ink for UV Printer 500ml
      60: { type: 'Ink', cat: 'DTG Consumables' }, // Direct to Garment Textile Ink 500ml
      61: { type: 'Film', cat: 'DTF Consumables' }, // DTF Gilt Veil Transfer Roll Film
      62: { type: 'Film', cat: 'DTF Consumables' }, // DTF Chameleon Transfer Roll Film
      63: { type: 'Film', cat: 'DTF Consumables' }, // DTF Luminous Transfer Roll Film
      64: { type: 'Film', cat: 'DTF Consumables' }, // DTF Glitter Transfer Roll Film
      65: { type: 'Film', cat: 'UV DTF Consumables' }, // UV DTF Transfer Hot Stamping Silver Film
      66: { type: 'Film', cat: 'DTF Consumables' }, // DTF PreTreat Transfer Roll Film 13"
      67: { type: 'Film', cat: 'DTF Consumables' }, // DTF PreTreat Transfer Sheet Film A4
      68: { type: 'Film', cat: 'UV DTF Consumables' }, // UV DTF Transfer Hot Stamping Gold Film
      69: { type: 'Film', cat: 'UV DTF Consumables' }, // UV DTF Transfer Clear AB Film
      70: { type: 'Film', cat: 'UV Consumables' }, // Transfer AB Film UV Laminator
      71: { type: 'Film', cat: 'DTF Consumables' }, // DTF PreTreat Transfer Roll Film 8.2"
      72: { type: 'Film', cat: 'DTF Consumables' }, // DTF PreTreat Transfer Sheet Film A3
      73: { type: 'Other liquids', cat: 'DTF Consumables' }, // Cleaning Kits
    };

    if (consMap[p.id]) {
      f.consumablesType = consMap[p.id].type;
      f.consumablesCategory = consMap[p.id].cat;
    }
  }

  // 74-91: Parts & Accessory
  if (p.id >= 74 && p.id <= 91) {
    f.collection = 'Parts & Accessory';
    f.availability = 'in-stock';
  }

  // 92-96: Extended Warranty & Services
  if (p.id >= 92 && p.id <= 96) {
    f.collection = 'Extended Warranty';
    f.availability = 'in-stock'; // overridden if next logic catches it
    if (p.badge && (p.badge.includes('Coming Soon') || p.badge.includes('🔜'))) {
        f.availability = 'out-of-stock';
    }
  }

  return f;
}

const finalProducts = productsData.map(p => {
  const f = determineFilters(p);
  const cleanOriginal = p.original && p.original.replace(/—/g, '').trim() !== '' ? p.original : null;
  return {
    id: p.id.toString(),
    title: p.name,
    price: p.sale,
    originalPrice: cleanOriginal,
    image: 'https://placehold.co/400x400/f3f4f6/a1a1aa.png?text=' + encodeURIComponent(p.name.substring(0, 10)) + '...',
    hoverImage: 'https://placehold.co/400x400/e5e7eb/9ca3af.png?text=Hover+',
    badge: p.badge || null,
    buttonStyle: p.button === 'Select Opts' ? 'outline' : 'default',
    buttonText: p.button,
    link: '#',
    filters: f
  };
});

let fileContent = `export interface ProductFilter {
  collection: 'DTF Printer' | 'UV Printer' | 'UV DTF Printer' | 'DTG Printer' | 'Consumables' | 'Equipment' | 'Parts & Accessory' | 'Extended Warranty' | null;
  availability: 'in-stock' | 'out-of-stock' | null;
  printType: 'DTF' | 'DTG' | 'UV' | 'UV DTF' | null;
  printSize: 'Width: 8.2"(210mm)' | 'Width: 6.7"(170mm)' | 'Width: 11.3"(287mm)' | 'Width: 11.8"(300mm)' | 'Width: 13"(330mm)' | null;
  resolution: '1440*1400 DPI (8 Pass)' | '720*1440 DPI (16 Pass)' | null;
  printSpeed: 'Letter/A4: 4.5min' | 'Letter/A4: 7min' | 'Letter/A4: 10min' | 'Letter/A4: 12.5min' | 'Letter/A4: 14min' | 'Letter/A4: 23 min' | null;
  printerHead: 'L800' | 'L1800' | 'LH-500' | 'R1390' | 'TX800' | 'XP600' | null;
  substrateThickness: '0-0.059" (0-15mm)' | '0-4.33" (0-110mm)' | '0-5.51" (0-140mm)' | null;
  consumablesType: 'Ink' | 'Film' | 'Powder' | 'Coatings' | 'Other liquids' | null;
  machineCategory: 'K13 Lite White' | 'K13 Lite Pink' | 'P13 Series' | 'F13 Pro Series' | 'F13 Series' | 'F8 Series' | null;
  consumablesCategory: 'DTF Consumables' | 'UV DTF Consumables' | 'UV Consumables' | 'DTG Consumables' | null;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice: string | null;
  image: string;
  hoverImage?: string;
  badge: string | null;
  buttonStyle: 'default' | 'outline';
  buttonText: string;
  link: string;
  filters: ProductFilter;
}

export const products: Product[] = ${JSON.stringify(finalProducts, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src/data/products.ts'), fileContent, 'utf-8');
console.log('Successfully generated products.ts with 96 strict elements!');
