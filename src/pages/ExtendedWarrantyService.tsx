import ConsumableProduct from './ConsumableProduct';

export default function ExtendedWarrantyService() {
  return (
    <ConsumableProduct
      data={{
        id: 'extended-warranty-service',
        title: 'Procolored Extended Warranty Service',
        image: 'https://www.procolored.com/cdn/shop/files/b78c39d5eabbde51946a49e28fefc57e_1220x_crop_center.png?v=1743061878',
        variants: [
          { key: '1year', label: '1-year Extended Warranty', price: 699 },
          { key: '2year', label: '2-year Extended Warranty', price: 1099 },
        ],
        infoSections: [
          { label: 'Service Overview', content: 'For all customers who have purchased Procolored printer equipment that is beyond the 12-month warranty period, we offer extended warranty services, which include bug fixes, remote troubleshooting, and hardware repair support.' },
          { label: '1-Year Extended Warranty', content: 'Full coverage for 12 additional months after your standard warranty expires. Includes remote technical support, firmware updates, and hardware defect coverage.' },
          { label: '2-Year Extended Warranty', content: 'Maximum protection for 24 additional months. Ideal for businesses relying on continuous printing operations. Priority support response and full hardware coverage included.' },
          { label: 'What\'s Included', content: 'Remote expert troubleshooting\nFirmware & software update support\nHardware defect coverage\nPriority customer support\nOngoing maintenance guidance' },
        ]
      }}
    />
  );
}
