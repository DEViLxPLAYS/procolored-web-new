import ConsumableProduct from './ConsumableProduct';

export default function DTFGlitterTransferFilm() {
  return (
    <ConsumableProduct
      data={{
        id: 'dtf-glitter-transfer-film',
        title: `Procolored DTF Glitter Transfer Roll Film 11.8 Inch x 328 FT——fit for A3 DTF Printer`,
        
        image: 'https://www.procolored.com/cdn/shop/files/4__1_8_1220x_crop_center.png?v=1745910718',
        variants: [
          { key: 'standard', label: 'Standard Roll', price: 169 },
        ],
        infoSections: [
          { label: 'Outlined', content: `Covered with silver glittering coating, presenting a shimmering effect on the finished printings` },
          { label: 'Description', content: `Applicable to: textile fabric, clothes, decor textile with even surface
Feature: covered with silver glittering coating, presenting a shimmering effect on the finished printings; strong ink absorption, anti-powder adhesion , easy separation` },
          { label: 'Compatibility', content: `Compatible printer: Apply to DTF printers of A3 printing size, including F13, F13 Pro, P13, K13 printers.` },
          { label: 'Technical Specification', content: `Substrate: PET with glitter coating
Thickness: 0.1mm
Film type: single-sided cold tear
Size: 11.8 Inch x 328 FT (30cm*100m)
Heat transfer temperature/time: 165-175℃, 15-20"
Shelf life: 18 months
Storage: Keep in a dry place and away from direct sunlight` }
        ]
      }}
    />
  );
}
