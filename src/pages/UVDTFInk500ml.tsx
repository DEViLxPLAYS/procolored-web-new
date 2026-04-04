import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'uvdtf-ink-500ml',
  title: 'Procolored Ink for UV DTF Printer 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/TW_RM_500_V11Pro_V13_Pro_V23_Max_1_0ff91e1f-571e-4dea-8c90-ff00a1e5d52d_1220x_crop_center.png?v=1749625616',
  variants: [
    { key: 'five-color-set', label: 'Five-color 5×500ml', price: 189 },
    { key: 'cyan', label: 'Cyan', price: 59 },
    { key: 'magenta', label: 'Magenta', price: 59 },
    { key: 'yellow', label: 'Yellow', price: 59 },
    { key: 'black', label: 'Black', price: 59 },
    { key: 'white', label: 'White', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: UV cured ink (soft ink)' },
    { label: 'Description', content: 'Feature: quickly dried, less ink consumption, complete color gamuts, excellent color reproduction, high fluency, durable quality\nApplicable to: transferring graphics onto any rigid, soft, flat or curved surfaces, including phone case, ceramic, metal, plastic, wood, paper, glass, etc.' },
    { label: 'Compatibility', content: 'Compatible printer: VF13 Pro Printer' },
    { label: 'Technical specification', content: 'Volume: 500ml\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
  ],
  note: "Note: We've recently updated the ink packaging. The old or new packaging will be shipped out randomly.",
};

export default function UVDTFInk500ml() {
  return <ConsumableProduct data={data} />;
}
