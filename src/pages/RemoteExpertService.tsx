import ConsumableProduct from './ConsumableProduct';

export default function RemoteExpertService() {
  return (
    <ConsumableProduct
      data={{
        id: 'remote-expert-service',
        title: `Procolored Remote Expert Service`,
        image: 'https://www.procolored.com/cdn/shop/files/29a3e0b58d9285335e91f4af262fd4d6_9ee8b6d2-2509-491d-b64f-60c1c9d91bdb_1220x_crop_center.png?v=1743061897',
        variants: [
          { key: '1hour', label: '1-hour online technical support package', price: 50 },
          { key: '1month', label: '1-month online technical support package', price: 199 },
          { key: '1year', label: '1-year online technical support package', price: 499 },
        ],
        infoSections: [
          { label: 'Service Description', content: `Our remote expert service provides you with professional technical support from our experienced team. Whether you need help with setup, troubleshooting, or optimizing your printer settings, our experts are here to help.` },
          { label: '1-Hour Package', content: `Perfect for quick troubleshooting and specific technical questions. One-on-one session with a Procolored expert via video or screen share.` },
          { label: '1-Month Package', content: `Comprehensive monthly support for ongoing technical assistance. Unlimited access to our support team for any printer-related issues.` },
          { label: '1-Year Package', content: `Full-year priority technical support with dedicated expert assistance. Includes setup guidance, maintenance tips, and troubleshooting support.` },
        ]
      }}
    />
  );
}
