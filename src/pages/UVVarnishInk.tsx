import ConsumableProduct from './ConsumableProduct';
import type { ConsumableProductData } from './ConsumableProduct';

const data: ConsumableProductData = {
  id: 'uv-varnish-ink',
  title: 'Procolored UV Varnish Ink 500ml',
  image: 'https://www.procolored.com/cdn/shop/files/UVVarnishink613_1220x_crop_center.png?v=1755765513',
  variants: [
    { key: 'uv-varnish-500ml', label: 'UV Varnish Ink 500ml', price: 59 },
  ],
  infoSections: [
    { label: 'Outlined', content: 'Product name: UV varnish ink (UV clear coating)' },
    { label: 'Description', content: 'Feature: anti-scratching, glossy, aesthetic, smooth looking\nFeature: outstanding viscosity/glossiness/smoothness, good hand feel, quickly cured' },
    { label: 'Compatibility', content: 'Compatible printer: VF13 Pro, V11 Pro printers.' },
    { label: 'Technical specification', content: 'Volume: 500ml\nOperating temperature: 50–55°C\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
  ],
};

export default function UVVarnishInk() {
  return <ConsumableProduct data={data} />;
}
