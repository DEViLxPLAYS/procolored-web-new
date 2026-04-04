import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'uvdtf-white-ink-500ml',
  title: 'Procolored White Ink for UV DTF Printing 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/UVDTF_White_500_1220x_crop_center.png?v=1755765040',
  variants: [
    { key: 'uvdtf-white-500ml', label: 'White Ink 500ml', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: UV DTF white ink' },
    { label: 'Description', content: 'High-opacity white ink formulated for UV DTF printing. Provides excellent base coverage and vibrant color layering on stickers, decals, and hard surface transfers.' },
    { label: 'Compatibility', content: 'Compatible with Procolored UV DTF printers.' },
    { label: 'Technical specification', content: 'Volume: 500ml\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
  ],
  note: "Note: We've recently updated the ink packaging. The old or new packaging will be shipped out randomly.",
};

export default function UVDTFWhiteInk500ml() {
  return <ConsumableProduct data={data} />;
}
