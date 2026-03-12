const fs = require('fs');
const path = require('path');

const sections = {
  dtf: [
    'Procolored F8 Panda DTF Printer 8.2" A4 L800',
    'Procolored F8 Panda DTF Printer 8.2" A4 L800 & Oven',
    'Procolored F13 Panda DTF Printer 13" A3 L1800 & Oven',
    'Procolored F13 Panda DTF Printer 13" A3 L1800 & Oven Premium',
    'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600',
    'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & Oven',
    'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & Oven Premium',
    'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & DTF Shaker Bundle',
    'Procolored F13 Pro Panda DTF Printer 13" A3 Dual XP600 & Bracket',
    'Procolored F13 Pro + Stand + Oven',
    'Procolored F13 Pro + Stand + Oven Premium',
    'Procolored F13 Pro + Stand + Shaker Oven',
    'Procolored K13 Lite DTF Printer 13" A3 White',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven White',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium White',
    'Procolored K13 Lite DTF Printer 13" A3 Pink',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven Pink',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium Pink',
    'Procolored K Series DTF Printer',
    'Procolored P13 DTF Printer 13" A3 XP600',
    'Procolored P13 DTF Printer 13" A3 XP600 & Oven',
    'Procolored P13 DTF Printer 13" A3 XP600 & Oven Premium',
    'Procolored P13 DTF Printer 13" A3 XP600 & DTF Shaker Bundle',
    'Procolored P13 DTF Printer 13" A3 XP600 MacOS',
    'Procolored P13 DTF Printer 13" A3 XP600 & Oven MacOS',
    'Procolored P13 DTF Printer 13" A3 XP600 & DTF Shaker Bundle MacOS'
  ],
  uv_dtf: [
    'Procolored VF13 Pro Panda UV DTF Printer 13" A3+ Dual XP600 2-in-1'
  ],
  uv: [
    'Procolored V4 UV Printer 4.7" A5 L800',
    'Procolored V6 Panda UV Printer 6.7" A4 L800',
    'Procolored V11 UV Printer 11.4" A3 R1390',
    'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800',
    'Procolored V11 Pro UV Printer 11.4" A3 Dual TX800 & Jigs'
  ],
  dtg: [
    'Procolored T8 Panda DTG Printer 8.2" A4 L800',
    'Procolored T11 Pro DTG Printer 11.8" A3 Dual TX800'
  ],
  equipment: [
    'Procolored Oven For DTF Printer Upgraded',
    'Procolored Smokeless Oven for DTF Printer Premium',
    'Procolored Powder Shaking And Drying All-In-One Machine For DTF Printer',
    'Procolored Oven Heating Plate',
    'Procolored Oven Temperature Controller',
    'Procolored Oven Exhaust Gas Filter',
    'Procolored DTF Cooling Block',
    'Printer Bracket For Procolored DTF Pro and Mini UV DTF Printers',
    'Procolored Jigs For UV Printer',
    'Procolored A3/A4 Garment Jig For DTG Printer',
    'Procolored Film Holder Fit For 13" DTF Roll Film',
    'Procolored Printer Protective Printhead Moisturizing Device'
  ],
  consumables: [
    'Procolored White Ink for DTF Printing',
    'Procolored White Ink for UV DTF Printing 500ml',
    'Procolored White Ink for UV Printing 500ml',
    'Procolored Ink for UV DTF Printer 500ml',
    'Procolored Ink for UV Printer 500ml',
    'Procolored Direct to Transfer Film Ink 250ml',
    'Procolored Direct to Transfer Film Ink 500ml',
    'Procolored Direct to Garment Textile Ink 500ml',
    'Procolored UV Varnish Ink 500ml',
    'Procolored Ink Cleaner DTF 500ml',
    'Procolored Ink Cleaner UV 500ml',
    'Procolored Ink Adhesion Promoter UV/DTG Pretreatment Liquid 500ml',
    'Procolored Nozzle Protection Moisturizing Liquid 500ml',
    'Procolored Direct to Transfer Film Powder',
    'Procolored DTF PreTreat Transfer Roll Film 8.2" x 328 FT',
    'Procolored DTF PreTreat Transfer Roll Film 13" x 328 FT',
    'Procolored DTF PreTreat Transfer Sheet Film A3',
    'Procolored DTF PreTreat Transfer Sheet Film A4',
    'Procolored DTF Gilt Veil Transfer Roll Film 11.8" x 328 FT',
    'Procolored DTF Chameleon Transfer Roll Film 11.8" x 328 FT',
    'Procolored DTF Luminous Transfer Roll Film 11.8" x 328 FT',
    'Procolored DTF Glitter Transfer Roll Film 11.8" x 328 FT',
    'Procolored UV DTF Transfer Hot Stamping Gold Film',
    'Procolored UV DTF Transfer Hot Stamping Silver Film',
    'Procolored UV DTF Transfer Clear AB Film',
    'Procolored Transfer AB Film UV Laminator',
    'Cleaning Kits'
  ],
  parts: [
    'Procolored Printer Control Board',
    'Procolored Printer Power Board',
    'Procolored Printhead Driver Board',
    'Procolored Printer Startup Button Board',
    'Procolored Printer Motherboard',
    'Procolored Printer Switching Power Supply L1800/R1390',
    'Procolored Original Print Head Brand New 100%',
    'Procolored Printhead Capping Unit',
    'Procolored White Ink Circulation Pump/Ink Waste Pump',
    'Procolored White Ink Circulation Pump/Ink Waste Pump variant', // to differentiate the two
    'Procolored Printer Ink Carriage for DTF Printer',
    'Procolored Printer Ink Tank',
    'Procolored Printer Ink Tank with Agitator',
    'Procolored Power Socket with Switch',
    'Procolored Printer Cartridges 12PCS',
    'Procolored Printer 6x120cm Ink Sac Tubes With Cartridges',
    'Procolored Printer 6x120cm Ink Sac Tubes With Cartridges variant',
    'USB Dongle for Procolored RIP V2.3'
  ],
  warranty: [
    'Procolored Extended Warranty Service',
    'Procolored Remote Expert Service',
    'Procolored Gift Card',
    'Procolored Selected Material 10% Discount Card',
    'Shipping Cost DHL Air Express'
  ],
  whats_new: [
    'Procolored K13 Lite DTF Printer 13" A3 White',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven White',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium White',
    'Procolored K13 Lite DTF Printer 13" A3 Pink',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven Pink',
    'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium Pink',
    'Procolored Smokeless Oven for DTF Printer Premium',
    'Procolored P13 DTF Printer 13" A3 XP600',
    'Procolored P13 DTF Printer 13" A3 XP600 & Oven',
    'Procolored P13 DTF Printer 13" A3 XP600 & Oven Premium',
    'Procolored P13 DTF Printer 13" A3 XP600 & DTF Shaker Bundle',
    'Procolored P13 DTF Printer 13" A3 XP600 MacOS',
    'Procolored P13 DTF Printer 13" A3 XP600 & Oven MacOS',
    'Procolored P13 DTF Printer 13" A3 XP600 & DTF Shaker Bundle MacOS',
    'Procolored K Series DTF Printer',
    'Procolored Oven Heating Plate',
    'Procolored White Ink Circulation Pump/Ink Waste Pump variant',
    'Procolored Oven Temperature Controller',
    'Procolored Power Socket with Switch',
    'Procolored Printer Ink Tank',
    'Procolored Printer Ink Tank with Agitator',
    'Procolored Printhead Capping Unit'
  ]
};

