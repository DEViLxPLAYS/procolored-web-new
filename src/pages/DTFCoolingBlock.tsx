import ConsumableProduct from './ConsumableProduct';

export default function DTFCoolingBlock() {
  return (
    <ConsumableProduct
      data={{
        id: 'dtf-cooling-block',
        title: `Procolored DTF Cooling Block`,
        image: 'https://www.procolored.com/cdn/shop/files/coolingblock_1_1220x_crop_center.png?v=1764921720',
        variants: [
          { key: 'standard', label: 'DTF Cooling Block', price: 49 },
        ],
        infoSections: [

        ]
      }}
    />
  );
}
