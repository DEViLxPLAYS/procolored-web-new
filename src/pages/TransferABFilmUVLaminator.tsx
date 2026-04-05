import ConsumableProduct from './ConsumableProduct';

export default function TransferABFilmUVLaminator() {
  return (
    <ConsumableProduct
      data={{
        id: 'transfer-ab-film-uv-laminator',
        title: `Procolored Transfer AB Film - Only for UV Laminator`,
        image: 'https://www.procolored.com/cdn/shop/products/A_UVDTF_-1_1220x_crop_center.jpg?v=1745911190',
        variants: [
          { key: 'a-100pcs', label: 'A Film (100 pcs)', price: 199 },
          { key: 'b-100m', label: 'B Film 100m (for laminator)', price: 99 },
          { key: 'b-50m', label: 'B Film 50m (for laminator)', price: 59 },
          { key: 'ab-set', label: 'A Film (100 pcs) + B Film 50m', price: 239 },
        ],
        infoSections: [
          { label: 'Outlined', content: `Product name: AB film for UV` },
          { label: 'Description', content: `Applicable to: smooth and adhesion-supportive surface
Feature: high transparency, proper thickness and hardness, self-adhesive, durable, anti-ultraviolet/high temperature/water/abrasion, easy separation/operation/application, outstanding color reproduction, high-quality 3D effect, supporting additional gold/silver/laser effect` },
          { label: 'Compatibility', content: `Apply to UV printers of A3 printing size, including VF13 Pro, V11, V11 Pro, V13 Pro, V23 Max printers. (V11, V11 Pro, V13 Pro, V23 Max printers need to match with the UVDTF laminator.)` },
          { label: 'Technical Specification', content: `Substrate: PET
Film type: A film as printing film; B film as liner film
Size: Glued A film - 29.7cm*42cm/sheet; Liner B film - 31cm*100m/roll, or 31cm*50m/roll (optional)
Thickness: 0.1mm
Shelf life: 12 months
Storage: Keep in a dry place and away from direct sunlight` },
        ]
      }}
    />
  );
}