const mapSecName = {
  dtf: 'DTF Printer',
  uv_dtf: 'UV DTF Printer',
  uv: 'UV Printer',
  dtg: 'DTG Printer',
  equipment: 'Equipment',
  consumables: 'Consumables',
  parts: 'Parts & Accessory',
  warranty: 'Extended Warranty',
  whats_new: "What's New"
};

const products = [];

// Helper to keep track of assignments
const assignTarget = (targets, key, count) => {
  if (!targets[key]) targets[key] = count;
  if (targets[key] > 0) {
    targets[key]--;
    return key;
  }
  return null;
};

// Target counts
const targets = {
  printType: { 'DTF': 24, 'DTG': 3, 'UV': 10, 'UV DTF': 7 },
  printSize: { 
    '8.2" × 12.9"': 1, 'Width: 6.7"(170mm)': 2, 'Width: 8.2"(210mm)': 3,
    'Width: 8.3"(210mm)': 1, 'Width: 11.3"(287mm)': 3, 'Width: 11.7"(297mm)': 1,
    'Width: 11.8"(300mm)': 4, 'Width: 13"(330mm)': 25
  },
  resolution: { '1440*1400 DPI (8 Pass)': 10, '720*1440 DPI (16 Pass)': 15, '720*1440 DPI (16 PASS)': 2 },
  printSpeed: {
    'Letter/A4: 4.5min': 8, 'Letter/A4: 7min': 9, 'Letter/A4: 10min': 2,
    'Letter/A4: 12.5min': 6, 'Letter/A4: 14min': 1, 'Letter/A4: 23 min': 3,
    'Letter/A4: 6min': 1, 'Letter/A4: 7.5min': 1, 'Letter/A4: 8~9min': 2
  },
  printerHead: { 'L800': 5, 'L1800': 2, 'LH-500': 6, 'R1390': 1, 'TX800': 3, 'XP600': 16 },
  substrateThickness: { '0-0.059" (0-15mm)': 1, '0-4.33" (0-110mm)': 1, '0-5.51" (0-140mm)': 3 },
  consumables: { 'Ink': 9, 'Film': 12, 'Powder': 1, 'Coatings': 1, 'Other liquids': 3 },
  machineCategory: { 'K13 Lite White': 3, 'K13 Lite Pink': 3, 'P13 Series': 7, 'F13 Pro Series': 8, 'F13 Series': 2, 'F8 Series': 2 },
  consumablesCategory: { 'DTF Consumables': 14, 'UV DTF Consumables': 5, 'UV Consumables': 6, 'DTG Consumables': 1 }
};

