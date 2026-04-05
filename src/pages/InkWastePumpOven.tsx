import ConsumableProduct from './ConsumableProduct';

export default function InkWastePumpOven() {
  return (
    <ConsumableProduct
      data={{
        id: 'ink-waste-pump-oven',
        title: `Procolored White Ink Circulation Pump/ Ink Waste Pump - Fit For Procolored Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5903_2d7a0aa9-1e23-4386-897a-7ca6fe4b74cf_1220x_crop_center.png?v=1745911809',
        variants: [
          { key: 'standard', label: 'Standard Pump', price: 79 },
        ],
        infoSections: [
          { label: 'Description', content: `Genuine Procolored replacement ink circulation pump. Keeps white ink properly mixed and circulated to prevent settling and clogging in your printer.` },
          { label: 'Compatibility', content: `Fit For: Compatible Procolored printer models. Please check compatibility with your specific model before ordering.` },
          { label: 'Features', content: `Prevents white ink settling
Reduces printhead clogging
Maintains consistent ink flow
Direct replacement part` },
        ]
      }}
    />
  );
}
