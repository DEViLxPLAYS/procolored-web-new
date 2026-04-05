import ConsumableProduct from './ConsumableProduct';

export default function InkSacTubesDTF() {
  return (
    <ConsumableProduct
      data={{
        id: 'ink-sac-tubes-dtf',
        title: `Procolored Printer 6*120cm Ink Sac Tubes With Cartridges—Fit For DTF Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/1__1_13_dc5b3eae-9127-4e82-9b64-e93f92d29978_1220x_crop_center.png?v=1745912196',
        variants: [
          { key: 'f8', label: 'F8', price: 89 },
          { key: 'f13', label: 'F13', price: 69 },
          { key: 'f13-pro', label: 'F13 Pro', price: 69 },
          { key: 'p13-windows', label: 'P13-Windows', price: 69 },
          { key: 'p13-macos', label: 'P13-MacOS', price: 89 },
          { key: 'k13-lite', label: 'K13 Lite', price: 69 },
          { key: 'k13', label: 'K13', price: 69 },
        ],
        infoSections: [

        ]
      }}
    />
  );
}
