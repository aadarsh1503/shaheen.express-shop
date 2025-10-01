// src/AccountDetailsForm.js

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { updateUserProfile } from '../frontend-admin/services/api';


const AccountDetailsForm = ({ userDetails, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pre-fill the form when userDetails are passed as props
  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        // The backend now sends `firstName` and `lastName` (can be null)
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        // The backend sends `name`, which is our Display Name
        displayName: userDetails.name || '',
        email: userDetails.email || '',
      }));
    }
  }, [userDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', content: "New passwords do not match." });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        // This maps to the `name` column in your DB
        displayName: formData.displayName,
      };

      // Password logic is correct, no changes needed
      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      const response = await updateUserProfile(payload); // This will now hit your new PUT /me route
      
      setMessage({ type: 'success', content: 'Changes saved successfully!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: ''}));
      
      if (onUpdateSuccess) {
        // The backend sends back the full, updated user object.
        // This will update the parent component's state instantly.
        onUpdateSuccess(response.data);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage({ type: 'error', content: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };
  
  const inputClasses = "w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <label htmlFor="firstName" className={labelClasses}>First name *</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClasses} required />
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="lastName" className={labelClasses}>Last name *</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClasses} required />
        </div>
      </div>
      
      <div>
        <label htmlFor="displayName" className={labelClasses}>Display name *</label>
        <input type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} className={inputClasses} required />
        <p className="text-xs text-gray-500 mt-2">This is how your name will be displayed in the account section and in reviews.</p>
      </div>

      <div>
        <label htmlFor="email" className={labelClasses}>Email address *</label>
        <input type="email" id="email" name="email" value={formData.email} className={`${inputClasses} bg-gray-100 cursor-not-allowed`} readOnly />
      </div>

      <fieldset className="border-t border-gray-200 pt-6">
        <legend className="text-3xl font-light text-gray-800 mb-6">Password change</legend>
        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="currentPassword" className={labelClasses}>Current password (leave blank to leave unchanged)</label>
            <input type={showCurrentPassword ? 'text' : 'password'} id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} className={inputClasses} />
            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500">
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="newPassword" className={labelClasses}>New password (leave blank to leave unchanged)</label>
            <input type={showNewPassword ? 'text' : 'password'} id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} className={inputClasses} />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500">
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className={labelClasses}>Confirm new password</label>
            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClasses} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </fieldset>

      {message.content && (
        <div className={`p-4 text-sm rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.content}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#212121] text-white py-3 px-8 font-semibold hover:bg-black transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default AccountDetailsForm;