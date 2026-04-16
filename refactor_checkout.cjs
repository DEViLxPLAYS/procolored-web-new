const fs = require('fs');
const path = require('path');

const checkoutPath = path.join(__dirname, 'src/pages/Checkout.tsx');
let content = fs.readFileSync(checkoutPath, 'utf8');

// 1. Add Imports
if (!content.includes('@stripe/stripe-js')) {
  content = content.replace(
    "import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';",
    "import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';\nimport { loadStripe } from '@stripe/stripe-js';\nimport { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';"
  );
}

// 2. Add StripePaymentForm function
if (!content.includes('function StripePaymentForm')) {
  const stripeFormCode = `
// ── Stripe Payment Form ──────────────────────────────────────────────────────
function StripePaymentForm({ totalUSD, validateForm, handleOrderComplete, setIsSubmitting }: { totalUSD: number, validateForm: () => boolean, handleOrderComplete: (txId: string) => Promise<void>, setIsSubmitting: (b: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !stripe || !elements) return;
    
    setProcessing(true);
    setIsSubmitting(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred.');
      setProcessing(false);
      setIsSubmitting(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
      setIsSubmitting(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      await handleOrderComplete(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{error}</div>}
      <button type="submit" disabled={!stripe || processing}
        style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: 15, borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: (!stripe || processing) ? 'not-allowed' : 'pointer', marginTop: 20 }}>
        {processing ? 'Processing...' : \`Pay \$\${totalUSD.toFixed(2)}\`}
      </button>
    </form>
  );
}

`;

  // Inject before function Checkout()
  content = content.replace("export default function Checkout() {", stripeFormCode + "export default function Checkout() {");
}

// 3. Add Stripe State to Checkout
if (!content.includes('const [stripePromise, setStripePromise]')) {
  content = content.replace(
    "const [isSubmitting, setIsSubmitting] = useState(false);",
    "const [isSubmitting, setIsSubmitting] = useState(false);\n  const [stripePromise, setStripePromise] = useState<any>(null);\n  const [clientSecret, setClientSecret] = useState<string | null>(null);\n  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');"
  );
}

// 4. Add Stripe config fetch
if (!content.includes('/api/stripe/config')) {
  const stripeConfigEffect = `
  // Fetch Stripe Info
  useEffect(() => {
    fetch(\`\$\{API_BASE\}/api/stripe/config\`)
      .then(res => res.json())
      .then(data => {
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (totalUSD > 0 && paymentMethod === 'stripe') {
      fetch(\`\$\{API_BASE\}/api/stripe/create-payment-intent\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalUSD * 100), currency: 'usd' }),
      })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
        .catch(console.error);
    }
  }, [totalUSD, paymentMethod]);
`;
  content = content.replace(
    "// Fetch PayPal config",
    stripeConfigEffect + "\n  // Fetch PayPal config"
  );
}

// 5. Update buildPayload to respect payment method
content = content.replace(
  "paymentMethod: isDemo ? 'Demo (No Payment)' : 'PayPal'",
  "paymentMethod: isDemo ? 'Demo (No Payment)' : (paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : 'PayPal')"
);

