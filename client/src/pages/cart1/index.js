import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mycontext } from "../../App";
import { fetchDataFromAPI, deletedata, Editdata } from "../../utils/api";

// Material UI Imports
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

// Icon Imports
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";

// Slide Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Cart1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);

  // States
  const [cartData, setcartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Scrolled Navbar logic
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState("Cart");

  // Location modal states
  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");

  // Profile dropdown state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Refs
  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);
  const promoInputRef = useRef(null);

  // Toast notification helper
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // User retrieval
  const getUserDetails = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        userId: user.userid || user.id || "654c1d2e5b7e8c3a1e9c8b7c"
      };
    } catch (e) {
      return { userId: "654c1d2e5b7e8c3a1e9c8b7c" };
    }
  };

  // Fallback Mocks
  const fallbackMocks = [
    {
      _id: "mock_cotton_shirt_1",
      productId: "prod_casual_cotton_1",
      title: "The Lifestyle Co Pure Cotton Casual Shirts",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE46b3AukOJyV7fpC89z6m5CdzuSIuUOVwlWnve-iEu2WvB6gB5WQGT31M30MSW0jVOradXZkARWS8vQ9H0jcd7gwtAN2oD8DSCGcItzbZIjMMcCoRksP-y4codPW05yxahUkj5rmnEZYr-KAwuFC1LoZkUWPeJKWLcgfOukWiIs2QPAel13qCmGGdt8WOGr-ajU26WSLm4yau81hM8gJ6kM4KH7ztOFHI-Tcj7Sdd_X8LiEdEVhI46vVNoptgQjORju_Vag7DnFE",
      price: 520,
      quantity: 1,
      subtotal: 520,
      rating: 5
    },
    {
      _id: "mock_watch_spot_2",
      productId: "prod_horology_luxe_2",
      title: "Men Dial & Leather Straps Analogue Watch NF8078_S W B",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
      price: 1800,
      quantity: 1,
      subtotal: 1800,
      rating: 4
    }
  ];

  // Fetch Cart Items
  useEffect(() => {
    const { userId } = getUserDetails();
    setLoading(true);
    fetchDataFromAPI(`/api/cart?userId=${userId}`)
      .then((res) => {
        if (res && res.cartList && res.cartList.length > 0) {
          setcartData(res.cartList);
          if (context.setcartData) context.setcartData(res.cartList);
        } else {
          setcartData(fallbackMocks);
          if (context.setcartData) context.setcartData(fallbackMocks);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to query cart list from backend:", err);
        setcartData(fallbackMocks);
        if (context.setcartData) context.setcartData(fallbackMocks);
        setLoading(false);
      });
  }, []);

  // Sticky Scroll listener
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

  // Dropdown close on outside click
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

  // Load locations
  useEffect(() => {
    setCountryList(context.countrylist || []);
  }, [context.countrylist]);

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
              "colors": {
                "surface-container-low": "#f5f3f3",
                "surface-container": "#efeded",
                "outline-variant": "#c4c7c7",
                "tertiary": "#000000",
                "on-tertiary-fixed": "#1f1b13",
                "secondary-fixed-dim": "#c7c6c5",
                "tertiary-fixed": "#eae2d4",
                "on-secondary-fixed": "#1a1c1b",
                "secondary": "#5e5e5d",
                "tertiary-container": "#1f1b13",
                "surface-dim": "#dbd9d9",
                "on-tertiary-container": "#898377",
                "error": "#ba1a1a",
                "on-primary-container": "#858383",
                "surface-container-lowest": "#ffffff",
                "primary-fixed": "#e5e2e1",
                "outline": "#747878",
                "surface-variant": "#e4e2e2",
                "on-surface": "#1b1c1c",
                "on-tertiary": "#ffffff",
                "error-container": "#ffdad6",
                "on-error": "#ffffff",
                "inverse-primary": "#c8c6c5",
                "surface-bright": "#fbf9f8",
                "on-secondary-fixed-variant": "#464746",
                "on-secondary-container": "#626361",
                "on-primary": "#ffffff",
                "secondary-fixed": "#e3e2e0",
                "primary-container": "#1c1b1b",
                "tertiary-fixed-dim": "#cdc6b8",
                "surface-tint": "#5f5e5e",
                "primary": "#000000",
                "background": "#fbf9f8",
                "on-primary-fixed-variant": "#474746",
                "surface": "#fbf9f8",
                "on-primary-fixed": "#1c1b1b",
                "on-error-container": "#93000a",
                "primary-fixed-dim": "#c8c6c5",
                "on-tertiary-fixed-variant": "#4b463c",
                "on-secondary": "#ffffff",
                "inverse-on-surface": "#f2f0f0",
                "secondary-container": "#e0dfde",
                "inverse-surface": "#303030",
                "surface-container-high": "#eae8e7",
                "on-surface-variant": "#444748",
                "surface-container-highest": "#e4e2e2",
                "on-background": "#1b1c1c"
              },
              "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
              },
              "spacing": {
                "unit": "8px",
                "margin-mobile": "20px",
                "margin-desktop": "64px",
                "gutter": "24px",
                "max-width": "1440px"
              },
              "fontFamily": {
                "headline-xl-mobile": ["Bodoni Moda"],
                "display-lg": ["Bodoni Moda"],
                "label-sm": ["Inter"],
                "headline-md": ["Bodoni Moda"],
                "headline-xl": ["Bodoni Moda"],
                "display-lg-mobile": ["Bodoni Moda"],
                "body-lg": ["Inter"],
                "body-md": ["Inter"]
              },
              "fontSize": {
                "headline-xl-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "500" }],
                "display-lg": ["80px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                "label-sm": ["12px", { "lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "600" }],
                "headline-md": ["32px", { "lineHeight": "1.3", "fontWeight": "500" }],
                "headline-xl": ["48px", { "lineHeight": "1.2", "fontWeight": "500" }],
                "display-lg-mobile": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }]
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

  // Stepper handlers
  const updateQuantity = (cartItemId, price, newQty) => {
    if (newQty < 1) {
      addToast("Minimum quantity is 1", "error");
      return;
    }

    const updated = cartData.map((item) =>
      item._id === cartItemId
        ? { ...item, quantity: newQty, subtotal: newQty * price }
        : item
    );
    setcartData(updated);
    if (context.setcartData) context.setcartData(updated);

    if (cartItemId.startsWith("mock_")) {
      console.log(`Mock item quantity updated locally to ${newQty}`);
      return;
    }

    Editdata(`/api/cart/${cartItemId}`, {
      quantity: newQty,
      subtotal: newQty * price
    })
      .then((res) => {
        console.log("Backend updated successfully:", res);
      })
      .catch((err) => {
        console.error("Backend update sync failed:", err);
      });
  };

  // Remove handler
  const removeItem = (id) => {
    const updated = cartData.filter((item) => item._id !== id);
    setcartData(updated);
    if (context.setcartData) context.setcartData(updated);
    addToast("Garment removed from cart", "success");

    if (id.startsWith("mock_")) {
      console.log("Mock item removed locally.");
      return;
    }

    deletedata(`/api/cart/${id}`)
      .then(() => {
        console.log("Backend item deleted successfully.");
      })
      .catch((err) => {
        console.error("Backend item delete failed:", err);
      });
  };

  // Promo handling
  const handleApplyPromo = () => {
    const code = promoInputRef.current?.value.trim().toUpperCase();
    if (cartData.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    if (code === "LUXE20") {
      setAppliedPromo(true);
      setPromoError(null);
      addToast("Promo Code LUXE20 applied!", "success");
    } else if (code === "") {
      setPromoError("Please enter a valid code.");
    } else {
      setPromoError("Invalid promo code. Try 'LUXE20'");
      addToast("Invalid promo code", "error");
    }
  };

  // Checkout handling
  const handleCheckout = () => {
    if (cartData.length === 0) {
      addToast("Add items to your cart before checking out", "error");
      return;
    }
    addToast("Entering Secure Checkout Portal...", "success");

    setTimeout(() => {
      const overlay = document.createElement("div");
      overlay.className = "fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-on-primary transition-opacity duration-500 opacity-0";
      overlay.innerHTML = `
        <div class="text-center space-y-6">
          <h2 class="font-display-lg text-4xl italic tracking-widest text-white">LUXE</h2>
          <p class="font-label-sm text-sm uppercase tracking-widest animate-pulse text-white">Establishing secure billing connection...</p>
        </div>
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.remove("opacity-0"), 10);

      setTimeout(() => {
        overlay.remove();
        navigate("/checkout1");
      }, 2000);
    }, 800);
  };

  // Profile click handlers
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

  // Location helpers
  const selectcountry = (index) => {
    setSelectedLocationTab(index);
    setSelectedCountry(context.countrylist[index].country);
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

  // Subcategories grouper
  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'fashion');
  const kidzKey = Object.keys(groupedSubCats).find(k => ['kidz', 'kids', 'kidszz'].includes(k.toLowerCase()));
  const watchesKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'watches');

  // Calculations
  const subtotal = cartData.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const totalItemsCount = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const promoDiscount = appliedPromo ? Math.round(subtotal * 0.20) : 0;
  const finalTotal = subtotal - promoDiscount;

  // Categories list
  const categoriesList = [
    { name: "Fruits & Vegetables", icon: "nutrition" },
    { name: "Meats & Seafood", icon: "set_meal" },
    { name: "Breakfast & Dairy", icon: "breakfast_dining" },
    { name: "Beverages", icon: "local_cafe" },
    { name: "Breads & Bakery", icon: "bakery_dining" },
    { name: "Frozen Foods", icon: "ac_unit" },
    { name: "Biscuits & Snacks", icon: "cookie" },
    { name: "Grocery & Staples", icon: "shopping_basket" }
  ];

  return (
    <>
      {/* Scope-locked Custom CSS Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

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

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .bezier-spring {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Force LUXE Obsidian/Black design and defeat Bootstrap blue overrides */
        .text-primary,
        .text-primary-fixed,
        .text-primary-fixed-dim,
        .text-headline-xl,
        .font-headline-xl,
        .font-headline-md,
        a,
        a:hover,
        .product-title,
        .price,
        .subtotal,
        .rating,
        span.material-symbols-outlined {
          color: #000000 !important;
        }

        /* Enforce elegant star color */
        span.material-symbols-outlined.text-primary {
          color: #000000 !important;
        }

        .text-on-surface-variant {
          color: #444748 !important;
        }

        /* Specific link resets for navbar so they are not pure black */
        .nav-links button,
        .nav-links a,
        .luxe-submenu-item {
          color: #444748 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .nav-links button:hover,
        .nav-links a:hover,
        .luxe-submenu-item:hover {
          color: #000000 !important;
        }
        .nav-link-btn.active {
          color: #000000 !important;
        }

        /* Specific link resets for editorial footer (black background, white text) */
        footer.editorial-footer,
        .editorial-footer,
        .editorial-footer a,
        .editorial-footer a:hover,
        .editorial-footer .footer-logo,
        .editorial-footer .footer-logo:hover,
        .editorial-footer .footer-link,
        .editorial-footer .footer-heading,
        .editorial-footer span {
          font-family: 'Inter', sans-serif !important;
        }
        footer.editorial-footer,
        .editorial-footer {
          background: #000000 !important;
          background-color: #000000 !important;
          color: #ffffff !important;
        }
        .editorial-footer a,
        .editorial-footer .footer-logo,
        .editorial-footer .footer-logo:hover {
          color: #ffffff !important;
          text-decoration: none !important;
        }
        .editorial-footer .footer-link {
          color: rgba(255, 255, 255, 0.6) !important;
          text-decoration: none !important;
        }
        .editorial-footer .footer-link:hover {
          color: #ffffff !important;
        }
        .editorial-footer span.material-symbols-outlined {
          color: #ffffff !important;
          opacity: 0.8 !important;
        }
        .editorial-footer span.material-symbols-outlined:hover {
          opacity: 1 !important;
        }
        .editorial-footer .footer-heading {
          color: #ffffff !important;
        }

        /* Dialog specific styling */
        .MuiButton-root {
          font-family: 'Inter', sans-serif !important;
        }

        /* Fixed luxury navbar styling copied from home1 */
        .luxe-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          background-color: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e0e0e0;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
        }

        .luxe-navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        /* Brand logo/wordmark LUXE */
        .brand-logo {
          font-family: 'Bodoni Moda', serif;
          font-weight: 800;
          font-size: 32px;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: #000000 !important;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
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
          font-family: 'Inter', sans-serif !important;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #444748 !important;
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
          color: #000000 !important;
        }
        .nav-link-btn.active {
          color: #000000 !important;
        }
        .nav-link-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #000000;
        }

        /* Category dropdown styling */
        .categories-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(16px);
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
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
          background-color: #f5f5f5;
        }
        .dropdown-row.selected {
          background-color: rgba(0, 0, 0, 0.05);
          font-weight: 700;
        }

        .dropdown-icon {
          color: #666666 !important;
        }
        .dropdown-label {
          font-family: 'Inter', sans-serif !important;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #000000 !important;
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
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          padding: 8px 16px;
          border-radius: 99px;
          cursor: pointer;
        }
        .location-text {
          font-family: 'Inter', sans-serif !important;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #000000 !important;
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
          color: #000000 !important;
        }
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #000000;
          color: #ffffff !important;
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
          background-color: #000000;
          color: #ffffff !important;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid #e0e0e0;
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
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
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
          font-family: 'Inter', sans-serif !important;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #000000 !important;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .luxe-submenu-item:hover {
          background-color: #f5f5f5;
          color: #000000 !important;
        }

        /* Stepper customization */
        .stepper-btn {
          border-color: #c4c7c7 !important;
        }
        .stepper-btn:hover {
          background-color: #efeded !important;
        }

        /* Custom checkout button */
        #checkout-btn {
          background-color: #000000 !important;
          background: #000000 !important;
          color: #ffffff !important;
        }
        #checkout-btn:hover {
          background-color: #222222 !important;
          background: #222222 !important;
        }
      `}</style>

      {/* Floating Toast Notification Wrapper */}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border text-sm font-label-sm uppercase tracking-wider animate-slide-up ${toast.type === "success"
              ? "bg-surface-container-lowest text-primary border-primary"
              : "bg-error-container text-on-error-container border-error"
              }`}
          >
            <span className="material-symbols-outlined">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* 1. STICKY LUXE NAVBAR (Identical to home1) */}
      <nav className={`luxe-navbar scrolled`}>
        <div className="luxe-navbar-container">
          {/* Brand Logo */}
          <Link className="brand-logo" to="/">
            LUXE
          </Link>

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
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`dropdown-row ${selectedCategory === cat.name ? "selected" : ""
                      }`}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setDropdownOpen(false);
                      navigate("/cat");
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
              border: "1px solid #e0e0e0",
              borderRadius: "20px",
              padding: "4px 16px",
              backgroundColor: "#f5f5f5",
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
                  color: "#000000",
                  width: "120px"
                }}
              />
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#666666", cursor: "pointer" }}>
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
              <span className="material-symbols-outlined text-[20px]" style={{ color: "#666666" }}>
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
                {totalItemsCount}
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
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileClose}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleProfileClose(); navigate("/my-account"); }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> My account
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { handleProfileClose(); navigate("/wishlist"); }}>
                    <ListItemIcon>
                      <FaRegHeart />
                    </ListItemIcon>
                    Wishlist
                  </MenuItem>
                  <MenuItem onClick={handleProfileClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
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

      {/* PADDING TO AVOID FIXED NAVBAR OVERLAPPING FIRST CONTENT */}
      <div style={{ height: "80px" }}></div>

      {/* 2. CART MAIN CONTENT */}
      <main className="max-w-max-width mx-auto px-margin-desktop py-20 min-h-[60vh]">
        <div className="mb-12 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mt-8">
          <h1 className="font-headline-xl text-headline-xl italic text-primary">Shopping Cart</h1>
          <p className="text-on-surface-variant font-label-sm uppercase tracking-widest text-[11px]">
            {loading ? "Syncing Boutique server..." : `There are ${totalItemsCount} products in your cart`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter items-start">
          {/* Main Table Area */}
          <div className="w-full lg:flex-1">
            {/* Desktop Headers */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1.2fr_1fr_0.5fr] gap-4 pb-4 border-b border-outline-variant font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              <div>Product</div>
              <div className="text-center">Unit Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Sub-total</div>
              <div className="text-right pr-4">Remove</div>
            </div>

            {/* Product list tracks */}
            <div className="space-y-2 min-h-[200px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">Syncing with Boutique server...</p>
                </div>
              ) : cartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                  <span className="material-symbols-outlined !text-[64px] text-outline-variant">shopping_bag</span>
                  <h3 className="font-headline-md text-2xl text-primary font-medium italic">Your luxury cart is empty</h3>
                  <p className="text-on-surface-variant font-body-md max-w-sm">Discover carefully tailored garments and horology pieces to begin curating your signature wardrobe.</p>
                  <Link className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-sm text-sm uppercase tracking-widest bezier-spring hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/10" to="/cat">
                    Continue Curating
                  </Link>
                </div>
              ) : (
                cartData.map((item) => {
                  const rating = Math.round(item.rating || 4.5);
                  return (
                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1.2fr_1fr_0.5fr] items-center gap-6 py-10 border-b border-surface-container-highest hover:bg-surface-container-low/30 transition-all duration-300 group">
                      {/* Product details */}
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="w-40 h-52 overflow-hidden rounded-lg bg-surface-container-high shadow-sm group-hover:scale-[1.02] bezier-spring flex-shrink-0">
                          <img className="w-full h-full object-cover" src={item.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=300"} alt={item.title} />
                        </div>
                        <div className="space-y-2 text-center sm:text-left">
                          <h3 className="font-body-lg text-body-lg font-medium text-primary tracking-tight leading-snug">{item.title}</h3>
                          <div className="flex justify-center sm:justify-start gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`material-symbols-outlined !text-[16px] ${i < rating ? "text-primary" : "text-outline-variant"}`}
                                style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="text-center font-body-md text-primary font-medium">Rs.{item.price}</div>

                      {/* Stepper buttons */}
                      <div className="flex justify-center">
                        <div className="flex items-center border border-outline-variant rounded-full px-2 py-1 bg-surface-container-lowest shadow-sm">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container rounded-full bezier-spring active:scale-90 select-none stepper-btn"
                            onClick={() => updateQuantity(item._id, item.price, item.quantity - 1)}
                          >
                            <span className="material-symbols-outlined !text-[18px]">remove</span>
                          </button>
                          <span className="w-10 text-center font-medium font-body-md select-none text-primary">{item.quantity}</span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container rounded-full bezier-spring active:scale-90 select-none stepper-btn"
                            onClick={() => updateQuantity(item._id, item.price, item.quantity + 1)}
                          >
                            <span className="material-symbols-outlined !text-[18px]">add</span>
                          </button>
                        </div>
                      </div>

                      {/* Subtotal value */}
                      <div className="text-center font-body-lg text-primary font-bold tracking-tight">Rs.{item.subtotal}</div>

                      {/* Remove action */}
                      <div className="flex justify-center md:justify-end md:pr-4">
                        <button
                          className="text-on-surface-variant hover:text-error bezier-spring p-2 rounded-full hover:bg-error-container/20"
                          onClick={() => removeItem(item._id)}
                          aria-label="Remove item"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter border-t border-outline-variant pt-20">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed transition-colors duration-300">
                  <span className="material-symbols-outlined text-primary">eco</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">Every Day Fresh</p>
                  <p className="text-[12px] text-on-surface-variant">Sourced sustainably daily</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed transition-colors duration-300">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">Free Delivery</p>
                  <p className="text-[12px] text-on-surface-variant">On orders over $70</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed transition-colors duration-300">
                  <span className="material-symbols-outlined text-primary">percent</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">Mega Discounts</p>
                  <p className="text-[12px] text-on-surface-variant">Exclusive daily offers</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-fixed transition-colors duration-300">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">Best Price</p>
                  <p className="text-[12px] text-on-surface-variant">Guaranteed on market</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <aside className="w-full lg:w-[380px] lg:sticky lg:top-28 space-y-gutter">
            <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
              <h2 className="font-headline-md text-[24px] mb-8 border-b border-outline-variant pb-4 text-primary">Order Summary</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-on-surface-variant font-body-md">
                  <span>Subtotal</span>
                  <span className="text-primary font-semibold">Rs.{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-body-md">
                  <span>Shipping</span>
                  <span className="text-primary-fixed-dim font-medium italic">
                    {subtotal === 0 ? "Empty" : "FREE"}
                  </span>
                </div>

                {appliedPromo && subtotal > 0 && (
                  <div className="flex justify-between items-center text-error font-body-md transition-all duration-300 animate-fade-in">
                    <span>Promo Discount (20%)</span>
                    <span className="font-medium">-Rs.{promoDiscount}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-surface-container-highest flex justify-between items-end">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest font-bold text-primary">Total</span>
                  <span className="text-[28px] font-headline-md text-primary">Rs.{finalTotal}</span>
                </div>
              </div>

              <button
                id="checkout-btn"
                className="w-full mt-10 bg-primary text-on-primary py-5 rounded-lg font-label-sm text-label-sm uppercase tracking-widest font-bold bezier-spring hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/10"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              <p className="text-center mt-6 text-[11px] text-on-surface-variant uppercase tracking-tighter">Secure checkout &amp; global shipping</p>
            </div>

            {/* Promo panel */}
            <div className="p-8 border border-outline-variant rounded-xl border-dashed bg-surface-container-lowest/50">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined text-primary">confirmation_number</span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest">Promo Code</span>
              </div>
              <div className="flex gap-2">
                <input
                  ref={promoInputRef}
                  className="flex-1 bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-2 text-sm transition-colors duration-300 text-primary"
                  placeholder="Enter code (Try LUXE20)"
                  type="text"
                />
                <button
                  className="font-label-sm text-label-sm uppercase text-primary hover:underline transition-all duration-200"
                  onClick={handleApplyPromo}
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="text-[12px] mt-2 font-medium tracking-tight text-emerald-600">
                  LUXE20 Promo applied successfully! 20% discount added.
                </p>
              )}
              {promoError && (
                <p className="text-[12px] mt-2 font-medium tracking-tight text-red-600">
                  {promoError}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* 3. LUXE EDITORIAL FOOTER */}
      <footer className="editorial-footer text-on-primary pt-32 pb-12" style={{ backgroundColor: "#000000", color: "#ffffff", padding: "120px 48px 48px" }}>
        <div className="container-fluid" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div className="row mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Logo and description */}
            <div className="col-lg-5 mb-5 mb-lg-0">
              <a className="footer-logo" style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: "800", letterSpacing: "-0.05em", textTransform: "uppercase", color: "#ffffff", textDecoration: "none", display: "block", marginBottom: "24px" }} href="#" onClick={(e) => e.preventDefault()}>LUXE</a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", maxWidth: "380px", opacity: 0.6, lineHeight: "1.7", marginBottom: "32px", color: "#ffffff" }}>
                Elevating the everyday through curated perspectives and architectural fashion.
              </p>
              <div className="d-flex gap-4">
                <a className="icon-hover-trigger" style={{ color: "#ffffff", opacity: 0.5, transition: "opacity 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#ffffff" }}>public</span>
                </a>
                <a className="icon-hover-trigger" style={{ color: "#ffffff", opacity: 0.5, transition: "opacity 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#ffffff" }}>photo_camera</span>
                </a>
                <a className="icon-hover-trigger" style={{ color: "#ffffff", opacity: 0.5, transition: "opacity 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>
                  <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#ffffff" }}>play_arrow</span>
                </a>
              </div>
            </div>
            {/* Inspiration Links */}
            <div className="col-6 col-lg-2 offset-lg-1 mb-4 mb-lg-0 d-flex flex-column gap-3">
              <h4 className="footer-heading" style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", marginBottom: "12px" }}>Inspiration</h4>
              <a className="footer-link" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>The Journal</a>
              <a className="footer-link" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>Archives</a>
              <a className="footer-link" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>Process</a>
            </div>
            {/* Assistance Links */}
            <div className="col-6 col-lg-2 mb-4 mb-lg-0 d-flex flex-column gap-3">
              <h4 className="footer-heading" style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", marginBottom: "12px" }}>Assistance</h4>
              <a className="footer-link" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>Shipping</a>
              <a className="footer-link" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>Contact</a>
              <a className="footer-link" style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", textDecoration: "none", transition: "color 0.3s" }} href="#" onClick={(e) => e.preventDefault()}>Returns</a>
            </div>
            {/* Newsletter */}
            <div className="col-lg-2">
              <h4 className="footer-heading" style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", marginBottom: "20px" }}>Newsletter</h4>
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
                  onClick={() => addToast("Joined Luxe Editorial list successfully!", "success")}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          {/* Bottom links */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <span className="font-label-sm" style={{ opacity: 0.4, fontSize: "11px", letterSpacing: "0.1em", color: "#ffffff" }}>© 2024 LUXE EDITORIAL. ALL RIGHTS RESERVED.</span>
            <div className="d-flex gap-4 align-items-center" style={{ opacity: 0.4 }}>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", color: "#ffffff" }}>PRIVACY</span>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", color: "#ffffff" }}>TERMS</span>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", color: "#ffffff" }}>COOKIES</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DELIVERY LOCATION SELECTION DIALOG */}
      <Dialog
        open={isOpenLocationModal}
        disableScrollLock={true}
        className="location"
        onClose={() => setIsOpenLocationModal(false)}
        TransitionComponent={Transition}
      >
        <div style={{ padding: "24px", position: "relative" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: "600", marginBottom: "8px", color: "#000000" }}>
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
              color: "#000000"
            }}
          >
            <IoMdClose size={24} />
          </Button>

          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--outline-variant)", borderRadius: "4px", padding: "4px 12px", marginBottom: "20px" }}>
            <input
              onChange={filterlist}
              placeholder="Search your area..."
              type="text"
              style={{ border: "none", outline: "none", width: "100%", fontFamily: "var(--font-body)", fontSize: "13px", padding: "8px 0", color: "#000000" }}
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
                    color: selectedLocationTab === index ? "#000000" : "#444748",
                    fontWeight: selectedLocationTab === index ? "600" : "400",
                    backgroundColor: selectedLocationTab === index ? "#eaeaea" : "transparent",
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
    </>
  );
};

export default Cart1;
