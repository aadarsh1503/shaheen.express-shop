import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, Filter, Eye, Download, RefreshCw, Calendar, 
  CreditCard, User, MapPin, Phone, Mail, ShoppingBag, ChevronDown, 
  X, SortDesc, FileText, Truck, CheckCircle, Clock, XCircle, 
  AlertTriangle, Users, DollarSign, TrendingUp, LogOut
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from '../components/AdminNavigation';
import AdminInvoice from '../components/AdminInvoice';
import { API_URL } from '../services/api';

// Loading Skeleton Component
const OrdersSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{children}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showInvoice, setShowInvoice] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  
  const { logout: logoutAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy]);

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setIsLoading(false);
        toast.error('Please login as admin first');
        navigate('/admin/login');
        return;
      }

      const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        toast.success(`Loaded ${response.data.orders.length} orders successfully`);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Admin session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        toast.error(`Failed to load orders: ${error.response?.data?.message || error.message}`);
      }
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
        order.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.created_at) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.created_at) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.created_at) >= filterDate);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(order => new Date(order.created_at) >= filterDate);
          break;
      }
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
        case 'customer':
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateFilter('all');
    setSortBy('newest');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (paymentFilter !== 'all') count++;
    if (dateFilter !== 'all') count++;
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

  const formatCurrency = (amount, currency = 'BHD') => {
    return `${parseFloat(amount).toFixed(3)} ${currency}`;
  };

  // Statistics calculations
  const statistics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const completedOrders = filteredOrders.filter(order => order.payment_status === 'COMPLETED' || order.payment_status === 'APPROVED').length;
    const pendingOrders = filteredOrders.filter(order => order.payment_status === 'PENDING').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      averageOrderValue,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    };
  }, [filteredOrders]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logoutAdmin();
    setIsLogoutModalOpen(false);
    navigate('/admin/login');
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        toast.error('Admin authentication required');
        navigate('/admin/login');
        return;
      }

      const response = await axios.put(
        `${API_URL}/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update the local orders state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, payment_status: newStatus }
              : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Admin session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        toast.error(`Failed to update status: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-10">
        <main className="container mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          </div>
          <OrdersSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <main className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EC2027] to-red-600 rounded-xl flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600">Monitor and manage all customer orders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAllOrders()}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:scale-105"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Refresh
            </button>
            <AdminNavigation onLogout={handleLogoutClick} />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(statistics.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-3xl font-bold text-[#EC2027]">{statistics.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-[#EC2027]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(statistics.averageOrderValue)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order ID, customer name, email, phone, or product..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
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
                  <option value="benefit">Benefit Pay</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EC2027] focus:border-[#EC2027]"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 3 Months</option>
                </select>
              </div>

              {/* Sort Options */}
              {/* <div>
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
                  <option value="customer">Customer Name</option>
                </select>
              </div> */}
            </div>
          )}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Orders per page:</span>
                <span className="bg-[#EC2027] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {ordersPerPage}
                </span>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid gap-6 mb-8">
              {currentOrders.map((order) => (
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
                              <User size={14} />
                              {order.first_name} {order.last_name}
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
                            {formatCurrency(order.total_amount, order.currency)}
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
                            {formatCurrency(order.total_amount, order.currency)}
                          </p>
                        </div>
                      </div>

                      {/* Order Status Management */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm mb-6">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="text-blue-600" size={20} />
                          Order Status Management
                        </h4>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Current Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.payment_status)}`}>
                              {order.payment_status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Update to:</label>
                            <select
                              value={order.payment_status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              disabled={updatingStatus === order.id}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
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
                            {updatingStatus === order.id && (
                              <div className="flex items-center gap-2 text-blue-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm">Updating...</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Status changes will be immediately visible to customers in their account page.
                        </p>
                      </div>

                      {/* Customer Information */}
                      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Users className="text-[#EC2027]" size={20} />
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
                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-[#EC2027] mt-0.5" />
                                <div>
                                  <p>{order.street_address}</p>
                                  <p>{order.city}, {order.country}</p>
                                </div>
                              </div>
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
                              className="flex items-center gap-2 text-[#EC2027] hover:text-red-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                            >
                              <Download size={16} />
                              Download PDF
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
                                <p className="text-sm text-gray-500">Unit Price: {formatCurrency(item.price, item.currency)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-[#EC2027]">
                                  {formatCurrency(parseFloat(item.price) * item.quantity, item.currency)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-[#EC2027] text-white border-[#EC2027]'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
      >
        Are you sure you want to sign out? Your admin session will be terminated.
      </ConfirmationModal>

      {/* Invoice Modal */}
      {showInvoice && (
        <AdminInvoice 
          order={showInvoice} 
          onClose={() => setShowInvoice(null)} 
          isModal={true} 
        />
      )}
    </div>
  );
};

export default OrdersAdmin;