// 6. Update Payment Section Render
if (content.includes('paypalLoading\n                ? <div style={{ padding: 32')) {
  // Replace the payment block
  const oldPaymentBlockRegex = /\{isDemoCart\s*\?\s*<DemoOrderButton[^>]*\/>\s*:\s*paypalLoading[\s\S]*?<\/> : null\)\s*\n\s*\}\s*<\/section>/m;
  
  // Actually, string replacement
  const startStr = "{isDemoCart";
  const endStr = "</section>";
  
  const paymentSectionStart = content.indexOf("{isDemoCart");
  if (paymentSectionStart > -1) {
    const sectionEnd = content.indexOf("</section>", paymentSectionStart);
    const beforeSection = content.substring(0, paymentSectionStart);
    const afterSection = content.substring(sectionEnd);

    const newPaymentBlock = \`{isDemoCart ? (
              <DemoOrderButton isSubmitting={isSubmitting} onSubmit={handleDemoOrder} />
            ) : (
              <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
                {/* PayPal Selector */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'paypal' ? '#f9fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}
                  onClick={() => setPaymentMethod('paypal')}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: paymentMethod === 'paypal' ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>PayPal</span>
                </label>
                
                {paymentMethod === 'paypal' && (
                  <div style={{ padding: 16, background: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
                    {paypalLoading
                      ? <div style={{ padding: 32, background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                          <span style={{ width: 24, height: 24, border: '2px solid #e5e7eb', borderTopColor: '#003087', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                          <span style={{ fontSize: 13, color: '#888' }}>Loading PayPal...</span>
                        </div>
                      : paypalError
                        ? <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}><strong>Payment Error:</strong> {paypalError}</div>
                        : paypalClientId
                          ? <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD', intent: 'capture' }}>
                              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', padding: 16, background: '#fff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555', marginBottom: 14 }}>
                                  <ShieldCheck size={13} color="#009cde" /> Secured by PayPal — pay safely with any card or PayPal balance
                                </div>
                                {formError && (
                                  <div style={{ marginBottom: 14, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                                    <span><strong>Please fill in all required details to continue:</strong><br />{formError}</span>
                                  </div>
                                )}
                                <PayPalButtons
                                  style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 48 }}
                                  disabled={isSubmitting}
                                  createOrder={async () => {
                                    if (!validateForm()) {
                                      throw new Error('form_invalid');
                                    }
                                    const res = await fetch(\`\$\{API_BASE\}/api/paypal/create-order\`, {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ cartTotal: totalUSD.toFixed(2), currency: 'USD' }),
                                    });
                                    const data = await res.json();
                                    if (!data.id) throw new Error(data.error || 'Could not create PayPal order.');
                                    return data.id;
                                  }}
                                  onApprove={async (data) => {
                                    setIsSubmitting(true);
                                    try {
                                      const res = await fetch(\`\$\{API_BASE\}/api/paypal/capture-order\`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ orderID: data.orderID }),
                                      });
                                      const capture = await res.json();
                                      if (capture.success) {
                                        await handleOrderComplete(data.orderID);
                                      } else {
                                        alert(capture.error || 'Payment capture failed. Contact support.');
                                        setIsSubmitting(false);
                                      }
                                    } catch {
                                      alert('Network error during payment capture. Contact support.');
                                      setIsSubmitting(false);
                                    }
                                  }}
                                  onError={(err: any) => {
                                    console.error('PayPal error:', err);
                                    if (err?.message === 'form_invalid') return; // already shown via formError
                                    setPaypalError('Payment could not be completed. Please check your details and try again.');
                                  }}
                                  onCancel={() => { setIsSubmitting(false); }}
                                />
                              </div>
                            </PayPalScriptProvider>
                          : null
                    }
                  </div>
                )}

                {/* Stripe Selector */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'stripe' ? '#f9fafb' : '#fff' }}
                  onClick={() => setPaymentMethod('stripe')}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: paymentMethod === 'stripe' ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Credit / Debit Card</span>
                </label>
                
                {paymentMethod === 'stripe' && (
                  <div style={{ padding: 16, background: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
                    {stripePromise && clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#1a1a1a' } } }}>
                        {formError && (
                          <div style={{ marginBottom: 14, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                            <span><strong>Please fill in all required details to continue:</strong><br />{formError}</span>
                          </div>
                        )}
                        <StripePaymentForm totalUSD={totalUSD} validateForm={validateForm} handleOrderComplete={handleOrderComplete} setIsSubmitting={setIsSubmitting} />
                      </Elements>
                    ) : (
                      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 24, height: 24, border: '2px solid #e5e7eb', borderTopColor: '#1a1a1a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        <span style={{ fontSize: 13, color: '#888' }}>Loading secure payment...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>\`;

    content = beforeSection + newPaymentBlock + afterSection;
  }
}

fs.writeFileSync(checkoutPath, content, 'utf8');
console.log('Checkout.tsx refactored successfully.');
