import ConsumableProduct from './ConsumableProduct';

export default function PrintheadDriverBoard() {
  return (
    <ConsumableProduct
      data={{
        id: 'printhead-driver-board',
        title: `Procolored Printhead Driver Board`,
        image: 'https://www.procolored.com/cdn/shop/files/001550_V13_Pro_TX800_Printhead_Driver_Board_1220x_crop_center.png?v=1749463205',
        variants: [
          { key: 'f13-pro', label: 'F13-Pro', price: 599 },
          { key: 'p13-xp600-win', label: 'P13-XP600-Windows', price: 599 },
          { key: 'vf13-pro', label: 'VF13-Pro', price: 599 },
          { key: 'v11-pro-tx800', label: 'V11-Pro-TX800', price: 679 },
          { key: 't11-pro-tx800', label: 'T11-Pro-TX800', price: 679 },
          { key: 'xp600-adapter', label: 'XP600 Adapter Board', price: 179 },
        ],
        infoSections: [
          { label: 'Description', content: `Genuine Procolored printhead driver board. Converts print data signals into precise firing waveforms for the printhead, ensuring accurate and consistent dot placement.` },
          { label: 'Compatibility', content: `Available models: F13-Pro, P13-XP600-Windows, VF13-Pro, V11-Pro-TX800, T11-Pro-TX800, XP600 Adapter Board.` },
          { label: 'Important Note', content: `Please select the correct model for your printer. Incompatible driver boards can damage both the board and printhead. Consult support if unsure.` },
        ]
      }}
    />
  );
}
