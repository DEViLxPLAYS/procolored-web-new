import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'adhesion-promoter',
  title: 'Procolored Ink Adhesion Promoter UV/DTG Pretreatment Liquid for Different Coatings 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/1__1_7_1220x_crop_center.png?v=1755765595',
  variants: [
    { key: 'acrylic-uv', label: 'For Acrylic Printing (UV)', price: 59 },
    { key: 'clothes-dtg', label: 'For Clothes Printing (DTG)', price: 59 },
    { key: 'metal-uv', label: 'For Metal Printing (UV)', price: 59 },
    { key: 'glass-uv', label: 'For Glass Printing (UV)', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: UV/DTG pretreatment liquid' },
    { label: 'Description', content: 'Function: Different printed surfaces like metal, glass, textile or plastic exhibit different level of adhesion with inks. This liquid can be used on printed surface to mitigate such adhesion differences, reinforcing the bonding and at the same time providing protection.\n4 types available:\n1) For UV printing on acrylic\n2) For UV printing on metal\n3) For UV printing on glass\n4) For DTG printing on clothes' },
    { label: 'Compatibility', content: 'For All UV/DTG Printers.' },
    { label: 'Technical specification', content: 'Main components: resin and hardener\nVolume: 500ml\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
  ],
};

export default function AdhesionPromoter() {
  return <ConsumableProduct data={data} />;
}
