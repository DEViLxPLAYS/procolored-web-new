const fs = require('fs');
let lines = fs.readFileSync('src/pages/Checkout.tsx', 'utf8').split('\n');
let res = [];
for (let i = 0; i < lines.length; i++) {
  let l = lines[i];
  if (l.includes('const discountAmount = ') && l.includes('discountApplied')) continue;
  if (l.includes('const shippingCost = 0;')) continue;
  if (l.includes('const total = cartSubtotal - discountAmount + shippingCost;')) continue;
  res.push(l);
  if (l.includes('const [clientSecret, setClientSecret]')) {
    res.push('  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;');
    res.push('  const shippingCost = 0;');
    res.push('  const total = cartSubtotal - discountAmount + shippingCost;');
  }
}
fs.writeFileSync('src/pages/Checkout.tsx', res.join('\n'));
console.log('Fixed exactly!');
