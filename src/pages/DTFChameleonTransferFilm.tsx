import ConsumableProduct from '../components/ConsumableProduct';

export default function DTFChameleonTransferFilm() {
  return (
    <ConsumableProduct
      data={{
        id: 'dtf-chameleon-transfer-film',
        title: `Procolored DTF Chameleon Transfer Roll Film 11.8 Inch x 328 FT——fit for A3 DTF Printer`,
        price: 169,
        image: 'https://www.procolored.com/cdn/shop/files/4__1_10_1220x_crop_center.png?v=1755765214',
        variants: [
          { key: 'standard', label: 'Standard Roll', price: 169 },
        ],
        details: {
          outlined: `Covered with chameleon coating, presenting printings with brighter and silky colors, as well as impressive glossiness`,
          description: `Applicable to: textile fabric, clothes, decor textile with even surface
Feature: covered with chameleon coating, presenting printings with brighter and silky colors, as well as impressive glossiness; good hand feel; strong ink absorption, anti-powder adhesion , easy separation`,
          compatibility: `Compatible printer: Apply to DTF printers of A3 printing size, including F13, F13 Pro, P13, K13 printers.`,
          technical: `Substrate: PET with chameleon coating
Thickness: 0.1mm
Film type: single-sided cold tear
Size: 11.8 Inch x 328 FT (30cm*100m)
Heat transfer temperature/time: 165-175℃, 15-20"
Shelf life: 18 months
Storage: Keep in a dry place and away from direct sunlight`
        }
      }}
    />
  );
}
