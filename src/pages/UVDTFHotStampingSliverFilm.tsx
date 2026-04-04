import ConsumableProduct from './ConsumableProduct';

export default function UVDTFHotStampingSliverFilm() {
  return (
    <ConsumableProduct
      data={{
        id: 'uvdtf-hot-stamping-sliver-film',
        title: `Procolored UV DTF Transfer Hot Stamping Sliver Film——fit for A3 UV DTF Printer`,
        price: 229,
        image: 'https://www.procolored.com/cdn/shop/files/Consumables-26_1220x_crop_center.png?v=1755766000',
        variants: [
          { key: 'standard', label: 'Standard Roll', price: 229 },
        ],
        infoSections: [
          { label: 'Outlined', content: `Product name: Silver AB film for UV DTF` },
          { label: 'Description', content: `Applicable to: smooth and adhesion-supportive surface
Feature: presenting silvery effect; proper thickness and hardness, self-adhesive, durable, anti-ultraviolet/high temperature/water/abrasion, easy separation/operation/application, outstanding color reproduction, high-quality 3D effect` },
          { label: 'Compatibility', content: `Compatible printer: Compatible with UVDTF printers of A3 printing size, including VF13 Pro printer.` },
          { label: 'Technical Specification', content: `Substrate: PET with silver coating
Film type: A film as printing film; B film as liner film
Size: glued A film - 31cm*50m (available glued film 30cm); B film - 31cm*50m
Thickness: 0.1mm
Shelf life: 12 months
Storage: Keep in a dry place and away from direct sunlight` }
        ]
      }}
    />
  );
}
