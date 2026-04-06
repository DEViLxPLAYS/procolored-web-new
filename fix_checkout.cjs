const fs = require('fs');
let c = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');
c = c.replace(/const discountAmount = discountApplied \? cartSubtotal \* 0\.05 : 0;\n\s*const shippingCost = 0;\n\s*const total = cartSubtotal - discountAmount \+ shippingCost;/g, '');
c = c.replace(/const \[clientSecret, setClientSecret\] = useState<string \| null>\(null\);/, 'const [clientSecret, setClientSecret] = useState<string | null>(null);\n  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;\n  const shippingCost = 0;\n  const total = cartSubtotal - discountAmount + shippingCost;');
fs.writeFileSync('src/pages/Checkout.tsx', c);
console.log('Fixed checkout');
