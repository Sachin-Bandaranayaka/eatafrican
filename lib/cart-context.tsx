"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string | null;
  restaurantId: string;
  restaurantName: string;
}

export interface DeliveryInfo {
  street: string;
  city: string;
  postalCode: string;
  deliveryTime: string;
  voucherCode?: string;
}

interface CartContextType {
  items: CartItem[];
  deliveryInfo: DeliveryInfo | null;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRestaurantId: () => string | null;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  clearDeliveryInfo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryInfo, setDeliveryInfoState] = useState<DeliveryInfo | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }

    const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
    if (savedDeliveryInfo) {
      try {
        setDeliveryInfoState(JSON.parse(savedDeliveryInfo));
      } catch (error) {
        console.error('Failed to load delivery info from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save delivery info to localStorage whenever it changes
  useEffect(() => {
    if (deliveryInfo) {
      localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    } else {
      localStorage.removeItem('deliveryInfo');
    }
  }, [deliveryInfo]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prevItems => {
      // Check if item already exists
      const existingIndex = prevItems.findIndex(i => i.menuItemId === item.menuItemId);
      
      if (existingIndex >= 0) {
        // Update quantity
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += item.quantity || 1;
        return newItems;
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.menuItemId === menuItemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getRestaurantId = () => {
    return items.length > 0 ? items[0].restaurantId : null;
  };

  const setDeliveryInfo = (info: DeliveryInfo) => {
    setDeliveryInfoState(info);
  };

  const clearDeliveryInfo = () => {
    setDeliveryInfoState(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryInfo,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getRestaurantId,
        setDeliveryInfo,
        clearDeliveryInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
