const fs = require('fs');
let p = fs.readFileSync('src/data/products.ts', 'utf8');

const WHITE_INK_IMG = 'https://www.procolored.com/cdn/shop/files/White_0d2df479-3b68-4cab-abc3-8f352988d5d2_1220x_crop_center.png?v=1762339022';
const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f3f4f6/a1a1aa.png?text=Procolored...';
const PLACEHOLDER_HOVER = 'https://placehold.co/400x400/e5e7eb/9ca3af.png?text=Hover+';

// Products that should keep placeholders (IDs that had placeholders originally: 33, 34, 35, 96)
// We need to restore these specific products back to placeholder images
// Strategy: for every product that is NOT "white-ink-dtf" and has the White_0d2df479 image, revert to placeholder

// Split the file into product blocks and fix each one
const whiteInkImgEscaped = WHITE_INK_IMG.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Replace image fields that have the wrongly-set white ink URL, ONLY for non-white-ink-dtf products
// We do this by finding the product blocks and checking the id
const productEntries = p.split(/(?=\s*\{[\s\r\n]*"id":)/);

const fixed = productEntries.map(entry => {
  // If this is the white-ink-dtf product, leave it alone
  if (entry.includes('"id": "white-ink-dtf"')) return entry;
  
  // If this entry has the white ink image incorrectly applied, revert to placeholder
  if (entry.includes(WHITE_INK_IMG)) {
    entry = entry.replace(
      new RegExp('"image": "' + whiteInkImgEscaped + '"'),
      `"image": "${PLACEHOLDER_IMG}"`
    );
    entry = entry.replace(
      new RegExp('"hoverImage": "' + whiteInkImgEscaped + '"'),
      `"hoverImage": "${PLACEHOLDER_HOVER}"`
    );
  }
  return entry;
}).join('');

// Now make sure the white-ink-dtf product is in the array
if (!fixed.includes('"id": "white-ink-dtf"')) {
  const newProduct = `  ,
  {
    "id": "white-ink-dtf",
    "title": "Procolored White Ink for DTF Printing",
    "price": "$1.00 USD",
    "originalPrice": "$49.00 USD",
    "image": "https://www.procolored.com/cdn/shop/files/250ml_cdfd861c-62b6-4d98-9331-934d56bfe03e_1220x_crop_center.png?v=1762339048",
    "hoverImage": "https://www.procolored.com/cdn/shop/files/250ml_cdfd861c-62b6-4d98-9331-934d56bfe03e_1220x_crop_center.png?v=1762339048",
    "badge": "New",
    "buttonStyle": "default",
    "buttonText": "Add to cart",
    "link": "/products/white-ink-dtf",
    "filters": {
      "collection": "Consumables",
      "availability": "in-stock",
      "printType": null,
      "printSize": null,
      "resolution": null,
      "printSpeed": null,
      "printerHead": null,
      "substrateThickness": null,
      "consumablesType": "Ink",
      "machineCategory": null,
      "consumablesCategory": "DTF Consumables"
    }
  }
];`;
  const result = fixed.replace(/\];(\s*)$/, newProduct);
  fs.writeFileSync('src/data/products.ts', result, 'utf8');
  console.log('✅ Reverted placeholder images and added white-ink-dtf product.');
} else {
  fs.writeFileSync('src/data/products.ts', fixed, 'utf8');
  console.log('✅ Reverted placeholder images. white-ink-dtf already exists.');
}
