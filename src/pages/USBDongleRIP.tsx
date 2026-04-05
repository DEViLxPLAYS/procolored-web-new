import ConsumableProduct from './ConsumableProduct';

export default function USBDongleRIP() {
  return (
    <ConsumableProduct
      data={{
        id: 'usb-dongle-rip',
        title: `USB Dongle for Procolored RIP V2.3 or later`,
        image: 'https://www.procolored.com/cdn/shop/files/20241126-182906_1220x_crop_center.jpg?v=1745912218',
        variants: [
          { key: 'pro-rip', label: 'Pro RIP', price: 139 },
          { key: 'studio-lite', label: 'Procolored Studio Lite', price: 79 },
        ],
        infoSections: [

        ]
      }}
    />
  );
}
