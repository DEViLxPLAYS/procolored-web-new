import ConsumableProduct from './ConsumableProduct';

export default function PrinterInkTank() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-ink-tank',
        title: `Procolored Printer Ink Tank`,
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5958_1220x_crop_center.png?v=1745911740',
        variants: [
          { key: 'f13-f13pro', label: 'F13/F13 Pro', price: 49 },
          { key: 'f8-l800', label: 'F8-L800', price: 49 },
          { key: 'vf13-pro', label: 'VF13 Pro', price: 49 },
          { key: 'p13', label: 'P13', price: 49 },
          { key: 'k13-lite', label: 'K13 Lite', price: 49 },
        ],
        infoSections: [
          { label: 'Description', content: `Genuine Procolored replacement ink tank. Keeps ink supply consistent and prevents air intake to protect your printhead.` },
          { label: 'Compatibility', content: `Available for: F13/F13 Pro, F8-L800, VF13 Pro, P13, K13 Lite. Select your model before ordering.` },
          { label: 'Features', content: `Prevents air intake
Consistent ink supply
Direct OEM replacement
Easy to install` },
        ]
      }}
    />
  );
}
