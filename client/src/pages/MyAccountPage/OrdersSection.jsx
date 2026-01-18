import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingBag, ArrowRight, Calendar, CreditCard, Truck, CheckCircle, 
  Clock, XCircle, Eye, Search, Filter, SortDesc, Download, RefreshCw,
  ChevronDown, X, MapPin, Phone, Mail, FileText
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Invoice from '../../components/Invoice/Invoice';
import OrderSkeleton from '../../components/LoadingSkeleton/OrderSkeleton';
import { API_URL } from '../../pages/frontend-admin/services/api';

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showInvoice, setShowInvoice] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy]);

  const fetchOrders = async (forceRefresh = false) => {
    // Cache for 30 seconds to avoid unnecessary API calls
    const now = Date.now();
    if (!forceRefresh && lastFetch && (now - lastFetch) < 30000 && orders.length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/payment/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setLastFetch(now);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === statusFilter);
    }

    // Payment method filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_method === paymentFilter);
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'amount-high':
          return parseFloat(b.total_amount) - parseFloat(a.total_amount);
        case 'amount-low':
          return parseFloat(a.total_amount) - parseFloat(b.total_amount);
        case 'status':
          return a.payment_status.localeCompare(b.payment_status);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setSortBy('newest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (paymentFilter !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
      case 'DELIVERED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <Clock className="text-blue-500" size={20} />;
      case 'SHIPPED':
        return <Truck className="text-blue-500" size={20} />;
      case 'PENDING':
        return <Clock className="text-yellow-500" size={20} />;
      case 'CANCELLED':
      case 'FAILED':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'COMPLETED':
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CONFIRMED':
      case 'PROCESSING':
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="text-center bg-gradient-to-br from-gray-50 to-white p-16 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#EC2027] opacity-10 blur-3xl rounded-full"></div>
          <ShoppingBag className="relative h-20 w-20 text-[#EC2027]" strokeWidth={1.5} />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">
          Your Order History is Empty
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
          It looks like you haven't placed an order yet. Let's find something you'll love!
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="group flex items-center gap-3 bg-gradient-to-r from-[#EC2027] to-red-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          Start Shopping
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#EC2027] to-red-600 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
            <p className="text-gray-600">Track and manage your order history</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <span className="bg-[#EC2027] text-white px-4 py-2 rounded-full text-sm font-semibold">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders by ID, name, email, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={16} />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="bg-[#EC2027] text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
          </button>
          
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-[#EC2027] hover:text-red-700 font-medium text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
              >
                <option value="all">All Methods</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount: High to Low</option>
                <option value="amount-low">Amount: Low to High</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#EC2027] hover:shadow-xl transition-all duration-300"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                      {getStatusIcon(order.payment_status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Order #{order.order_id.slice(-8).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(order.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package size={14} />
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#EC2027]">
                        {parseFloat(order.total_amount).toFixed(3)} {order.currency}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 
                         order.payment_method === 'benefit' ? 'Benefit Pay' :
                         `${order.payment_method} Card`}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className="bg-[#EC2027] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold"
                    >
                      <Eye size={16} />
                      {selectedOrder?.id === order.id ? 'Hide' : 'View'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {selectedOrder?.id === order.id && (
                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                  {/* Order Info Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="text-[#EC2027]" size={20} />
                        <span className="text-sm font-semibold text-gray-600">Payment</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">
                        {order.payment_method === 'cod' ? 'Cash on Delivery' : 
                         order.payment_method === 'benefit' ? 'Benefit Pay' :
                         `${order.payment_method} Card`}
                      </p>
                      {order.payment_method !== 'cod' && order.order_status && order.order_status !== 'PENDING' && order.order_status !== 'CONFIRMED' && (
                        <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                          TXN: {order.order_status}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="text-[#EC2027]" size={20} />
                        <span className="text-sm font-semibold text-gray-600">Shipping</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">{order.shipping_option || 'Standard'}</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="text-[#EC2027]" size={20} />
                        <span className="text-sm font-semibold text-gray-600">Total Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-[#EC2027]">
                        {parseFloat(order.total_amount).toFixed(3)} {order.currency}
                      </p>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="text-[#EC2027]" size={20} />
                      Customer & Shipping Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Customer Details</h5>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="font-semibold text-gray-800">{order.first_name} {order.last_name}</p>
                          {order.company && <p className="text-gray-500">{order.company}</p>}
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-[#EC2027]" />
                            <span>{order.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[#EC2027]" />
                            <span>{order.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Shipping Address</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.street_address}</p>
                          <p>{order.city}, {order.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="text-[#EC2027]" size={20} />
                        Order Items ({order.items?.length || 0})
                      </h4>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setShowInvoice(order)}
                          className="flex items-center gap-2 text-[#EC2027] hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                        >
                          <FileText size={16} />
                          View Invoice
                        </button>
                        <button 
                          onClick={() => setShowInvoice(order)}
                          className="flex items-center gap-2 text-[#EC2027] hover:text-red-700 text-sm font-medium"
                        >
                          <Download size={16} />
                          Download Invoice
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#EC2027] transition-colors"
                        >
                          <img
                            src={item.image || '/placeholder-image.jpg'}
                            alt={item.product_name}
                            className="w-20 h-20 object-contain bg-white border border-gray-200 rounded-lg"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className="flex-grow">
                            <h5 className="font-semibold text-gray-800">{item.product_name}</h5>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Unit Price: {parseFloat(item.price).toFixed(3)} {order.currency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#EC2027]">
                              {(parseFloat(item.price) * item.quantity).toFixed(3)} {order.currency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && (
        <Invoice 
          order={showInvoice} 
          onClose={() => setShowInvoice(null)} 
          isModal={true} 
        />
      )}
    </div>
  );
};

export default OrdersSection;
