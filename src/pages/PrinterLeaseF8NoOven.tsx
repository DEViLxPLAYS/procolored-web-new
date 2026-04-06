import ConsumableProduct from './ConsumableProduct';

export default function PrinterLeaseF8NoOven() {
  return (
    <ConsumableProduct
      data={{
        id: 'printer-lease-f8-no-oven',
        title: 'Printer Lease: Procolored F8 Panda DTF Printer 8.2" A4 L800',
        image: 'https://www.procolored.com/cdn/shop/files/20251009-173921_4e4425e0-e4ae-48e1-b00b-21b531e6d611_1220x_crop_center.png?v=1760002807',
        badge: 'Lease Program',
        variants: [{ key: 'monthly', label: 'Monthly Lease — F8 Printer Only', price: 499 }],
        infoSections: [
          {
            label: "What's Included",
            content: "Procolored F8 Panda DTF Printer (8.2\" A4, L800 printhead)\nAll standard accessories to start printing\nOven not included — printer only",
          },
          {
            label: 'Lease Terms',
            content: "Monthly lease payment: $499/month\nA separate deposit is required (see Deposit listing)\nMinimum lease term applies — contact support for details\nPurchase option available at lease end",
          },
          {
            label: 'Why Lease?',
            content: "Low upfront cost to start your DTF printing business\nFlexible monthly commitment\nFull technical support included\nUpgrade to the bundle or full purchase anytime",
          },
          {
            label: 'Specifications',
            content: "Print Width: 8.2\" (210mm)\nPrint Format: A4\nPrinthead: Epson L800\nInk Type: DTF Ink (CMYK + White)\nCompatible Film: DTF Transfer Film",
          },
        ],
        note: 'A refundable security deposit of $300 is required separately. Contact our team after purchase to complete enrollment.',
        reviews: [
          { name: 'Mia F.', date: '03/18/2026', title: 'Great starter option', text: 'Already had a curing oven so the printer-only lease was perfect for me. Prints are crisp and vibrant.', rating: 5 },
          { name: 'T-Shirt Hustle', date: '03/01/2026', title: 'Reliable machine', text: "The F8 is a workhorse. Lease program made it accessible. Support team is responsive whenever I've had questions.", rating: 5 },
          { name: 'Greg P.', date: '02/14/2026', title: 'Worth every dollar', text: 'Very solid printer for the price. Lease program is fair and transparent. Highly recommend.', rating: 5 },
        ],
      }}
    />
  );
}
