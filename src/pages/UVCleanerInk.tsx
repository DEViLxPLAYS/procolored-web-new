import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'uv-cleaner-ink',
  title: 'Procolored Ink Cleaner (UV) UV Cleaner Ink 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/1__1_5_1220x_crop_center.png?v=1755765545',
  variants: [
    { key: 'uv-cleaner-500ml', label: 'UV Cleaner Ink 500ml', price: 69 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: Cleaner Ink' },
    { label: 'Description', content: 'Main components: alcohol, ionic water, Nano active agent, solvent, penetrating agent\nFunction:\n1. Can be used to clean ink-polluted parts of inkjet printers, keeping printer clean and tidy.\n2. Prolong printer longevity by providing effective housing protection.\n3. This cleaner is environmental and non-corrosive, harmless to both print heads and circuitry.' },
    { label: 'Compatibility', content: 'Apply for any ink-polluted parts of UV and UVDTF printers.' },
    { label: 'Technical specification', content: 'Attention: Not recommended to do injective cleaning to print head. This cleaner is only used for ink residue cleaning on printer.\nStorage: Keep in a cool, dry and well-ventilated place with room temperature 5–25°C, away from fire, heat or direct sunlight.\nShelf life: 1 year. Do not use if it\'s expired.' },
  ],
};

export default function UVCleanerInk() {
  return <ConsumableProduct data={data} />;
}
