import ConsumableProduct from './ConsumableProduct';

export default function PrintheadCappingUnit() {
  return (
    <ConsumableProduct
      data={{
        id: 'printhead-capping-unit',
        title: `Procolored Printhead Capping Unit - Fit For Procolored Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5985_1220x_crop_center.png?v=1743064959',
        variants: [
          { key: 'f8-capping', label: 'F8 - Capping Unit', price: 49 },
          { key: 'f8-capping-tube', label: 'F8 - Capping Unit with Tube', price: 49 },
          { key: 'f13-capping', label: 'F13 - Capping Unit', price: 49 },
          { key: 'f13-capping-tube', label: 'F13 - Capping Unit with Tube', price: 49 },
          { key: 'f13pro-capping', label: 'F13 Pro - Capping Unit', price: 49 },
          { key: 'f13pro-capping-tube', label: 'F13 Pro - Capping Unit with Tube', price: 49 },
          { key: 'vf13pro-capping', label: 'VF13 Pro - Capping Unit', price: 49 },
          { key: 'vf13pro-capping-tube', label: 'VF13 Pro - Capping Unit with Tube', price: 49 },
          { key: 'v11-capping', label: 'V11 - Capping Unit', price: 49 },
          { key: 'v11pro-capping', label: 'V11 Pro - Capping Unit', price: 49 },
          { key: 't11pro-tx800-capping', label: 'T11 Pro TX800 - Capping Unit', price: 49 },
        ],
        infoSections: [
          { label: 'Description', content: `OEM replacement capping unit for Procolored printers. Seals the printhead when not in use to prevent ink from drying and clogging nozzles.` },
          { label: 'Options', content: `Choose between Capping Unit only or Capping Unit with Tube. Available for F8, F13, F13 Pro, VF13 Pro, V11, V11 Pro, T11 Pro TX800.` },
          { label: 'Features', content: `Seals printhead when idle
Prevents nozzle clogging
Extends printhead life
Direct OEM replacement` },
        ]
      }}
    />
  );
}
