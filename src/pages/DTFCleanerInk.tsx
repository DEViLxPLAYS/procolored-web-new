import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'dtf-cleaner-ink',
  title: 'Procolored Ink Cleaner (DTF) DTF Cleaner Ink 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/DTF_Cleaner_Ink_4_1220x_crop_center.png?v=1755764998',
  variants: [
    { key: 'dtf-cleaner-500ml', label: 'DTF Cleaner Ink 500ml', price: 69 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: Cleaner Ink' },
    { label: 'Description', content: 'Main components: alcohol, ionic water, Nano active agent, solvent, penetrating agent\nFunction:\n1. Can be used to clean ink-polluted parts of inkjet printers, keeping printer clean and tidy.\n2. Can heighten printing efficiency by improving ink fluency and prolong printer longevity.\n3. This cleaner is environmental and non-corrosive, harmless to both print heads and circuitry.' },
    { label: 'Compatibility', content: 'Apply to all DTF printers, including F8, F13, F13 Pro, P13, K8, K13.' },
    { label: 'Technical specification', content: 'Attention: Not recommended to do injective cleaning to print head. This cleaner is only used for ink residue cleaning on printer.\nStorage: Keep in a cool, dry and well-ventilated place with room temperature 5–25°C, away from fire, heat or direct sunlight.\nShelf life: 1 year. Do not use if it\'s expired.' },
  ],
};

export default function DTFCleanerInk() {
  return <ConsumableProduct data={data} />;
}
