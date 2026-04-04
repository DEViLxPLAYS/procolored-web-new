import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'uv-printer-ink-500ml',
  title: 'Procolored Ink for UV Printer 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/TW_RM_500_V11Pro_V13_Pro_V23_Max_1_0ff91e1f-571e-4dea-8c90-ff00a1e5d52d_1220x_crop_center.png?v=1749625616',
  variants: [
    { key: 'soft-v4-5set', label: 'Soft Ink V4/V6/V11 — Five-color 5×500ml', price: 189 },
    { key: 'soft-v4-cyan', label: 'Soft Ink V4/V6/V11 — Cyan', price: 59 },
    { key: 'soft-v4-magenta', label: 'Soft Ink V4/V6/V11 — Magenta', price: 59 },
    { key: 'soft-v4-yellow', label: 'Soft Ink V4/V6/V11 — Yellow', price: 59 },
    { key: 'soft-v4-black', label: 'Soft Ink V4/V6/V11 — Black', price: 59 },
    { key: 'soft-v4-white', label: 'Soft Ink V4/V6/V11 — White', price: 59 },
    { key: 'soft-v11pro-5set', label: 'Soft Ink V11 Pro/V13 Pro/V23 Max — Five-color 5×500ml', price: 189 },
    { key: 'soft-v11pro-cyan', label: 'Soft Ink V11 Pro/V13 Pro/V23 Max — Cyan', price: 59 },
    { key: 'soft-v11pro-magenta', label: 'Soft Ink V11 Pro/V13 Pro/V23 Max — Magenta', price: 59 },
    { key: 'soft-v11pro-yellow', label: 'Soft Ink V11 Pro/V13 Pro/V23 Max — Yellow', price: 59 },
    { key: 'soft-v11pro-black', label: 'Soft Ink V11 Pro/V13 Pro/V23 Max — Black', price: 59 },
    { key: 'soft-v11pro-white', label: 'Soft Ink V11 Pro/V13 Pro/V23 Max — White', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: UV cured ink (soft/hard ink)' },
    { label: 'Description', content: 'Feature: quickly dried, less ink consumption, complete color gamuts, excellent color reproduction, high fluency, durable quality\nApplicable to: flat or curved surfaces of which high drop is within 2mm, including phone case, ceramic, metal, plastic, wood, paper, glass, etc (extra jigs needed for curved objects)' },
    { label: 'Compatibility', content: 'Apply to UV printers, including V4, V6, V11, V11 Pro, V13 Pro, V23 Max Printer.' },
    { label: 'Technical specification', content: 'Volume: 500ml\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
  ],
  note: "Note: We've recently updated the ink packaging. The old or new packaging will be shipped out randomly.",
};

export default function UVPrinterInk500ml() {
  return <ConsumableProduct data={data} />;
}
