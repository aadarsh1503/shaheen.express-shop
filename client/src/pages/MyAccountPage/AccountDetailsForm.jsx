// src/AccountDetailsForm.js
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AccountDetailsForm = ({ userEmail }) => {
  // Extract the username part from the email for the default display name
  const defaultDisplayName = userEmail ? userEmail.split('@')[0] : '';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: defaultDisplayName,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    // In a real app, you would send this data to your server for processing
    console.log('Saving account details:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        // Password fields are typically handled separately and not logged
    });
    alert('Changes saved successfully!');
  };
  
  const inputClasses = "w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-500";
  const labelClasses = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="bg-gray-50 border-l-2 border-gray-400 p-4 text-sm text-gray-600">
        Your account with Shaheen Express is using a temporary password. We emailed you a link to change your password.
      </p>

      {/* First and Last Name */}
      <div className="flex flex-col md:flex-row gap-6">
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
      
      {/* Display Name */}
      <div>
        <label htmlFor="displayName" className={labelClasses}>Display name *</label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          className={inputClasses}
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          This will be how your name will be displayed in the account section and in reviews.
        </p>
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className={labelClasses}>Email address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userEmail}
          className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
          readOnly
        />
      </div>

      {/* Password Change Section */}
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

      {/* Save Button */}
      <div>
        <button
          type="submit"
          className="bg-[#212121] text-white py-3 px-8 font-semibold hover:bg-black transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default AccountDetailsForm;