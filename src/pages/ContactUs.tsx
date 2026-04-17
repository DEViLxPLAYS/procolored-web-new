import { useState } from 'react';
import { api } from '../services/api';

type Tab = 'presales' | 'aftersales' | 'feedback';

const FORM_LABELS: Record<Tab, string> = {
  presales: 'Pre-Sales Consultant',
  aftersales: 'After-Sales Support',
  feedback: 'Service Feedback',
};

export default function ContactUs() {
  const [activeTab, setActiveTab] = useState<Tab>('presales');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'presales', label: 'Pre-Sales Consultant' },
    { id: 'aftersales', label: 'After-Sales Support' },
    { id: 'feedback', label: 'Service Feedback' },
  ];

  return (
    <div className="w-full bg-[#f9f9f9] min-h-screen pt-12 pb-24 font-sans text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-[28px] font-bold mb-10 text-[#1a1a1a]">Contact Us</h1>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar — clickable tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-5 py-3 rounded-md font-medium text-[15px] transition-colors shadow-sm ${
                  activeTab === tab.id
                    ? 'bg-[#dd2222] text-white'
                    : 'bg-[#ebebeb] text-[#4a4a4a] hover:bg-gray-200'
                }`}
              >
                {tab.label} &gt;
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 bg-white p-8 md:p-12 rounded-lg shadow-sm">
            {/* ─── PRE-SALES ─── */}
            {activeTab === 'presales' && (
              <>
                <p className="text-[#4a4a4a] text-[15px] mb-8 leading-relaxed">
                  Procolored is committed to providing you with the best products and services. Our pre-sales team is here to help you choose the right printer for your business needs.
                </p>
                <div className="mb-10">
                  <h2 className="text-[#1a1a1a] font-bold text-base mb-3">Contact Info</h2>
                  <div className="space-y-2 text-[#4a4a4a] text-[15px]">
                    <p><strong className="text-[#1a1a1a]">Pre-sales Email:</strong> <a href="mailto:support@procollored.com" className="text-[#0066cc] hover:underline">support@procollored.com</a></p>
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-[#1a1a1a] font-bold text-base mb-2">Looking For A Consultant</h2>
                  <p className="text-[#666666] text-sm">Leave a message if you have any question about choosing products and we'll get back to you shortly.</p>
                </div>
                <ContactForm type="presales" submitLabel="Submit" />
              </>
            )}

            {/* ─── AFTER-SALES ─── */}
            {activeTab === 'aftersales' && (
              <>
                <p className="text-[#4a4a4a] text-[15px] mb-8 leading-relaxed">
                  Procolored is committed to providing excellent after-sales support. Our dedicated team is available to assist you with technical issues, maintenance questions, and post-purchase concerns.
                </p>
                <div className="mb-10">
                  <h2 className="text-[#1a1a1a] font-bold text-base mb-3">Contact Info</h2>
                  <div className="space-y-2 text-[#4a4a4a] text-[15px]">
                    <p><strong className="text-[#1a1a1a]">After-sales Email:</strong> <a href="mailto:support@procollored.com" className="text-[#0066cc] hover:underline">support@procollored.com</a></p>
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-[#1a1a1a] font-bold text-base mb-2">Submit an After-Sales Request</h2>
                  <p className="text-[#666666] text-sm">Leave a message about your after-sales concern and our team will get back to you within 24–48 business hours.</p>
                </div>
                <ContactForm type="aftersales" submitLabel="Submit" />
              </>
            )}

            {/* ─── FEEDBACK ─── */}
            {activeTab === 'feedback' && (
              <>
                <p className="text-[#4a4a4a] text-[15px] mb-8 leading-relaxed">
                  Your feedback is invaluable to us. At Procolored, we continuously strive to improve our products and services based on customer experiences. Please share your thoughts with us.
                </p>
                <div className="mb-10">
                  <h2 className="text-[#1a1a1a] font-bold text-base mb-3">Contact Info</h2>
                  <div className="space-y-2 text-[#4a4a4a] text-[15px]">
                    <p><strong className="text-[#1a1a1a]">Feedback Email:</strong> <a href="mailto:support@procollored.com" className="text-[#0066cc] hover:underline">support@procollored.com</a></p>
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-[#1a1a1a] font-bold text-base mb-2">Share Your Experience</h2>
                  <p className="text-[#666666] text-sm">Tell us about your experience with Procolored products or services. Your feedback helps us serve you better.</p>
                </div>
                <ContactForm type="feedback" submitLabel="Submit Feedback" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared form ─── */
function ContactForm({ type, submitLabel }: { type: 'presales' | 'aftersales' | 'feedback'; submitLabel: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    message: '',
    productLink: '', // for presales — required
    orderNumber: '', // for aftersales — required
    rating: ''       // for feedback — required
  });

  const FORM_LABEL: Record<typeof type, string> = {
    presales: 'Pre-Sales Consultant',
    aftersales: 'After-Sales Support',
    feedback: 'Service Feedback',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error on change
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (type === 'presales' && !formData.productLink.trim()) newErrors.productLink = 'Please specify the product you are interested in';
    if (type === 'aftersales' && !formData.orderNumber.trim()) newErrors.orderNumber = 'Order number is required';
    if (type === 'feedback' && !formData.rating) newErrors.rating = 'Please select a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Build message with prepended context
      let finalMessage = formData.message;
      if (type === 'aftersales') {
        finalMessage = `[Order Number: ${formData.orderNumber}]\n\n` + finalMessage;
      }
      if (type === 'feedback') {
        finalMessage = `[Rating Given: ${formData.rating} Stars]\n\n` + finalMessage;
      }
      if (type === 'presales') {
        finalMessage = `[Product Interested In: ${formData.productLink}]\n\n` + finalMessage;
      }

      await api.submitContactForm({
        formType: FORM_LABEL[type],         // ← tells backend which form
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        productLink: type === 'presales' ? formData.productLink : undefined,
        orderNumber: type === 'aftersales' ? formData.orderNumber : undefined,
        rating: type === 'feedback' ? formData.rating : undefined,
        message: finalMessage
      });
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', country: '', email: '', message: '', productLink: '', orderNumber: '', rating: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch (_err) {
      alert('There was an error sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name: string) =>
    `w-full border rounded-md px-4 py-2.5 text-sm focus:outline-none transition-colors ${errors[name] ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-red-500'}`;

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
          ✅ Message sent successfully! We will get back to you soon.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">First Name *</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="First Name" className={fieldClass('firstName')} />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">⚠ {errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Last Name *</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Last Name" className={fieldClass('lastName')} />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">⚠ {errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Country *</label>
        <select name="country" value={formData.country} onChange={handleChange} className={fieldClass('country') + ' appearance-none bg-white'}>
          <option value="">Please select</option>
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
          <option>Australia</option>
          <option>Germany</option>
        </select>
        {errors.country && <p className="text-red-500 text-xs mt-1">⚠ {errors.country}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Email *</label>
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className={fieldClass('email')} />
        {errors.email && <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>}
      </div>

      {/* Pre-Sales: Product interested in — REQUIRED */}
      {type === 'presales' && (
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">The Product You Are Interested In *</label>
          <input name="productLink" value={formData.productLink} onChange={handleChange} type="text" placeholder="Product name or link (required)" className={fieldClass('productLink')} />
          {errors.productLink && <p className="text-red-500 text-xs mt-1">⚠ {errors.productLink}</p>}
        </div>
      )}

      {/* After-Sales: Order Number — REQUIRED */}
      {type === 'aftersales' && (
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Order Number *</label>
          <input name="orderNumber" value={formData.orderNumber} onChange={handleChange} type="text" placeholder="Your order number (required)" className={fieldClass('orderNumber')} />
          {errors.orderNumber && <p className="text-red-500 text-xs mt-1">⚠ {errors.orderNumber}</p>}
        </div>
      )}

      {/* Feedback: Rating — REQUIRED */}
      {type === 'feedback' && (
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Rating *</label>
          <select name="rating" value={formData.rating} onChange={handleChange} className={fieldClass('rating') + ' appearance-none bg-white'}>
            <option value="">Select a rating (required)</option>
            <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
            <option value="4">⭐⭐⭐⭐ — Good</option>
            <option value="3">⭐⭐⭐ — Average</option>
            <option value="2">⭐⭐ — Poor</option>
            <option value="1">⭐ — Very Poor</option>
          </select>
          {errors.rating && <p className="text-red-500 text-xs mt-1">⚠ {errors.rating}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Message *</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="Please provide details..." className={fieldClass('message') + ' resize-y'} />
        {errors.message && <p className="text-red-500 text-xs mt-1">⚠ {errors.message}</p>}
      </div>

      <div className="pt-2">
        <button type="submit" disabled={loading} className="bg-black hover:bg-[#E85A24] disabled:opacity-50 text-white font-bold text-sm px-10 py-3 rounded-full transition-colors duration-300 shadow-md">
          {loading ? 'Sending...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
