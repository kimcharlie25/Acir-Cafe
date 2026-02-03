import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Check, Loader2 } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { useOrders } from '../hooks/useOrders';
import { uploadReceiptToCloudinary, compressImage } from '../lib/cloudinary';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

// Countdown Modal Component
const CountdownModal: React.FC<{
  orderNumber: string;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  onDone: () => void;
}> = ({ orderNumber, countdown, setCountdown, onDone }) => {
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, setCountdown]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-corinthia font-bold text-brand-primary mb-4">Order Confirmed!</h2>
        <p className="text-brand-muted mb-6 font-inter">
          Please proceed to the counter with this order number:
        </p>
        <div className="bg-brand-bg rounded-xl py-4 px-6 mb-6">
          <span className="text-4xl font-bold text-brand-primary font-mono">#{orderNumber}</span>
        </div>
        <button
          onClick={onDone}
          disabled={countdown > 0}
          className={`w-full py-3 rounded-xl transition-all duration-200 font-medium font-inter ${countdown > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-brand-primary text-white hover:bg-brand-accent'
            }`}
        >
          {countdown > 0 ? `Done (${countdown})` : 'Done'}
        </button>
      </div>
    </div>
  );
};

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const { createOrder, creating, error } = useOrders();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [uiNotice, setUiNotice] = useState<string | null>(null);
  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);
  const [doneCountdown, setDoneCountdown] = useState(5);
  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const copyOrderDetails = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setUploadError(null);
    setReceiptUrl(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptUrl(null);
    setUploadError(null);
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleConfirmOrder = async () => {
    try {
      const mergedNotes = notes;
      const order = await createOrder({
        customerName,
        serviceType,
        paymentMethod: 'counter', // Pay at counter
        referenceNumber,
        notes: mergedNotes,
        total: totalPrice,
        items: cartItems,
      });
      // Show the order confirmation modal
      const orderNum = order.order_number?.toString().padStart(3, '0') || order.id.slice(-6).toUpperCase();
      setConfirmedOrderNumber(orderNum);
      setShowOrderModal(true);
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      if (/insufficient stock/i.test(raw)) {
        setUiNotice(raw);
        return;
      }
      if (/rate limit/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else {
        setUiNotice('Unable to place order. Please try again.');
      }
    }
  };

  const handlePlaceOrder = async () => {
    let uploadedReceiptUrl = receiptUrl;

    // Upload receipt first if user selected one but hasn't uploaded yet
    if (receiptFile && !receiptUrl) {
      try {
        setUploadingReceipt(true);
        setUploadError(null);
        setUiNotice('Uploading receipt...');

        // Compress image before upload
        const compressedFile = await compressImage(receiptFile, 1200, 0.8);

        // Upload to Cloudinary
        uploadedReceiptUrl = await uploadReceiptToCloudinary(compressedFile);
        setReceiptUrl(uploadedReceiptUrl);
        setUiNotice('Receipt uploaded! Creating order...');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload receipt';
        setUploadError(message);
        setUiNotice(`Upload failed: ${message}. Please try again or continue without receipt.`);
        setUploadingReceipt(false);
        return; // Stop order placement if upload fails
      } finally {
        setUploadingReceipt(false);
      }
    }

    // Persist order to database
    let orderId: string;
    let orderNum: string;
    try {
      const mergedNotes = notes;
      const order = await createOrder({
        customerName,
        serviceType,
        paymentMethod,
        referenceNumber,
        notes: mergedNotes,
        total: totalPrice,
        items: cartItems,
        receiptUrl: uploadedReceiptUrl ?? undefined,
      });
      orderId = order.id;
      // Format order number for display (3-digit padded or fallback to ID slice)
      orderNum = order.order_number?.toString().padStart(3, '0') || orderId.slice(-6).toUpperCase();
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      if (/insufficient stock/i.test(raw)) {
        setUiNotice(raw);
        return;
      }
      if (/rate limit/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else if (/missing identifiers/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      }
      return;
    }


    const orderDetails = `
🛒 ACIR CAFE ORDER
📋 Order Number: #${orderNum}

👤 Customer: ${customerName}
📍 Service: ${serviceType === 'dine-in' ? 'Dine In' : 'Take Out'}

📋 ORDER DETAILS:
${cartItems.map(item => {
      let itemDetails = `• ${item.name}`;
      if (item.selectedVariation) {
        itemDetails += ` (${item.selectedVariation.name})`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} x${addOn.quantity}`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
      return itemDetails;
    }).join('\n')}

💰 TOTAL: ₱${totalPrice}


💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
${uploadedReceiptUrl ? `📸 Payment Receipt: ${uploadedReceiptUrl}` : '📸 Payment Screenshot: Please attach your payment receipt screenshot'}

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing Acir Cafe! ☕

📋 Order Number: #${orderNum}
    `.trim();

    const pageId = '61579693577478';
    const encodedMessage = encodeURIComponent(orderDetails);
    const webLink = `https://m.me/${pageId}?text=${encodedMessage}`;

    // Best effort: copy order details so user can paste in Messenger if text cannot be prefilled
    await copyOrderDetails(orderDetails);

    // Use window.location for both mobile and desktop to avoid popup blocker
    // This will navigate away from the site but ensures the link always works
    window.location.href = webLink;

  };

  const isDetailsValid = customerName;

  if (step === 'details') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-brand-muted hover:text-brand-primary transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-inter">Back to Cart</span>
          </button>
          <h1 className="text-4xl font-corinthia font-bold text-brand-primary ml-8">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-primary/10">
            <h2 className="text-3xl font-corinthia font-bold text-brand-primary mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-brand-primary/10">
                  <div>
                    <h4 className="font-medium text-brand-primary font-inter">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-brand-muted font-inter">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-brand-muted font-inter">
                        Add-ons: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-brand-muted font-inter">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-brand-primary font-inter">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-primary/20 pt-4">
              <div className="flex items-center justify-between text-2xl font-corinthia font-bold text-brand-primary">
                <span>Total:</span>
                <span className="font-inter">₱{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-primary/10">
            <h2 className="text-3xl font-corinthia font-bold text-brand-primary mb-6">Customer Information</h2>

            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-brand-primary mb-2 font-inter">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 font-inter"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-primary mb-3 font-inter">Service Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                    { value: 'take-out', label: 'Take Out', icon: '🥡' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${serviceType === option.value
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-primary/30 bg-white text-brand-primary hover:border-brand-primary/50'
                        }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium font-inter">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium text-brand-primary mb-2 font-inter">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-primary/30 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 font-inter"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={!isDetailsValid || creating}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-200 transform font-inter ${isDetailsValid && !creating
                  ? 'bg-brand-primary text-white hover:bg-brand-accent hover:scale-[1.02]'
                  : 'bg-brand-light text-brand-muted cursor-not-allowed'
                  }`}
              >
                {creating ? 'Placing Order...' : 'Confirm Order'}
              </button>

              {/* Order Confirmation Modal */}
              {showOrderModal && confirmedOrderNumber && (
                <CountdownModal
                  orderNumber={confirmedOrderNumber}
                  countdown={doneCountdown}
                  setCountdown={setDoneCountdown}
                  onDone={() => {
                    setShowOrderModal(false);
                    window.location.reload(); // Refresh to clear cart
                  }}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-brand-muted hover:text-brand-primary transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-inter">Back to Details</span>
        </button>
        <h1 className="text-4xl font-corinthia font-bold text-brand-primary ml-8">Payment</h1>
      </div>

      {uiNotice && (
        <div className="mb-4 rounded-lg border border-brand-muted/30 bg-brand-bg text-brand-primary p-4 text-sm font-inter">
          {uiNotice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-primary/10">
          <h2 className="text-3xl font-corinthia font-bold text-brand-primary mb-6">Choose Payment Method</h2>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${paymentMethod === method.id
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-brand-primary/30 bg-white text-brand-primary hover:border-brand-primary/50'
                  }`}
              >
                <span className="text-2xl">💳</span>
                <span className="font-medium font-inter">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-brand-bg rounded-lg p-6 mb-6">
              <h3 className="font-medium text-brand-primary mb-4 font-inter">Payment Details</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-brand-muted mb-1 font-inter">{selectedPaymentMethod.name}</p>
                  <p className="font-mono text-brand-primary font-medium">{selectedPaymentMethod.account_number}</p>
                  <p className="text-sm text-brand-muted mb-3 font-inter">Account Name: {selectedPaymentMethod.account_name}</p>
                  <p className="text-xl font-semibold text-brand-primary font-inter">Amount: ₱{totalPrice}</p>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={selectedPaymentMethod.qr_code_url}
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-32 h-32 rounded-lg border-2 border-brand-primary/30 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-xs text-brand-muted text-center mt-2 font-inter">Scan to pay</p>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Upload */}
          <div className="bg-brand-light border border-brand-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-brand-primary mb-3 font-inter">📸 Upload Payment Receipt</h4>

            {!receiptPreview ? (
              <div>
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-primary/30 rounded-lg cursor-pointer bg-white hover:bg-brand-bg transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-brand-primary mb-2" />
                    <p className="text-sm text-brand-muted font-inter">
                      <span className="font-semibold">Click to select receipt</span> or drag and drop
                    </p>
                    <p className="text-xs text-brand-muted mt-1 font-inter">PNG, JPG, WEBP up to 10MB (Optional)</p>
                  </div>
                  <input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                    onChange={handleReceiptFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border-2 border-brand-primary/30">
                  <img
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={handleRemoveReceipt}
                    className="absolute top-2 right-2 p-1 bg-brand-primary text-white rounded-full hover:bg-brand-accent transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {receiptUrl ? (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium font-inter">Receipt ready! Will be saved with your order.</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-brand-primary bg-brand-bg px-3 py-2 rounded-lg">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm font-medium font-inter">Receipt selected. Will upload when you place order.</span>
                  </div>
                )}

                {uploadError && (
                  <div className="text-sm text-brand-primary bg-brand-light px-3 py-2 rounded-lg font-inter">
                    {uploadError}
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-brand-muted mt-3 font-inter">
              {receiptFile ? 'Receipt will be uploaded automatically when you place your order.' : 'You can also attach your receipt in the Messenger conversation.'}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-brand-primary/10">
          <h2 className="text-3xl font-corinthia font-bold text-brand-primary mb-6">Final Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="bg-brand-bg rounded-lg p-4">
              <h4 className="font-medium text-brand-primary mb-2 font-inter">Customer Details</h4>
              <p className="text-sm text-brand-muted font-inter">Name: {customerName}</p>
              <p className="text-sm text-brand-muted font-inter">Service: {serviceType === 'dine-in' ? 'Dine In' : 'Take Out'}</p>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-brand-primary/10">
                <div>
                  <h4 className="font-medium text-brand-primary font-inter">{item.name}</h4>
                  {item.selectedVariation && (
                    <p className="text-sm text-brand-muted font-inter">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-sm text-brand-muted font-inter">
                      Add-ons: {item.selectedAddOns.map(addOn =>
                        addOn.quantity && addOn.quantity > 1
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-brand-muted font-inter">₱{item.totalPrice} x {item.quantity}</p>
                </div>
                <span className="font-semibold text-brand-primary font-inter">₱{item.totalPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-primary/20 pt-4 mb-6">
            <div className="flex items-center justify-between text-2xl font-corinthia font-bold text-brand-primary">
              <span>Total:</span>
              <span className="font-inter">₱{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={creating || uploadingReceipt}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-200 transform font-inter ${creating || uploadingReceipt ? 'bg-brand-light text-brand-muted cursor-not-allowed' : 'bg-brand-primary text-white hover:bg-brand-accent hover:scale-[1.02]'}`}
          >
            {uploadingReceipt ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Uploading Receipt...</span>
              </span>
            ) : creating ? (
              'Placing Order...'
            ) : (
              'Place Order via Messenger'
            )}
          </button>
          {error && !uiNotice && (
            <p className="text-sm text-brand-primary text-center mt-2 font-inter">{error}</p>
          )}

          <p className="text-xs text-brand-muted text-center mt-3 font-inter">
            You'll be redirected to Facebook Messenger to confirm your order. Don't forget to attach your payment screenshot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
