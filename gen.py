import json
import re

products_data = [
    # DTF
    ("Procolored F8 Panda DTF Printer 8.2\" A4 L800", "Rs.541,000.00", None, None),
    ("Procolored F8 Panda DTF Printer 8.2\" A4 L800 & Oven", "Rs.683,400.00", None, None),
    ("Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven", "Rs.854,300.00", "Rs.996,800.00", "⭐ Best Seller — Fan Appreciation Sale"),
    ("Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven Premium", "Rs.996,700.00", "Rs.1,139,200.00", "⭐ Best Seller — Fan Appreciation Sale"),
    ("Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600", "Rs.1,367,100.00", "Rs.1,481,100.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & Oven", "Rs.1,481,000.00", "Rs.1,623,500.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & Oven Premium", "Rs.1,623,400.00", "Rs.1,765,900.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & DTF Shaker Bundle", "Rs.1,822,800.00", "Rs.1,965,300.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro Panda DTF Printer 13\" A3 Dual XP600 & Bracket", "Rs.1,481,000.00", "Rs.1,595,000.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro + Stand + Oven", "Rs.1,595,000.00", "Rs.1,737,500.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro + Stand + Oven Premium", "Rs.1,708,900.00", "Rs.1,879,900.00", "F13 Pro Spring Sale"),
    ("Procolored F13 Pro + Stand + Shaker Oven", "Rs.1,879,800.00", "Rs.2,079,300.00", "F13 Pro Spring Sale"),
    ("Procolored K13 Lite DTF Printer 13\" A3 White", "Rs.569,500.00", "Rs.854,400.00", "🆕 New Arrival"),
    ("Procolored K13 Lite DTF Printer 13\" A3 & Oven White", "Rs.711,900.00", "Rs.1,025,000.00", "🆕 New Arrival"),
    ("Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium White", "Rs.797,400.00", "Rs.1,139,200.00", "🆕 New Arrival"),
    ("Procolored K13 Lite DTF Printer 13\" A3 Pink", "Rs.569,500.00", "Rs.854,400.00", "🆕 New Arrival"),
    ("Procolored K13 Lite DTF Printer 13\" A3 & Oven Pink", "Rs.711,900.00", "Rs.1,025,000.00", "🆕 New Arrival"),
    ("Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium Pink", "Rs.797,400.00", "Rs.1,139,200.00", "🆕 New Arrival"),
    ("Procolored K Series DTF Printer", "Rs.569,500.00", None, "🆕 🔜 Coming Soon"),
    ("Procolored P13 DTF Printer 13\" A3 XP600", "Rs.1,025,200.00", "Rs.1,224,700.00", "🆕 P13 Exclusive Deal"),
    ("Procolored P13 DTF Printer 13\" A3 XP600 & Oven", "Rs.1,139,200.00", "Rs.1,310,200.00", "🆕 P13 Exclusive Deal"),
    ("Procolored P13 DTF Printer 13\" A3 XP600 & Oven Premium", "Rs.1,224,600.00", "Rs.1,424,100.00", "🆕 P13 Exclusive Deal"),
    ("Procolored P13 DTF Printer 13\" A3 XP600 & DTF Shaker Bundle", "Rs.1,481,000.00", "Rs.1,623,500.00", "🆕 P13 Exclusive Deal"),
    ("Procolored P13 DTF Printer 13\" A3 XP600 MacOS", "Rs.1,224,700.00", None, "🆕 🔜 Coming Soon"),
    ("Procolored P13 DTF Printer 13\" A3 XP600 & Oven MacOS", "Rs.1,310,200.00", None, "🆕 🔜 Coming Soon"),
    ("Procolored P13 DTF Printer 13\" A3 XP600 & DTF Shaker Bundle MacOS", "Rs.1,709,000.00", None, "🆕 🔜 Coming Soon"),
    
    # UV DTF
    ("Procolored VF13 Pro Panda UV DTF Printer 13\" A3+ Dual XP600 2-in-1", "Rs.1,965,300.00", None, None),

    # UV
    ("Procolored V4 UV Printer 4.7\" A5 L800", "Rs.655,000.00", None, None),
    ("Procolored V6 Panda UV Printer 6.7\" A4 L800", "Rs.1,025,300.00", None, None),
    ("Procolored V11 UV Printer 11.4\" A3 R1390", "Rs.1,481,100.00", None, None),
    ("Procolored V11 Pro UV Printer 11.4\" A3 Dual TX800", "Rs.1,709,000.00", None, None),
    ("Procolored V11 Pro UV Printer 11.4\" A3 Dual TX800 & Jigs", "Rs.1,908,400.00", "Rs.1,948,300.00", None),

    # DTG
    ("Procolored T8 Panda DTG Printer 8.2\" A4 L800", "Rs.1,025,300.00", None, None),
    ("Procolored T11 Pro DTG Printer 11.8\" A3 Dual TX800", "Rs.1,709,000.00", None, None),

    # Equipment
    ("Procolored Oven For DTF Printer Upgraded", "Rs.170,700.00", None, None),
    ("Procolored Smokeless Oven for DTF Printer Premium", "Rs.284,600.00", None, "🆕 New Arrival"),
    ("Procolored Powder Shaking And Drying All-In-One Machine", "Rs.512,500.00", None, None),
    ("Procolored Oven Heating Plate", "Rs.56,700.00", None, "🆕 New Arrival"),
    ("Procolored Oven Temperature Controller", "Rs.16,900.00", None, "🆕 New Arrival"),
    ("Procolored Oven Exhaust Gas Filter", "Rs.14,000.00", None, None),
    ("Procolored DTF Cooling Block", "Rs.14,000.00", None, None),
    ("Printer Bracket For Procolored DTF Pro and Mini UV DTF Printers", "Rs.142,200.00", None, None),
    ("Procolored Jigs For UV Printer", "Rs.227,700.00", "Rs.241,900.00", None),
    ("Procolored A3/A4 Garment Jig For DTG Printer", "Rs.36,800.00", None, None),
    ("Procolored Film Holder Fit For 13\" DTF Roll Film", "Rs.33,900.00", None, None),
    ("Procolored Printer Protective Printhead Moisturizing Device", "Rs.42,500.00", None, None),

    # Consumables
    ("Procolored White Ink for DTF Printing", "Rs.14,000.00", None, None),
    ("Procolored White Ink for UV DTF Printing 500ml", "Rs.16,900.00", None, None),
    ("Procolored White Ink for UV Printing 500ml", "Rs.16,900.00", None, None),
    ("Procolored Ink for UV DTF Printer 500ml", "Rs.53,900.00", None, None),
    ("Procolored Ink for UV Printer 500ml", "Rs.53,900.00", None, None),
    ("Procolored Direct to Transfer Film Ink 250ml", "Rs.36,800.00", None, None),
    ("Procolored Direct to Transfer Film Ink 500ml", "Rs.65,300.00", None, None),
    ("Procolored Direct to Garment Textile Ink 500ml", "Rs.65,300.00", None, None),
    ("Procolored UV Varnish Ink 500ml", "Rs.16,900.00", None, None),
    ("Procolored Ink Cleaner DTF 500ml", "Rs.19,700.00", None, None),
    ("Procolored Ink Cleaner UV 500ml", "Rs.19,700.00", None, None),
    ("Procolored Ink Adhesion Promoter 500ml", "Rs.16,900.00", None, None),
    ("Procolored Nozzle Protection Moisturizing Liquid 500ml", "Rs.16,900.00", None, None),
    ("Procolored Direct to Transfer Film Powder", "Rs.10,900.00", None, None),
    ("Procolored DTF PreTreat Transfer Roll Film 8.2\" x 328 FT", "Rs.25,400.00", None, None),
    ("Procolored DTF PreTreat Transfer Roll Film 13\" x 328 FT", "Rs.48,200.00", None, None),
    ("Procolored DTF PreTreat Transfer Sheet Film A3", "Rs.25,400.00", None, None),
    ("Procolored DTF PreTreat Transfer Sheet Film A4", "Rs.19,700.00", None, None),
    ("Procolored DTF Gilt Veil Transfer Roll Film 11.8\" x 328 FT", "Rs.53,900.00", None, None),
    ("Procolored DTF Chameleon Transfer Roll Film 11.8\" x 328 FT", "Rs.48,200.00", None, None),
    ("Procolored DTF Luminous Transfer Roll Film 11.8\" x 328 FT", "Rs.56,700.00", None, None),
    ("Procolored DTF Glitter Transfer Roll Film 11.8\" x 328 FT", "Rs.48,200.00", None, None),
    ("Procolored UV DTF Transfer Hot Stamping Gold Film", "Rs.56,700.00", None, None),
    ("Procolored UV DTF Transfer Hot Stamping Silver Film", "Rs.65,300.00", None, None),
    ("Procolored UV DTF Transfer Clear AB Film", "Rs.45,300.00", None, None),
    ("Procolored Transfer AB Film UV Laminator", "Rs.56,700.00", None, None),
    ("Cleaning Kits", "Rs.14,000.00", None, None),

    # Parts & Accessory
    ("Procolored Printer Control Board", "Rs.51,000.00", None, None),
    ("Procolored Printer Power Board", "Rs.28,300.00", None, None),
    ("Procolored Printhead Driver Board", "Rs.170,700.00", None, None),
    ("Procolored Printer Startup Button Board", "Rs.28,300.00", None, None),
    ("Procolored Printer Motherboard", "Rs.42,500.00", None, None),
    ("Procolored Printer Switching Power Supply L1800/R1390", "Rs.28,300.00", None, None),
    ("Procolored Original Print Head Brand New 100%", "Rs.91,200.00", None, None),
    ("Procolored Printhead Capping Unit", "Rs.14,000.00", None, "🆕 New Arrival"),
    ("Procolored White Ink Circulation Pump/Ink Waste Pump (Fit For Procolored Printer)", "Rs.22,600.00", None, "🆕 New Arrival"),
    ("Procolored White Ink Circulation Pump/Ink Waste Pump", "Rs.19,700.00", None, None),
    ("Procolored Printer Ink Carriage for DTF Printer", "Rs.28,300.00", None, None),
    ("Procolored Printer Ink Tank", "Rs.14,000.00", None, "🆕 New Arrival"),
    ("Procolored Printer Ink Tank with Agitator", "Rs.22,600.00", None, "🆕 New Arrival"),
    ("Procolored Power Socket with Switch", "Rs.11,200.00", None, "🆕 New Arrival"),
    ("Procolored Printer Cartridges 12PCS", "Rs.11,200.00", None, None),
    ("Procolored Printer 6x120cm Ink Sac Tubes With Cartridges", "Rs.25,400.00", None, None),
    ("Procolored Printer 6x120cm Ink Sac Tubes With Cartridges variant", "Rs.19,700.00", None, None),
    ("USB Dongle for Procolored RIP V2.3", "Rs.39,600.00", None, None),

    # Extended Warranty
    ("Procolored Extended Warranty Service", "Rs.199,200.00", None, None),
    ("Procolored Remote Expert Service", "Rs.14,300.00", None, None),
    ("Procolored Gift Card", "Rs.28,486.00", None, None),
    ("Procolored Selected Material 10% Discount Card", "Rs.14,300.00", "Rs.22,800.00", "🔜"),
    ("Shipping Cost DHL Air Express", "Rs.10,000.00", None, None),
]

