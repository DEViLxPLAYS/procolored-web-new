import ConsumableProduct from './ConsumableProduct';

export default function PrintheadMoisturizingDevice() {
  return (
    <ConsumableProduct
      data={{
        id: 'printhead-moisturizing-device',
        title: `Procolored Printer Protective For Printhead Moisturizing Device`,
        image: 'https://www.procolored.com/cdn/shop/files/BSZZ22_1220x_crop_center.jpg?v=1742287138',
        variants: [
          { key: 'f8', label: 'F8', price: 149 },
          { key: 'f13', label: 'F13', price: 149 },
          { key: 'f13-pro', label: 'F13 Pro', price: 149 },
          { key: 'k13-lite', label: 'K13 Lite', price: 149 },
          { key: 'p13', label: 'P13', price: 149 },
          { key: 'vf13-pro', label: 'VF13 Pro', price: 149 },
          { key: 'v4', label: 'V4', price: 149 },
          { key: 'v6', label: 'V6', price: 149 },
          { key: 'v11', label: 'V11', price: 149 },
          { key: 'v11-pro', label: 'V11 Pro', price: 149 },
          { key: 't8', label: 'T8', price: 149 },
          { key: 't11-pro', label: 'T11 Pro', price: 149 },
        ],
        infoSections: [
          { label: 'Outlined', content: `Printer Protective For Printhead Moisturizing Device` },
          { label: 'Description', content: `Print head moisturizing device: It's crucial to keep the inkjet print head moisturized during their daily working. A properly-moisturized print head can effectively reduce clogging issue thus avoiding printing interruption; it can also prolong the print head longevity by preventing clogging issues caused by ink buildups.` },
          { label: 'Compatibility', content: `Compatible printer: F8, F13, F13 Pro, P13, K13 Lite, VF13 Pro, V4, V6, V11, V11 Pro, V13 Pro, V23 Max, T8, T11 Pro, T13 Pro, T23 Max

Configuration: Clear Ink Cartridges*6 with tube, Bottle, Nozzle Protection Liquid*500ml` },
          { label: 'Technical Specification', content: `Shelf life: 3-5 years.
Storage: Keep in a cool, dry and well-ventilated place with room temperature 5-25℃, away from fire, heat or direct sunlight.` },
        ]
      }}
    />
  );
}
