import ConsumableProduct from './ConsumableProduct';

const MODELS = ['F8', 'F13', 'F13 Pro', 'VF13 Pro', 'V11', 'V11 Pro', 'T11 Pro TX800'];
const TYPES = ['Capping Unit', 'Capping Unit with Tube'];

// All combinations are $49 as specified
const priceMap: Record<string, number> = {};
MODELS.forEach(m => TYPES.forEach(t => { priceMap[`${m}__${t}`] = 49; }));

export default function PrintheadCappingUnit() {
  return (
    <ConsumableProduct
      data={{
        id: 'printhead-capping-unit',
        title: 'Procolored Printhead Capping Unit - Fit For Procolored Printer',
        image: 'https://www.procolored.com/cdn/shop/files/DSCF5985_1220x_crop_center.png?v=1743064959',
        variants: [{ key: 'default', label: 'Capping Unit', price: 49 }],
        variantGroups: [
          { label: 'Model', options: MODELS },
          { label: 'Type', options: TYPES },
        ],
        variantPriceMap: priceMap,
        infoSections: [
          {
            label: 'Description',
            content: 'OEM replacement capping unit for Procolored printers. Seals the printhead when not in use to prevent ink from drying and clogging nozzles.',
          },
          {
            label: 'Options',
            content: 'Capping Unit: Standard replacement cap.\nCapping Unit with Tube: Includes the connected tube assembly for a full replacement.',
          },
          {
            label: 'Compatibility',
            content: 'F8 · F13 · F13 Pro · VF13 Pro · V11 · V11 Pro · T11 Pro TX800',
          },
          {
            label: 'Features',
            content: 'Seals printhead when idle\nPrevents nozzle clogging\nExtends printhead life\nDirect OEM replacement',
          },
        ],
        note: '⚠️ Please select your exact printer model before ordering. Using an incompatible part may damage the printhead.',
      }}
    />
  );
}
