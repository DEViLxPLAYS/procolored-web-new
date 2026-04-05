import ConsumableProduct from './ConsumableProduct';

export default function DTFPreTreatSheetA3() {
  return (
    <ConsumableProduct
      data={{
        id: 'dtf-pretreat-sheet-a3',
        title: `Procolored DTF PreTreat Transfer Sheet Film——fit for A3 DTF Printer`,
        image: 'https://www.procolored.com/cdn/shop/files/2__1_7_1220x_crop_center.png?v=1755765686',
        variants: [
          { key: 'standard', label: 'A3 Sheet Pack', price: 89 },
        ],
        infoSections: [
          { label: 'Outlined', content: `DTF PET Transfer Film Roll - work with all DTF printers utilizing DTF ink and DTF Transfer Film Powder.` },
          { label: 'Description', content: `Substrate: PET
Thickness: 0.1mm
Film type: single-sided cold tear
Size: 11.7" × 16.5" (29.7cm*42cm)
Heat transfer temperature/time: 150-160℃, 8-12"` },
          { label: 'Compatibility', content: `Compatible printer: Only compatible with F13 printer.` },
          { label: 'Technical Specification', content: `Applicable to: textile fabric, clothes, decor textile with even surface
Feature: strong ink absorption, anti-powder adhesion, easy separation
Shelf life: 18 months
Storage: Keep in a dry place and away from direct sunlight` },
          { label: 'Key Features', content: `Durability: Made of PET, durable, heat-resistant and transparent.
Thickness: 75 microns for more stability.
Coatings: Heat-activated coating layer on the printing side.
Versatility: Prints on cotton, polyester, blends, nylon and leather.
No Pretreatment Required.` },
        ]
      }}
    />
  );
}
