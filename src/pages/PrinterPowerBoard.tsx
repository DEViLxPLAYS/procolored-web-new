import ConsumableProduct from './ConsumableProduct';

export default function PrinterPowerBoard() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-power-board',
        title: `Procolored Printer Power Board`,
        image: 'https://www.procolored.com/cdn/shop/files/000038_printhead_driver_board_1220x_crop_center.png?v=1749463205',
        variants: [
          { key: 'f8-l800', label: 'F8-L800', price: 99 },
          { key: 'f13-pro', label: 'F13-Pro', price: 169 },
          { key: 'p13-xp600-win', label: 'P13-XP600-Windows', price: 169 },
          { key: 'vf13-pro', label: 'VF13-Pro', price: 199 },
          { key: 'v4-l800', label: 'V4-L800', price: 99 },
          { key: 'v6-l800', label: 'V6-L800', price: 99 },
          { key: 'v11-r1390', label: 'V11-R1390', price: 109 },
          { key: 'v11-pro-tx800', label: 'V11-Pro-TX800', price: 199 },
          { key: 't8-l800', label: 'T8-L800', price: 99 },
          { key: 't11-pro-tx800', label: 'T11-Pro-TX800', price: 199 },
          { key: 'l1800-dx5-r2000', label: 'L1800/DX5-R2000', price: 109 },
        ],
        infoSections: [
          { label: 'Description', content: `OEM replacement power board for Procolored printers. Regulates and distributes power to all printer components for stable, reliable operation.` },
          { label: 'Compatibility', content: `Available models: F8-L800, F13-Pro, P13-XP600-Windows, VF13-Pro, V4-L800, V6-L800, V11-R1390, V11-Pro-TX800, T8-L800, T11-Pro-TX800, L1800/DX5-R2000.` },
          { label: 'Important Note', content: `Please select the correct model for your printer before ordering. Using an incompatible power board can damage the printer.` },
        ]
      }}
    />
  );
}
