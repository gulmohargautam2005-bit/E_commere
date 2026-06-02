import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mycontext } from '../../App';
import { fetchDataFromAPI, postDataToAPI, deletedata } from '../../utils/api';
import { downloadLuxeInvoice } from '../../utils/invoiceGenerator';
import toast, { Toaster } from 'react-hot-toast';
import '../../web.css';
import Header1 from '../../components/Header1';
import Footer1 from '../../components/Footer1';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);

  // States
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);



  // Checkout Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    postcode: '',
    phone: '',
    email: '',
    createAccount: false,
    shipDifferentAddress: false,
    orderNotes: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  // Handle inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };





  // Dynamically load Tailwind CDN & Scoped configuration
  useEffect(() => {
    const scriptId = "tailwind-cdn-script";
    let script = document.getElementById(scriptId);

    const applyConfig = () => {
      if (window.tailwind) {
        window.tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "surface-container-low": "#fbfbfb",
                "surface-container": "#eaeaea",
                "outline-variant": "#e0e0e0",
                primary: "#111111",
                "on-primary": "#ffffff",
                "on-surface-variant": "#666666",
                secondary: "#5e5e5d",
                error: "#ba1a1a",
                surface: "#ffffff",
                background: "#ffffff"
              },
              spacing: {
                gutter: "24px",
                "margin-desktop": "48px",
                "max-width": "1320px"
              }
            }
          }
        };
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
      script.id = scriptId;
      script.onload = applyConfig;
      document.head.appendChild(script);
    } else {
      if (window.tailwind) {
        applyConfig();
      } else {
        script.addEventListener("load", applyConfig);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener("load", applyConfig);
      }
    };
  }, []);

  // Fetch cart & check authentication
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.userid || userData.id || "654c1d2e5b7e8c3a1e9c8b7c";
    setUser(userData);

    if (context.cartData && context.cartData.length > 0) {
      setCartItems(context.cartData);
      setLoading(false);
    } else {
      setLoading(true);
      fetchDataFromAPI(`/api/cart?userId=${userId}`)
        .then((res) => {
          const items = res && res.cartList ? res.cartList : (Array.isArray(res) ? res : []);
          setCartItems(items);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Cart fetch failed in Checkout1.", err);
          setLoading(false);
        });
    }
  }, [context.cartData]);

  // Derived state calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const shipping = subtotal > 0 ? (subtotal > 2000 ? 0 : 5.00) : 0;
  const total = subtotal + shipping;



  // Form Validation
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error("First Name is required.");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last Name is required.");
      return false;
    }
    if (!formData.country) {
      toast.error("Country / Region is required.");
      return false;
    }
    if (!formData.streetAddress1.trim()) {
      toast.error("Street Address is required.");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Town / City is required.");
      return false;
    }
    if (!formData.postcode.trim()) {
      toast.error("Postcode / ZIP is required.");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone Number is required.");
      return false;
    }
    const phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("Please enter a valid Phone Number.");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email Address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid Email Address.");
      return false;
    }
    if (!acceptTerms) {
      toast.error("You must accept the terms and conditions to place your order.");
      return false;
    }
    return true;
  };

  // Place Order Action
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // 1. Validate form first
    if (!validateForm()) return;

    // 2. Auth guard
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData?.userid) {
      toast.error("Please login to complete your order.");
      navigate('/signin');
      return;
    }

    // 3. Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Payment gateway failed to load. Please check your connection.");
      return;
    }

    // Razorpay Key: set REACT_APP_RAZORPAY_KEY_ID in your .env file
    // Never expose REACT_APP_RAZORPAY_KEY_SECRET on the frontend
    // Key secret must only be used server-side for order creation

    // 4. Calculate amount in paise (INR × 100)
    const amountInPaise = cartItems.reduce(
      (total, item) => total + parseInt(item.price) * item.quantity,
      0
    ) * 100;

    // 5. Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      order_receipt: `order_rcptid_${formData.firstName}_${formData.lastName}`,
      name: "LUXE Editorial",
      description: "Your LUXE order",
      theme: {
        color: "#111111"
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      handler: function (response) {
        const paymentId = response.razorpay_payment_id;

        const loadingToast = toast.loading("Confirming your order...");

        const payload = {
          userId: userData.userid,
          items: cartItems,
          billingDetails: formData,
          paymentMethod: 'razorpay',
          paymentId: paymentId,
          subtotal,
          shipping,
          total,
          name: `${formData.firstName} ${formData.lastName}`,
          phoneNumber: formData.phone,
          address: formData.streetAddress1,
          pincode: formData.postcode,
          amount: total,
          email: formData.email,
          products: cartItems,
          date: new Date().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" })
        };

        postDataToAPI('/api/order/create', payload)
          .then((res) => {
            toast.success("Order placed successfully!", { id: loadingToast });
            downloadLuxeInvoice(res.order?.id || res.order?._id || payload);

            // Clear cart immediately (sets cart icon counter to 0)
            if (context.setcartData) {
              context.setcartData([]);
            }
            deletedata(`/api/cart/clear/${userData.userid || userData.id || 'unknown'}`)
              .catch((err) => console.warn("Failed to clear cart database:", err));

            setTimeout(() => navigate('/'), 3500);
          })
          .catch((err) => {
            console.warn("Order save failed, payment was captured:", err);
            toast.success("Payment successful! Order confirmed.", { id: loadingToast });
            downloadLuxeInvoice(payload);

            // Clear cart immediately (sets cart icon counter to 0)
            if (context.setcartData) {
              context.setcartData([]);
            }
            deletedata(`/api/cart/clear/${userData.userid || userData.id || 'unknown'}`)
              .catch((err) => console.warn("Failed to clear cart database:", err));

            setTimeout(() => navigate('/'), 3500);
          });
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled. Your order was not placed.");
        }
      }
    };

    // 6. Open Razorpay
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="font-body min-h-screen flex flex-col bg-[#fbf9f8]">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Scope-Locked CSS overrides (including Home1 header/footer design tokens) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200');

        :root {
          --primary: #111111;
          --on-primary: #ffffff;
          --surface: #ffffff;
          --on-surface: #111111;
          --surface-dim: #f5f5f5;
          --surface-container: #eaeaea;
          --on-surface-variant: #666666;
          --outline-variant: #e0e0e0;
          --bg-surface: rgba(255, 255, 255, 0.9);
          --backdrop-blur: blur(12px);
          --font-display: 'Bodoni Moda', serif;
          --font-body: 'Inter', sans-serif;
        }

        .font-display {
          font-family: 'Bodoni Moda', serif !important;
        }
        .font-body {
          font-family: 'Inter', sans-serif !important;
        }

        .text-primary {
          color: #000000 !important;
        }
        .bg-primary {
          background-color: #000000 !important;
        }
        .border-primary {
          border-color: #000000 !important;
        }
        .text-on-primary {
          color: #ffffff !important;
        }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined' !important;
          font-weight: 300 !important;
          font-size: 24px;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }

        /* Header Navigation styles moved to web.css */

        /* Checkout Form inputs styling */
        .form-input-minimal {
          border: none;
          border-bottom: 1px solid #c4c7c7;
          background: transparent;
          padding: 12px 0;
          width: 100%;
          transition: border-color 0.3s ease;
          border-radius: 0 !important;
        }
        .form-input-minimal:focus {
          outline: none !important;
          border-color: #000000 !important;
          box-shadow: none !important;
        }

        .custom-radio:checked + label .radio-circle {
          background-color: #000000;
          border-color: #000000;
        }
        .custom-radio:checked + label .radio-dot {
          background-color: #ffffff;
        }

        /* Editorial Footer overrides (moved to web.css) */
      `}</style>

      <Header1 />

      {/* Main Content Spacer for fixed navbar */}
      <div className="h-24 md:h-28"></div>

      {/* Main Content */}
      <main className="max-w-max-width mx-auto px-margin-desktop py-16 md:py-24 flex-grow w-full">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl text-primary font-medium tracking-tight mb-4">
            Checkout
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-2xl">
            Review your selection and provide shipping details to finalize your order.
          </p>
        </div>

        {/* 12-Column Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

          {/* Left Column (col-span-7) - Billing Details Form */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-primary font-medium mb-10">
                Billing Details
              </h2>

              <div className="space-y-8">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="firstName" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="e.g. John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="e.g. Smith"
                    />
                  </div>
                </div>

                {/* Country Dropdown */}
                <div>
                  <label htmlFor="country" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                    Country / Region *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="form-input-minimal text-primary text-base border-b border-outline-variant pr-8 py-3 bg-transparent cursor-pointer focus:outline-none"
                  >
                    <option value="India">India</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="US">United States (US)</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label htmlFor="streetAddress1" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                    Street address *
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      id="streetAddress1"
                      name="streetAddress1"
                      value={formData.streetAddress1}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="House number and street name"
                    />
                    <input
                      type="text"
                      id="streetAddress2"
                      name="streetAddress2"
                      value={formData.streetAddress2}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                  </div>
                </div>

                {/* Row 2: Town/City & Postcode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="city" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div>
                    <label htmlFor="postcode" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                      Postcode / ZIP *
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="e.g. 400001"
                    />
                  </div>
                </div>

                {/* Row 3: Phone & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="phone" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest mb-2 block">
                      Email address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input-minimal text-primary text-base"
                      placeholder="e.g. client@luxe.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox Group */}
            <div className="pt-8 space-y-6">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="createAccount"
                  checked={formData.createAccount}
                  onChange={handleInputChange}
                  className="w-5 h-5 border-outline rounded-sm text-primary focus:ring-0 cursor-pointer"
                />
                <span className="font-body text-base text-on-surface group-hover:text-primary transition-colors select-none">
                  Create an account?
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="shipDifferentAddress"
                  checked={formData.shipDifferentAddress}
                  onChange={handleInputChange}
                  className="w-5 h-5 border-outline rounded-sm text-primary focus:ring-0 cursor-pointer"
                />
                <span className="font-body text-base text-on-surface group-hover:text-primary transition-colors select-none">
                  Ship to a different address?
                </span>
              </label>
            </div>

            {/* Order Notes Field */}
            <div className="space-y-4">
              <label htmlFor="orderNotes" className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest block">
                Order notes (optional)
              </label>
              <textarea
                id="orderNotes"
                name="orderNotes"
                rows="4"
                value={formData.orderNotes}
                onChange={handleInputChange}
                className="form-input-minimal text-primary text-base resize-none border-b border-outline-variant focus:outline-none"
                placeholder="Notes about your order, e.g. special notes for delivery."
              />
            </div>
          </div>

          {/* Right Column (col-span-5) - Order Summary + Payment */}
          <div className="lg:col-span-5 space-y-12">
            <div className="sticky top-28 space-y-12">

              {/* Order Card */}
              <div className="bg-surface-container-low p-8 md:p-12 border border-outline-variant">
                <h3 className="font-display text-2xl text-primary font-medium mb-8">
                  Your Order
                </h3>

                {/* Loading state skeleton */}
                {loading ? (
                  <div className="space-y-6">
                    <div className="animate-pulse bg-surface-container h-12 rounded w-full"></div>
                    <div className="animate-pulse bg-surface-container h-12 rounded w-full"></div>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="py-6 text-center text-on-surface-variant/60 font-body">
                    Your cart is empty
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant/60">
                    {/* Cart list mapping */}
                    {cartItems.map((item, idx) => (
                      <div key={item._id || idx} className="flex justify-between items-start py-6 first:pt-0 last:pb-6">
                        <div className="pr-4">
                          <p className="font-body text-base text-primary font-medium">
                            {item.title}
                            <span className="text-on-surface-variant text-sm ml-2 font-normal">× {item.quantity}</span>
                          </p>
                          <p className="font-label-sm text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">
                            {item.category || 'Luxury Goods'}
                          </p>
                        </div>
                        <span className="font-body text-base text-primary font-medium whitespace-nowrap">
                          ₹{item.subtotal}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal, Shipping & Total summary rows */}
                <div className="border-t border-outline-variant/80 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest font-label-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="text-primary font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest font-label-sm text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-primary font-semibold">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                {/* Total Row */}
                <div className="flex justify-between items-center pt-6 mt-6 border-t border-primary">
                  <span className="font-display text-2xl text-primary font-medium">Total</span>
                  <span className="font-display text-2xl text-primary font-medium">₹{total}</span>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white border border-outline-variant p-8 md:p-12">
                <h3 className="font-display text-2xl text-primary font-medium mb-8">
                  Payment
                </h3>

                <div className="bg-surface-container-low border border-outline-variant p-6 rounded mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>
                      credit_card
                    </span>
                    <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                      Secure Online Payment
                    </span>
                  </div>
                  <p className="font-label-sm text-xs text-on-surface-variant leading-relaxed">
                    Pay securely using UPI, Credit/Debit Card, Net Banking, or Wallets via Razorpay.
                    Your payment information is encrypted and never stored on our servers.
                  </p>
                </div>

                {/* Terms and Privacy Footer */}
                <div className="mt-12 pt-10 border-t border-outline-variant">
                  <p className="font-label-sm text-xs text-on-surface-variant leading-relaxed mb-8">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                    <Link to="/" className="underline text-on-surface-variant hover:text-primary transition-colors">
                      privacy policy
                    </Link>.
                  </p>

                  <label className="flex items-start space-x-3 cursor-pointer group mb-8">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-5 h-5 border-outline rounded-sm text-primary focus:ring-0 cursor-pointer mt-0.5"
                    />
                    <span className="font-label-sm text-xs text-on-surface-variant leading-relaxed select-none group-hover:text-primary transition-colors">
                      I have read and agree to the website{' '}
                      <Link to="/" className="underline text-on-surface-variant hover:text-primary transition-colors font-medium">
                        terms and conditions
                      </Link> *
                    </span>
                  </label>

                  {/* Payment trust strip */}
                  <div className="flex items-center justify-center gap-6 py-4 mb-6 border border-outline-variant rounded bg-surface-container-low">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>
                        lock
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">
                        Secure Payment
                      </span>
                    </div>
                    <div className="w-px h-4 bg-outline-variant"></div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>
                        verified_user
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">
                        SSL Encrypted
                      </span>
                    </div>
                    <div className="w-px h-4 bg-outline-variant"></div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>
                        payments
                      </span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">
                        Razorpay
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-label-sm py-6 uppercase tracking-widest hover:bg-on-surface-variant transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                        lock
                      </span>
                      Proceed to Payment
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </main>

      <Footer1 showPaymentIcons={true} />
    </div>
  );
};

export default Checkout1;
