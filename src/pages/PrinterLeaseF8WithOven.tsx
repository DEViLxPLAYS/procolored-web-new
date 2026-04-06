import ConsumableProduct from './ConsumableProduct';

export default function PrinterLeaseF8WithOven() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-lease-f8-with-oven',
        title: 'Printer Lease: Procolored F8 Panda DTF Printer 8.2" A4 L800 & Oven',
        image: 'https://www.procolored.com/cdn/shop/files/rentprogram_1220x_crop_center.png?v=1740704365',
        badge: 'Lease Program',
        variants: [{ key: 'monthly', label: 'Monthly Lease — F8 + Oven Bundle', price: 549 }],
        infoSections: [
          {
            label: "What's Included",
            content: "Procolored F8 Panda DTF Printer (8.2\" A4, L800 printhead)\nProcolored Smokeless Oven\nAll necessary accessories to start printing",
          },
          {
            label: 'Lease Terms',
            content: "Monthly lease payment: $549/month\nA separate deposit is required (see Deposit listing)\nMinimum lease term applies — contact support for full terms\nEquipment returned at end of lease or purchase option available",
          },
          {
            label: 'Why Lease?',
            content: "Low upfront cost\nAlways have access to current technology\nIncludes ongoing technical support\nFlexible upgrade path",
          },
          {
            label: 'Support',
            content: 'Full technical support included throughout the lease period. Remote and engineer support available.',
          },
        ],
        note: 'A refundable security deposit of $300 is required separately before equipment is shipped. Contact our team to get started.',
        reviews: [
          { name: 'Sarah M.', date: '03/15/2026', title: 'Perfect for starting my business', text: 'The lease program let me get started with professional equipment without breaking the bank. Setup was smooth and support has been excellent.', rating: 5 },
          { name: 'DTF Studio LA', date: '02/28/2026', title: 'Great program', text: 'This lease deal is fantastic for small shops. The F8 + oven bundle prints great quality. Would recommend to anyone starting out.', rating: 5 },
          { name: 'Mike T.', date: '02/10/2026', title: 'Easy and affordable', text: 'No large upfront cost and the printer works great. Customer service was very helpful with the lease paperwork.', rating: 5 },
        ],
      }}
    />
  );
}
