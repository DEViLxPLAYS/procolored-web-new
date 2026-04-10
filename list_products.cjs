const fs = require('fs');
const c = fs.readFileSync('src/data/products.ts', 'utf8');
// Find all title+image pairs
const titleRe = /"title":\s*"([^"]+)"/g;
const imageRe = /"image":\s*"([^"]+)"/g;
const titles = [...c.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);
const images = [...c.matchAll(/"image":\s*"([^"]+)"/g)].map(m => m[1]);
const hoverImages = [...c.matchAll(/"hoverImage":\s*"([^"]+)"/g)].map(m => m[1]);

titles.slice(0, 25).forEach((t, i) => {
  console.log(`[${i}] ${t.substring(0, 50)}`);
  console.log(`    img: ${(images[i] || '').substring(40, 100)}`);
  console.log(`    hover: ${(hoverImages[i] || '').substring(40, 100)}`);
});
