# Cart Component Integration Example

This is a step-by-step guide to connect your cart component to the backend.

## Step 1: Import the Cart Hook

At the top of `components/cart.tsx`, add:

```typescript
import { useCart } from '@/lib/cart-context';
```

## Step 2: Use the Cart Hook

Inside your `CartComponent`, replace the hardcoded items with:

```typescript
export function CartComponent({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  
  // Your existing state
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: ''
  });
  const [deliveryTime, setDeliveryTime] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  
  // ... rest of your component
}
```

## Step 3: Display Cart Items

Replace the hardcoded cart items section with:

```typescript
{/* Cart Items */}
<div className="relative space-y-4">
  {items.length === 0 ? (
    <p className="text-center text-white py-4">Your cart is empty</p>
  ) : (
    items.map((item) => (
      <div key={item.id} className="flex items-start gap-2 border-b border-amber-200 pb-2">
        <div className="bg-gray-200 p-2 rounded-md w-16 h-16 flex items-center justify-center">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <img src="/placeholder.svg" alt="" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-[#ebeb48] font-bold text-sm">{item.name}</div>
          <div className="text-xs text-white">{item.restaurantName}</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.menuItemId, parseInt(e.target.value) || 1)}
            className="text-white w-10 h-6 text-xs border border-blue-300 rounded text-center focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <div className="text-sm text-white font-bold">
            Fr. {(item.price * item.quantity).toFixed(2)}.-
          </div>
          <button 
            onClick={() => removeItem(item.menuItemId)}
            className="h-6 w-6 flex items-center justify-center gap-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
          >
            <img src="/images/recycleBin.png" alt="Remove item" className="w-3 h-3" />
          </button>
        </div>
      </div>
    ))
  )}
</div>
```

## Step 4: Calculate Totals

Replace the order summary section with:

```typescript
{/* Order Summary */}
<div className="relative w-1/2 bg-[#cfe2f3] p-4 rounded-3xl flex justify-between text-black">
  <div>
    <div className="text-sm mb-2">Subtotal</div>
    <div className="text-sm mb-2">Delivery Fee</div>
    {discount > 0 && <div className="text-sm mb-2">Discount</div>}
    <div className="text-sm font-bold">Total</div>
    <div className="text-xs">Inkl. MwSt.</div>
  </div>
  <div className="text-right">
    <div className="text-sm">Fr. {getTotalPrice().toFixed(2)}.-</div>
    <div className="text-sm mb-2">Fr. {deliveryFee.toFixed(2)}.-</div>
    {discount > 0 && <div className="text-sm mb-2 text-green-600">-Fr. {discount.toFixed(2)}.-</div>}
    <div className="text-sm font-bold mb-2">
      Fr. {(getTotalPrice() + deliveryFee - discount).toFixed(2)}.-
    </div>
    <div className="text-xs">-</div>
  </div>
</div>
```

## Step 5: Calculate Delivery Fee

Add this function to calculate delivery fee based on address:

```typescript
const calculateDeliveryFee = async () => {
  if (!deliveryAddress.postalCode || !deliveryAddress.city) {
    return;
  }
  
  try {
    // You can implement a simple distance-based calculation
    // or call an API endpoint
    const baseDeliveryFee = 6.00;
    setDeliveryFee(baseDeliveryFee);
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
  }
};

// Call this when address changes
useEffect(() => {
  calculateDeliveryFee();
}, [deliveryAddress]);
```

## Step 6: Validate Voucher Code

Add this function to validate voucher codes:

```typescript
const validateVoucher = async () => {
  if (!voucherCode) return;
  
  try {
    const response = await fetch('/api/admin/vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: voucherCode })
    });
    
    if (response.ok) {
      const data = await response.json();
      const voucher = data.voucher;
      
      if (voucher.discountType === 'percentage') {
        setDiscount(getTotalPrice() * (voucher.discountValue / 100));
      } else {
        setDiscount(voucher.discountValue);
      }
    } else {
      alert('Invalid voucher code');
    }
  } catch (error) {
    console.error('Error validating voucher:', error);
  }
};
```

## Step 7: Place Order

Add this function to create the order:

