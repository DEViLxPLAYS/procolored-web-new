const fs = require('fs');

const productsData = [
  {
    id: 'dtf-gilt-veil-transfer-film',
    component: 'DTFGiltVeilTransferFilm',
    route: 'dtf-gilt-veil-transfer-film',
    title: 'Procolored DTF Gilt Veil Transfer Roll Film 11.8 Inch x 328 FT——fit for A3 DTF Printer',
    price: 189,
    image: 'https://www.procolored.com/cdn/shop/files/3__1_13_1220x_crop_center.png?v=1755765192',
    category: 'DTF Consumables',
    outlined: 'Covered with gold glittering coating, presenting a shimmering effect on the finished printings',
    desc: 'Applicable to: textile fabric, clothes, decor textile with even surface\nFeature: covered with gold glittering coating, presenting a shimmering effect on the finished printings; strong ink absorption, anti-powder adhesion , easy separation',
    compat: 'Compatible printer: Apply to DTF printers of A3 Printing size, including F13, F13 Pro, P13, K13 printers.',
    tech: 'Substrate: PET with gold glitter coating\nThickness: 0.1mm\nFilm type: single-sided cold tear\nSize: 11.8 Inch x 328 FT (30cm*100m)\nHeat transfer temperature/time: 165-175℃, 15-20"\nShelf life: 18 months\nStorage: Keep in a dry place and away from direct sunlight'
  },
  {
    id: 'dtf-chameleon-transfer-film',
    component: 'DTFChameleonTransferFilm',
    route: 'dtf-chameleon-transfer-film',
    title: 'Procolored DTF Chameleon Transfer Roll Film 11.8 Inch x 328 FT——fit for A3 DTF Printer',
    price: 169,
    image: 'https://www.procolored.com/cdn/shop/files/4__1_10_1220x_crop_center.png?v=1755765214',
    category: 'DTF Consumables',
    outlined: 'Covered with chameleon coating, presenting printings with brighter and silky colors, as well as impressive glossiness',
    desc: 'Applicable to: textile fabric, clothes, decor textile with even surface\nFeature: covered with chameleon coating, presenting printings with brighter and silky colors, as well as impressive glossiness; good hand feel; strong ink absorption, anti-powder adhesion , easy separation',
    compat: 'Compatible printer: Apply to DTF printers of A3 printing size, including F13, F13 Pro, P13, K13 printers.',
    tech: 'Substrate: PET with chameleon coating\nThickness: 0.1mm\nFilm type: single-sided cold tear\nSize: 11.8 Inch x 328 FT (30cm*100m)\nHeat transfer temperature/time: 165-175℃, 15-20"\nShelf life: 18 months\nStorage: Keep in a dry place and away from direct sunlight'
  },
  {
    id: 'dtf-luminous-transfer-film',
    component: 'DTFLuminousTransferFilm',
    route: 'dtf-luminous-transfer-film',
    title: 'Procolored DTF Luminous Transfer Roll Film 11.8 Inch x 328 FT——fit for A3 DTF Printer',
    price: 199,
    image: 'https://www.procolored.com/cdn/shop/files/4__1_9_1220x_crop_center.png?v=1755765237',
    category: 'DTF Consumables',
    outlined: 'Covered with luminous glittering coating, presenting a shimmering effect on the finished printings',
    desc: 'Applicable to: textile fabric, clothes, decor textile with even surface\nFeature: covered with luminous glittering coating, presenting a shimmering effect on the finished printings; strong ink absorption, anti-powder adhesion , easy separation',
    compat: 'Compatible printer: Apply to DTF Printers of A3 printing size, including F13, F13 Pro, P13, K13 printers.',
    tech: 'Substrate: PET with luminous glitter coating\nThickness: 0.1mm\nFilm type: single-sided cold tear\nSize: 11.8 Inch x 328 FT (30cm*100m)\nHeat transfer temperature/time: 165-175℃, 15-20"\nShelf life: 18 months\nStorage: Keep in a dry place and away from direct sunlight'
  },
  {
    id: 'dtf-glitter-transfer-film',
    component: 'DTFGlitterTransferFilm',
    route: 'dtf-glitter-transfer-film',
    title: 'Procolored DTF Glitter Transfer Roll Film 11.8 Inch x 328 FT——fit for A3 DTF Printer',
    price: 169,
    image: 'https://www.procolored.com/cdn/shop/files/4__1_8_1220x_crop_center.png?v=1745910718',
    category: 'DTF Consumables',
    outlined: 'Covered with silver glittering coating, presenting a shimmering effect on the finished printings',
    desc: 'Applicable to: textile fabric, clothes, decor textile with even surface\nFeature: covered with silver glittering coating, presenting a shimmering effect on the finished printings; strong ink absorption, anti-powder adhesion , easy separation',
    compat: 'Compatible printer: Apply to DTF printers of A3 printing size, including F13, F13 Pro, P13, K13 printers.',
    tech: 'Substrate: PET with glitter coating\nThickness: 0.1mm\nFilm type: single-sided cold tear\nSize: 11.8 Inch x 328 FT (30cm*100m)\nHeat transfer temperature/time: 165-175℃, 15-20"\nShelf life: 18 months\nStorage: Keep in a dry place and away from direct sunlight'
  },
  {
    id: 'uvdtf-hot-stamping-sliver-film',
    component: 'UVDTFHotStampingSliverFilm',
    route: 'uvdtf-hot-stamping-sliver-film',
    title: 'Procolored UV DTF Transfer Hot Stamping Sliver Film——fit for A3 UV DTF Printer',
    price: 229,
    image: 'https://www.procolored.com/cdn/shop/files/Consumables-26_1220x_crop_center.png?v=1755766000',
    category: 'UV DTF Consumables',
    outlined: 'Product name: Silver AB film for UV DTF',
    desc: 'Applicable to: smooth and adhesion-supportive surface\nFeature: presenting silvery effect; proper thickness and hardness, self-adhesive, durable, anti-ultraviolet/high temperature/water/abrasion, easy separation/operation/application, outstanding color reproduction, high-quality 3D effect',
    compat: 'Compatible printer: Compatible with UVDTF printers of A3 printing size, including VF13 Pro printer.',
    tech: 'Substrate: PET with silver coating\nFilm type: A film as printing film; B film as liner film\nSize: glued A film - 31cm*50m (available glued film 30cm); B film - 31cm*50m\nThickness: 0.1mm\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight'
  },
  {
    id: 'dtf-pretreat-transfer-film',
    component: 'DTFPreTreatTransferFilm',
    route: 'dtf-pretreat-transfer-film',
    title: 'Procolored DTF PreTreat Transfer Roll Film 13 Inch x 328 FT——fit for A3 DTF Printer',
    price: 169,
    image: 'https://www.procolored.com/cdn/shop/files/DTF_PreTreat_Transfer_Roll_Film_1220x_crop_center.jpg?v=1765965179',
    category: 'DTF Consumables',
    outlined: 'Premium 13 inch PET film for DTF printing without pretreatment.',
    desc: 'Applicable to: textile fabric, clothes, decor textile with even surface\nFeature: Pre-treat film ensures simple printing without requiring pre-treatment on fabric.',
    compat: 'Compatible printer: Apply to DTF printers of A3/13-inch printing size.',
    tech: 'Substrate: PET\nThickness: 0.1mm\nSize: 13 Inch x 328 FT\nShelf life: 18 months\nStorage: Keep in a dry place and away from direct sunlight'
  }
];

// Re-Generate Component Files with Correct interface and correct import
productsData.forEach(p => {
  const content = `import ConsumableProduct from './ConsumableProduct';

export default function ${p.component}() {
  return (
    <ConsumableProduct
      data={{
        id: '${p.id}',
        title: \`${p.title}\`,
        price: ${p.price},
        image: '${p.image}',
        variants: [
          { key: 'standard', label: 'Standard Roll', price: ${p.price} },
        ],
        infoSections: [
          { label: 'Outlined', content: \`${p.outlined.replace(/`/g, '\\`')}\` },
          { label: 'Description', content: \`${p.desc.replace(/`/g, '\\`')}\` },
          { label: 'Compatibility', content: \`${p.compat.replace(/`/g, '\\`')}\` },
          { label: 'Technical Specification', content: \`${p.tech.replace(/`/g, '\\`')}\` }
        ]
      }}
    />
  );
}
`;
  fs.writeFileSync(`src/pages/${p.component}.tsx`, content, 'utf8');
  console.log(`Rewritten ${p.component}`);
});
