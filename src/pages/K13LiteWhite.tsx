import K13LiteProduct from './K13LiteProduct';

const WHITE_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_1_9a953385-6db6-491d-84f6-45f45196871d_1220x_crop_center.jpg?v=1758869975',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_m_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/20260105-114947_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_12_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_11_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_white_10_ca4ab931-50b4-4d40-ba1e-b62e709de56a_1220x_crop_center.png?v=1767585189',
];

export default function K13LiteWhite() {
  return (
    <K13LiteProduct
      variant={{
        color: 'White',
        bundleType: 'base',
        productName: 'Procolored K13 Lite DTF Printer 13" A3 - White',
        slug: 'procolored-k13-lite-dtf-printer-13-a3-white',
        originalPKR: 797_900,
        salePKR: 655_000,
        images: WHITE_IMAGES,
      }}
    />
  );
}