```typescript
const handlePlaceOrder = async () => {
  if (items.length === 0) {
    alert('Your cart is empty');
    return;
  }
  
  if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.postalCode) {
    alert('Please provide delivery address');
    return;
  }
  
  if (!deliveryTime) {
    alert('Please select delivery time');
    return;
  }
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add auth token if user is logged in
        // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        restaurantId: items[0].restaurantId,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          postalCode: deliveryAddress.postalCode
        },
        deliveryTime: deliveryTime,
        voucherCode: voucherCode || undefined,
        paymentMethod: 'card', // or get from user selection
        // For guest checkout, include customer info:
        customerInfo: currentView === 'login' ? undefined : {
          email: 'guest@example.com', // Get from form
          phone: '+41123456789', // Get from form
          firstName: 'Guest', // Get from form
          lastName: 'User' // Get from form
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      clearCart();
      setCurrentView('payment-success');
      
      // Optionally redirect to order confirmation page
      // setTimeout(() => {
      //   window.location.href = `/order/${data.order.id}`;
      // }, 2000);
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to place order');
      setCurrentView('payment-error');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    alert('An error occurred while placing your order');
    setCurrentView('payment-error');
  }
};
```

## Step 8: Update Button Handlers

Replace your existing button handlers:

```typescript
// For the "PLACE ORDER" button in DeliveryInfoView
<button onClick={handlePlaceOrder}>
  PLACE ORDER
</button>

// For the "RETRY PAYMENT" button in PaymentErrorView
<button onClick={handlePlaceOrder}>
  RETRY PAYMENT
</button>
```

## Complete Example

Here's a minimal working example:

```typescript
"use client"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"

export function CartComponent({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: ''
  });
  const [deliveryTime, setDeliveryTime] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(6.00);
  const [discount, setDiscount] = useState(0);
  
  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: items[0].restaurantId,
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price
          })),
          deliveryAddress,
          deliveryTime,
          voucherCode: voucherCode || undefined,
          paymentMethod: 'card'
        })
      });
      
      if (response.ok) {
        clearCart();
        alert('Order placed successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order');
    }
  };
  
  return (
    <div>
      {/* Display cart items */}
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>Fr. {item.price}.-</span>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => updateQuantity(item.menuItemId, parseInt(e.target.value))}
          />
          <button onClick={() => removeItem(item.menuItemId)}>Remove</button>
        </div>
      ))}
      
      {/* Delivery address form */}
      <input 
        placeholder="Street"
        value={deliveryAddress.street}
        onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
      />
      <input 
        placeholder="City"
        value={deliveryAddress.city}
        onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
      />
      <input 
        placeholder="Postal Code"
        value={deliveryAddress.postalCode}
        onChange={(e) => setDeliveryAddress({...deliveryAddress, postalCode: e.target.value})}
      />
      
      {/* Delivery time */}
      <input 
        type="datetime-local"
        value={deliveryTime}
        onChange={(e) => setDeliveryTime(e.target.value)}
      />
      
      {/* Voucher */}
      <input 
        placeholder="Voucher Code"
        value={voucherCode}
        onChange={(e) => setVoucherCode(e.target.value)}
      />
      
      {/* Totals */}
      <div>
        <p>Subtotal: Fr. {getTotalPrice().toFixed(2)}.-</p>
        <p>Delivery: Fr. {deliveryFee.toFixed(2)}.-</p>
        {discount > 0 && <p>Discount: -Fr. {discount.toFixed(2)}.-</p>}
        <p>Total: Fr. {(getTotalPrice() + deliveryFee - discount).toFixed(2)}.-</p>
      </div>
      
      {/* Place order button */}
      <button onClick={handlePlaceOrder}>
        PLACE ORDER
      </button>
    </div>
  );
}
```

## Testing

1. Add items to cart from restaurant menu page
2. Open cart
3. Verify items are displayed
4. Fill in delivery address
5. Select delivery time
6. Click "Place Order"
7. Check browser console for API response
8. Verify order is created in database

## Troubleshooting

**Cart is empty after refresh**: Make sure CartProvider is wrapping your app in `client-wrapper.tsx`

**Can't place order**: Check browser console for errors. Make sure all required fields are filled.

**401 Unauthorized**: Add authentication token to request headers if user is logged in.

**Items from different restaurants**: The cart context prevents this automatically. It will only allow items from one restaurant at a time.

---

That's it! Your cart is now fully connected to the backend. 🎉
