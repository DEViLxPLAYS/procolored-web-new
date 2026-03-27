// ─── F13 Pro Product Page — All Data ───────────────────────────────────────

export const STATIC_GALLERY = [
  'https://www.procolored.com/cdn/shop/files/ProcoloredF13ProPandaDTFPrinter13A3DualXP600_4_d8d7ed01-6f5b-4443-a06b-d83c6189339e_1220x_crop_center.png?v=1773743412',
  'https://www.procolored.com/cdn/shop/files/ProcoloredF13ProPandaDTFPrinter13A3DualXP600_3_c6cf14eb-0b07-4fe9-a1e6-ab1362148d99_1220x_crop_center.png?v=1773743412',
  'https://www.procolored.com/cdn/shop/files/ProcoloredF13ProPandaDTFPrinter13A3DualXP600_5_8a9254cf-ad8b-48ea-9392-7c7b6fcb3d36_1220x_crop_center.png?v=1773743412',
  'https://www.procolored.com/cdn/shop/files/F13_Pro_A3_01_1220x_crop_center.jpg?v=1773742870',
];

export interface Variant {
  id: string;
  name: string;
  sale: number;
  original: number;
  saving: number;
  badge: string;
  badgeClass: string;
  img: string;
}

export const VARIANTS: Variant[] = [
  { id: 'f13pro', name: 'F13 Pro', sale: 4799, original: 5199, saving: 400, badge: 'F13 Pro Spring Sale', badgeClass: 'bg-orange-500', img: 'https://www.procolored.com/cdn/shop/files/1_51f5ec44-cce2-4464-a9ca-4ac0786e79ec_1220x_crop_center.jpg?v=1773742870' },
  { id: 'f13pro-oven', name: 'F13 Pro+Oven', sale: 5199, original: 5699, saving: 500, badge: '⭐ Recommended', badgeClass: 'bg-yellow-500', img: 'https://www.procolored.com/cdn/shop/files/2_84b225f2-17e1-4a54-ae70-99b9d6fc31e3_1220x_crop_center.jpg?v=1773742871' },
  { id: 'f13pro-oven-heat', name: 'F13 Pro+Oven+Heat Press', sale: 5399, original: 6049, saving: 650, badge: '🏆 Startup First Choice', badgeClass: 'bg-green-600', img: 'https://www.procolored.com/cdn/shop/files/3_e2abdf88-0e5e-4ea2-a1e9-0ba27ed7481b_1220x_crop_center.jpg?v=1773742870' },
  { id: 'f13pro-smokeless', name: 'F13 Pro+Smokeless Oven', sale: 5699, original: 6199, saving: 500, badge: '🔥 Best Seller', badgeClass: 'bg-orange-600', img: 'https://www.procolored.com/cdn/shop/files/4_3aebd596-738b-4e01-85ca-4d0992279502_1220x_crop_center.jpg?v=1773742871' },
  { id: 'f13pro-smokeless-heat', name: 'F13 Pro+Smokeless Oven+Heat Press', sale: 5899, original: 6499, saving: 600, badge: 'F13 Pro Spring Sale', badgeClass: 'bg-orange-500', img: 'https://www.procolored.com/cdn/shop/files/5_f34e58a9-454a-4f85-b9d1-84416f3f7cb3_1220x_crop_center.jpg?v=1773742870' },
  { id: 'f13pro-shaker', name: 'F13 Pro+Shaker', sale: 6399, original: 6899, saving: 500, badge: 'F13 Pro Spring Sale', badgeClass: 'bg-orange-500', img: 'https://www.procolored.com/cdn/shop/files/6_fc3cfef8-24d7-4726-a449-bc38e64f7058_1220x_crop_center.jpg?v=1773742870' },
  { id: 'f13pro-shaker-heat', name: 'F13 Pro+Shaker+Heat Press', sale: 6599, original: 7249, saving: 650, badge: '🎯 Best Combination', badgeClass: 'bg-red-600', img: 'https://www.procolored.com/cdn/shop/files/7_3a38569b-ecc1-4ce5-88d8-1c9cc42b1b51_1220x_crop_center.jpg?v=1773742871' },
];

