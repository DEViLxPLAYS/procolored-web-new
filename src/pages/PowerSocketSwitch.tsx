import ConsumableProduct from './ConsumableProduct';

export default function PowerSocketSwitch() {
  return (
    <ConsumableProduct
      data={{
        id: 'power-socket-switch',
        title: `Procolored Power Socket with Switch - Fit For Procolored Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5896_1220x_crop_center.png?v=1745911901',
        variants: [
          { key: 'standard', label: 'Power Socket with Switch', price: 39 },
        ],
        infoSections: [
          { label: 'Description', content: `OEM replacement power socket with integrated on/off switch for Procolored printers. Direct plug-in fit for a safe, reliable power connection.` },
          { label: 'Compatibility', content: `Fit For: Compatible Procolored printer models. Please verify before ordering.` },
          { label: 'Features', content: `Integrated on/off switch
Direct replacement fit
Safe and reliable power delivery
Durable construction` },
        ]
      }}
    />
  );
}
