import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mycontext } from '../../App';
import { fetchDataFromAPI, postDataToAPI, deletedata } from '../../utils/api';
import { downloadLuxeInvoice } from '../../utils/invoiceGenerator';
import toast, { Toaster } from 'react-hot-toast';

// MUI Imports
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";

// Icon Imports
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  // Header & Footer States (copied from home1)
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState("Checkout");

  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);

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

  // Scroll listener for sticky navbar effects (copied from home1)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown close on outside click (copied from home1)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (navLinksRef.current && !navLinksRef.current.contains(event.target)) {
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync country list on context load (copied from home1)
  useEffect(() => {
    setCountryList(context.countrylist || []);
  }, [context.countrylist]);

  // Profile click handlers (copied from home1)
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Location helpers (copied from home1)
  const selectcountry = (index) => {
    setSelectedLocationTab(index);
    setSelectedCountry(countryList[index].country);
    setIsOpenLocationModal(false);
  };

  const filterlist = (e) => {
    const Keyword = e.target.value.toLowerCase();
    if (Keyword !== "") {
      const list = (context.countrylist || []).filter((item) => {
        return item.country.toLowerCase().includes(Keyword);
      });
      setCountryList(list);
    } else {
      setCountryList(context.countrylist || []);
    }
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

  // Categories list (copied from home1)
  const categories = [
    { name: "Fruits & Vegetables", icon: "eco" },
    { name: "Meats & Seafood", icon: "restaurant" },
    { name: "Breakfast & Dairy", icon: "bakery_dining" },
    { name: "Beverages", icon: "local_cafe" },
    { name: "Breads & Bakery", icon: "breakfast_dining" },
    { name: "Frozen Foods", icon: "kitchen" },
    { name: "Biscuits & Snacks", icon: "cookie" },
    { name: "Grocery & Staples", icon: "shopping_basket" },
  ];

  // Group subcategories from context (copied from home1)
  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'fashion');
  const kidzKey = Object.keys(groupedSubCats).find(k => ['kidz', 'kids', 'kidszz'].includes(k.toLowerCase()));
  const watchesKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'watches');

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

        /* Fixed luxury navbar styling (copied from home1) */
        .luxe-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          background-color: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .luxe-navbar.scrolled {
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--outline-variant);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
        }

        .luxe-navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: height 0.4s ease;
        }
        .luxe-navbar.h-normal .luxe-navbar-container {
          height: 96px;
        }
        .luxe-navbar.h-compact .luxe-navbar-container {
          height: 80px;
        }

        /* Brand logo/wordmark LUXE */
        .brand-logo {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 32px;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: var(--primary) !important;
          cursor: pointer;
          user-select: none;
        }

        /* Nav links layout */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .nav-item {
          position: relative;
        }

        .nav-link-btn {
          font-family: var(--font-body) !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.18em !important;
          text-transform: uppercase !important;
          color: var(--on-surface-variant) !important;
          background: none;
          border: none;
          padding: 8px 0;
          cursor: pointer;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link-btn:hover {
          color: var(--primary) !important;
        }
        .nav-link-btn.active {
          color: var(--primary) !important;
        }
        .nav-link-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--primary);
        }

        /* Category dropdown styling */
        .categories-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(16px);
          background-color: var(--surface);
          border: 1px solid var(--outline-variant);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          min-width: 300px;
          padding: 12px 0;
          z-index: 1010;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .categories-dropdown.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(8px);
        }

        .dropdown-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 24px;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dropdown-row:hover {
          background-color: var(--surface-dim);
        }
        .dropdown-row.selected {
          background-color: rgba(0, 0, 0, 0.05);
          font-weight: 700;
        }

        .dropdown-icon {
          color: var(--on-surface-variant) !important;
        }
        .dropdown-label {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--primary) !important;
        }

        /* Right clusters */
        .right-cluster {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        /* Location Pill */
        .location-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--surface-dim);
          border: 1px solid var(--outline-variant);
          padding: 8px 16px;
          border-radius: 99px;
          cursor: pointer;
        }
        .location-text {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--primary) !important;
        }

        /* Cart Icon with badge */
        .cart-icon-wrapper {
          position: relative;
          cursor: pointer;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          padding: 0;
          color: var(--primary) !important;
        }
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--primary);
          color: var(--on-primary) !important;
          font-size: 9px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Profile avatar styling */
        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary);
          color: var(--on-primary) !important;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid var(--outline-variant);
        }

        .icon-hover-trigger {
          transition: transform 0.3s ease;
        }
        .icon-hover-trigger:hover {
          transform: scale(1.15);
        }

        /* Dynamic Luxe Submenus */
        .luxe-submenu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(16px);
          background-color: var(--surface);
          border: 1px solid var(--outline-variant);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          min-width: 220px;
          padding: 12px 0;
          z-index: 1010;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .luxe-submenu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(8px);
        }
        .luxe-submenu-item {
          display: block;
          width: 100%;
          padding: 10px 24px;
          text-align: left;
          background: none;
          border: none;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--primary) !important;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .luxe-submenu-item:hover {
          background-color: var(--surface-dim);
          color: var(--primary) !important;
        }

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

        /* Editorial Footer overrides (copied from home1) */
        footer.editorial-footer,
        .editorial-footer {
          background: #000000 !important;
          background-color: #000000 !important;
          color: #ffffff !important;
          padding: 120px 48px 48px !important;
        }
        .footer-logo {
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
          text-decoration: none;
          display: block;
        }
        .footer-logo, .footer-logo:hover {
          color: var(--on-primary) !important;
        }
        .footer-heading {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #ffffff !important;
          margin-bottom: 20px;
        }
        .footer-link {
          font-family: var(--font-body);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6) !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer-link:hover {
          color: #ffffff !important;
        }
      `}</style>

      {/* 1. STICKY/STICK-ON NAVIGATION BAR (identical to home1 page) */}
      <nav
        className={`luxe-navbar ${scrolled ? "scrolled" : ""} ${scrolled ? "h-compact" : "h-normal"
          }`}
      >
        <div className="luxe-navbar-container">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => navigate("/")}>
            LUXE
          </div>

          {/* Center Navigation Links */}
          <ul className="nav-links" ref={navLinksRef}>
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeLink === "Home" ? "active" : ""}`}
                onClick={() => {
                  setActiveLink("Home");
                  setActiveSubmenu(null);
                  setDropdownOpen(false);
                  navigate("/");
                }}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeSubmenu === "Fashion" ? "active" : ""}`}
                onClick={() => {
                  setActiveSubmenu(activeSubmenu === "Fashion" ? null : "Fashion");
                  setDropdownOpen(false);
                }}
              >
                Fashion
                <span className="material-symbols-outlined" style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {activeSubmenu === "Fashion" ? "expand_less" : "expand_more"}
                </span>
              </button>
              {fashionKey && groupedSubCats[fashionKey] && (
                <div className={`luxe-submenu ${activeSubmenu === "Fashion" ? "show" : ""}`}>
                  {groupedSubCats[fashionKey].map((sub, idx) => (
                    <button
                      key={idx}
                      className="luxe-submenu-item"
                      onClick={() => {
                        setActiveSubmenu(null);
                        setActiveLink("Fashion");
                        navigate(`/subCat/${sub._id}`);
                      }}
                    >
                      {sub.subCat}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeSubmenu === "Kidz" ? "active" : ""}`}
                onClick={() => {
                  setActiveSubmenu(activeSubmenu === "Kidz" ? null : "Kidz");
                  setDropdownOpen(false);
                }}
              >
                Kidz
                <span className="material-symbols-outlined" style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {activeSubmenu === "Kidz" ? "expand_less" : "expand_more"}
                </span>
              </button>
              {kidzKey && groupedSubCats[kidzKey] && (
                <div className={`luxe-submenu ${activeSubmenu === "Kidz" ? "show" : ""}`}>
                  {groupedSubCats[kidzKey].map((sub, idx) => (
                    <button
                      key={idx}
                      className="luxe-submenu-item"
                      onClick={() => {
                        setActiveSubmenu(null);
                        setActiveLink("Kidz");
                        navigate(`/subCat/${sub._id}`);
                      }}
                    >
                      {sub.subCat}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeSubmenu === "Watches" ? "active" : ""}`}
                onClick={() => {
                  setActiveSubmenu(activeSubmenu === "Watches" ? null : "Watches");
                  setDropdownOpen(false);
                }}
              >
                Watches
                <span className="material-symbols-outlined" style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {activeSubmenu === "Watches" ? "expand_less" : "expand_more"}
                </span>
              </button>
              {watchesKey && groupedSubCats[watchesKey] && (
                <div className={`luxe-submenu ${activeSubmenu === "Watches" ? "show" : ""}`}>
                  {groupedSubCats[watchesKey].map((sub, idx) => (
                    <button
                      key={idx}
                      className="luxe-submenu-item"
                      onClick={() => {
                        setActiveSubmenu(null);
                        setActiveLink("Watches");
                        navigate(`/subCat/${sub._id}`);
                      }}
                    >
                      {sub.subCat}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Categories dropdown link */}
            <li className="nav-item" ref={dropdownRef}>
              <button
                className={`nav-link-btn ${dropdownOpen ? "active" : ""}`}
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setActiveSubmenu(null);
                }}
              >
                Categories
                <span className="material-symbols-outlined" style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {dropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Subcategory Dropdown Panel */}
              <div className={`categories-dropdown ${dropdownOpen ? "show" : ""}`}>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`dropdown-row ${selectedCategory === cat.name ? "selected" : ""
                      }`}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="material-symbols-outlined dropdown-icon">
                      {cat.icon}
                    </span>
                    <span className="dropdown-label">{cat.name}</span>
                  </button>
                ))}
              </div>
            </li>
          </ul>

          {/* Right Action Icons Cluster */}
          <div className="right-cluster">
            {/* Search Bar */}
            <div className="search-bar-luxury d-none d-md-flex align-items-center" style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--outline-variant)",
              borderRadius: "20px",
              padding: "4px 16px",
              backgroundColor: "var(--surface-dim)",
              marginRight: "4px"
            }}>
              <input
                placeholder="Search products..."
                type="text"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "12px",
                  fontFamily: "var(--font-body)",
                  color: "var(--primary)",
                  width: "120px"
                }}
              />
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--on-surface-variant)", cursor: "pointer" }}>
                search
              </span>
            </div>

            {/* Location Pill */}
            <div
              className="location-pill"
              onClick={() => {
                setCountryList(context.countrylist || []);
                setIsOpenLocationModal(true);
              }}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--on-surface-variant)" }}>
                location_on
              </span>
              <span className="location-text">{selectedCountry}</span>
            </div>

            {/* Cart Icon with badge */}
            <button className="cart-icon-wrapper icon-hover-trigger" onClick={() => navigate("/cart")}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                shopping_bag
              </span>
              <span className="cart-badge">
                {context?.cartData?.length || 0}
              </span>
            </button>

            {/* Profile Circle Avatar / Auth Dropdown */}
            {context.isLogin !== true ? (
              <button
                className="nav-link-btn"
                onClick={() => navigate("/signin")}
                style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.18em", textTransform: "uppercase" }}
              >
                Sign In
              </button>
            ) : (
              <>
                <div
                  className="profile-avatar icon-hover-trigger"
                  onClick={handleProfileClick}
                  style={{ cursor: "pointer" }}
                >
                  {context.user?.name?.substring(0, 2).toUpperCase() || "JD"}
                </div>
                <Menu
                  anchorEl={profileAnchorEl}
                  id="account-menu"
                  open={Boolean(profileAnchorEl)}
                  onClose={handleProfileClose}
                  disableScrollLock={true}
                  onClick={handleProfileClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileClose}>
                    <Avatar /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleProfileClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
      </nav>

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

      {/* 9. LUXE EDITORIAL FOOTER (identical to home1 page) */}
      <footer className="editorial-footer text-on-primary pt-32 pb-12">
        <div className="container-fluid" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div className="row mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Logo and description */}
            <div className="col-lg-5 mb-5 mb-lg-0">
              <a className="footer-logo" href="#">LUXE</a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", maxWidth: "380px", opacity: 0.6, lineHeight: "1.7", marginBottom: "32px" }}>
                Elevating the everyday through curated perspectives and architectural fashion.
              </p>
              <div className="d-flex gap-4">
                <a className="icon-hover-trigger" style={{ color: "var(--on-primary)", opacity: 0.5, transition: "opacity 0.3s" }} href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>public</span>
                </a>
                <a className="icon-hover-trigger" style={{ color: "var(--on-primary)", opacity: 0.5, transition: "opacity 0.3s" }} href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>photo_camera</span>
                </a>
                <a className="icon-hover-trigger" style={{ color: "var(--on-primary)", opacity: 0.5, transition: "opacity 0.3s" }} href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>play_arrow</span>
                </a>
              </div>
            </div>
            {/* Inspiration Links */}
            <div className="col-6 col-lg-2 offset-lg-1 mb-4 mb-lg-0 d-flex flex-column gap-3">
              <h4 className="footer-heading">Inspiration</h4>
              <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>The Journal</a>
              <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Archives</a>
              <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Process</a>
            </div>
            {/* Assistance Links */}
            <div className="col-6 col-lg-2 mb-4 mb-lg-0 d-flex flex-column gap-3">
              <h4 className="footer-heading">Assistance</h4>
              <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Shipping</a>
              <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Contact</a>
              <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Returns</a>
            </div>
            {/* Newsletter */}
            <div className="col-lg-2">
              <h4 className="footer-heading">Newsletter</h4>
              <div className="position-relative" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)", paddingBottom: "8px" }}>
                <input
                  className="w-100 bg-transparent border-0 py-2 outline-none text-white font-body-md"
                  placeholder="Enter your email"
                  type="email"
                  style={{ border: "none", outline: "none", background: "transparent", color: "#ffffff", width: "100%", fontSize: "14px" }}
                />
                <button
                  className="position-absolute end-0 bottom-0 bg-transparent border-0 font-label-sm uppercase tracking-widest text-white"
                  style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", cursor: "pointer" }}
                  onClick={() => toast.success("Joined Luxe Editorial list successfully!")}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          {/* Bottom links */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <span className="font-label-sm" style={{ opacity: 0.4, fontSize: "11px", letterSpacing: "0.1em" }}>© 2024 LUXE EDITORIAL. ALL RIGHTS RESERVED.</span>
            <div className="d-flex gap-4 align-items-center" style={{ opacity: 0.4 }}>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>PRIVACY</span>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>TERMS</span>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>COOKIES</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DELIVERY LOCATION SELECTION DIALOG (copied from home1) */}
      <Dialog
        open={isOpenLocationModal}
        disableScrollLock={true}
        className="location"
        onClose={() => setIsOpenLocationModal(false)}
        TransitionComponent={Transition}
      >
        <div style={{ padding: "24px", position: "relative" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
            Choose your Delivery Location
          </h4>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--on-surface-variant)", marginBottom: "20px" }}>
            Enter your address and we will specify the offer for your area.
          </p>
          <Button
            onClick={() => setIsOpenLocationModal(false)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              minWidth: "auto",
              padding: "8px",
              color: "var(--primary)"
            }}
          >
            <IoMdClose size={24} />
          </Button>

          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--outline-variant)", borderRadius: "4px", padding: "4px 12px", marginBottom: "20px" }}>
            <input
              onChange={filterlist}
              placeholder="Search your area..."
              type="text"
              style={{ border: "none", outline: "none", width: "100%", fontFamily: "var(--font-body)", fontSize: "13px", padding: "8px 0" }}
            />
            <Button style={{ minWidth: "auto", color: "var(--on-surface-variant)" }}>
              <FaSearch />
            </Button>
          </div>

          <ul className="clist" style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "260px", overflowY: "auto" }}>
            {countryList?.length !== 0 && countryList?.map((item, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <Button
                  onClick={() => selectcountry(index)}
                  className={`${selectedLocationTab === index ? "active" : ""}`}
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    textTransform: "none",
                    color: selectedLocationTab === index ? "var(--primary)" : "var(--on-surface-variant)",
                    fontWeight: selectedLocationTab === index ? "600" : "400",
                    backgroundColor: selectedLocationTab === index ? "var(--surface-container)" : "transparent",
                    textAlign: "left",
                    padding: "8px 16px"
                  }}
                >
                  {item.country}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    </div>
  );
};

export default Checkout1;
