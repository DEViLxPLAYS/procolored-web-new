import ConsumableProduct from './ConsumableProduct';

export default function PrinterInkTankAgitator() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-ink-tank-agitator',
        title: `Procolored Printer Ink Tank with Agitator`,
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5932_1220x_crop_center.png?v=1745911705',
        variants: [
          { key: 'f8-f13-f13pro', label: 'F8-L800/F13/F13 Pro', price: 79 },
          { key: 'vf13-pro', label: 'VF13 Pro', price: 79 },
          { key: 'p13', label: 'P13', price: 79 },
        ],
        infoSections: [
          { label: 'Description', content: `Ink tank with built-in agitator motor to continuously mix white ink, preventing settling and ensuring consistent ink flow for optimal print quality.` },
          { label: 'Compatibility', content: `Available for: F8-L800/F13/F13 Pro, VF13 Pro, P13. Select your model before ordering.` },
          { label: 'Features', content: `Built-in agitator motor
Prevents white ink settling
Consistent ink flow
Reduces printhead clogs` },
        ]
      }}
    />
  );
}
