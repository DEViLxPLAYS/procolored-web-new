import ConsumableProduct from './ConsumableProduct';

export default function PrinterMotherboard() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-motherboard',
        title: `Procolored Printer Motherboard`,
        image: 'https://www.procolored.com/cdn/shop/files/000046_1220x_crop_center.png?v=1749551014',
        variants: [
          { key: 'f8-l800', label: 'F8-L800', price: 149 },
          { key: 'f8-l805', label: 'F8-L805', price: 149 },
          { key: 'f13-l1800', label: 'F13-L1800', price: 299 },
          { key: 'f13-r1390', label: 'F13-R1390', price: 159 },
          { key: 'k13-lite', label: 'K13 Lite', price: 149 },
          { key: 'f13-pro', label: 'F13-Pro', price: 1359 },
          { key: 'p13-xp600-win', label: 'P13-XP600-Win', price: 1359 },
          { key: 'p13-xp600-mac', label: 'P13-XP600-Mac', price: 1359 },
          { key: 'vf13-pro', label: 'VF13-Pro', price: 1359 },
          { key: 'v4-l800', label: 'V4-L800', price: 149 },
          { key: 'v6-l800', label: 'V6-L800', price: 149 },
          { key: 'v11-r1390', label: 'V11-R1390', price: 159 },
          { key: 'v11-pro-tx800', label: 'V11-Pro-TX800', price: 1359 },
          { key: 't8-l800', label: 'T8-L800', price: 149 },
          { key: 't11-pro-tx800', label: 'T11-Pro-TX800', price: 1359 },
          { key: 'r2000', label: 'R2000', price: 259 },
        ],
        infoSections: [

        ]
      }}
    />
  );
}