const assignNext = (categoryMap) => {
  for (const [k, v] of Object.entries(categoryMap)) {
    if (v > 0) {
      categoryMap[k]--;
      return k;
    }
  }
  return null;
}

let idCounter = 1;

// Collect all unique names from main sections (1-7, 9)
const uniqueMap = new Map();
for (const [secKey, list] of Object.entries(sections)) {
  if (secKey === 'whats_new') continue; // handled next
  
  for (let name of list) {
    let displayName = name.replace(' variant', '');
    let isBestSeller = name.includes('Best Seller');
    let isNew = sections.whats_new.includes(name);

    // Clean up name for visual
    displayName = displayName.replace(' ⭐ Best Seller', '').replace(' 🆕', '').replace(' 🔜', '');

    let product = {
      id: String(idCounter++),
      name: displayName,
      sections: [mapSecName[secKey]],
      badge: isNew ? 'NEW ARRIVAL' : (isBestSeller ? 'BEST SELLER' : null),
      image: '/images/product-placeholder.jpg', // we will use placebolder or generic
      price: 'Rs.999,999.00 PKR',
      originalPrice: 'Rs.1,100,000.00 PKR',
      inStock: true
    };
    
    if (isNew) {
      product.sections.push("What's New");
    }

    // Assign generic fields based on target depletion
    product.printType = assignNext(targets.printType);
    product.printSize = assignNext(targets.printSize);
    product.resolution = assignNext(targets.resolution);
    product.printSpeed = assignNext(targets.printSpeed);
    product.printerHead = assignNext(targets.printerHead);
    product.substrateThickness = assignNext(targets.substrateThickness);
    product.consumables = assignNext(targets.consumables);
    product.machineCategory = assignNext(targets.machineCategory);
    product.consumablesCategory = assignNext(targets.consumablesCategory);

    // Cleanup undefined
    Object.keys(product).forEach(k => {
      if (product[k] === null) delete product[k];
    });

    uniqueMap.set(name, product);
    products.push(product);
  }
}

// Write the file structure
const content = `export interface Product {
  id: string;
  name: string;
  sections: string[];
  badge?: string | null;
  image: string;
  price: string;
  originalPrice?: string;
  inStock: boolean;
  printType?: string;
  printSize?: string;
  resolution?: string;
  printSpeed?: string;
  printerHead?: string;
  substrateThickness?: string;
  consumables?: string;
  machineCategory?: string;
  consumablesCategory?: string;
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'products.ts'), content);
console.log('Successfully generated 96 products with exact filter counts!');
