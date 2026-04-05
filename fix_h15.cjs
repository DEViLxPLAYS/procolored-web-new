const fs = require('fs');
let c = fs.readFileSync('src/data/products.ts', 'utf8');

// Fix H15 price
c = c.replace('"id": "h15-heat-press"', '__H15_MARKER__');
// Find the price after marker
const idx = c.indexOf('__H15_MARKER__');
if (idx > -1) {
    const snippet = c.slice(idx, idx + 300);
    const fixed = snippet.replace('$599.00 USD', '$329.00 USD').replace('$599.00 USD', '$329.00 USD');
    c = c.slice(0, idx) + fixed + c.slice(idx + snippet.length);
    c = c.replace('__H15_MARKER__', '"id": "h15-heat-press"');
    console.log('Fixed H15 price');
} else {
    console.log('H15 marker not found');
}

// Fix H15 image
c = c.replace(
    'H15_Auto_Heat_Press_1220x_crop_center.png?v=1743061512',
    'ProcoloredAutoHeatPressMachine_4_1220x_crop_center.png?v=1774683303'
);
console.log('Fixed H15 image');

// Fix H15 name
c = c.replace('"Procolored H15 Auto Heat Press for DTF Printing"', '"Procolored H15 Auto Heat Press Machine"');
console.log('Fixed H15 name');

// Fix all emoji badges
const before = (c.match(/🆕 New Arrival/g) || []).length;
c = c.split('🆕 New Arrival').join('NEW ARRIVAL');
const after = (c.match(/🆕 New Arrival/g) || []).length;
console.log(`Fixed ${before - after} emoji badges`);

fs.writeFileSync('src/data/products.ts', c, 'utf8');
console.log('Done!');
