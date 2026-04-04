import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'cleaning-kits',
  title: 'Cleaning Kits',
  image: 'https://www.procolored.com/cdn/shop/files/cleaningkits12.11-1_1220x_crop_center.png?v=1765441472',
  variants: [
    { key: 'cleaning-kits', label: 'Cleaning Kit Set', price: 49 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'This cleaning kit encompasses: lint-free cloth, lint-free swab, syringe, sponge pad, waste ink bottle.' },
    { label: 'Description', content: 'Function: For print head cleaning, can effectively reduce print head clogging and buildups, heightening printing reproduction and resolution; protect print head from drying, prolonging printer longevity; keep the printer clean.\nPackage includes:\n- Waste Ink Bottle (1)\n- Foam Cleaning Swabs (10 count)\n- 20mL Syringe (6 count)\n- Syringe Tips (4)\n- Splatter Sponge for Printer (5 pieces)\n- Airlaid Paper (100 sheets)' },
    { label: 'Compatibility', content: 'Apply to all Procolored printers, including DTF printers, UV printers, UVDTF printer, and DTG printers.' },
    { label: 'Technical specification', content: 'Shelf life: 3–5 years.\nStorage: Keep in a cool, dry and well-ventilated place with room temperature 5–25°C, away from fire, heat or direct sunlight.' },
  ],
};

export default function CleaningKits() {
  return <ConsumableProduct data={data} />;
}
