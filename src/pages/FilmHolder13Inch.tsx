import ConsumableProduct from './ConsumableProduct';

export default function FilmHolder13Inch() {
  return (
    <ConsumableProduct
      data={{
        id: 'film-holder-13inch',
        title: `Procolored Film Holder Fit For 13" DTF Roll Film`,
        image: 'https://www.procolored.com/cdn/shop/files/1__1_14_1220x_crop_center.png?v=1745911935',
        variants: [
          { key: 'f8', label: 'F8', price: 119 },
          { key: 'f13', label: 'F13', price: 119 },
          { key: 'k13-lite-pink', label: 'K13 Lite Pink', price: 119 },
        ],
        infoSections: [
          { label: 'Description', content: `Precision-engineered film holder designed specifically for 13" DTF roll film. Ensures smooth, consistent film feeding for professional-quality DTF printing results.` },
          { label: 'Compatibility', content: `Compatible printers: F8, F13, K13 Lite Pink.` },
          { label: 'Features', content: `Secure film mounting
Precise film alignment
Durable construction
Easy installation and removal` },
        ]
      }}
    />
  );
}
