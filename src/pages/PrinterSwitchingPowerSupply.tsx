import ConsumableProduct from './ConsumableProduct';

export default function PrinterSwitchingPowerSupply() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-switching-power-supply',
        title: `Procolored Printer Switching Power Supply - L1800/R1390`,
        image: 'https://www.procolored.com/cdn/shop/files/img_v3_02i6_dc3e96d6-70d1-4cf0-accb-aa47b147256g_1220x_crop_center.png?v=1745911615',
        variants: [
          { key: 'standard', label: 'L1800/R1390 Power Supply', price: 99 },
        ],
        infoSections: [
          { label: 'Description', content: `Genuine Procolored switching power supply for L1800 and R1390 printhead-based printers. Provides stable, regulated power to protect your printer and ensure consistent performance.` },
          { label: 'Compatibility', content: `Fit For: Procolored printers using L1800 or R1390 printheads. Please confirm compatibility with your printer model before ordering.` },
          { label: 'Features', content: `Stable regulated output
Switching type for efficiency
Direct OEM replacement
Protects printer components` },
        ]
      }}
    />
  );
}
