// src/BillingAddressForm.js
import React, { useState } from 'react';

const BillingAddressForm = ({ userEmail }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    postcode: '',
    phone: '',
    email: userEmail || '', // Pre-fill with the user's email
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your server
    console.log('Form data saved:', formData);
    alert('Address saved successfully!');
  };

  const inputClasses = "w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500";
  const labelClasses = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <div>
      <h3 className="text-2xl font-light mb-6">Billing address</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="firstName" className={labelClasses}>First name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
          <div className="w-full md:w-1/2">
            <label htmlFor="lastName" className={labelClasses}>Last name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="company" className={labelClasses}>Company name (optional)</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Country / Region */}
        <div>
          <label htmlFor="country" className={labelClasses}>Country / Region *</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select a country / region…</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="IN">India</option>
          </select>
        </div>

        {/* Street Address */}
        <div>
          <label htmlFor="streetAddress1" className={labelClasses}>Street address *</label>
          <input
            type="text"
            id="streetAddress1"
            name="streetAddress1"
            value={formData.streetAddress1}
            onChange={handleChange}
            placeholder="House number and street name"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <input
            type="text"
            id="streetAddress2"
            name="streetAddress2"
            value={formData.streetAddress2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, etc. (optional)"
            className={inputClasses}
          />
        </div>
        
        {/* Town / City */}
        <div>
          <label htmlFor="city" className={labelClasses}>Town / City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Postcode */}
        <div>
          <label htmlFor="postcode" className={labelClasses}>Block Number / Postcode (optional)</label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        
        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClasses}>Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        
        {/* Email Address */}
        <div>
          <label htmlFor="email" className={labelClasses}>Email address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
            readOnly // Make the email field read-only
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#212121] text-white py-3 px-8 font-semibold hover:bg-black transition-colors duration-200"
          >
            Save address
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingAddressForm;