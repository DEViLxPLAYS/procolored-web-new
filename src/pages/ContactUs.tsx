import { useState } from 'react';
import { api } from '../services/api';

type Tab = 'presales' | 'aftersales' | 'feedback';

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    message: '',
    productLink: '', // for presales
    orderNumber: '', // for aftersales
    rating: ''       // for feedback
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message || !formData.country) {
      alert('Please fill out all required fields.');
      return;
    }
    
    setLoading(true);
    try {
      // Build message appending context if there's order or feedback rating
      let finalMessage = formData.message;
      if (type === 'aftersales' && formData.orderNumber) {
        finalMessage = `[Order Number: ${formData.orderNumber}]\n\n` + finalMessage;
      }
      if (type === 'feedback' && formData.rating) {
        finalMessage = `[Rating Given: ${formData.rating} Stars]\n\n` + finalMessage;
      }

      await api.submitContactForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        productLink: formData.productLink,
        message: finalMessage
      });
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', country: '', email: '', message: '', productLink: '', orderNumber: '', rating: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('There was an error sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
          Message sent successfully! We will get back to you soon.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">First Name *</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="First Name" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Last Name *</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Last Name" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Country *</label>
        <select name="country" value={formData.country} onChange={handleChange} required className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-red-500 transition-colors">
          <option value="">Please select</option>
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
          <option>Pakistan</option>
          <option>Australia</option>
          <option>Germany</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Email *</label>
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" required className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
      </div>

      {type === 'presales' && (
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">The Product You Are Interested In</label>
          <input name="productLink" value={formData.productLink} onChange={handleChange} type="text" placeholder="Product link or name" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
        </div>
      )}

      {type === 'aftersales' && (
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Order Number</label>
          <input name="orderNumber" value={formData.orderNumber} onChange={handleChange} type="text" placeholder="Your order number (if available)" className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 transition-colors" />
        </div>
      )}

      {type === 'feedback' && (
        <div>
          <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Rating</label>
          <select name="rating" value={formData.rating} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-red-500 transition-colors">
            <option value="">Select a rating</option>
            <option value="5">⭐⭐⭐⭐⭐ — Excellent</option>
            <option value="4">⭐⭐⭐⭐ — Good</option>
            <option value="3">⭐⭐⭐ — Average</option>
            <option value="2">⭐⭐ — Poor</option>
            <option value="1">⭐ — Very Poor</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-[#1a1a1a] mb-2">Message *</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required placeholder="Please provide details..." className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors resize-y" />
      </div>
      <div className="pt-2">
        <button type="submit" disabled={loading} className="bg-black hover:bg-[#E85A24] disabled:opacity-50 text-white font-bold text-sm px-10 py-3 rounded-full transition-colors duration-300 shadow-md">
          {loading ? 'Sending...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
