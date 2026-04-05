import ConsumableProduct from './ConsumableProduct';

export default function WhiteInkCirculationPump() {
  return (
    <ConsumableProduct
      data={{
        id: 'white-ink-circulation-pump',
        title: `Procolored White Ink Circulation Pump/ Ink Waste Pump`,
        image: 'https://www.procolored.com/cdn/shop/files/10__1_18_1220x_crop_center.png?v=1743061786',
        variants: [
          { key: 'f8', label: 'F8', price: 69 },
          { key: 'f13', label: 'F13', price: 109 },
          { key: 'f13-pro', label: 'F13 Pro', price: 79 },
          { key: 'p13-macos', label: 'P13-MacOS', price: 79 },
          { key: 'p13-windows', label: 'P13-Windows', price: 79 },
          { key: 'k13-lite', label: 'K13 Lite', price: 79 },
          { key: 'vf13-pro', label: 'VF13 Pro', price: 79 },
          { key: 'v4', label: 'V4', price: 69 },
          { key: 'v6', label: 'V6', price: 69 },
          { key: 'v11', label: 'V11', price: 109 },
          { key: 'v11-pro', label: 'V11 Pro', price: 69 },
          { key: 't8', label: 'T8', price: 69 },
          { key: 't11-pro', label: 'T11 Pro', price: 69 },
          { key: 'dx5', label: 'DX5', price: 109 },
        ],
        infoSections: [

        ]
      }}
    />
  );
}
