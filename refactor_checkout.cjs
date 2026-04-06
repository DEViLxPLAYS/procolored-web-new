const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/pages/Checkout.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Imports
content = content.replace(
  /import \{ PayPalScriptProvider, PayPalButtons \} from "@paypal\/react-paypal-js";\s*/g,
  ''
);

content = content.replace(
  /import \{ Elements, CardElement, useStripe, useElements \} from '@stripe\/react-stripe-js';/g,
  "import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';"
);

content = content.replace(
  /const PAYPAL_CLIENT_ID = '.*';\n/g,
  ''
);

// 2. StripeCardForm -> StripeForm
const oldFormRegex = /\/\/ ── Stripe Card Form ──[\s\S]*?export default function Checkout\(\) \{/;
const newForm = `// ── Stripe Form ────────────────────────────────────────
function StripeForm({
  isSubmitting, setIsSubmitting, onSuccess, validateForm
}: {
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  onSuccess: (txId: string) => void;
  validateForm: () => boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMsg, setErrorMsg] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required', // Keeps user on page if possible
        confirmParams: {
          return_url: window.location.href, // Safe fallback
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment not completed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay}>
      <div className="mb-6">
        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-800 uppercase tracking-widest mb-3">
          <CreditCard className="w-5 h-5 text-gray-500" />
          Secure Payment
        </label>
        
        {/* Payment Element Frame */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all">
          <PaymentElement options={{ layout: 'tabs' }} />
        </div>
        
        {/* Badges */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium">Secured by</span>
            <span className="text-[#6366F1] font-bold text-xs tracking-wider">stripe</span>
          </div>
          <div className="flex gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-3 object-contain grayscale opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 object-contain grayscale opacity-60" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-4 object-contain grayscale opacity-60" />
          </div>
        </div>
      </div>
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm mb-4">{errorMsg}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !stripe}
        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Pay Now
          </>
        )}
      </button>
      <p className="text-[11px] text-gray-400 text-center mt-4">Your payment information is encrypted and secure.</p>
    </form>
  );
}

export default function Checkout() {`;
content = content.replace(oldFormRegex, newForm);

// 3. States & Initial Effect Swap
// Find where paypal states begin
const stateRegex = /const \[paypalClientId.*?(?=const emailRef =)/s;
const newStates = `const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;
  const shippingCost = 0;
  const total = cartSubtotal - discountAmount + shippingCost;

  useEffect(() => {
    fetch(\`\$\{API_BASE\}/api/stripe/config\`)
      .then(res => res.json())
      .then(data => setStripePublishableKey((data && data.publishableKey) ? data.publishableKey : STRIPE_PK))
      .catch(() => setStripePublishableKey(STRIPE_PK));
  }, []);

  useEffect(() => {
    if (total > 0) {
      // Create Intent dynamically when total changes so PaymentElement can render
      fetch(\`\$\{API_BASE\}/api/stripe/create-payment-intent\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'usd' }),
      })
      .then(res => res.json())
      .then(data => {
         if (data.clientSecret) setClientSecret(data.clientSecret);
         else if (data.error) setStripeError(data.error);
      })
      .catch(() => setStripeError("Could not initialize secure payment connection."));
    }
  }, [total]);

  `;
content = content.replace(stateRegex, newStates);

// Remove the old total calculation since we moved it up
content = content.replace(/const discountAmount = discountApplied \? cartSubtotal \* 0\.05 : 0;\n\s*const shippingCost = 0;\n\s*const total = cartSubtotal - discountAmount \+ shippingCost;/s, '');

// Fix payment method in order submission
content = content.replace(
  /paymentMethod: transactionId \? \(transactionId\.startsWith\('pi_'\) \? 'Stripe' : 'PayPal'\) : 'Credit Card',/g,
  "paymentMethod: 'Stripe',"
);

// 4. Remove paypal functions
content = content.replace(/const createPaypalOrder = async \(\) => \{[\s\S]*?\};\n\n  \/\/ PayPal SDK errored.*?\}\s*;/s, '');

// 5. Replace Payment Method UI tabs and panels
const panelRegex = /\{\/\* Payment Method Tabs \*\/\}[\s\S]*?(?=<\/section>)/s;
const newPanel = `{/* Stripe Payment Element Panel */}
                      {stripeError ? (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl mb-6">{stripeError}</div>
                      ) : (stripePublishableKey && clientSecret) ? (
                        <div className="animate-fade-in">
                          <Elements 
                            stripe={loadStripe(stripePublishableKey)} 
                            options={{ 
                              clientSecret, 
                              appearance: { 
                                theme: 'stripe',
                                variables: { colorPrimary: '#6366F1', borderRadius: '8px' }
                              } 
                            }}
                          >
                            <StripeForm
                              isSubmitting={isSubmitting}
                              setIsSubmitting={setIsSubmitting}
                              onSuccess={(txId) => handleSubmit(undefined, txId, 'paid')}
                              validateForm={() => {
                                if (!email || !firstName || !lastName || !address || !city || !postal) {
                                  alert("Please fill out all required contact and delivery information before proceeding to payment.");
                                  return false;
                                }
                                return true;
                              }}
                            />
                          </Elements>
                        </div>
                      ) : (
                        <div className="p-10 border border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center flex-col gap-3">
                          <span className="w-6 h-6 border-2 border-gray-300 border-t-[#6366F1] rounded-full animate-spin"></span>
                          <span className="text-sm font-semibold text-gray-600">Initializing Secure Checkout...</span>
                        </div>
                      )}
                      `;
content = content.replace(panelRegex, newPanel);

fs.writeFileSync(file, content, 'utf8');
console.log('Refactor complete!');
