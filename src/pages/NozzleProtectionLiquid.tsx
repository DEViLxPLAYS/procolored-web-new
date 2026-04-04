import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'nozzle-protection-liquid',
  title: 'Procolored Nozzle Protection Moisturizing Liquid / Printhead Cleaning Fluid 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/Nozzle-1_1220x_crop_center.png?v=1762338002',
  variants: [
    { key: 'nozzle-500ml', label: 'Nozzle Protection Liquid 500ml', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: Nozzle Protection Liquid / Printhead Cleaning Fluid' },
    { label: 'Description', content: 'Main components: A kind of transparent green fluid extracted biologically, environment friendly without any solvent and poisonous materials. Non-corrosive and protective to nozzles.\nWhen to use:\n1. Apply to moisturize print head when the printer is not working, to prevent dried inks inside.\n2. When the printer is idle for 1–3 days (no need to disassemble the print head).\n3. When the printer is idle for a long time, disassemble and clean print head. Then put a lint-free cloth dipped with protection fluid on the print head.' },
    { label: 'Compatibility', content: 'Compatible with any print heads of Procolored printers, including DTF printers, UV printers, UVDTF printers, DTG printers.' },
    { label: 'Technical specification', content: 'Efficacy: Used for print head moisturizing and cleaning.\nShelf life: 12 months.\nStorage: Keep in a dry place and away from direct sunlight.' },
  ],
};

export default function NozzleProtectionLiquid() {
  return <ConsumableProduct data={data} />;
}
