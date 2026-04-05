import ConsumableProduct from './ConsumableProduct';

export default function PrinterCartridges12PCS() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-cartridges-12pcs',
        title: `Procolored Printer Cartridges(12PCS)`,
        image: 'https://www.procolored.com/cdn/shop/files/TB1_1220x_crop_center.png?v=1743061842',
        variants: [
          { key: 'f8', label: 'F8', price: 39 },
          { key: 'f13', label: 'F13', price: 39 },
          { key: 'f13-pro', label: 'F13 Pro', price: 39 },
          { key: 'p13', label: 'P13', price: 39 },
          { key: 'k13-lite', label: 'K13 Lite', price: 39 },
          { key: 'vf13-pro', label: 'VF13 Pro', price: 39 },
          { key: 'v4', label: 'V4', price: 39 },
          { key: 'v6', label: 'V6', price: 39 },
          { key: 'v11', label: 'V11', price: 39 },
          { key: 'v11-pro', label: 'V11 Pro', price: 39 },
          { key: 't8', label: 'T8', price: 39 },
          { key: 't11-pro', label: 'T11 Pro', price: 39 },
        ],
        infoSections: [
          { label: 'Ink Cartridge', content: `Designed for Procolored printers, it can also be referred to as ink damper. As a replaceable component, it is designed to be easily installed and removed, allowing users to replace it when the ink runs out.` },
          { label: 'Replacement Tutorial', content: `It is necessary to check whether the ink cartridges are damaged or aging, and whether there is air leakage when using them. If the above situations occur, you should consider replacing the ink cartridges.` },
        ]
      }}
    />
  );
}
