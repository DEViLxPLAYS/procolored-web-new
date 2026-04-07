const fs = require('fs');
let c = fs.readFileSync('src/data/products.ts', 'utf8');

const k13Entries = `,
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-white",
    "title": "Procolored K13 Lite DTF Printer 13\\" A3 - White",
    "price": "$2,867.00 USD",
    "originalPrice": "$4,101.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/K13_lite_white_1_9a953385-6db6-491d-84f6-45f45196871d_1220x_crop_center.jpg?v=1758869975",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/K13_lite_white_m_1220x_crop_center.jpg?v=1772447536",
    "badge": "Save $1,234",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/procolored-k13-lite-dtf-printer-13-a3-white",
    "filters": {
      "collection": "DTF Printer",
      "availability": "in-stock",
      "printType": "DTF",
      "printSize": "Width: 13\\"(330mm)",
      "resolution": "1440*1400 DPI (8 Pass)",
      "printSpeed": "Letter/A4: 8~9min",
      "printerHead": "LH-500",
      "substrateThickness": null,
      "consumablesType": null,
      "machineCategory": "K13 Lite White",
      "consumablesCategory": null
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-pink",
    "title": "Procolored K13 Lite DTF Printer 13\\" A3 - Pink",
    "price": "$2,867.00 USD",
    "originalPrice": "$4,101.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/K13_lite_Pink__1_1220x_crop_center.jpg?v=1758869972",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/K13_lite_pink_10_47d94674-2379-4e42-a679-2aed84d90f2d_1220x_crop_center.png?v=1767585184",
    "badge": "Save $1,234",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/procolored-k13-lite-dtf-printer-13-a3-pink",
    "filters": {
      "collection": "DTF Printer",
      "availability": "in-stock",
      "printType": "DTF",
      "printSize": "Width: 13\\"(330mm)",
      "resolution": "1440*1400 DPI (8 Pass)",
      "printSpeed": "Letter/A4: 8~9min",
      "printerHead": "LH-500",
      "substrateThickness": null,
      "consumablesType": null,
      "machineCategory": "K13 Lite Pink",
      "consumablesCategory": null
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-white",
    "title": "Procolored K13 Lite DTF Printer 13\\" A3 & Oven - White",
    "price": "$3,514.00 USD",
    "originalPrice": "$4,775.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/K13_lite_white_10.png?v=1772447536",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/K13_lite_white_11_1220x_crop_center.png?v=1772447536",
    "badge": "Bundle Deal",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/procolored-k13-lite-dtf-printer-13-a3-oven-white",
    "filters": {
      "collection": "DTF Printer",
      "availability": "in-stock",
      "printType": "DTF",
      "printSize": "Width: 13\\"(330mm)",
      "resolution": "1440*1400 DPI (8 Pass)",
      "printSpeed": "Letter/A4: 8~9min",
      "printerHead": "LH-500",
      "substrateThickness": null,
      "consumablesType": null,
      "machineCategory": "K13 Lite White",
      "consumablesCategory": null
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-pink",
    "title": "Procolored K13 Lite DTF Printer 13\\" A3 & Oven - Pink",
    "price": "$3,514.00 USD",
    "originalPrice": "$4,775.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/K13_lite_pink_10.png?v=1772447536",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/K13_lite_pink_11_1220x_crop_center.png?v=1772447536",
    "badge": "Bundle Deal",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/procolored-k13-lite-dtf-printer-13-a3-oven-pink",
    "filters": {
      "collection": "DTF Printer",
      "availability": "in-stock",
      "printType": "DTF",
      "printSize": "Width: 13\\"(330mm)",
      "resolution": "1440*1400 DPI (8 Pass)",
      "printSpeed": "Letter/A4: 8~9min",
      "printerHead": "LH-500",
      "substrateThickness": null,
      "consumablesType": null,
      "machineCategory": "K13 Lite Pink",
      "consumablesCategory": null
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-premium-white",
    "title": "Procolored K13 Lite DTF Printer 13\\" A3 & Oven Premium - White",
    "price": "$4,039.00 USD",
    "originalPrice": "$5,461.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/Procolored_DTF_printer_with_Smokeless_Oven_Bundle_10_1220x_crop_center.jpg?v=1772447536",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/K13_lite_white_12_1220x_crop_center.png?v=1772447536",
    "badge": "Premium Bundle",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-white",
    "filters": {
      "collection": "DTF Printer",
      "availability": "in-stock",
      "printType": "DTF",
      "printSize": "Width: 13\\"(330mm)",
      "resolution": "1440*1400 DPI (8 Pass)",
      "printSpeed": "Letter/A4: 8~9min",
      "printerHead": "LH-500",
      "substrateThickness": null,
      "consumablesType": null,
      "machineCategory": "K13 Lite White",
      "consumablesCategory": null
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink",
    "title": "Procolored K13 Lite DTF Printer 13\\" A3 & Oven Premium - Pink",
    "price": "$4,039.00 USD",
    "originalPrice": "$5,461.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/K13_lite_Pink__1_1220x_crop_center.jpg?v=1758869972",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/K13_lite_pink_12_1220x_crop_center.png?v=1772447536",
    "badge": "Premium Bundle",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink",
    "filters": {
      "collection": "DTF Printer",
      "availability": "in-stock",
      "printType": "DTF",
      "printSize": "Width: 13\\"(330mm)",
      "resolution": "1440*1400 DPI (8 Pass)",
      "printSpeed": "Letter/A4: 8~9min",
      "printerHead": "LH-500",
      "substrateThickness": null,
      "consumablesType": null,
      "machineCategory": "K13 Lite Pink",
      "consumablesCategory": null
    }
  }`;

// Find the first product entry closing and insert after it (after id:9 entry)
// We look for the closing of the FIRST item (id:"9")
const marker = '"link": "/f13",\r\n    "filters"';
const firstProduct = c.indexOf(marker);
if (firstProduct === -1) {
  console.error('Marker not found!');
  process.exit(1);
}

// Find end of that first object's closing brace
let braceDepth = 0;
let i = firstProduct;
let inString = false;
let escaped = false;
while (i < c.length) {
  const ch = c[i];
  if (escaped) { escaped = false; i++; continue; }
  if (ch === '\\') { escaped = true; i++; continue; }
  if (ch === '"') { inString = !inString; }
  if (!inString) {
    if (ch === '{') braceDepth++;
    if (ch === '}') {
      braceDepth--;
      if (braceDepth < 0) {
        // This is the closing brace of the top-level product object
        break;
      }
    }
  }
  i++;
}

// i points to the closing } of the first product
// Insert the k13 entries right after this }
const insertPos = i + 1;
const newContent = c.slice(0, insertPos) + k13Entries + c.slice(insertPos);
fs.writeFileSync('src/data/products.ts', newContent);
console.log('K13 Lite products added to collection at position', insertPos);
console.log('New file size:', newContent.length, 'bytes');
