import ConsumableProduct from '../components/ConsumableProduct';

export default function DTFPreTreatTransferFilm() {
  return (
    <ConsumableProduct
      data={{
        id: 'dtf-pretreat-transfer-film',
        title: `Procolored DTF PreTreat Transfer Roll Film 13 Inch x 328 FT——fit for A3 DTF Printer`,
        price: 169,
        image: 'https://www.procolored.com/cdn/shop/files/DTF_PreTreat_Transfer_Roll_Film_1220x_crop_center.jpg?v=1765965179',
        variants: [
          { key: 'standard', label: 'Standard Roll', price: 169 },
        ],
        details: {
          outlined: `Premium 13 inch PET film for DTF printing without pretreatment.`,
          description: `Applicable to: textile fabric, clothes, decor textile with even surface
Feature: Pre-treat film ensures simple printing without requiring pre-treatment on fabric.`,
          compatibility: `Compatible printer: Apply to DTF printers of A3/13-inch printing size.`,
          technical: `Substrate: PET
Thickness: 0.1mm
Size: 13 Inch x 328 FT
Shelf life: 18 months
Storage: Keep in a dry place and away from direct sunlight`
        }
      }}
    />
  );
}
