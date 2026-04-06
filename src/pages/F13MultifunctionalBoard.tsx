import ConsumableProduct from './ConsumableProduct';

export default function F13MultifunctionalBoard() {
  return (
    <ConsumableProduct
      data={{
        id: 'f13-multifunctional-board',
        title: 'Procolored F13 DTF Printer Multifunctional Board',
        image: 'https://www.procolored.com/cdn/shop/files/F13multifuntionboard000792_1220x_crop_center.jpg?v=1773988996',
        badge: 'OEM Replacement',
        variants: [{ key: 'default', label: 'F13 Multifunctional Board', price: 179 }],
        infoSections: [
          {
            label: 'Description',
            content: 'Original OEM multifunctional board for the Procolored F13 DTF Printer. Controls core printer functions including motor drivers, sensor inputs, and communication interfaces. Direct plug-and-play replacement for damaged or faulty units.',
          },
          {
            label: 'Compatibility',
            content: 'Compatible exclusively with the Procolored F13 DTF Printer series.',
          },
          {
            label: 'Features',
            content: 'OEM quality component\nDirect drop-in replacement\nControls motor drivers & sensors\nPlug-and-play installation\nFull communication interface support',
          },
          {
            label: 'Warranty',
            content: '3-month warranty on hardware defects from the date of delivery.',
          },
          {
            label: 'Note',
            content: 'Professional installation recommended. Improper installation may void the warranty.',
          },
        ],
        note: '⚠️ This board is only compatible with the F13 model. Please confirm your printer model before ordering.',
        reviews: [
          { name: 'James T.', date: '03/10/2026', title: 'Saved my printer', text: 'My F13 board fried after a power surge. This replacement arrived fast and snapped right in — printer is running perfectly again.', rating: 5 },
          { name: 'PrintPro Shop', date: '02/22/2026', title: 'Exactly as described', text: 'Genuine OEM part, works flawlessly. Would definitely order again.', rating: 5 },
          { name: 'Carlos R.', date: '02/05/2026', title: 'Great quality', text: 'Easy to install with the guide. My printer was back online within 30 minutes.', rating: 5 },
        ],
      }}
    />
  );
}
