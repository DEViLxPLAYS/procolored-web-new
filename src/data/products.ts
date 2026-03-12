export interface ProductFilter {
  [key: string]: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: string;
  originalPrice: string | null;
  savings: string | null;
  badge: string | null;
  image: string;
  sections: string[];
  filters: ProductFilter;
}

export const products: Product[] = [
  {
    "id": "procolored-f8-panda-dtf-printer-8-2-a4-l800",
    "name": "Procolored F8 Panda DTF Printer 8.2\" A4 L800",
    "slug": "procolored-f8-panda-dtf-printer-8-2-a4-l800",
    "price": "Rs.541,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "8.2\" × 12.9\"",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L800",
      "Substrate Thickness Allows": "0-0.059\" (0-15mm)",
      "Consumables": "Ink",
      "Machine Category": "K13 Lite White",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f8-panda-dtf-printer-8-2-a4-l800-oven",
    "name": "Procolored F8 Panda DTF Printer 8.2\" A4 L800 & Oven",
    "slug": "procolored-f8-panda-dtf-printer-8-2-a4-l800-oven",
    "price": "Rs.683,400.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 6.7\"(170mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L800",
      "Substrate Thickness Allows": "0-4.33\" (0-110mm)",
      "Consumables": "Ink",
      "Machine Category": "K13 Lite White",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-panda-dtf-printer-13-a3-l1800-oven",
    "name": "Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven",
    "slug": "procolored-f13-panda-dtf-printer-13-a3-l1800-oven",
    "price": "Rs.854,300.00 PKR",
    "originalPrice": "Rs.996,800.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "⭐ Best Seller — Fan Appreciation Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 6.7\"(170mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L800",
      "Substrate Thickness Allows": "0-5.51\" (0-140mm)",
      "Consumables": "Ink",
      "Machine Category": "K13 Lite White",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-panda-dtf-printer-13-a3-l1800-oven-premium",
    "name": "Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven Premium",
    "slug": "procolored-f13-panda-dtf-printer-13-a3-l1800-oven-premium",
    "price": "Rs.996,700.00 PKR",
    "originalPrice": "Rs.1,139,200.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "⭐ Best Seller — Fan Appreciation Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 8.2\"(210mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L800",
      "Substrate Thickness Allows": "0-5.51\" (0-140mm)",
      "Consumables": "Ink",
      "Machine Category": "K13 Lite Pink",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600",
    "name": "Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600",
    "slug": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600",
    "price": "Rs.1,367,100.00 PKR",
    "originalPrice": "Rs.1,481,100.00 PKR",
    "savings": "Rs.114,000.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 8.2\"(210mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L800",
      "Substrate Thickness Allows": "0-5.51\" (0-140mm)",
      "Consumables": "Ink",
      "Machine Category": "K13 Lite Pink",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-oven",
    "name": "Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & Oven",
    "slug": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-oven",
    "price": "Rs.1,481,000.00 PKR",
    "originalPrice": "Rs.1,623,500.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 8.2\"(210mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L1800",
      "Consumables": "Ink",
      "Machine Category": "K13 Lite Pink",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-oven-premium",
    "name": "Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & Oven Premium",
    "slug": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-oven-premium",
    "price": "Rs.1,623,400.00 PKR",
    "originalPrice": "Rs.1,765,900.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 8.3\"(210mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "L1800",
      "Consumables": "Ink",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-dtf-shaker-bundle",
    "name": "Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & DTF Shaker Bundle",
    "slug": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-dtf-shaker-bundle",
    "price": "Rs.1,822,800.00 PKR",
    "originalPrice": "Rs.1,965,300.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.3\"(287mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 4.5min",
      "Printer Head": "LH-500",
      "Consumables": "Ink",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-bracket",
    "name": "Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & Bracket",
    "slug": "procolored-f13-pro-panda-dtf-printer-13-a3-dual-xp600-bracket",
    "price": "Rs.1,481,000.00 PKR",
    "originalPrice": "Rs.1,595,000.00 PKR",
    "savings": "Rs.114,000.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.3\"(287mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 6min",
      "Printer Head": "LH-500",
      "Consumables": "Ink",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-stand-oven",
    "name": "Procolored F13 Pro + Stand + Oven",
    "slug": "procolored-f13-pro-stand-oven",
    "price": "Rs.1,595,000.00 PKR",
    "originalPrice": "Rs.1,737,500.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.3\"(287mm)",
      "Resolution": "1440*1400 DPI (8 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "LH-500",
      "Consumables": "Film",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-stand-oven-premium",
    "name": "Procolored F13 Pro + Stand + Oven Premium",
    "slug": "procolored-f13-pro-stand-oven-premium",
    "price": "Rs.1,708,900.00 PKR",
    "originalPrice": "Rs.1,879,900.00 PKR",
    "savings": "Rs.171,000.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.7\"(297mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "LH-500",
      "Consumables": "Film",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-f13-pro-stand-shaker-oven",
    "name": "Procolored F13 Pro + Stand + Shaker Oven",
    "slug": "procolored-f13-pro-stand-shaker-oven",
    "price": "Rs.1,879,800.00 PKR",
    "originalPrice": "Rs.2,079,300.00 PKR",
    "savings": "Rs.199,500.00 PKR",
    "badge": "F13 Pro Spring Sale",
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.8\"(300mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "LH-500",
      "Consumables": "Film",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-white",
    "name": "Procolored K13 Lite DTF Printer 13\" A3 White",
    "slug": "procolored-k13-lite-dtf-printer-13-a3-white",
    "price": "Rs.569,500.00 PKR",
    "originalPrice": "Rs.854,400.00 PKR",
    "savings": "Rs.284,900.00 PKR",
    "badge": "🆕 New Arrival",
    "image": "/images/product-k13-white.jpg",
    "sections": [
      "DTF Printer",
      "What's New"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.8\"(300mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "LH-500",
      "Consumables": "Film",
      "Machine Category": "P13 Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-white",
    "name": "Procolored K13 Lite DTF Printer 13\" A3 & Oven White",
    "slug": "procolored-k13-lite-dtf-printer-13-a3-oven-white",
    "price": "Rs.711,900.00 PKR",
    "originalPrice": "Rs.1,025,000.00 PKR",
    "savings": "Rs.313,100.00 PKR",
    "badge": "🆕 New Arrival",
    "image": "/images/product-k13-white.jpg",
    "sections": [
      "DTF Printer",
      "What's New"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.8\"(300mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "R1390",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-premium-white",
    "name": "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium White",
    "slug": "procolored-k13-lite-dtf-printer-13-a3-oven-premium-white",
    "price": "Rs.797,400.00 PKR",
    "originalPrice": "Rs.1,139,200.00 PKR",
    "savings": "Rs.341,800.00 PKR",
    "badge": "🆕 New Arrival",
    "image": "/images/product-k13-white.jpg",
    "sections": [
      "DTF Printer",
      "What's New"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 11.8\"(300mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "TX800",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-pink",
    "name": "Procolored K13 Lite DTF Printer 13\" A3 Pink",
    "slug": "procolored-k13-lite-dtf-printer-13-a3-pink",
    "price": "Rs.569,500.00 PKR",
    "originalPrice": "Rs.854,400.00 PKR",
    "savings": "Rs.284,900.00 PKR",
    "badge": "🆕 New Arrival",
    "image": "/images/product-k13-pink.jpg",
    "sections": [
      "DTF Printer",
      "What's New"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "TX800",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-pink",
    "name": "Procolored K13 Lite DTF Printer 13\" A3 & Oven Pink",
    "slug": "procolored-k13-lite-dtf-printer-13-a3-oven-pink",
    "price": "Rs.711,900.00 PKR",
    "originalPrice": "Rs.1,025,000.00 PKR",
    "savings": "Rs.313,100.00 PKR",
    "badge": "🆕 New Arrival",
    "image": "/images/product-k13-pink.jpg",
    "sections": [
      "DTF Printer",
      "What's New"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "TX800",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink",
    "name": "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium Pink",
    "slug": "procolored-k13-lite-dtf-printer-13-a3-oven-premium-pink",
    "price": "Rs.797,400.00 PKR",
    "originalPrice": "Rs.1,139,200.00 PKR",
    "savings": "Rs.341,800.00 PKR",
    "badge": "🆕 New Arrival",
    "image": "/images/product-k13-pink.jpg",
    "sections": [
      "DTF Printer",
      "What's New"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7min",
      "Printer Head": "XP600",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-k-series-dtf-printer",
    "name": "Procolored K Series DTF Printer",
    "slug": "procolored-k-series-dtf-printer",
    "price": "Rs.569,500.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 🔜 Coming Soon",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 7.5min",
      "Printer Head": "XP600",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV DTF Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600",
    "price": "Rs.1,025,200.00 PKR",
    "originalPrice": "Rs.1,224,700.00 PKR",
    "savings": "Rs.199,500.00 PKR",
    "badge": "🆕 P13 Exclusive Deal",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 8~9min",
      "Printer Head": "XP600",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600-oven",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600 & Oven",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600-oven",
    "price": "Rs.1,139,200.00 PKR",
    "originalPrice": "Rs.1,310,200.00 PKR",
    "savings": "Rs.171,000.00 PKR",
    "badge": "🆕 P13 Exclusive Deal",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 8~9min",
      "Printer Head": "XP600",
      "Consumables": "Film",
      "Machine Category": "F13 Pro Series",
      "Consumables Category": "UV Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600-oven-premium",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600 & Oven Premium",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600-oven-premium",
    "price": "Rs.1,224,600.00 PKR",
    "originalPrice": "Rs.1,424,100.00 PKR",
    "savings": "Rs.199,500.00 PKR",
    "badge": "🆕 P13 Exclusive Deal",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 10min",
      "Printer Head": "XP600",
      "Consumables": "Powder",
      "Machine Category": "F13 Series",
      "Consumables Category": "UV Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600-dtf-shaker-bundle",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600 & DTF Shaker Bundle",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600-dtf-shaker-bundle",
    "price": "Rs.1,481,000.00 PKR",
    "originalPrice": "Rs.1,623,500.00 PKR",
    "savings": "Rs.142,500.00 PKR",
    "badge": "🆕 P13 Exclusive Deal",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 10min",
      "Printer Head": "XP600",
      "Consumables": "Coatings",
      "Machine Category": "F13 Series",
      "Consumables Category": "UV Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600-macos",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600 MacOS",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600-macos",
    "price": "Rs.1,224,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 🔜 Coming Soon",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 12.5min",
      "Printer Head": "XP600",
      "Consumables": "Other liquids",
      "Machine Category": "F8 Series",
      "Consumables Category": "UV Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600-oven-macos",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600 & Oven MacOS",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600-oven-macos",
    "price": "Rs.1,310,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 🔜 Coming Soon",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTG",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 Pass)",
      "Print Speed": "Letter/A4: 12.5min",
      "Printer Head": "XP600",
      "Consumables": "Other liquids",
      "Machine Category": "F8 Series",
      "Consumables Category": "UV Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-p13-dtf-printer-13-a3-xp600-dtf-shaker-bundle-macos",
    "name": "Procolored P13 DTF Printer 13\" A3 XP600 & DTF Shaker Bundle MacOS",
    "slug": "procolored-p13-dtf-printer-13-a3-xp600-dtf-shaker-bundle-macos",
    "price": "Rs.1,709,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 🔜 Coming Soon",
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTF Printer"
    ],
    "filters": {
      "Print Type": "DTG",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 PASS)",
      "Print Speed": "Letter/A4: 12.5min",
      "Printer Head": "XP600",
      "Consumables": "Other liquids",
      "Consumables Category": "DTG Consumables",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1",
    "name": "Procolored VF13 Pro Panda UV DTF Printer 13\" A3+ Dual XP600 2-in-1",
    "slug": "procolored-vf13-pro-panda-uv-dtf-printer-13-a3-dual-xp600-2-in-1",
    "price": "Rs.1,965,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/product-f13-panda.jpg",
    "sections": [
      "UV DTF Printer"
    ],
    "filters": {
      "Print Type": "DTG",
      "Print Size": "Width: 13\"(330mm)",
      "Resolution": "720*1440 DPI (16 PASS)",
      "Print Speed": "Letter/A4: 12.5min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-v4-uv-printer-4-7-a5-l800",
    "name": "Procolored V4 UV Printer 4.7\" A5 L800",
    "slug": "procolored-v4-uv-printer-4-7-a5-l800",
    "price": "Rs.655,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "UV Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Print Speed": "Letter/A4: 12.5min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-v6-panda-uv-printer-6-7-a4-l800",
    "name": "Procolored V6 Panda UV Printer 6.7\" A4 L800",
    "slug": "procolored-v6-panda-uv-printer-6-7-a4-l800",
    "price": "Rs.1,025,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "UV Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Print Speed": "Letter/A4: 12.5min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-v11-uv-printer-11-4-a3-r1390",
    "name": "Procolored V11 UV Printer 11.4\" A3 R1390",
    "slug": "procolored-v11-uv-printer-11-4-a3-r1390",
    "price": "Rs.1,481,100.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "UV Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Print Speed": "Letter/A4: 14min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-v11-pro-uv-printer-11-4-a3-dual-tx800",
    "name": "Procolored V11 Pro UV Printer 11.4\" A3 Dual TX800",
    "slug": "procolored-v11-pro-uv-printer-11-4-a3-dual-tx800",
    "price": "Rs.1,709,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "UV Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Print Speed": "Letter/A4: 23 min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs",
    "name": "Procolored V11 Pro UV Printer 11.4\" A3 Dual TX800 & Jigs",
    "slug": "procolored-v11-pro-uv-printer-11-4-a3-dual-tx800-jigs",
    "price": "Rs.1,908,400.00 PKR",
    "originalPrice": "Rs.1,948,300.00 PKR",
    "savings": "Rs.39,900.00 PKR",
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "UV Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Print Speed": "Letter/A4: 23 min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-t8-panda-dtg-printer-8-2-a4-l800",
    "name": "Procolored T8 Panda DTG Printer 8.2\" A4 L800",
    "slug": "procolored-t8-panda-dtg-printer-8-2-a4-l800",
    "price": "Rs.1,025,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTG Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Print Speed": "Letter/A4: 23 min",
      "Printer Head": "XP600",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-t11-pro-dtg-printer-11-8-a3-dual-tx800",
    "name": "Procolored T11 Pro DTG Printer 11.8\" A3 Dual TX800",
    "slug": "procolored-t11-pro-dtg-printer-11-8-a3-dual-tx800",
    "price": "Rs.1,709,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "DTG Printer"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-oven-for-dtf-printer-upgraded",
    "name": "Procolored Oven For DTF Printer Upgraded",
    "slug": "procolored-oven-for-dtf-printer-upgraded",
    "price": "Rs.170,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-smokeless-oven-for-dtf-printer-premium",
    "name": "Procolored Smokeless Oven for DTF Printer Premium",
    "slug": "procolored-smokeless-oven-for-dtf-printer-premium",
    "price": "Rs.284,600.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment",
      "What's New"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-powder-shaking-and-drying-all-in-one-machine",
    "name": "Procolored Powder Shaking And Drying All-In-One Machine",
    "slug": "procolored-powder-shaking-and-drying-all-in-one-machine",
    "price": "Rs.512,500.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-oven-heating-plate",
    "name": "Procolored Oven Heating Plate",
    "slug": "procolored-oven-heating-plate",
    "price": "Rs.56,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment",
      "What's New"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-oven-temperature-controller",
    "name": "Procolored Oven Temperature Controller",
    "slug": "procolored-oven-temperature-controller",
    "price": "Rs.16,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment",
      "What's New"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-oven-exhaust-gas-filter",
    "name": "Procolored Oven Exhaust Gas Filter",
    "slug": "procolored-oven-exhaust-gas-filter",
    "price": "Rs.14,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Print Size": "Width: 13\"(330mm)",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-cooling-block",
    "name": "Procolored DTF Cooling Block",
    "slug": "procolored-dtf-cooling-block",
    "price": "Rs.14,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Availability": "In stock"
    }
  },
  {
    "id": "printer-bracket-for-procolored-dtf-pro-and-mini-uv-dtf-printers",
    "name": "Printer Bracket For Procolored DTF Pro and Mini UV DTF Printers",
    "slug": "printer-bracket-for-procolored-dtf-pro-and-mini-uv-dtf-printers",
    "price": "Rs.142,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-jigs-for-uv-printer",
    "name": "Procolored Jigs For UV Printer",
    "slug": "procolored-jigs-for-uv-printer",
    "price": "Rs.227,700.00 PKR",
    "originalPrice": "Rs.241,900.00 PKR",
    "savings": "Rs.14,200.00 PKR",
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-a3-a4-garment-jig-for-dtg-printer",
    "name": "Procolored A3/A4 Garment Jig For DTG Printer",
    "slug": "procolored-a3-a4-garment-jig-for-dtg-printer",
    "price": "Rs.36,800.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Print Type": "UV DTF",
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-film-holder-fit-for-13-dtf-roll-film",
    "name": "Procolored Film Holder Fit For 13\" DTF Roll Film",
    "slug": "procolored-film-holder-fit-for-13-dtf-roll-film",
    "price": "Rs.33,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-protective-printhead-moisturizing-device",
    "name": "Procolored Printer Protective Printhead Moisturizing Device",
    "slug": "procolored-printer-protective-printhead-moisturizing-device",
    "price": "Rs.42,500.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Equipment"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-white-ink-for-dtf-printing",
    "name": "Procolored White Ink for DTF Printing",
    "slug": "procolored-white-ink-for-dtf-printing",
    "price": "Rs.14,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-white-ink-for-uv-dtf-printing-500ml",
    "name": "Procolored White Ink for UV DTF Printing 500ml",
    "slug": "procolored-white-ink-for-uv-dtf-printing-500ml",
    "price": "Rs.16,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-white-ink-for-uv-printing-500ml",
    "name": "Procolored White Ink for UV Printing 500ml",
    "slug": "procolored-white-ink-for-uv-printing-500ml",
    "price": "Rs.16,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-ink-for-uv-dtf-printer-500ml",
    "name": "Procolored Ink for UV DTF Printer 500ml",
    "slug": "procolored-ink-for-uv-dtf-printer-500ml",
    "price": "Rs.53,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-ink-for-uv-printer-500ml",
    "name": "Procolored Ink for UV Printer 500ml",
    "slug": "procolored-ink-for-uv-printer-500ml",
    "price": "Rs.53,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-direct-to-transfer-film-ink-250ml",
    "name": "Procolored Direct to Transfer Film Ink 250ml",
    "slug": "procolored-direct-to-transfer-film-ink-250ml",
    "price": "Rs.36,800.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-direct-to-transfer-film-ink-500ml",
    "name": "Procolored Direct to Transfer Film Ink 500ml",
    "slug": "procolored-direct-to-transfer-film-ink-500ml",
    "price": "Rs.65,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-direct-to-garment-textile-ink-500ml",
    "name": "Procolored Direct to Garment Textile Ink 500ml",
    "slug": "procolored-direct-to-garment-textile-ink-500ml",
    "price": "Rs.65,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-uv-varnish-ink-500ml",
    "name": "Procolored UV Varnish Ink 500ml",
    "slug": "procolored-uv-varnish-ink-500ml",
    "price": "Rs.16,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-ink-cleaner-dtf-500ml",
    "name": "Procolored Ink Cleaner DTF 500ml",
    "slug": "procolored-ink-cleaner-dtf-500ml",
    "price": "Rs.19,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-ink-cleaner-uv-500ml",
    "name": "Procolored Ink Cleaner UV 500ml",
    "slug": "procolored-ink-cleaner-uv-500ml",
    "price": "Rs.19,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-ink-adhesion-promoter-500ml",
    "name": "Procolored Ink Adhesion Promoter 500ml",
    "slug": "procolored-ink-adhesion-promoter-500ml",
    "price": "Rs.16,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-nozzle-protection-moisturizing-liquid-500ml",
    "name": "Procolored Nozzle Protection Moisturizing Liquid 500ml",
    "slug": "procolored-nozzle-protection-moisturizing-liquid-500ml",
    "price": "Rs.16,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-direct-to-transfer-film-powder",
    "name": "Procolored Direct to Transfer Film Powder",
    "slug": "procolored-direct-to-transfer-film-powder",
    "price": "Rs.10,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-pretreat-transfer-roll-film-8-2-x-328-ft",
    "name": "Procolored DTF PreTreat Transfer Roll Film 8.2\" x 328 FT",
    "slug": "procolored-dtf-pretreat-transfer-roll-film-8-2-x-328-ft",
    "price": "Rs.25,400.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-pretreat-transfer-roll-film-13-x-328-ft",
    "name": "Procolored DTF PreTreat Transfer Roll Film 13\" x 328 FT",
    "slug": "procolored-dtf-pretreat-transfer-roll-film-13-x-328-ft",
    "price": "Rs.48,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-pretreat-transfer-sheet-film-a3",
    "name": "Procolored DTF PreTreat Transfer Sheet Film A3",
    "slug": "procolored-dtf-pretreat-transfer-sheet-film-a3",
    "price": "Rs.25,400.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-pretreat-transfer-sheet-film-a4",
    "name": "Procolored DTF PreTreat Transfer Sheet Film A4",
    "slug": "procolored-dtf-pretreat-transfer-sheet-film-a4",
    "price": "Rs.19,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-gilt-veil-transfer-roll-film-11-8-x-328-ft",
    "name": "Procolored DTF Gilt Veil Transfer Roll Film 11.8\" x 328 FT",
    "slug": "procolored-dtf-gilt-veil-transfer-roll-film-11-8-x-328-ft",
    "price": "Rs.53,900.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-chameleon-transfer-roll-film-11-8-x-328-ft",
    "name": "Procolored DTF Chameleon Transfer Roll Film 11.8\" x 328 FT",
    "slug": "procolored-dtf-chameleon-transfer-roll-film-11-8-x-328-ft",
    "price": "Rs.48,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-luminous-transfer-roll-film-11-8-x-328-ft",
    "name": "Procolored DTF Luminous Transfer Roll Film 11.8\" x 328 FT",
    "slug": "procolored-dtf-luminous-transfer-roll-film-11-8-x-328-ft",
    "price": "Rs.56,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-dtf-glitter-transfer-roll-film-11-8-x-328-ft",
    "name": "Procolored DTF Glitter Transfer Roll Film 11.8\" x 328 FT",
    "slug": "procolored-dtf-glitter-transfer-roll-film-11-8-x-328-ft",
    "price": "Rs.48,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-uv-dtf-transfer-hot-stamping-gold-film",
    "name": "Procolored UV DTF Transfer Hot Stamping Gold Film",
    "slug": "procolored-uv-dtf-transfer-hot-stamping-gold-film",
    "price": "Rs.56,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-uv-dtf-transfer-hot-stamping-silver-film",
    "name": "Procolored UV DTF Transfer Hot Stamping Silver Film",
    "slug": "procolored-uv-dtf-transfer-hot-stamping-silver-film",
    "price": "Rs.65,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-uv-dtf-transfer-clear-ab-film",
    "name": "Procolored UV DTF Transfer Clear AB Film",
    "slug": "procolored-uv-dtf-transfer-clear-ab-film",
    "price": "Rs.45,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-transfer-ab-film-uv-laminator",
    "name": "Procolored Transfer AB Film UV Laminator",
    "slug": "procolored-transfer-ab-film-uv-laminator",
    "price": "Rs.56,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "cleaning-kits",
    "name": "Cleaning Kits",
    "slug": "cleaning-kits",
    "price": "Rs.14,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Consumables"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-control-board",
    "name": "Procolored Printer Control Board",
    "slug": "procolored-printer-control-board",
    "price": "Rs.51,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-power-board",
    "name": "Procolored Printer Power Board",
    "slug": "procolored-printer-power-board",
    "price": "Rs.28,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printhead-driver-board",
    "name": "Procolored Printhead Driver Board",
    "slug": "procolored-printhead-driver-board",
    "price": "Rs.170,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-startup-button-board",
    "name": "Procolored Printer Startup Button Board",
    "slug": "procolored-printer-startup-button-board",
    "price": "Rs.28,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-motherboard",
    "name": "Procolored Printer Motherboard",
    "slug": "procolored-printer-motherboard",
    "price": "Rs.42,500.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-switching-power-supply-l1800-r1390",
    "name": "Procolored Printer Switching Power Supply L1800/R1390",
    "slug": "procolored-printer-switching-power-supply-l1800-r1390",
    "price": "Rs.28,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-original-print-head-brand-new-100",
    "name": "Procolored Original Print Head Brand New 100%",
    "slug": "procolored-original-print-head-brand-new-100",
    "price": "Rs.91,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printhead-capping-unit",
    "name": "Procolored Printhead Capping Unit",
    "slug": "procolored-printhead-capping-unit",
    "price": "Rs.14,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory",
      "What's New"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-white-ink-circulation-pump-ink-waste-pump-fit-for-procolored-printer",
    "name": "Procolored White Ink Circulation Pump/Ink Waste Pump (Fit For Procolored Printer)",
    "slug": "procolored-white-ink-circulation-pump-ink-waste-pump-fit-for-procolored-printer",
    "price": "Rs.22,600.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory",
      "What's New"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-white-ink-circulation-pump-ink-waste-pump",
    "name": "Procolored White Ink Circulation Pump/Ink Waste Pump",
    "slug": "procolored-white-ink-circulation-pump-ink-waste-pump",
    "price": "Rs.19,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-ink-carriage-for-dtf-printer",
    "name": "Procolored Printer Ink Carriage for DTF Printer",
    "slug": "procolored-printer-ink-carriage-for-dtf-printer",
    "price": "Rs.28,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-ink-tank",
    "name": "Procolored Printer Ink Tank",
    "slug": "procolored-printer-ink-tank",
    "price": "Rs.14,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory",
      "What's New"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-ink-tank-with-agitator",
    "name": "Procolored Printer Ink Tank with Agitator",
    "slug": "procolored-printer-ink-tank-with-agitator",
    "price": "Rs.22,600.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory",
      "What's New"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-power-socket-with-switch",
    "name": "Procolored Power Socket with Switch",
    "slug": "procolored-power-socket-with-switch",
    "price": "Rs.11,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": "🆕 New Arrival",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory",
      "What's New"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-cartridges-12pcs",
    "name": "Procolored Printer Cartridges 12PCS",
    "slug": "procolored-printer-cartridges-12pcs",
    "price": "Rs.11,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-6x120cm-ink-sac-tubes-with-cartridges",
    "name": "Procolored Printer 6x120cm Ink Sac Tubes With Cartridges",
    "slug": "procolored-printer-6x120cm-ink-sac-tubes-with-cartridges",
    "price": "Rs.25,400.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-printer-6x120cm-ink-sac-tubes-with-cartridges-variant",
    "name": "Procolored Printer 6x120cm Ink Sac Tubes With Cartridges variant",
    "slug": "procolored-printer-6x120cm-ink-sac-tubes-with-cartridges-variant",
    "price": "Rs.19,700.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "usb-dongle-for-procolored-rip-v2-3",
    "name": "USB Dongle for Procolored RIP V2.3",
    "slug": "usb-dongle-for-procolored-rip-v2-3",
    "price": "Rs.39,600.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Parts & Accessory"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-extended-warranty-service",
    "name": "Procolored Extended Warranty Service",
    "slug": "procolored-extended-warranty-service",
    "price": "Rs.199,200.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Extended Warranty"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-remote-expert-service",
    "name": "Procolored Remote Expert Service",
    "slug": "procolored-remote-expert-service",
    "price": "Rs.14,300.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Extended Warranty"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-gift-card",
    "name": "Procolored Gift Card",
    "slug": "procolored-gift-card",
    "price": "Rs.28,486.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Extended Warranty"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "procolored-selected-material-10-discount-card",
    "name": "Procolored Selected Material 10% Discount Card",
    "slug": "procolored-selected-material-10-discount-card",
    "price": "Rs.14,300.00 PKR",
    "originalPrice": "Rs.22,800.00 PKR",
    "savings": "Rs.8,500.00 PKR",
    "badge": "🔜",
    "image": "/images/placeholder.jpg",
    "sections": [
      "Extended Warranty"
    ],
    "filters": {
      "Availability": "In stock"
    }
  },
  {
    "id": "shipping-cost-dhl-air-express",
    "name": "Shipping Cost DHL Air Express",
    "slug": "shipping-cost-dhl-air-express",
    "price": "Rs.10,000.00 PKR",
    "originalPrice": null,
    "savings": null,
    "badge": null,
    "image": "/images/placeholder.jpg",
    "sections": [
      "Extended Warranty"
    ],
    "filters": {
      "Availability": "In stock"
    }
  }
];
