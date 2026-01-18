import { useState, useEffect } from 'react';
import { 
  MapPin, Plus, Edit, Trash2, Star, Building, Phone, Mail, 
  User, Home, X, Check, Loader 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../pages/frontend-admin/services/api';

const AddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    addressType: 'both',
    firstName: '',
    lastName: '',
    company: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Bahrain',
    phone: '',
    email: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      addressType: 'both',
      firstName: '',
      lastName: '',
      company: '',
      streetAddress: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Bahrain',
      phone: '',
      email: '',
      isDefault: false
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingAddress) {
        // Update existing address
        await axios.put(`${API_URL}/addresses/${editingAddress.id}`, formData, config);
        toast.success('Address updated successfully');
      } else {
        // Add new address
        await axios.post(`${API_URL}/addresses`, formData, config);
        toast.success('Address added successfully');
      }

      fetchAddresses();
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      addressType: address.address_type,
      firstName: address.first_name,
      lastName: address.last_name,
      company: address.company || '',
      streetAddress: address.street_address,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state || '',
      postalCode: address.postal_code || '',
      country: address.country,
      phone: address.phone,
      email: address.email,
      isDefault: address.is_default
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/addresses/${addressId}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
    }
  };

  const getAddressTypeIcon = (type) => {
    return <MapPin className="text-[#EC2027]" size={16} />;
  };

  const getAddressTypeLabel = (type) => {
    return 'Billing & Shipping Address';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EC2027]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#EC2027] to-red-600 rounded-xl flex items-center justify-center">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Addresses</h2>
            <p className="text-gray-600">Manage your billing and shipping addresses</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#EC2027] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <Plus size={20} />
          Add New Address
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                >
                  <option value="both">Billing & Shipping Address</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">This address will be used for both billing and shipping</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                />
              </div>

              {/* Address Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment, Suite, etc. (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                />
              </div>

              {/* City, State, Postal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State (Optional)
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                >
                  <option value="Bahrain">Bahrain</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">UAE</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Oman">Oman</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                  />
                </div>
              </div>

              {/* Default Address */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#EC2027] border-gray-300 rounded focus:ring-[#EC2027]"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#EC2027] text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center bg-gradient-to-br from-gray-50 to-white p-16 rounded-2xl border-2 border-dashed border-gray-300">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-6">Add your first address to make checkout faster</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#EC2027] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                address.is_default ? 'border-[#EC2027] bg-red-50' : 'border-gray-200'
              }`}
            >
              {/* Address Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getAddressTypeIcon(address.address_type)}
                  <span className="text-sm font-semibold text-gray-700">
                    {getAddressTypeLabel(address.address_type)}
                  </span>
                  {address.is_default && (
                    <div className="flex items-center gap-1 bg-[#EC2027] text-white px-2 py-1 rounded-full text-xs">
                      <Star size={12} />
                      Default
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-gray-800">
                  {address.first_name} {address.last_name}
                </p>
                {address.company && (
                  <p className="text-gray-600">{address.company}</p>
                )}
                <p>{address.street_address}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>{address.city}, {address.country}</p>
                {address.postal_code && <p>{address.postal_code}</p>}
                
                <div className="pt-3 border-t border-gray-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#EC2027]" />
                    <span>{address.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#EC2027]" />
                    <span>{address.email}</span>
                  </div>
                </div>
              </div>

              {/* Set Default Button */}
              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesSection;