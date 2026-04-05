import ConsumableProduct from './ConsumableProduct';

export default function PrinterInkCarriageDTF() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-ink-carriage-dtf',
        title: `Procolored Printer Ink Carriage for DTF Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/12__1_7_1220x_crop_center.png?v=1743061802',
        variants: [
          { key: 'f8', label: 'F8', price: 99 },
          { key: 'f13-l1800', label: 'F13-L1800', price: 99 },
          { key: 'f13-r1390', label: 'F13-R1390', price: 99 },
          { key: 'p13-mac', label: 'P13-Mac', price: 99 },
          { key: 'k13-lite', label: 'K13 Lite', price: 99 },
          { key: 'v4', label: 'V4', price: 99 },
          { key: 'v6', label: 'V6', price: 99 },
          { key: 'v11', label: 'V11', price: 99 },
          { key: 't8', label: 'T8', price: 99 },
          { key: 'dx5', label: 'DX5', price: 99 },
        ],
        infoSections: [
          { label: 'Description', content: `The Procolored Printer Ink Carriage for DTF Printer provides reliable and consistent printing performance, offering superior print accuracy and freshness for high-end construction and years of reliable use, delivering professional results.` },
        ]
      }}
    />
  );
}
