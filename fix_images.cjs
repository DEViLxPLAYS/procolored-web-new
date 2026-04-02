const fs = require('fs');
let p = fs.readFileSync('src/data/products.ts', 'utf8');

// Replace placehold.co images with a nice generic Procolored ink image
p = p.replace(/"https:\/\/placehold\.co\/[^"]+"/g, '"https://www.procolored.com/cdn/shop/files/White_0d2df479-3b68-4cab-abc3-8f352988d5d2_1220x_crop_center.png?v=1762339022"');

// Append the white-ink-dtf product to the end
if (!p.includes('white-ink-dtf')) {
  const newProduct = `
  , {
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
      "consumablesType": "Ink",
      "consumablesCategory": "DTF Consumables"
    }
  }
];`;
  p = p.replace(/];$/, newProduct);
}
fs.writeFileSync('src/data/products.ts', p, 'utf8');
console.log('Fixed products.ts');
