import ConsumableProduct from './ConsumableProduct';

export default function OvenExhaustGasFilter() {
  return (
    <ConsumableProduct
      data={{
        id: 'oven-exhaust-gas-filter',
        title: `Procolored Oven Exhaust Gas Filter`,
        image: 'https://www.procolored.com/cdn/shop/files/cotton_core_1220x_crop_center.jpg?v=1730282939',
        variants: [
          { key: 'panda-air-filter', label: 'Panda Oven Air Filter', price: 49 },
          { key: 'panda-cotton-core', label: 'Panda Oven Filter Cotton Core x3pcs - No Frame', price: 49 },
          { key: 'smokeless-gas-filter', label: 'Smokeless Oven Gas Filter', price: 119 },
        ],
        infoSections: [
          { label: 'Description', content: `Replacement exhaust gas filter for Procolored DTF ovens. Reduces odors and fine particles generated during the powder curing process.` },
          { label: 'Options', content: `Panda Oven Air Filter: Complete filter unit. Panda Oven Filter Cotton Core x3pcs: Replacement cores only (no frame). Smokeless Oven Gas Filter: Heavy-duty filter for Smokeless Oven models.` },
          { label: 'Features', content: `Reduces curing odors
Filters fine particles
Easy to replace
Improves air quality in workspace` },
        ]
      }}
    />
  );
}
