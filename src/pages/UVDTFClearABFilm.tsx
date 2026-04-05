import ConsumableProduct from './ConsumableProduct';

export default function UVDTFClearABFilm() {
  return (
    <ConsumableProduct
      data={{
        id: 'uvdtf-clear-ab-film',
        title: 'Procolored UV DTF Transfer Clear AB Film - fit for A3 UV DTF Printer',
        image: 'https://www.procolored.com/cdn/shop/files/2__1_10_1220x_crop_center.png?v=1755765443',
        variants: [
          { key: 'ab-set', label: 'A+B Film Set', price: 159 },
          { key: 'a-only', label: 'A Film only (31cm*50m)', price: 109 },
          { key: 'b-only', label: 'B Film only (31cm*50m)', price: 59 },
        ],
        infoSections: [
          { label: 'Outlined', content: 'The earlier Type-A film, which was based on white paper, has been upgraded to a transparent version to enhance its appearance, while retaining its fundamental features.' },
          { label: 'Usage of A/B Films', content: 'The type-A film is used as base film for printing and type-B film is used as backing film to back up the printed stickers. The A/B transfer films are used in pair on the UV DTF printer.' },
          { label: 'Description', content: 'Feature: high transparency, proper thickness and hardness, self-adhesive, durable, anti-ultraviolet/high temperature/water/abrasion, easy separation/operation/application, outstanding color reproduction, high-quality 3D effect, supporting additional gold/silver/laser effect' },
          { label: 'Compatibility', content: 'Compatible printer: Compatible with UVDTF printers of A3 printing size, such as VF13 Pro Printer.' },
          { label: 'Technical Specification', content: 'Substrate: PET\nFilm type: A film as printing film; B film as liner film\nSize: Glued A film - 31cm*50meter (available glued film 30cm); Liner B film - 31cm*50meter\nThickness: 0.1mm\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
        ]
      }}
    />
  );
}
