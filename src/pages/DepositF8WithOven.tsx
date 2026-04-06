import ConsumableProduct from './ConsumableProduct';

export default function DepositF8WithOven() {
  return (
    <ConsumableProduct
      data={{
        id: 'deposit-f8-with-oven',
        title: 'Deposit: Procolored F8 Panda DTF Printer 8.2" A4 L800 & Oven',
        image: 'https://www.procolored.com/cdn/shop/files/rentprogram_1220x_crop_center.png?v=1740704365',
        badge: 'Security Deposit',
        variants: [{ key: 'deposit', label: 'Security Deposit — F8 + Oven Bundle', price: 300 }],
        infoSections: [
          {
            label: 'About This Deposit',
            content: 'This is the refundable security deposit required to begin your F8 Panda + Oven lease program. The deposit is held for the full duration of the lease and returned when equipment is received back in good condition.',
          },
          {
            label: 'How It Works',
            content: '1. Pay this deposit to initiate the lease\n2. Pay your monthly lease fee separately ($549/month)\n3. Equipment ships once both payments are confirmed\n4. Deposit refunded within 7 business days of return',
          },
          {
            label: 'Conditions',
            content: 'Deposit is fully refundable if equipment is returned in original condition\nDeductions may apply for damage beyond normal wear\nNon-refundable if lease terms are violated',
          },
        ],
        note: '💡 This listing is for the security deposit only. Purchase the monthly lease separately to complete your enrollment.',
        reviews: [
          { name: 'Rachel K.', date: '03/12/2026', title: 'Simple process', text: 'Paying the deposit was straightforward. Team confirmed everything quickly and the printer arrived in great shape.', rating: 5 },
          { name: 'Custom Prints Co.', date: '02/20/2026', title: 'Transparent process', text: 'Very clear about terms. Got my deposit back promptly when we upgraded to buying the machine.', rating: 5 },
          { name: 'Tony B.', date: '01/30/2026', title: 'No issues', text: 'Easy deposit, easy process. The whole lease program is well organized.', rating: 5 },
        ],
      }}
    />
  );
}
