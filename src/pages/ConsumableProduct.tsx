import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export interface ConsumableVariant {
  key: string;
  label: string;
  price: number;
  originalPrice?: number;
}

/** Two-dimensional variant group (e.g. Model × Type) */
export interface VariantGroup {
  label: string;    // e.g. "Model"
  options: string[]; // e.g. ["F8", "F13", ...]
}

export interface ConsumableProductData {
  id: string;
  title: string;
  image: string;
  subtitle?: string;
  /** Flat list of variants — used for single-selector products */
  variants: ConsumableVariant[];
  /**
   * Two-dimension variant selector.
   * When provided, renders two <select> elements.
   * variantPriceMap keys must be  "group0Option__group1Option"
   */
  variantGroups?: VariantGroup[];
  variantPriceMap?: Record<string, number>;
  infoSections: { label: string; content: string }[];
  note?: string;
  badge?: string;
  reviews?: { name: string; date: string; title: string; text: string; rating: number }[];
}

const DEFAULT_REVIEWS = [
  { name: 'Alex R.', date: '03/15/2026', title: 'Exactly as described', text: 'Great product, does exactly what it says. Arrived quickly and in perfect condition. Will order again.', rating: 5 },
  { name: 'Maria T.', date: '02/28/2026', title: 'High quality', text: 'Very impressed with the quality. My print results improved noticeably after switching to this product. Highly recommend for any Procolored printer owner.', rating: 5 },
  { name: 'PrintShop_LA', date: '02/10/2026', title: 'Good value for money', text: 'Solid product that does the job well. Consistent performance batch after batch. No complaints at all.', rating: 5 },
];

