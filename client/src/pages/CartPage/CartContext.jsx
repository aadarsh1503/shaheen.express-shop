// src/pages/CartPage/CartContext.js (COMPLETE AND UPDATED)

import React, { createContext, useState, useEffect, useContext } from 'react';
// Import toast
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Could not save cart data to localStorage", error);
    }
  }, [cartItems]);

  // --- Cart Management Functions ---

  // MODIFIED: addToCart with stock check and toast notification
  const addToCart = (product, productTable) => {
    if (product.stockQuantity === undefined) {
      toast.error("Sorry, an error occurred.");
      return;
    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Correct logic: Calculate potential new quantity
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stockQuantity) {
          toast.warn(`Max quantity for ${product.name} is ${product.stockQuantity}.`);
          return prevItems; // Don't update
        }
        toast.success(`${product.name} added to cart!`);
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        toast.success(`${product.name} added to cart!`);
        return [...prevItems, { ...product, quantity: 1, productTable }];
      }
    });
  };
  
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  // MODIFIED: updateQuantity with stock check and toast notification
  const updateQuantity = (itemId, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;

          // If increasing, check against stock and cap the value
          if (delta > 0 && newQuantity > item.stockQuantity) {
            toast.warn(`Max quantity reached! Only ${item.stockQuantity} available.`);
            // IMPORTANT: Cap the quantity at the stock limit
            return { ...item, quantity: item.stockQuantity };
          }
          
          // Ensure quantity is at least 1
          const finalQuantity = Math.max(1, newQuantity);

          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };
  const emptyCart = () => {
    setCartItems([]);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};