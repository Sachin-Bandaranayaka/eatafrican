'use client';

import { useState } from 'react';
import { X, MapPin, Clock, Package, User } from 'lucide-react';
import { PaymentInfoDisplay, PaymentStatus } from './payment-info-display';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderDetailsViewProps {
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  scheduledDeliveryTime?: string;
  actualDeliveryTime?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  paymentReference?: string | null;
  onClose?: () => void;
}

export function OrderDetailsView({
  orderNumber,
  status,
  customerName,
  customerEmail,
  customerPhone,
  deliveryAddress,
  deliveryCity,
  deliveryPostalCode,
  scheduledDeliveryTime,
  actualDeliveryTime,
  items,
  subtotal,
  deliveryFee,
  discountAmount = 0,
  taxAmount = 0,
  totalAmount,
  paymentStatus,
  paymentMethod,
  paymentReference,
  onClose,
}: OrderDetailsViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Order Details</h2>
            <p className="text-amber-100">Order #{orderNumber}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-amber-100 transition"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Status */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Order Status</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {status}
            </span>
          </div>
        </div>

        {/* Payment Information */}
        <div className="pb-4 border-b">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Information</h3>
          <PaymentInfoDisplay
            paymentStatus={paymentStatus}
            paymentMethod={paymentMethod}
            paymentReference={paymentReference}
            showDetails={true}
          />
        </div>

        {/* Customer Information */}
        <div className="pb-4 border-b">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{customerName}</span>
            </div>
            {customerEmail && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 ml-6">Email:</span>
                <span className="text-gray-900">{customerEmail}</span>
              </div>
            )}
            {customerPhone && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700 ml-6">Phone:</span>
                <span className="text-gray-900">{customerPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="pb-4 border-b">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Delivery Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-500 mt-0.5" />
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-900">
                  {deliveryAddress}
                  <br />
                  {deliveryPostalCode} {deliveryCity}
                </p>
              </div>
            </div>
            {scheduledDeliveryTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="font-medium text-gray-700">Scheduled:</span>
                <span className="text-gray-900">
                  {new Date(scheduledDeliveryTime).toLocaleString()}
                </span>
              </div>
            )}
            {actualDeliveryTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-500" />
                <span className="font-medium text-gray-700">Delivered:</span>
                <span className="text-gray-900">
                  {new Date(actualDeliveryTime).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="pb-4 border-b">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Fr. {item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  Fr. {item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">Fr. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Delivery Fee</span>
              <span className="text-gray-900">Fr. {deliveryFee.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-Fr. {discountAmount.toFixed(2)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-700">Tax (8.1%)</span>
                <span className="text-gray-900">Fr. {taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 border-gray-300">
              <span className="font-bold text-gray-900 text-base">Total</span>
              <span className="font-bold text-gray-900 text-base">
                Fr. {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
