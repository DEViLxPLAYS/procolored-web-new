import ConsumableProduct from './ConsumableProduct';

export default function OvenTemperatureController() {
  return (
    <ConsumableProduct
      data={{
        id: 'oven-temperature-controller',
        title: `Procolored Oven Temperature Controller - Fit For Procolored Oven`,
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5913_1220x_crop_center.png?v=1745911839',
        variants: [
          { key: 'standard', label: 'Temperature Controller', price: 59 },
        ],
        infoSections: [
          { label: 'Description', content: `Precision replacement temperature controller for Procolored DTF ovens. Ensures accurate temperature regulation for consistent powder curing quality.` },
          { label: 'Compatibility', content: `Fit For: Procolored Oven models. Please verify your oven model before ordering.` },
          { label: 'Features', content: `Precise digital temperature control
Easy-to-read display
Reliable performance
Direct OEM replacement` },
        ]
      }}
    />
  );
}
