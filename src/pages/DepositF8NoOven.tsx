import ConsumableProduct from './ConsumableProduct';

export default function DepositF8NoOven() {
  return (
    <ConsumableProduct
      data={{
        id: 'deposit-f8-no-oven',
        title: 'Deposit: Procolored F8 Panda DTF Printer 8.2" A4 L800',
        image: 'https://www.procolored.com/cdn/shop/files/20251009-173921_1220x_crop_center.png?v=1760002803',
        badge: 'Security Deposit',
        variants: [{ key: 'deposit', label: 'Security Deposit — F8 Printer Only', price: 300 }],
        infoSections: [
          {
            label: 'About This Deposit',
            content: 'This is the refundable security deposit required to begin your F8 Panda DTF Printer (printer only) lease program. The deposit is held throughout the lease and refunded upon return of equipment in good condition.',
          },
          {
            label: 'How It Works',
            content: '1. Pay this deposit to initiate the lease\n2. Pay your monthly lease fee separately ($499/month)\n3. Equipment ships once both payments are confirmed\n4. Deposit refunded within 7 business days of return',
          },
          {
            label: 'Conditions',
            content: 'Deposit is fully refundable if equipment is returned in original condition\nDeductions may apply for damage beyond normal wear\nNon-refundable if lease terms are violated',
          },
        ],
        note: '💡 This listing is for the security deposit only. Purchase the F8 monthly lease separately to complete enrollment.',
        reviews: [
          { name: 'Linda H.', date: '03/05/2026', title: 'Simple setup', text: 'Paid the deposit, got a confirmation same day. Printer arrived well-packaged and working perfectly.', rating: 5 },
          { name: 'PrintHouse NYC', date: '02/18/2026', title: 'Smooth experience', text: 'Deposit process was clear and handled professionally. Refund came back fast when we converted to a full purchase.', rating: 5 },
          { name: 'Andre L.', date: '02/02/2026', title: 'No surprises', text: 'Everything was exactly as described. Honest and transparent lease program.', rating: 5 },
        ],
      }}
    />
  );
}