export const MGMT_VIDEOS = [
  { title: 'White Ink Circulation', src: 'https://www.procolored.com/cdn/shop/videos/c/vp/21069efdc54e4f86a0c916a01802e191/21069efdc54e4f86a0c916a01802e191.m3u8?v=0', desc: 'The newly designed system combines stirring, circulation, and filtration for improved performance. This upgrade ensures better ink flow, reduces the risk of printhead clogging, and extends the lifespan of your DTF printer.' },
  { title: 'Printhead Auto-Cleaning', src: 'https://www.procolored.com/cdn/shop/videos/c/vp/be84c3c65ae248cf89c4d2a601839963/be84c3c65ae248cf89c4d2a601839963.m3u8?v=0', desc: 'When left on, the printer automatically cleans the printhead every 10 hours. Keep the printer powered on for regular self-cleaning if going on vacation (approximately 1ml ink per day).' },
  { title: 'Printhead Safeguard System', src: 'https://www.procolored.com/cdn/shop/videos/c/vp/18b424806d55412c95bc271d6ab10779/18b424806d55412c95bc271d6ab10779.m3u8?v=0', desc: 'The photoelectric detection system effectively minimizes the risks caused by film unevenness, protecting the printheads from damage and ensuring consistent, high-quality output.' },
  { title: 'Dual Print Head Array for Faster Printing', src: 'https://www.procolored.com/cdn/shop/videos/c/vp/c7f01c3a90084a70be698e01d10a7a31/c7f01c3a90084a70be698e01d10a7a31.m3u8?v=0', desc: 'With the innovative dual print head array, two print heads work together simultaneously, cutting print time in half and dramatically increasing your daily output capacity.' },
];

export const RIP_VIDEOS = [
  { title: 'Procolored RIP - Professional Software', src: 'https://www.procolored.com/cdn/shop/videos/c/vp/1922fa01217244639525912bd13ef4ae/1922fa01217244639525912bd13ef4ae.m3u8?v=0', desc: 'A powerful PDF engine with versatile features, including advanced grid algorithms, image splitting, seamless copying, and visual dot rationing for unmatched precision in every print job.' },
  { title: 'Exceptional Color Reproduction', src: 'https://www.procolored.com/cdn/shop/videos/c/vp/ce18231a2a6040d08d4ea8c3bca2b870/ce18231a2a6040d08d4ea8c3bca2b870.m3u8?v=0', desc: 'Equipped with dual printheads, this printer simultaneously processes CCMMYK+WWWWWW ink channels, delivering vibrant, lifelike colors with exceptional accuracy across every transfer.' },
];

export const STEPS = [
  { num: 1, title: 'Adjust Design', time: '15–20 seconds', img: 'https://www.procolored.com/cdn/shop/files/rip_setting_arrangement.png?v=1766733785&width=375' },
  { num: 2, title: 'Print', time: '5–8 mins', img: 'https://www.procolored.com/cdn/shop/files/printing.png?v=1766661030&width=375' },
  { num: 3, title: 'Spread Powder', time: '5 seconds', img: 'https://www.procolored.com/cdn/shop/files/Rectangle_793.png?v=1766661017&width=375' },
  { num: 4, title: 'Oven Dry', time: '3 mins', img: 'https://www.procolored.com/cdn/shop/files/Rectangle_792.png?v=1766660999&width=375' },
  { num: 5, title: 'Heat Press', time: '20 seconds', img: 'https://www.procolored.com/cdn/shop/files/Rectangle_794.png?v=1766661020&width=375' },
  { num: 6, title: 'Peel Off Film', time: '3 seconds', img: 'https://www.procolored.com/cdn/shop/files/peeling.png?v=1766661032&width=375' },
];

export const CAROUSEL_ITEMS = [
  { item: 'Bag', retail: 32, cost: 8, profit: 24, img: 'https://www.procolored.com/cdn/shop/files/4_79cc71a4-eccf-4fd8-9ca5-cc4c217543df.jpg?v=1766544582&width=550' },
  { item: 'Jeans', retail: 45, cost: 12, profit: 33, img: 'https://www.procolored.com/cdn/shop/files/7_d6995f82-a3ef-4592-a24e-e53ffedbbfd5.jpg?v=1766544582&width=550' },
  { item: 'Baseball Cap', retail: 35, cost: 9, profit: 26, img: 'https://www.procolored.com/cdn/shop/files/3_519e2ba1-2203-4e52-b755-7fa9cdae5cca.jpg?v=1766544582&width=550' },
  { item: 'Apron', retail: 28, cost: 7, profit: 21, img: 'https://www.procolored.com/cdn/shop/files/6_76eb3d10-db4d-43f2-8f0f-2785d12fa0a7.jpg?v=1766544582&width=550' },
  { item: 'Throw Pillow', retail: 30, cost: 9, profit: 21, img: 'https://www.procolored.com/cdn/shop/files/2_1a9d7065-d0ab-45eb-8f00-609198e3b2fe.jpg?v=1766544582&width=550' },
  { item: 'Baby Clothes', retail: 28.90, cost: 7, profit: 21, img: 'https://www.procolored.com/cdn/shop/files/5_d975f986-38c5-4d37-99ec-4dc04c01f76f.jpg?v=1766544583&width=550' },
];

