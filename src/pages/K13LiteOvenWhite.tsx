import K13LiteProduct from './K13LiteProduct';

const WHITE_IMAGES_2_6 = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_m_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/20260105-114947_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_12_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_11_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_10_ca4ab931-50b4-4d40-ba1e-b62e709de56a_1220x_crop_center.png?v=1767585189',
];

export default function K13LiteOvenWhite() {
  return (
    <K13LiteProduct
      variant={{
        color: 'White',
        bundleType: 'oven',
        productName: 'Procolored K13 Lite DTF Printer 13" A3 & Oven - White',
        slug: 'procolored-k13-lite-dtf-printer-13-a3-oven-white',
        originalPKR: 1_140_900,
        salePKR: 940_000,
        images: [
          'https://www.procolored.com/cdn/shop/files/K13_lite_white_5_3bceb5a3-46a0-4a3c-9144-63f9a71f88dc_1220x_crop_center.jpg?v=1758869975',
          ...WHITE_IMAGES_2_6,
        ],
      }}
    />
  );
}
