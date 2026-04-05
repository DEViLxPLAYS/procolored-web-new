import ConsumableProduct from './ConsumableProduct';

export default function PrinterStartupButtonBoard() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-startup-button-board',
        title: `Procolored Printer Startup Button Board`,
        image: 'https://www.procolored.com/cdn/shop/files/000734_startup_button_board_1_1220x_crop_center.png?v=1749463175',
        variants: [
          { key: 'f8-l800', label: 'F8-L800', price: 99 },
          { key: 'f13-l1800', label: 'F13-L1800', price: 119 },
          { key: 'f13-pro', label: 'F13-Pro', price: 139 },
          { key: 'k13-lite', label: 'K13 Lite', price: 119 },
          { key: 'p13-xp600-win', label: 'P13-XP600-Windows', price: 139 },
          { key: 'p13-xp600-mac', label: 'P13-XP600-MacOS', price: 139 },
          { key: 'vf13-pro', label: 'VF13-Pro', price: 139 },
          { key: 'v4-l800', label: 'V4-L800', price: 99 },
          { key: 'v6-l800', label: 'V6-L800', price: 119 },
          { key: 'v11-r1390', label: 'V11-R1390', price: 119 },
          { key: 'v11-pro-tx800', label: 'V11-Pro-TX800', price: 139 },
          { key: 't8-l800', label: 'T8-L800', price: 119 },
          { key: 't11-pro-tx800', label: 'T11-Pro-TX800', price: 139 },
          { key: 'dx5-r2000', label: 'DX5-R2000', price: 119 },
        ],
        infoSections: [
          { label: 'Description', content: `Genuine Procolored replacement startup button board. Controls the power and function buttons on your printer panel.` },
          { label: 'Compatibility', content: `Available models: F8-L800, F13-L1800, F13-Pro, K13 Lite, P13-XP600-Windows, P13-XP600-MacOS, VF13-Pro, V4-L800, V6-L800, V11-R1390, V11-Pro-TX800, T8-L800, T11-Pro-TX800, DX5-R2000.` },
          { label: 'Important Note', content: `Please select the correct model for your printer before ordering.` },
        ]
      }}
    />
  );
}
