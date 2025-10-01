import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getAllShopCategories, 
  searchShopProducts, 
  searchProducts 
} from '../frontend-admin/services/api';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false); // Reset animation state on open
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllShopCategories();
        setCategories(response.data); 
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [shopResults, adminResults] = await Promise.all([
          searchShopProducts(debouncedSearchTerm),
          searchProducts(debouncedSearchTerm)
        ]);

        const normalizedAdminResults = adminResults.data.map(product => ({
          ...product,
          image: product.image1
        }));

        const combinedResults = [...shopResults.data, ...normalizedAdminResults];
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());
        
        setSearchResults(uniqueResults);

      } catch (err) {
        setError('Failed to fetch search results.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setSearchTerm('');
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
      onClose(); // Unmount component after animation
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-white z-50 flex flex-col ${
        isClosing ? 'animate-slide-up-fade' : 'animate-slide-down-fade'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="container mx-auto flex-grow flex flex-col max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex-shrink-0 pt-4 pb-8">
          <div className="flex justify-end mb-6">
            <button onClick={handleClose} className="p-2 text-gray-600 hover:text-gray-900 rounded-full" aria-label="Close search">
              <X size={32} />
            </button>
          </div>
          <div className="relative border-b-2 border-gray-300 focus-within:border-gray-900">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent pl-12 pr-4 py-3 text-3xl md:text-4xl text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Results Area with Scrolling Fix */}
        <div className="flex-grow overflow-y-auto pb-8 min-h-0">
          {isLoading && (
            <div className="flex justify-center items-center pt-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          )}
          
          {error && <div className="text-center text-red-500 pt-8">{error}</div>}

          {!isLoading && !error && debouncedSearchTerm.trim() !== '' && searchResults.length === 0 && (
            <p className="text-center text-gray-600 pt-8">No products found for "{debouncedSearchTerm}".</p>
          )}

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <Link 
                  key={product.id}
                  to={`/shop/product/${product.id}`}
                  onClick={handleClose}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-contain border rounded-md flex-shrink-0" 
                  />
                  <div>
                    <h3 className="font-medium text-gray-800 group-hover:text-black">{product.name}</h3>
                    <p className="text-sm text-gray-500">{parseFloat(product.price).toFixed(2)} KWD</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {searchTerm.trim() === '' && !isLoading && (
            <div className="bg-[#e9f3f5] py-10 px-4">
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-600">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/shop/category/${category.id}`}
                    onClick={handleClose}
                    className="hover:text-black transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;