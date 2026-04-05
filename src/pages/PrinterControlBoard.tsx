import ConsumableProduct from './ConsumableProduct';

export default function PrinterControlBoard() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-control-board',
        title: `Procolored Printer Control Board`,
        image: 'https://www.procolored.com/cdn/shop/files/000035_V11_T11_Printer_control_board_1220x_crop_center.png?v=1749463360',
        variants: [
          { key: 'f8-l800', label: 'F8-L800', price: 179 },
          { key: 'f8-l805', label: 'F8-L805', price: 119 },
          { key: 'f13-l1800', label: 'F13-L1800', price: 179 },
          { key: 'k13lite-lh500', label: 'K13Lite-LH500', price: 179 },
          { key: 'p13-xp600-mac', label: 'P13-XP600-Mac', price: 259 },
          { key: 'v4-l800', label: 'V4-L800', price: 259 },
          { key: 'v6-l800', label: 'V6-L800', price: 259 },
          { key: 'v11-r1390', label: 'V11-R1390', price: 259 },
          { key: 't8-l800', label: 'T8-L800', price: 259 },
          { key: 'dx5-r2000', label: 'DX5-R2000', price: 239 },
        ],
        infoSections: [
          { label: 'Description', content: `Genuine Procolored printer control board. Acts as the central processing hub for print data, communication, and printer operations.` },
          { label: 'Compatibility', content: `Available models: F8-L800, F8-L805, F13-L1800, K13Lite-LH500, P13-XP600-Mac, V4-L800, V6-L800, V11-R1390, T8-L800, DX5-R2000.` },
          { label: 'Important Note', content: `Please ensure you select the correct model for your printer. Incorrect parts may void the warranty. Consult our support team if you are unsure.` },
        ]
      }}
    />
  );
}
