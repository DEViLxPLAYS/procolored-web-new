import ConsumableProduct from './ConsumableProduct';

export default function DTFPreTreatRoll13Inch() {
  return (
    <ConsumableProduct
      data={{
        id: 'dtf-pretreat-roll-13inch',
        title: 'Procolored DTF PreTreat Transfer Roll Film 13 Inch x 328 FT——fit for A3 DTF Printer',
        image: 'https://www.procolored.com/cdn/shop/files/DTF_PreTreat_Transfer_Roll_Film_1220x_crop_center.jpg?v=1765965179',
        variants: [
          { key: 'standard', label: '13 Inch x 328 FT', price: 169 },
        ],
        infoSections: [
          { label: 'Outlined', content: 'DTF PET Transfer Film Roll - work with all DTF printers utilizing DTF ink and DTF Transfer Film Powder.' },
          { label: 'Description', content: 'Substrate: PET\nThickness: 0.1mm\nFilm type: single-sided cold tear\nSize: 13 Inch x 328 FT (33cm*100meter)\nHeat transfer temperature/time: 150-160℃, 8-12"' },
          { label: 'Compatibility', content: 'Compatible printer: Apply to all DTF printers of A3 printing size, including F13, F13 Pro, P13, K13 printers.' },
          { label: 'Technical Specification', content: 'Applicable to: textile fabric, clothes, decor textile with even surface\nFeature: strong ink absorption, anti-powder adhesion, easy separation\nShelf life: 18 months\nStorage: Keep in a dry place and away from direct sunlight' },
          { label: 'Key Features', content: 'Durability: The DTF transfer film is made of polyethylene terephthalate (PET), it is durable, heat-resistant and transparent.\nThickness: 75 microns, which provides more stability and durability than thinner film.\nCoatings: Coated with a heat-activated coating layer on the printing side.\nVersatility: Can be used to print on cotton, polyester, blends, nylon and leather.\nNo Pretreatment Required: DTF printing does not require fabric pretreatment.' },
        ]
      }}
    />
  );
}