/* ─── Styled Select ─────────────────────────────────────────────────────── */
function StyledSelect({
  label,
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  getOptionLabel?: (o: string) => string;
  getOptionValue?: (o: string) => string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-white border-2 border-gray-200 hover:border-orange-400 focus:border-orange-500 focus:outline-none rounded-xl px-4 py-3 pr-10 text-gray-800 font-semibold text-sm cursor-pointer transition-colors duration-200 shadow-sm"
        >
          {options.map(o => (
            <option key={o} value={getOptionValue ? getOptionValue(o) : o}>
              {getOptionLabel ? getOptionLabel(o) : o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
      </div>
    </div>
  );
}

/* ─── Pill Buttons (≤ 6 variants) ────────────────────────────────────────── */
function PillButtons({
  variants,
  selected,
  onSelect,
}: {
  variants: ConsumableVariant[];
  selected: string;
  onSelect: (k: string) => void;
}) {
  const cols = variants.length <= 3 ? 'grid-cols-3' : variants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`grid gap-2 ${cols}`}>
      {variants.map(v => (
        <button
          key={v.key}
          onClick={() => onSelect(v.key)}
          className={`text-left px-3 py-3 rounded-xl border-2 font-semibold transition-all text-sm flex flex-col gap-0.5 ${
            selected === v.key
              ? 'border-orange-500 text-orange-600 bg-orange-50 shadow-sm'
              : 'border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50/40'
          }`}
        >
          <span className="leading-tight text-[13px]">{v.label}</span>
          <span className="font-bold text-xs text-orange-500">${v.price}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ConsumableProduct({ data }: { data: ConsumableProductData }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* ── Single-dimension state ── */
  const [variantKey, setVariantKey] = useState(data.variants[0]?.key ?? '');

  /* ── Two-dimension state ── */
  const [groupSelections, setGroupSelections] = useState<string[]>(
    () => data.variantGroups?.map(g => g.options[0] ?? '') ?? []
  );

  const reviews = data.reviews ?? DEFAULT_REVIEWS;

  /* ── Compute active price ── */
  let activePrice = 0;
  let activeName = '';

  if (data.variantGroups && data.variantPriceMap) {
    const key2d = groupSelections.join('__');
    activePrice = data.variantPriceMap[key2d] ?? 0;
    activeName = groupSelections.join(' — ');
  } else {
    const variant = data.variants.find(v => v.key === variantKey) ?? data.variants[0];
    activePrice = variant?.price ?? 0;
    activeName = variant?.label ?? '';
  }

  const handleAddToCart = () =>
    addToCart({
      id: `${data.id}-${data.variantGroups ? groupSelections.join('-') : variantKey}`,
      name: `${data.title} — ${activeName}`,
      price: `$USD:${activePrice}`,
      image: data.image,
      quantity: 1,
    });
  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout'); };

  /* ── Variant UI ── */
  const renderVariantSelector = () => {
    /* Two-dimension */
    if (data.variantGroups && data.variantPriceMap) {
      return (
        <div className="flex flex-col gap-4">
          {data.variantGroups.map((group, gi) => (
            <StyledSelect
              key={gi}
              label={group.label}
              options={group.options}
              value={groupSelections[gi] ?? group.options[0]}
              onChange={v => setGroupSelections(prev => {
                const next = [...prev];
                next[gi] = v;
                return next;
              })}
            />
          ))}
          {/* Live price preview */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <span className="font-medium">Selected:</span>
            <span className="text-gray-800 font-semibold">{groupSelections.join(' · ')}</span>
            <span className="ml-auto text-orange-600 font-bold">${activePrice}.00</span>
          </div>
        </div>
      );
    }

    /* Single-dimension — many options → select dropdown */
    if (data.variants.length > 6) {
      const variant = data.variants.find(v => v.key === variantKey) ?? data.variants[0];
      return (
        <div className="flex flex-col gap-3">
          <StyledSelect
            label="Select Option"
            options={data.variants.map(v => v.key)}
            value={variantKey}
            onChange={setVariantKey}
            getOptionLabel={k => {
              const v = data.variants.find(x => x.key === k);
              return v ? `${v.label} — $${v.price}` : k;
            }}
          />
          {/* Selected badge */}
          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
            <span className="text-sm font-semibold text-gray-800">{variant?.label}</span>
            <span className="text-sm font-bold text-orange-600">${variant?.price}.00</span>
          </div>
        </div>
      );
    }

    /* Single-dimension — few options → pill buttons */
    if (data.variants.length > 1) {
      return (
        <PillButtons
          variants={data.variants}
          selected={variantKey}
          onSelect={setVariantKey}
        />
      );
    }

    return null;
  };

  return (
    <div className="bg-white font-sans min-h-screen">
      <section className="pt-6 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            <a href="/" className="hover:underline text-gray-800">Home</a>{' > '}{data.title}
          </p>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0">
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-[480px] object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                />
                {data.badge && (
                  <span className="absolute top-4 left-4 bg-[#E85A24] text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {data.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="w-full lg:w-[55%] flex flex-col gap-5">
              <div>
                <h1 className="text-2xl lg:text-[2rem] font-bold text-gray-900 leading-tight mb-3">
                  {data.title}
                </h1>
                {data.subtitle && (
                  <p className="text-sm text-gray-500 mb-3 font-medium">{data.subtitle}</p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <a href="#reviews" className="text-sm text-blue-600 hover:underline">
                    5.0 — {reviews.length} reviews
                  </a>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[2rem] font-extrabold text-red-600">
                    ${activePrice}.00 USD
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              {data.variants.length > 0 && (
                <div>
                  {data.variants.length > 1 || data.variantGroups ? (
                    <div className="mb-1">
                      <p className="font-extrabold text-gray-900 text-sm mb-3 uppercase tracking-wide">
                        {data.variantGroups ? 'Select Options:' : 'Options:'}
                      </p>
                      {renderVariantSelector()}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Note */}
              {data.note && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  {data.note}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 mt-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3.5 rounded-xl transition text-[15px]"
                >
                  Add to cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#5A31F4] hover:bg-[#4a26d1] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span className="text-[15px]">Buy with</span>
                  <span className="font-serif italic font-bold">shop</span>
                </button>
              </div>
              <div className="text-center mt-[-8px]">
                <a href="#" className="text-xs text-blue-500 underline hover:text-blue-600">
                  More payment options
                </a>
              </div>

              {/* Trust Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-xs text-gray-600">
                <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 mb-1">Shop with Confidence!</p>
                  <ul className="list-disc pl-4 space-y-1 mb-2">
                    <li>100% Protection Against Shipping Mishaps</li>
                  </ul>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    WORRY-FREE PURCHASE® BY{' '}
                    <span className="text-blue-500 lowercase font-medium">seel</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Info */}
      {data.infoSections.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Information</h2>
            <div className="space-y-0 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {data.infoSections.map((s, i) => (
                <div key={i} className="flex gap-0 border-b border-gray-100 last:border-0">
                  <div className="w-48 flex-shrink-0 bg-gray-50 px-6 py-4 font-bold text-gray-900 text-sm border-r border-gray-100">
                    {s.label}
                  </div>
                  <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {s.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="text-xl font-extrabold text-gray-900">5.0 out of 5</span>
              <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
            </div>
            <div className="flex flex-col gap-1.5 justify-center pl-4 md:border-l border-gray-200">
              {([[5,'100%',reviews.length],[4,'0%',0],[3,'0%',0],[2,'0%',0],[1,'0%',0]] as const).map(([stars,pct,count],i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s<=(stars as number)?'fill-yellow-400 text-yellow-400':'text-gray-300'}`} />
                    ))}
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{width: pct as string}} />
                  </div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 justify-center">
              <button className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-sm transition rounded-lg">
                Write a review
              </button>
              <button className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold text-sm transition rounded-lg">
                Ask a question
              </button>
            </div>
          </div>
          <div className="flex justify-start mb-6 border-b border-gray-200 pb-2">
            <button className="text-sm text-yellow-500 font-bold flex items-center gap-1">
              Most Recent <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {reviews.map((r, i) => (
              <div key={i} className="py-6 flex flex-col md:flex-row gap-4 md:gap-12 w-full">
                <div className="w-full md:w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s<=r.rating?'fill-yellow-400 text-yellow-400':'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-2">{r.title}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
