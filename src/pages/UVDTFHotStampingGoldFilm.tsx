import ConsumableProduct from './ConsumableProduct';

export default function UVDTFHotStampingGoldFilm() {
  return (
    <ConsumableProduct
      data={{
        id: 'uvdtf-hot-stamping-gold-film',
        title: 'Procolored UV DTF Transfer Hot Stamping Gold Film——fit for A3 UV DTF Printer',
        image: 'https://www.procolored.com/cdn/shop/files/Consumables-25_1220x_crop_center.png?v=1755765423',
        variants: [
          { key: 'standard', label: 'Gold AB Film', price: 199 },
        ],
        infoSections: [
          { label: 'Outlined', content: 'Product name: Golden AB film for UV DTF' },
          { label: 'Description', content: 'Applicable to: smooth and adhesion-supportive surface\nFeature: presenting golden effect; proper thickness and hardness, self-adhesive, durable, anti-ultraviolet/high temperature/water/abrasion, easy separation/operation/application, outstanding color reproduction, high-quality 3D effect' },
          { label: 'Compatibility', content: 'Compatible printer: Compatible with UVDTF printers of A3 printing size, such as VF13 Pro printer.' },
          { label: 'Technical Specification', content: 'Substrate: PET with gold coating\nFilm type: A film as printing film; B film as liner film\nSize: glued A film - 31cm*50m (available glued film 30cm); B film - 31cm*50m\nThickness: 0.1mm\nShelf life: 12 months\nStorage: Keep in a dry place and away from direct sunlight' },
        ]
      }}
    />
  );
}