products = []

def get_section(i):
    if i < 26: return ["DTF Printer"]
    if i < 27: return ["UV DTF Printer"]
    if i < 32: return ["UV Printer"]
    if i < 34: return ["DTG Printer"]
    if i < 46: return ["Equipment"]
    if i < 73: return ["Consumables"]
    if i < 91: return ["Parts & Accessory"]
    return ["Extended Warranty"]

ptype_counts = {'DTF': 24, 'DTG': 3, 'UV': 10, 'UV DTF': 7}
psize_counts = {
    '8.2" × 12.9"': 1,
    'Width: 6.7"(170mm)': 2,
    'Width: 8.2"(210mm)': 3,
    'Width: 8.3"(210mm)': 1,
    'Width: 11.3"(287mm)': 3,
    'Width: 11.7"(297mm)': 1,
    'Width: 11.8"(300mm)': 4,
    'Width: 13"(330mm)': 25
}
res_counts = {
    '1440*1400 DPI (8 Pass)': 10,
    '720*1440 DPI (16 Pass)': 15,
    '720*1440 DPI (16 PASS)': 2
}
speed_counts = {
    'Letter/A4: 4.5min': 8,
    'Letter/A4: 6min': 1,
    'Letter/A4: 7min': 9,
    'Letter/A4: 7.5min': 1,
    'Letter/A4: 8~9min': 2,
    'Letter/A4: 10min': 2,
    'Letter/A4: 12.5min': 6,
    'Letter/A4: 14min': 1,
    'Letter/A4: 23 min': 3
}
head_counts = {
    'L800': 5,
    'L1800': 2,
    'LH-500': 6,
    'R1390': 1,
    'TX800': 3,
    'XP600': 16
}
sub_counts = {
    '0-0.059" (0-15mm)': 1,
    '0-4.33" (0-110mm)': 1,
    '0-5.51" (0-140mm)': 3
}
cons_counts = {
    'Ink': 9,
    'Film': 12,
    'Powder': 1,
    'Coatings': 1,
    'Other liquids': 3
}
mc_counts = {
    'K13 Lite White': 3,
    'K13 Lite Pink': 3,
    'P13 Series': 7,
    'F13 Pro Series': 8,
    'F13 Series': 2,
    'F8 Series': 2
}
cc_counts = {
    'DTF Consumables': 14,
    'UV DTF Consumables': 5,
    'UV Consumables': 6,
    'DTG Consumables': 1
}

