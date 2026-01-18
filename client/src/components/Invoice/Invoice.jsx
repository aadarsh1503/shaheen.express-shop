import { useState, useRef, useEffect } from 'react';
import { 
  Download, Printer, Mail, Calendar, MapPin, Phone, 
  Package, CreditCard, Building, FileText, X, Loader 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { API_URL } from '../../pages/frontend-admin/services/api';

const Invoice = ({ order, onClose, isModal = false }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(order);
  const invoiceRef = useRef();

  useEffect(() => {
    // If we have a basic order object, fetch complete details
    if (order && order.order_id && !order.items) {
      fetchOrderDetails(order.order_id);
    } else {
      setOrderData(order);
    }
  }, [order]);

  const fetchOrderDetails = async (orderId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/payment/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOrderData(response.data.order);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const generateInvoiceNumber = (orderId) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `INV-${year}${month}-${orderId.slice(-6).toUpperCase()}`;
  };

  const downloadPDF = async () => {
    setIsGenerating(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${generateInvoiceNumber(orderData.order_id)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const subtotal = orderData?.items?.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) || 0;
  const shippingCost = 2.200; // Default shipping cost
  const vatRate = 0.10;
  const vatAmount = (subtotal + shippingCost) * vatRate;
  const total = parseFloat(orderData?.total_amount || 0);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 flex items-center gap-4">
          <Loader className="animate-spin text-[#EC2027]" size={24} />
          <span className="text-gray-700">Loading invoice...</span>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const InvoiceContent = () => (
    <div ref={invoiceRef} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-[#EC2027]">
        <div>
          <h1 className="text-4xl font-bold text-[#EC2027] mb-2">INVOICE</h1>
          <p className="text-gray-600">Invoice #{generateInvoiceNumber(orderData.order_id)}</p>
        </div>
        <div className="text-right">
          <img 
            src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1768639827/i1-3Ew8TKSD_dit20k.png" 
            alt="Shaheen Express Logo" 
            className="w-32 h-32 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Company & Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* From */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building className="text-[#EC2027]" size={20} />
            From
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-bold text-gray-800">Shaheen Express</p>
            <p className="text-gray-600">Premium Delivery & Shopping Services</p>
            <p className="text-gray-600">Kingdom of Bahrain</p>
            <div className="mt-3 space-y-1">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                +973 XXXX XXXX
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                info@shaheenexpress.com
              </p>
            </div>
          </div>
        </div>

        {/* To */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-[#EC2027]" size={20} />
            Bill To
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-bold text-gray-800">{orderData.first_name} {orderData.last_name}</p>
            {orderData.company && <p className="text-gray-600">{orderData.company}</p>}
            <p className="text-gray-600">{orderData.street_address}</p>
            <p className="text-gray-600">{orderData.city}, {orderData.country}</p>
            <div className="mt-3 space-y-1">
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                {orderData.phone}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                {orderData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={16} />
            <span className="text-sm font-semibold text-blue-800">Invoice Date</span>
          </div>
          <p className="font-bold text-blue-900">{formatDate(orderData.created_at)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-green-600" size={16} />
            <span className="text-sm font-semibold text-green-800">Order ID</span>
          </div>
          <p className="font-bold text-green-900">#{orderData.order_id.slice(-8).toUpperCase()}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="text-purple-600" size={16} />
            <span className="text-sm font-semibold text-purple-800">Payment Method</span>
          </div>
          <p className="font-bold text-purple-900 capitalize">
            {orderData.payment_method === 'cod' ? 'Cash on Delivery' : `${orderData.payment_method} Card`}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="text-[#EC2027]" size={20} />
          Order Items
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-[#EC2027] text-white">
                <th className="text-left p-3 font-semibold">Item</th>
                <th className="text-center p-3 font-semibold">Qty</th>
                <th className="text-right p-3 font-semibold">Unit Price</th>
                <th className="text-right p-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.items?.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.product_name}
                        className="w-12 h-12 object-contain bg-white border border-gray-200 rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Product ID: {item.product_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 border-b border-gray-200 text-center font-semibold">
                    {item.quantity}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-right font-semibold">
                    {parseFloat(item.price).toFixed(3)} {orderData.currency}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-right font-bold text-[#EC2027]">
                    {(parseFloat(item.price) * item.quantity).toFixed(3)} {orderData.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-1/2">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{subtotal.toFixed(3)} {orderData.currency}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold">{shippingCost.toFixed(3)} {orderData.currency}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>VAT (10%):</span>
                <span className="font-semibold">{vatAmount.toFixed(3)} {orderData.currency}</span>
              </div>
              <div className="border-t-2 border-[#EC2027] pt-3">
                <div className="flex justify-between text-xl font-bold text-[#EC2027]">
                  <span>Total:</span>
                  <span>{total.toFixed(3)} {orderData.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Payment Information</h4>
            <p className="text-sm text-gray-600">
              Payment Status: <span className="font-semibold text-green-600">
                {orderData.payment_status === 'COMPLETED' ? 'PAID' : orderData.payment_status}
              </span>
            </p>
            {orderData.payment_method !== 'cod' && orderData.order_status && (
              <p className="text-sm text-gray-600">
                Transaction ID: <span className="font-mono text-xs">{orderData.order_status}</span>
              </p>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Terms & Conditions</h4>
            <p className="text-xs text-gray-600">
              Thank you for your business! This invoice is generated automatically. 
              For any queries, please contact our customer service.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()} | Shaheen Express - Premium Delivery Services
          </p>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-xl font-bold text-gray-800">Invoice Preview</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={downloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-[#EC2027] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={printInvoice}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          {/* Invoice Content */}
          <div className="p-4">
            <InvoiceContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={downloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-[#EC2027] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={printInvoice}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>
        
        <InvoiceContent />
      </div>
    </div>
  );
};

export default Invoice;