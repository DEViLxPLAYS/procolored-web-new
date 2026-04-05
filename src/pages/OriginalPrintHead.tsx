import ConsumableProduct from './ConsumableProduct';

export default function OriginalPrintHead() {
  return (
    <ConsumableProduct
      data={{
        id: 'original-print-head',
        title: `Procolored Original Print Head Brand New 100%——fit for Procolored Printer`,
        image: 'https://www.procolored.com/cdn/shop/products/R330_L800_1220x_crop_center.png?v=1744785902',
        variants: [
          { key: 'l800', label: 'L800', price: 320 },
          { key: 'tx800', label: 'TX 800', price: 320 },
          { key: 'dx5', label: 'DX5', price: 1680 },
          { key: 'lh-500', label: 'LH-500', price: 280 },
        ],
        infoSections: [
          { label: 'How to Replace the L1800 Printhead', content: `Watch the tutorial video: https://youtu.be/E1lR9cdpkbU?si=uZ-cmv_jlZWL079r` },
        ]
      }}
    />
  );
}
