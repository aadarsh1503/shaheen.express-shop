// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the context
const CartContext = createContext();

// Custom hook to use the cart context easily
export const useCart = () => useContext(CartContext);

// 2. Create a provider component
export const CartProvider = ({ children }) => {
  // Initialize state from localStorage or as an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart data from localStorage", error);
      return [];
    }
  });

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Could not save cart data to localStorage", error);
    }
  }, [cartItems]);

  // --- Cart Management Functions ---

  // Function to add an item (or update quantity if it exists)
  // CHANGE: Accept productTable to know the product's origin
  const addToCart = (product, productTable) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If new item, add it with quantity 1 and the productTable
        return [...prevItems, { ...product, quantity: 1, productTable }];
      }
    });
  };
  
  // Function to remove an item completely
  const removeFromCart = (itemId) => {
    // Note: In local cart, we use product.id, not cart_item_id
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  // Function to update quantity (increase/decrease)
  const updateQuantity = (itemId, delta) => { // delta can be 1 or -1
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Ensure quantity is at least 1
          : item
      ).filter(item => item.quantity > 0) // Also remove if quantity becomes 0 or less
    );
  };

  // Function to empty the cart
  const emptyCart = () => {
    setCartItems([]);
  };
  
  // Provide state and functions to children components
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};