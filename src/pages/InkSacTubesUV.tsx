import ConsumableProduct from './ConsumableProduct';

export default function InkSacTubesUV() {
  return (
    <ConsumableProduct
      data={{
        id: 'ink-sac-tubes-uv',
        title: `Procolored Printer 6*120cm Ink Sac Tubes With Cartridges—Fit For UV Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/1__1_13_1220x_crop_center.png?v=1745912286',
        variants: [
          { key: 'v4', label: 'V4', price: 69 },
          { key: 'v6', label: 'V6', price: 69 },
          { key: 'v11', label: 'V11', price: 69 },
          { key: 'v11-pro', label: 'V11 Pro', price: 69 },
          { key: 'uvdtf', label: 'UVDTF', price: 69 },
        ],
        infoSections: [

        ]
      }}
    />
  );
}
