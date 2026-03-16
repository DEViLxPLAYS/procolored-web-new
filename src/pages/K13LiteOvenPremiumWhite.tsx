import K13LiteProduct from './K13LiteProduct';

const WHITE_IMAGES_2_6 = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_m_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/20260105-114947_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_12_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_11_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_10_ca4ab931-50b4-4d40-ba1e-b62e709de56a_1220x_crop_center.png?v=1767585189',
];

export default function K13LiteOvenPremiumWhite() {
  return (
    <K13LiteProduct
      variant={{
        color: 'White',
        bundleType: 'oven-premium',
        productName: 'Procolored K13 Lite DTF Printer 13" A3 & Oven Premium - White',
        slug: 'procolored-k13-lite-dtf-printer-13-a3-oven-premium-white',
        originalPKR: 1_311_000,
        salePKR: 1_080_000,
        images: [
          'https://www.procolored.com/cdn/shop/files/Procolored_DTF_printer_with_Smokeless_Oven_Bundle_10_1220x_crop_center.jpg?v=1772447536',
          ...WHITE_IMAGES_2_6,
        ],
      }}
    />
  );
}
