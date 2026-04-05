import ConsumableProduct from './ConsumableProduct';

export default function OvenHeatingPlate() {
  return (
    <ConsumableProduct
      data={{
        id: 'oven-heating-plate',
        title: `Procolored Oven Heating Plate - Fit For Procolored Oven`,
        image: 'https://www.procolored.com/cdn/shop/files/heatingplate-1_2_1220x_crop_center.png?v=1745911869',
        variants: [
          { key: 'standard', label: 'Standard Heating Plate', price: 199 },
        ],
        infoSections: [
          { label: 'Description', content: `Original replacement heating plate designed exclusively for Procolored DTF ovens. Maintains precise, even heat distribution for optimal powder curing results.` },
          { label: 'Compatibility', content: `Fit For: Procolored Oven models. Please verify your oven model before ordering.` },
          { label: 'Features', content: `Uniform heat distribution
Precise temperature control
Long-lasting durability
Drop-in replacement fit` },
        ]
      }}
    />
  );
}