export const SPEC_ROWS: [string, string][] = [
  ['Model', 'F13 Pro'],
  ['Printhead Type', 'XP600 (Less Blockage)'],
  ['Printhead Config', 'Dual Array'],
  ['Film Feed', 'Roll-fed'],
  ['Film Cutter', 'Yes'],
  ['Prints per Hour', '13pcs (Letter/A4 Size)'],
  ['Print Width', '13" (330mm)'],
  ['Print Speed', 'Letter/A4: 4.5min'],
  ['Ink Consumption', 'Letter/A4: 3.75ml'],
  ['Product Weight', '86 lb (39 kg)'],
  ['Max Resolution', '720×1440 DPI (16 PASS)'],
  ['Color Config', 'CCMMYK+WWWWWW'],
  ['Software', 'Pro RIP'],
  ['System', 'Windows OS'],
  ['Product Size', '29.5"×17.7"×14.2" (75×45×36cm)'],
];

export const FAQS = [
  { q: 'What materials can I print on?', a: 'Cotton, polyester, blends, denim, canvas, and most fabric-based materials using DTF transfers.' },
  { q: 'What consumables does the F13 Pro require?', a: 'The F13 Pro uses DTF ink (CCMMYK+WWWWWW), adhesive powder, and PET roll film. All consumables are available directly from Procolored.' },
  { q: 'Why does the F13 Pro use dual print heads?', a: 'Dual XP600 print heads work in tandem to cut print time in half, roughly doubling your daily output compared to single-head models like the F13.' },
  { q: 'What is the maximum print size?', a: 'The F13 Pro supports a 13" (330mm) print width and unlimited roll length — perfect for A3/A4 apparel transfers.' },
  { q: 'Is the printer easy to maintain?', a: 'Yes. The F13 Pro auto-cleans the printhead every 10 hours when powered on. Basic daily maintenance takes only a few minutes.' },
  { q: 'Is this printer suitable for business use?', a: 'Absolutely. It can produce 13+ A4 prints per hour, and profit per 5-hour workday can reach $1,319.55 — ideal for small to medium apparel businesses.' },
  { q: 'What are the differences between F13 and F13 Pro?', a: 'The F13 Pro has dual XP600 print heads vs. the F13\'s single L1800 head, giving the Pro roughly 2× the speed (4.5 min vs. 11 min per 12"×16" print). The Pro also has a higher daily output and a more advanced Siphon Circulation system.' },
];

export const REVIEWS = [
  { name: 'Marcus T.', rating: 5, date: 'Jan 12, 2025', text: 'This machine is a game changer for my shirt business. The dual-head setup prints so fast I can barely keep up with demand. Colors are vivid and transfers are clean every single time.' },
  { name: 'Danielle R.', rating: 5, date: 'Feb 3, 2025', text: 'Setup was straightforward and the RIP software is surprisingly intuitive. I was printing professionally within a day. The auto-cleaning feature means I spend less time on maintenance and more time on orders.' },
  { name: 'Javier M.', rating: 5, date: 'Feb 18, 2025', text: 'Upgraded from a single-head DTF and the difference is night and day. The smokeless oven bundle is worth every penny — it keeps my shop comfortable. Already paying off the investment within the first month.' },
  { name: 'Leah K.', rating: 4, date: 'Mar 5, 2025', text: 'Excellent print quality on cotton and poly blends alike. The siphon circulation system keeps white ink flowing without any clogging. Slight learning curve to get the RIP settings dialed in, but support was super helpful.' },
  { name: 'Anthony B.', rating: 5, date: 'Mar 21, 2025', text: 'I ran 2,000+ transfers in my first month. The print consistency is remarkable — every transfer looks identical. Build quality feels premium and the panda design is honestly a cool touch for my studio.' },
  { name: 'Priya N.', rating: 5, date: 'Apr 2, 2025', text: 'Bought the bundle with the shaker and heat press — absolutely worth it. Having everything from one brand means it all works perfectly together. ROI was faster than I expected. Highly recommend to anyone serious about DTF.' },
];
