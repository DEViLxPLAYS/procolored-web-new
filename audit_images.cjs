const fs = require('fs');

// Check images in products.ts
const prodContent = fs.readFileSync('src/data/products.ts', 'utf8');
const lines = prodContent.split('\n');

// Extract all product id + image pairs
let currentId = '';
let currentImage = '';
const products = [];

lines.forEach((l, i) => {
  const idMatch = l.match(/"id":\s*"([^"]+)"/);
  const imgMatch = l.match(/"image":\s*"([^"]+)"/);
  if (idMatch) currentId = idMatch[1];
  if (imgMatch) {
    currentImage = imgMatch[1];
    if (currentId) {
      products.push({ id: currentId, image: currentImage, line: i + 1 });
    }
  }
});

console.log(`Total products in products.ts: ${products.length}`);
console.log('\nProducts with suspicious/placeholder images:');
const bad = products.filter(p => 
  p.image.includes('placeholder') || 
  p.image.includes('placehold') || 
  p.image === '' || 
  p.image.includes('example.com') ||
  p.image.includes('picsum') ||
  p.image.includes('lorempixel') ||
  !p.image.startsWith('http')
);
bad.forEach(p => console.log(` - ${p.id}: ${p.image.substring(0, 80)}`));

if (bad.length === 0) {
  console.log('No placeholder images found in products.ts - all have real URLs');
}

// Now check page files for what images they use
console.log('\n\nChecking page files for any placeholder images:');
const pages = fs.readdirSync('src/pages').filter(f => f.endsWith('.tsx') && f !== 'ConsumableProduct.tsx');
pages.forEach(page => {
  const content = fs.readFileSync(`src/pages/${page}`, 'utf8');
  if (content.includes('placehold') || content.includes('placeholder.com') || content.includes('via.placeholder')) {
    // Find the image line
    const imgLine = content.split('\n').find(l => l.includes('placehold'));
    console.log(` - ${page}: ${imgLine?.trim().substring(0, 100)}`);
  }
});
