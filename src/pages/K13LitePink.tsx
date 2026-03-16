import K13LiteProduct from './K13LiteProduct';

const PINK_IMAGES = [
  'https://www.procolored.com/cdn/shop/files/K13_lite_Pink__1_1220x_crop_center.jpg?v=1758869972',
  'https://www.procolored.com/cdn/shop/files/1_11199f37-ce34-49c7-8720-a8afaac4a3c1_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/20260105-114947_1220x_crop_center.jpg?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_pink_12_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_pink_11_1220x_crop_center.png?v=1772447536',
  'https://www.procolored.com/cdn/shop/files/K13_lite_pink_10_47d94674-2379-4e42-a679-2aed84d90f2d_1220x_crop_center.png?v=1767585184',
];

export default function K13LitePink() {
  return (
    <K13LiteProduct
      variant={{
        color: 'Pink',
        bundleType: 'base',
        productName: 'Procolored K13 Lite DTF Printer 13" A3 - Pink',
        slug: 'procolored-k13-lite-dtf-printer-13-a3-pink',
        originalPKR: 797_900,
        salePKR: 655_000,
        images: PINK_IMAGES,
      }}
    />
  );
}
