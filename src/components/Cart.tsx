import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">☕</div>
          <h2 className="text-3xl font-corinthia font-bold text-brand-primary mb-2">Your cart is empty</h2>
          <p className="text-brand-muted mb-6 font-inter">Add some delicious items to get started!</p>
          <button
            onClick={onContinueShopping}
            className="bg-brand-primary text-white px-6 py-3 rounded-full hover:bg-brand-accent transition-all duration-200 font-inter"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-brand-muted hover:text-brand-primary transition-colors duration-200 self-start"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline font-inter">Continue Shopping</span>
          <span className="sm:hidden font-inter">Back</span>
        </button>

        <div className="flex items-center justify-between sm:justify-center flex-1">
          <h1 className="text-3xl sm:text-4xl font-corinthia font-bold text-brand-primary">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-brand-accent hover:text-brand-primary transition-colors duration-200 text-sm sm:text-base font-inter"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-brand-primary/10">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b border-brand-primary/10' : ''}`}>
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h3 className="text-base font-semibold text-brand-primary mb-1 font-inter">{item.name}</h3>
                  {item.selectedVariation && (
                    <p className="text-xs text-brand-muted mb-1 font-inter">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-brand-muted mb-1 font-inter">
                      Add-ons: {item.selectedAddOns.map(addOn =>
                        addOn.quantity && addOn.quantity > 1
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-brand-accent hover:text-brand-primary hover:bg-brand-light rounded-full transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-brand-light rounded-full p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-brand-primary/10 rounded-full transition-colors duration-200"
                  >
                    <Minus className="h-3 w-3 text-brand-primary" />
                  </button>
                  <span className="font-semibold text-brand-primary min-w-[24px] text-center text-sm font-inter">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-brand-primary/10 rounded-full transition-colors duration-200"
                  >
                    <Plus className="h-3 w-3 text-brand-primary" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-brand-muted font-inter">₱{item.totalPrice} each</p>
                  <p className="text-lg font-semibold text-brand-primary font-inter">₱{item.totalPrice * item.quantity}</p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-brand-primary mb-1 font-inter">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-brand-muted mb-1 font-inter">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-brand-muted mb-1 font-inter">
                    Add-ons: {item.selectedAddOns.map(addOn =>
                      addOn.quantity && addOn.quantity > 1
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-lg font-semibold text-brand-primary font-inter">₱{item.totalPrice} each</p>
              </div>

              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-3 bg-brand-light rounded-full p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-brand-primary/10 rounded-full transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-brand-primary" />
                  </button>
                  <span className="font-semibold text-brand-primary min-w-[32px] text-center font-inter">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-brand-primary/10 rounded-full transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-brand-primary" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-brand-primary font-inter">₱{item.totalPrice * item.quantity}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-brand-accent hover:text-brand-primary hover:bg-brand-light rounded-full transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-primary/10">
        <div className="flex items-center justify-between text-2xl font-corinthia font-bold text-brand-primary mb-6">
          <span>Total:</span>
          <span className="font-inter">₱{(getTotalPrice() || 0).toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-brand-primary text-white py-4 rounded-xl hover:bg-brand-accent transition-all duration-200 transform hover:scale-[1.02] font-medium text-lg font-inter"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;