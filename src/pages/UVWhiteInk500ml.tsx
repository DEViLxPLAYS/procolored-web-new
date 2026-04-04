import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'uv-white-ink-500ml',
  title: 'Procolored White Ink for UV Printing 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/MK_RM_500_V4_V6_V11_1_1220x_crop_center.png?v=1755765152',
  variants: [
    { key: 'soft-v4v6v11', label: 'Soft Ink — Fit for V4/V6/V11', price: 59 },
    { key: 'soft-v11pro', label: 'Soft Ink — Fit for V11 Pro/V13 Pro/V23 Max', price: 59 },
    { key: 'hard-v4v6v11', label: 'Hard Ink — Fit for V4/V6/V11', price: 59 },
    { key: 'hard-v11pro', label: 'Hard Ink — Fit for V11 Pro/V13 Pro/V23 Max', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: UV cured white ink (soft/hard ink)' },
    { label: 'Description', content: 'Feature: quickly dried, less ink consumption, complete color gamuts, excellent color reproduction, high fluency, durable quality\nApplicable to: flat or curved surfaces including phone case, ceramic, metal, plastic, wood, paper, glass, etc.' },
    { label: 'Compatibility', content: 'Compatible printer: V4, V6, V11, V11 Pro, V13 Pro, V23 Max Printers.' },
    { label: 'Technical specification', content: 'Volume: 500ml\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
  ],
  note: "Note: We've recently updated the ink packaging. The old or new packaging will be shipped out randomly.",
};

export default function UVWhiteInk500ml() {
  return <ConsumableProduct data={data} />;
}
