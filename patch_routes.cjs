const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');
const oldStr = 'path="procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" element={<VF13ProUVDTFProduct />} />';
const newStr = `path="procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" element={<VF13ProUVDTFProduct />} />
              {/* Redirects for old numeric product IDs */}
              <Route path="products/27" element={<Navigate to="/products/procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1" replace />} />
              <Route path="products/19" element={<Navigate to="/p13-dtf-printer" replace />} />`;
if (c.includes(oldStr)) {
  c = c.replace(oldStr, newStr);
  fs.writeFileSync('src/App.tsx', c);
  console.log('Redirect routes added!');
} else {
  console.log('String not found! Searching...');
  const idx = c.indexOf('procolored-vf13-pro-panda');
  console.log('Found at index:', idx);
  console.log('Context:', JSON.stringify(c.substring(idx, idx + 200)));
}
