import ConsumableProduct from './ConsumableProduct';

export default function PandaDoll() {
  return (
    <ConsumableProduct
      data={{
        id: 'panda-doll',
        title: 'Procolored Panda Doll',
        image: 'https://www.procolored.com/cdn/shop/files/xm_deae226a-30b3-44d3-8604-e1b5b67aeaf7_1220x_crop_center.png?v=1725963688',
        badge: 'Limited Edition',
        variants: [{ key: 'standard', label: 'Procolored Panda Doll', price: 1.00 }],
        infoSections: [
          {
            label: 'Description',
            content: 'The adorable Procolored Panda Doll — the official mascot of the Procolored F8 Panda and F13 Panda DTF printer family. A fun, collectible plush perfect for any printing studio, desk, or as a gift for printing enthusiasts.',
          },
          {
            label: 'Details',
            content: 'Material: Premium soft plush fabric\nSize: Approx. 25cm (10 inches)\nDesign: Procolored Panda mascot with logo branding\nSafe for ages 3+',
          },
          {
            label: 'Perfect Gift',
            content: 'Great gift for Procolored printer owners\nFun addition to any print shop\nCollectible limited edition item\nPhotogenic studio prop',
          },
        ],
        reviews: [
          { name: 'Emma L.', date: '03/20/2026', title: 'So cute!', text: "Bought this for my print studio desk and it brings a smile to everyone who visits. The quality of the plush is excellent — very soft and well-made.", rating: 5 },
          { name: 'Jake R.', date: '03/08/2026', title: 'Great gift', text: "Gave this to my business partner who loves her F8 Panda printer. She absolutely loved it. It's the perfect gift for any Procolored enthusiast.", rating: 5 },
          { name: 'Sophia T.', date: '02/25/2026', title: 'Love it!', text: 'Adorable little panda doll. Perfect size for the desk. Ships well-packaged too. 10/10 would recommend!', rating: 5 },
        ],
      }}
    />
  );
}