def pop_count(d):
    for k, v in list(d.items()):
        if v > 0:
            d[k] -= 1
            return k
    return None

import string
import re

for i, (name, price_str, orig_price_str, badge) in enumerate(products_data):
    sections = get_section(i)
    
    pt = pop_count(ptype_counts)
    ps = pop_count(psize_counts)
    res = pop_count(res_counts)
    speed = pop_count(speed_counts)
    head = pop_count(head_counts)
    sub = pop_count(sub_counts)
    cons = pop_count(cons_counts)
    mc = pop_count(mc_counts)
    cc = pop_count(cc_counts)

    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

    image_src = "/images/placeholder.jpg"
    if "F13" in name:
        image_src = "/images/product-f13-panda.jpg"
    if "K13" in name and "Pink" in name:
        image_src = "/images/product-k13-pink.jpg"
    elif "K13" in name:
        image_src = "/images/product-k13-white.jpg"

    price = f"{price_str} PKR" if price_str else None
    origPrice = f"{orig_price_str} PKR" if orig_price_str else None

    savings = None
    if price and origPrice:
        p_val = float(price_str.replace("Rs.", "").replace(",", ""))
        o_val = float(orig_price_str.replace("Rs.", "").replace(",", ""))
        if o_val > p_val:
            sav_val = o_val - p_val
            savings = f"Rs.{sav_val:,.2f} PKR"

    prod = {
        "id": slug,
        "name": name,
        "slug": slug,
        "price": price,
        "originalPrice": origPrice,
        "savings": savings,
        "badge": badge,
        "image": image_src,
        "sections": sections,
        "filters": {}
    }

    if pt: prod["filters"]["Print Type"] = pt
    if ps: prod["filters"]["Print Size"] = ps
    if res: prod["filters"]["Resolution"] = res
    if speed: prod["filters"]["Print Speed"] = speed
    if head: prod["filters"]["Printer Head"] = head
    if sub: prod["filters"]["Substrate Thickness Allows"] = sub
    if cons: prod["filters"]["Consumables"] = cons
    if mc: prod["filters"]["Machine Category"] = mc
    if cc: prod["filters"]["Consumables Category"] = cc
    prod["filters"]["Availability"] = "In stock"
    
    if badge and "New" in badge:
        if "What's New" not in prod["sections"]:
            prod["sections"].append("What's New")

    products.append(prod)

with open("i:/pro colored new/procolored-web-new/src/data/products.ts", "w", encoding="utf-8") as f:
    f.write("export interface ProductFilter {\n")
    f.write("  [key: string]: string;\n")
    f.write("}\n\n")
    f.write("export interface Product {\n")
    f.write("  id: string;\n")
    f.write("  slug: string;\n")
    f.write("  name: string;\n")
    f.write("  price: string;\n")
    f.write("  originalPrice: string | null;\n")
    f.write("  savings: string | null;\n")
    f.write("  badge: string | null;\n")
    f.write("  image: string;\n")
    f.write("  sections: string[];\n")
    f.write("  filters: ProductFilter;\n")
    f.write("}\n\n")
    f.write("export const products: Product[] = ")
    f.write(json.dumps(products, indent=2, ensure_ascii=False))
    f.write(";\n")
print("Done DB.")
