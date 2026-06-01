import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";

// Icon Imports
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";

// Context & API
import { Mycontext } from "../../App";
import { fetchDataFromAPI } from "../../utils/api";

// Toast Import
import toast, { Toaster } from "react-hot-toast";

// Editorial Images Import
import watchesEditorialImg from "../../assets/images/watches_editorial.png";
import fashionEditorialImg from "../../assets/images/fashion_editorial.png";
import kidsEditorialImg from "../../assets/images/kids_editorial.png";

// Price Range slider - fallback to custom sliders if package styles are missing
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

// Slide Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Listing1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // States
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState("Default");
  const [priceRange, setPriceRange] = useState([100, 6000]);
  const [activeMaterial, setActiveMaterial] = useState("All Materials");
  const [activeMovement, setActiveMovement] = useState("All Movements");
  const [activeColor, setActiveColor] = useState("All Colors");

  // Dropdown Panels Toggle State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLink, setActiveLink] = useState("Watches");

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToRender, setItemsToRender] = useState(8);
  const itemsPerPage = 8;

  // Header & Navbar scroll logic
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Watches");

  // Location Modal states
  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("London");

  // Profile dropdown state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Refs
  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);

  // Sound effects
  const playBeep = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 800;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.3
    );
  };

  const playSuccessSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      900,
      audioCtx.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.3
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  };

  // Dynamically load Tailwind CDN & Scoped theme configurations
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

  // Dynamically load Google Fonts & CSS tweaks
  useEffect(() => {
    const fontLink1 = document.createElement("link");
    fontLink1.rel = "preconnect";
    fontLink1.href = "https://fonts.googleapis.com";
    document.head.appendChild(fontLink1);

    const fontLink2 = document.createElement("link");
    fontLink2.rel = "preconnect";
    fontLink2.href = "https://fonts.gstatic.com";
    fontLink2.crossOrigin = "anonymous";
    document.head.appendChild(fontLink2);

    const fontLink3 = document.createElement("link");
    fontLink3.rel = "stylesheet";
    fontLink3.href =
      "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap";
    document.head.appendChild(fontLink3);

    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .font-display {
        font-family: 'Bodoni Moda', serif !important;
      }
      .font-body {
        font-family: 'Inter', sans-serif !important;
      }
      .font-headline-xl {
        font-family: 'Bodoni Moda', serif !important;
        font-size: 36px !important;
        font-weight: 700 !important;
        letter-spacing: -0.02em !important;
      }
      .font-headline-md {
        font-family: 'Bodoni Moda', serif !important;
        font-size: 24px !important;
        font-weight: 700 !important;
        letter-spacing: -0.02em !important;
      }
      .font-label-sm {
        font-family: 'Inter', sans-serif !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.18em !important;
        text-transform: uppercase !important;
      }
      .font-body-md {
        font-family: 'Inter', sans-serif !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        line-height: 1.6 !important;
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        font-size: 20px;
        vertical-align: middle;
      }
      .transition-spring {
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .product-card:hover .quick-add-overlay {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      .product-card:hover .wishlist-hover-btn {
        opacity: 1 !important;
      }
      .filter-sticky-shadow {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
      }
      .range-slider {
        height: 6px !important;
        background: #eaeaea !important;
      }
      .range-slider .range-slider__range {
        background: #111111 !important;
      }
      .range-slider .range-slider__thumb {
        width: 16px !important;
        height: 16px !important;
        background: #111111 !important;
      }

      /* Force all blue text to black */
      .listingPage .text-primary,
      .listingPage a,
      .listingPage a:hover,
      .listingPage button,
      .listingPage h1,
      .listingPage h2,
      .listingPage h3,
      .listingPage h4,
      .listingPage h5,
      .listingPage p,
      .listingPage li,
      .listingPage label,
      .listingPage span:not(.text-danger):not(.text-error):not(.MuiRating-icon):not(.badge) {
        color: #000000 !important;
      }

      /* Core Layout Styles for Luxe Listing */
      .listingPage {
        background-color: #ffffff !important;
        color: #000000 !important;
        min-height: 100vh !important;
        font-family: 'Inter', sans-serif !important;
      }
      .listing-container {
        max-width: 1440px !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 48px !important;
      }
      .category-header {
        padding-top: 120px !important;
        padding-bottom: 24px !important;
      }

      /* Navbar Layout */
      .luxe-navbar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
        background-color: rgba(255, 255, 255, 0.92) !important;
        backdrop-filter: blur(12px) !important;
        border-bottom: 1px solid #e0e0e0 !important;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02) !important;
        height: 80px !important;
        display: flex !important;
        align-items: center !important;
      }
      .luxe-navbar-container {
        max-width: 1440px !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        height: 100% !important;
      }
      .brand-logo {
        font-family: 'Bodoni Moda', serif !important;
        font-weight: 800 !important;
        font-size: 32px !important;
        letter-spacing: -0.05em !important;
        text-transform: uppercase !important;
        color: #000000 !important;
        cursor: pointer !important;
        user-select: none !important;
        text-decoration: none !important;
        display: inline-block !important;
      }
      .nav-links {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 40px !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }
      .nav-item {
        position: relative !important;
      }
      .nav-link-btn {
        font-family: 'Inter', sans-serif !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.18em !important;
        text-transform: uppercase !important;
        color: #444748 !important;
        background: none !important;
        border: none !important;
        padding: 8px 0 !important;
        cursor: pointer !important;
        transition: color 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .nav-link-btn:hover, .nav-link-btn.active {
        color: #000000 !important;
      }
      .nav-link-btn.active::after {
        content: '' !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 1px !important;
        background-color: #000000 !important;
      }
      .right-cluster {
        display: flex !important;
        align-items: center !important;
        gap: 24px !important;
      }
      .location-pill {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        background-color: #f5f5f5 !important;
        border: 1px solid #e0e0e0 !important;
        padding: 8px 16px !important;
        border-radius: 99px !important;
        cursor: pointer !important;
      }
      .location-text {
        font-family: 'Inter', sans-serif !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.05em !important;
        color: #000000 !important;
      }
      .cart-icon-wrapper {
        position: relative !important;
        cursor: pointer !important;
        background: none !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 !important;
        color: #000000 !important;
      }
      .cart-badge {
        position: absolute !important;
        top: -4px !important;
        right: -4px !important;
        background-color: #000000 !important;
        color: #ffffff !important;
        font-size: 9px !important;
        font-weight: 700 !important;
        width: 16px !important;
        height: 16px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .profile-avatar {
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        background-color: #000000 !important;
        color: #ffffff !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        border: 1px solid #e0e0e0 !important;
      }
      .categories-dropdown {
        position: absolute !important;
        top: 100% !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(16px) !important;
        background-color: #ffffff !important;
        border: 1px solid #e0e0e0 !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
        border-radius: 4px !important;
        min-width: 300px !important;
        padding: 12px 0 !important;
        z-index: 1010 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1) !important;
      }
      .categories-dropdown.show {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateX(-50%) translateY(8px) !important;
      }
      .dropdown-row {
        display: flex !important;
        align-items: center !important;
        gap: 16px !important;
        padding: 14px 24px !important;
        width: 100% !important;
        background: none !important;
        border: none !important;
        text-align: left !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      .dropdown-row:hover {
        background-color: #f5f5f5 !important;
      }
      .dropdown-row.selected {
        background-color: rgba(0, 0, 0, 0.05) !important;
        font-weight: 700 !important;
      }
      .luxe-submenu {
        position: absolute !important;
        top: 100% !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(16px) !important;
        background-color: #ffffff !important;
        border: 1px solid #e0e0e0 !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
        border-radius: 4px !important;
        min-width: 220px !important;
        padding: 12px 0 !important;
        z-index: 1010 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1) !important;
      }
      .luxe-submenu.show {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateX(-50%) translateY(8px) !important;
      }
      .luxe-submenu-item {
        display: block !important;
        width: 100% !important;
        padding: 10px 24px !important;
        text-align: left !important;
        background: none !important;
        border: none !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        letter-spacing: 0.15em !important;
        text-transform: uppercase !important;
        color: #000000 !important;
        text-decoration: none !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
      }
      .luxe-submenu-item:hover {
        background-color: #f5f5f5 !important;
      }

      /* Filter Bar Layout */
      .filter-bar-sticky {
        position: sticky !important;
        top: 80px !important;
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(8px) !important;
        z-index: 40 !important;
        border-bottom: 1px solid #e0e0e0 !important;
        padding: 16px 0 !important;
        margin-bottom: 48px !important;
      }
      .filter-container {
        max-width: 1440px !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }
      .filter-left {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 32px !important;
        flex-wrap: wrap !important;
      }
      .filter-right {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        color: #666666 !important;
      }

      /* Product Grid Layout */
      .product-grid {
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 24px !important;
      }
      @media (max-width: 1024px) {
        .product-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
      }
      @media (max-width: 768px) {
        .product-grid {
          grid-template-columns: repeat(1, 1fr) !important;
        }
      }
      .product-card {
        position: relative !important;
        cursor: pointer !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .product-card img {
        width: 100% !important;
        aspect-ratio: 1/1 !important;
        object-fit: cover !important;
        border-radius: 8px !important;
      }
      .product-card .quick-add-overlay {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        padding: 16px !important;
        opacity: 0 !important;
        transform: translateY(16px) !important;
        transition: all 0.3s ease !important;
      }
      .product-card:hover .quick-add-overlay {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      .product-card .quick-add-overlay button {
        width: 100% !important;
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 1px solid #000000 !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.15em !important;
        text-transform: uppercase !important;
        padding: 12px 0 !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
      }
      .product-card .quick-add-overlay button:hover {
        background-color: #ffffff !important;
        color: #000000 !important;
        border-color: #000000 !important;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      fontLink1.remove();
      fontLink2.remove();
      fontLink3.remove();
      styleTag.remove();
    };
  }, []);

  // Fetch products by subcategory parameter
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setItemsToRender(8);

    fetchDataFromAPI(`/api/products/subCat/${id}`)
      .then((res) => {
        setRawProducts(res.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products for subcategory:", err);
        setError("Could not retrieve collection. Please try again.");
        setLoading(false);
      });
  }, [id]);

  // Dynamically set activeLink and selectedCategory based on current subcategory's parent category
  useEffect(() => {
    if (!id || !context.subCatData || context.subCatData.length === 0) return;
    const currentSubCat = context.subCatData.find(sub => sub._id === id);
    const parentCatName = currentSubCat?.category?.name;
    if (parentCatName) {
      const lower = parentCatName.toLowerCase();
      let matchedName = "Watches"; // Default fallback
      if (['kidz', 'kids', 'kidszz'].includes(lower)) {
        matchedName = "Kidz";
      } else if (lower === 'fashion') {
        matchedName = "Fashion";
      } else if (lower === 'watches') {
        matchedName = "Watches";
      } else {
        matchedName = parentCatName.charAt(0).toUpperCase() + parentCatName.slice(1).toLowerCase();
      }
      setActiveLink(matchedName);
      setSelectedCategory(matchedName);
    }
  }, [id, context.subCatData]);

  // Scroll position listener for sticky filter bar and styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync locations
  useEffect(() => {
    setCountryList(context.countrylist || []);
  }, [context.countrylist]);

  // Close menus on click outside
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

  // API query: Filter products by Price Range
  const handlePriceApply = () => {
    setLoading(true);
    setActiveDropdown(null);
    fetchDataFromAPI(
      `/api/products/products?minprice=${priceRange[0]}&maxprice=${priceRange[1]}&subcategory=${id}`
    )
      .then((res) => {
        setRawProducts(res.products || []);
        setLoading(false);
        toast.success(`Price filter applied: ₹${priceRange[0]} - ₹${priceRange[1]}`, {
          style: {
            border: "1px solid #111111",
            padding: "16px",
            color: "#111111",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: "600"
          }
        });
      })
      .catch((err) => {
        console.error("Failed price range filtering:", err);
        setLoading(false);
      });
  };

  // Reset/Clear all filters
  const handleClearFilters = () => {
    setSortBy("Default");
    setPriceRange([100, 6000]);
    setActiveMaterial("All Materials");
    setActiveMovement("All Movements");
    setActiveColor("All Colors");
    setActiveDropdown(null);
    setCurrentPage(1);
    setItemsToRender(8);

    setLoading(true);
    fetchDataFromAPI(`/api/products/subCat/${id}`)
      .then((res) => {
        setRawProducts(res.products || []);
        setLoading(false);
        toast.success("Filters cleared successfully", {
          style: {
            border: "1px solid #111111",
            padding: "16px",
            color: "#111111",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: "600"
          }
        });
      })
      .catch((err) => {
        console.error("Failed to clear filters:", err);
        setLoading(false);
      });
  };

  // Profile Click handlers
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // Location helpers
  const selectCountry = (index) => {
    setSelectedLocationTab(index);
    setSelectedCountry(context.countrylist[index].country);
    setIsOpenLocationModal(false);
  };

  const filterCountryList = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword !== "") {
      const list = (context.countrylist || []).filter((item) =>
        item.country.toLowerCase().includes(keyword)
      );
      setCountryList(list);
    } else {
      setCountryList(context.countrylist || []);
    }
  };

  // Quick Add To Cart with Auth Guard
  const handleAddToCart = (product) => {
    if (!context.isLogin) {
      toast.error("Please login first to add items to cart!", {
        style: {
          border: "1px solid #ba1a1a",
          padding: "16px",
          color: "#ba1a1a",
          textTransform: "uppercase",
          fontSize: "11px",
          letterSpacing: "0.1em",
          fontWeight: "600"
        }
      });
      playBeep();
      return;
    }

    const payload = {
      title: product.name,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
      rating: product.rating,
      price: product.price,
      quantity: 1,
      subtotal: parseInt(product.price),
      productId: product._id,
      userId: user.userid || user.id
    };

    context.addtocart(payload);
    toast.success("Watch added to your bag!", {
      style: {
        border: "1px solid #111111",
        padding: "16px",
        color: "#111111",
        textTransform: "uppercase",
        fontSize: "11px",
        letterSpacing: "0.1em",
        fontWeight: "600"
      }
    });
    playSuccessSound();
  };

  // Add To Wishlist with Auth Guard
  const handleAddToWishlist = (product) => {
    if (!context.isLogin) {
      toast.error("Please login first to add items to wishlist!", {
        style: {
          border: "1px solid #ba1a1a",
          padding: "16px",
          color: "#ba1a1a",
          textTransform: "uppercase",
          fontSize: "11px",
          letterSpacing: "0.1em",
          fontWeight: "600"
        }
      });
      playBeep();
      return;
    }

    const payload = {
      title: product.name,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
      rating: product.rating,
      price: product.price,
      productId: product._id,
      userId: user.userid || user.id
    };

    context.addToWishlist(payload);
    toast.success("Added to your wishlist selection!", {
      style: {
        border: "1px solid #111111",
        padding: "16px",
        color: "#111111",
        textTransform: "uppercase",
        fontSize: "11px",
        letterSpacing: "0.1em",
        fontWeight: "600"
      }
    });
    playSuccessSound();
  };

  // Nav categories grouper
  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find(
    (k) => k.toLowerCase() === "fashion"
  );
  const kidzKey = Object.keys(groupedSubCats).find((k) =>
    ["kidz", "kids", "kidszz"].includes(k.toLowerCase())
  );
  const watchesKey = Object.keys(groupedSubCats).find(
    (k) => k.toLowerCase() === "watches"
  );

  const categoriesList = [
    { name: "Fashion", icon: "apparel" },
    { name: "Kidz", icon: "child_care" },
    { name: "Watches", icon: "watch" }
  ];

  const totalItemsCount = (context.cartData || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  // Dynamic Page Title
  const subCategory = (context.subCatData || []).find((item) => item._id === id);
  const categoryName = subCategory?.category?.name || "Watches";
  const subCategoryName = subCategory?.subCat || "";
  const displayTitle = subCategoryName
    ? `THE ${subCategoryName.toUpperCase()} COLLECTION`
    : `THE ${categoryName.toUpperCase()} COLLECTION`;

  // Dynamic Editorial moment card data based on Category
  const editorialData = useMemo(() => {
    const name = categoryName.toLowerCase();
    if (name.includes("watches") || name.includes("watch")) {
      return {
        image: watchesEditorialImg,
        quote: '"Timeless elegance is not about being noticed, it is about being remembered."',
        caption: "HOROLOGY EDITORIAL / VOL. II"
      };
    } else if (name.includes("fashion") || name.includes("apparel") || name.includes("clothing")) {
      return {
        image: fashionEditorialImg,
        quote: '"Style is a way to say who you are without having to speak."',
        caption: "COUTURE COLLECTION / VOL. IV"
      };
    } else if (name.includes("kidz") || name.includes("kids") || name.includes("child")) {
      return {
        image: kidsEditorialImg,
        quote: '"Encourage their curiosity, cherish their wonder, style their dreams."',
        caption: "KIDZ CURATION / SPRING SUMMER"
      };
    } else {
      return {
        image: fashionEditorialImg,
        quote: '"Simplicity is the ultimate sophistication."',
        caption: "LUXE EDITORIAL / VOL. I"
      };
    }
  }, [categoryName]);

  // Local/Client-side Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Filter by Material
    if (activeMaterial && activeMaterial !== "All Materials") {
      const kw = activeMaterial.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return (
          name.includes(kw) ||
          desc.includes(kw) ||
          (kw === "stainless steel" && (name.includes("steel") || desc.includes("steel")))
        );
      });
    }

    // Filter by Movement
    if (activeMovement && activeMovement !== "All Movements") {
      const kw = activeMovement.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return name.includes(kw) || desc.includes(kw);
      });
    }

    // Filter by Color
    if (activeColor && activeColor !== "All Colors") {
      const kw = activeColor.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return name.includes(kw) || desc.includes(kw);
      });
    }

    // Client-side Sorting
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Customer Rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Newest Arrivals") {
      result.sort((a, b) => b._id.localeCompare(a._id));
    }

    return result;
  }, [rawProducts, activeMaterial, activeMovement, activeColor, sortBy]);

  // Pagination subsets
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsToRender
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setItemsToRender(itemsPerPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setItemsToRender((prev) =>
      Math.min(prev + itemsPerPage, filteredProducts.length - startIndex)
    );
  };

  const isFilterActive =
    sortBy !== "Default" ||
    priceRange[0] !== 100 ||
    priceRange[1] !== 6000 ||
    activeMaterial !== "All Materials" ||
    activeMovement !== "All Movements" ||
    activeColor !== "All Colors";

  return (
    <div className="listingPage bg-background min-h-screen text-primary font-body flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* NAVBAR */}
      <nav className="luxe-navbar">
        <div className="luxe-navbar-container">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            LUXE
          </Link>

          {/* Center navigation */}
          <ul className="nav-links" ref={navLinksRef}>
            <li className="nav-item">
              <button
                className="nav-link-btn"
                onClick={() => {
                  setActiveLink("Home");
                  navigate("/");
                }}
              >
                Home
              </button>
            </li>

            {/* Fashion Dropdown */}
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeLink === "Fashion" ? "active" : ""}`}
                onClick={() => {
                  setActiveSubmenu(
                    activeSubmenu === "Fashion" ? null : "Fashion"
                  );
                  setDropdownOpen(false);
                }}
              >
                Fashion
                <span className="material-symbols-outlined !text-[14px] ml-1">
                  {activeSubmenu === "Fashion" ? "expand_less" : "expand_more"}
                </span>
              </button>
              {fashionKey && groupedSubCats[fashionKey] && (
                <div
                  className={`luxe-submenu ${activeSubmenu === "Fashion" ? "show" : ""}`}
                >
                  {groupedSubCats[fashionKey].map((sub, idx) => (
                    <button
                      key={idx}
                      className="luxe-submenu-item"
                      onClick={() => {
                        setActiveSubmenu(null);
                        setActiveLink("Fashion");
                        navigate(`/subcat/${sub._id}`);
                      }}
                    >
                      {sub.subCat}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Kidz Dropdown */}
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeLink === "Kidz" ? "active" : ""}`}
                onClick={() => {
                  setActiveSubmenu(activeSubmenu === "Kidz" ? null : "Kidz");
                  setDropdownOpen(false);
                }}
              >
                Kidz
                <span className="material-symbols-outlined !text-[14px] ml-1">
                  {activeSubmenu === "Kidz" ? "expand_less" : "expand_more"}
                </span>
              </button>
              {kidzKey && groupedSubCats[kidzKey] && (
                <div
                  className={`luxe-submenu ${activeSubmenu === "Kidz" ? "show" : ""}`}
                >
                  {groupedSubCats[kidzKey].map((sub, idx) => (
                    <button
                      key={idx}
                      className="luxe-submenu-item"
                      onClick={() => {
                        setActiveSubmenu(null);
                        setActiveLink("Kidz");
                        navigate(`/subcat/${sub._id}`);
                      }}
                    >
                      {sub.subCat}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Watches Dropdown (Active by Default) */}
            <li className="nav-item">
              <button
                className={`nav-link-btn ${activeLink === "Watches" ? "active" : ""}`}
                onClick={() => {
                  setActiveSubmenu(
                    activeSubmenu === "Watches" ? null : "Watches"
                  );
                  setDropdownOpen(false);
                }}
              >
                Watches
                <span className="material-symbols-outlined !text-[14px] ml-1">
                  {activeSubmenu === "Watches" ? "expand_less" : "expand_more"}
                </span>
              </button>
              {watchesKey && groupedSubCats[watchesKey] && (
                <div
                  className={`luxe-submenu ${activeSubmenu === "Watches" ? "show" : ""}`}
                >
                  {groupedSubCats[watchesKey].map((sub, idx) => (
                    <button
                      key={idx}
                      className={`luxe-submenu-item ${id === sub._id ? "font-bold text-black" : ""}`}
                      onClick={() => {
                        setActiveSubmenu(null);
                        setActiveLink("Watches");
                        navigate(`/subcat/${sub._id}`);
                      }}
                    >
                      {sub.subCat}
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* All Categories Dropdown panel */}
            <li className="nav-item" ref={dropdownRef}>
              <button
                className={`nav-link-btn ${dropdownOpen ? "active" : ""}`}
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setActiveSubmenu(null);
                }}
              >
                Categories
                <span className="material-symbols-outlined !text-[14px] ml-1">
                  {dropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
              <div
                className={`categories-dropdown ${dropdownOpen ? "show" : ""}`}
              >
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`dropdown-row ${selectedCategory === cat.name ? "selected" : ""}`}
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

          {/* Right cluster */}
          <div className="right-cluster">
            {/* Minimal Search Bar */}
            <div className="hidden md:flex items-center gap-3 border-b border-outline-variant/60 py-1 max-w-[200px]">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", color: "#666666", cursor: "pointer" }}
              >
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
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ color: "#666666" }}
              >
                location_on
              </span>
              <span className="location-text">{selectedCountry}</span>
            </div>

            {/* Bag Icon */}
            <button
              className="cart-icon-wrapper hover:scale-105 transition-transform"
              onClick={() => navigate("/cart")}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                shopping_bag
              </span>
              <span className="cart-badge bg-primary text-on-primary rounded-full text-[10px] w-4 h-4 flex items-center justify-center absolute -top-1 -right-1">
                {totalItemsCount}
              </span>
            </button>

            {/* Profile Avatar / Auth */}
            {context.isLogin !== true ? (
              <button
                className="nav-link-btn hover:scale-105 transition-transform"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
            ) : (
              <>
                <div
                  className="profile-avatar hover:scale-105 transition-transform"
                  onClick={handleProfileClick}
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
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0
                        }
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleProfileClose}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    My Account
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

      {/* CATEGORY HEADER SECTION */}
      <header className="category-header pt-32 pb-0 max-w-max-width mx-auto px-margin-desktop w-full">
        <h1 className="font-headline-xl text-headline-xl text-primary font-bold uppercase tracking-tight mb-2">
          {displayTitle}
        </h1>
        <p className="font-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
          {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"} Curation
        </p>
      </header>

      {/* STICKY FILTER BAR */}
      <div
        className={`filter-bar-sticky sticky top-20 bg-background/95 backdrop-blur-sm z-40 border-b border-outline-variant py-4 mb-12 transition-all duration-300 w-full ${
          scrolled ? "filter-sticky-shadow" : ""
        }`}
      >
        <div className="filter-container max-w-max-width mx-auto px-margin-desktop flex items-center justify-between">
          {/* Left filter options */}
          <div className="flex items-center flex-wrap gap-6 md:gap-8">
            {/* Sort Dropdown */}
            <button
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                sortBy !== "Default" ? "font-bold underline underline-offset-4" : ""
              }`}
            >
              <span>{sortBy === "Default" ? "Sort By" : sortBy}</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "sort" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Price Dropdown */}
            <button
              onClick={() => toggleDropdown("price")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                priceRange[0] !== 100 || priceRange[1] !== 6000
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Price</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "price" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Material Dropdown */}
            <button
              onClick={() => toggleDropdown("material")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                activeMaterial !== "All Materials"
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Material</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "material" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Movement Dropdown */}
            <button
              onClick={() => toggleDropdown("movement")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                activeMovement !== "All Movements"
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Movement</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "movement" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Color Dropdown */}
            <button
              onClick={() => toggleDropdown("color")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                activeColor !== "All Colors"
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Color</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "color" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Clear Filters Button */}
            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="font-label-sm text-error underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Right labels */}
          <div className="flex items-center space-x-2 text-on-surface-variant font-label-sm">
            <span className="material-symbols-outlined">filter_list</span>
            <span>Filters</span>
          </div>
        </div>

        {/* Dropdown Expand Panels */}
        {activeDropdown && (
          <div className="border-t border-outline-variant bg-white py-6 mt-4 w-full">
            <div className="max-w-max-width mx-auto px-margin-desktop">
              {activeDropdown === "sort" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Sort Products By
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "Default",
                      "Price: Low to High",
                      "Price: High to Low",
                      "Customer Rating",
                      "Newest Arrivals"
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setActiveDropdown(null);
                        }}
                        className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                          sortBy === opt
                            ? "bg-primary text-on-primary border-primary"
                            : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeDropdown === "price" && (
                <div className="max-w-md">
                  <span className="font-label-sm text-on-surface-variant mb-4 block">
                    Price Range Selector
                  </span>
                  <div className="px-2 pt-2">
                    <RangeSlider
                      min={100}
                      max={6000}
                      step={10}
                      value={priceRange}
                      onInput={(val) => setPriceRange(val)}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="font-body-md text-primary font-semibold">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>
                    <button
                      onClick={handlePriceApply}
                      className="bg-primary text-on-primary px-6 py-2 font-label-sm hover:bg-neutral-800 transition-colors rounded-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {activeDropdown === "material" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Watch Materials
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "All Materials",
                      "Stainless Steel",
                      "Rose Gold",
                      "Leather",
                      "Titanium"
                    ].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => {
                          setActiveMaterial(mat);
                          setActiveDropdown(null);
                        }}
                        className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                          activeMaterial === mat
                            ? "bg-primary text-on-primary border-primary"
                            : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeDropdown === "movement" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Watch Movements
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {["All Movements", "Automatic", "Quartz", "Mechanical"].map(
                      (mov) => (
                        <button
                          key={mov}
                          onClick={() => {
                            setActiveMovement(mov);
                            setActiveDropdown(null);
                          }}
                          className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                            activeMovement === mov
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                          }`}
                        >
                          {mov}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeDropdown === "color" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Dial Colors
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {["All Colors", "Black", "Silver", "Gold", "Blue", "White"].map(
                      (col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setActiveColor(col);
                            setActiveDropdown(null);
                          }}
                          className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                            activeColor === col
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                          }`}
                        >
                          {col}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <main className="listing-container max-w-max-width mx-auto px-margin-desktop flex-1 w-full pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            <p className="font-label-sm tracking-widest text-on-surface-variant">
              LOADING CURATION...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="font-headline-md text-error mb-4">{error}</p>
            <button
              onClick={handleClearFilters}
              className="bg-primary text-on-primary px-8 py-3 font-label-sm uppercase tracking-widest"
            >
              Reset Collection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-headline-md text-on-surface-variant mb-4">
              No Pieces match your current selection.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-primary text-on-primary px-8 py-3 font-label-sm uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* PRODUCT GRID */}
            <div className="product-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
              {(() => {
                const gridItems = [];
                paginatedProducts.forEach((product, index) => {
                  // Inject editorial moment card after card 2 (index 2)
                  if (index === 2) {
                    gridItems.push(
                      <div
                        key="editorial-moment-card"
                        className="relative overflow-hidden rounded-lg group md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto h-full min-h-[350px]"
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                        <img
                          src={editorialData.image}
                          alt="Luxe Editorial Lifestyle"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
                        />
                        <div className="bottom-left-text-block absolute bottom-12 left-12 z-20 max-w-md pr-8">
                          <p className="font-display text-white italic mb-4 text-[26px] md:text-[32px] leading-snug">
                            {editorialData.quote}
                          </p>
                          <p className="font-label-sm text-white uppercase tracking-[0.3em]">
                            {editorialData.caption}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Render standard product card
                  const imgSrc = Array.isArray(product.images)
                    ? product.images[0]
                    : product.images;

                  gridItems.push(
                    <div
                      key={product._id}
                      className="product-card group relative cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.transition =
                          "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0px)";
                      }}
                    >
                      {/* Image wrapper */}
                      <div className="relative aspect-square overflow-hidden bg-surface-container-low mb-6 rounded-lg">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product);
                          }}
                          className="wishlist-hover-btn absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-20"
                        >
                          <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                          >
                            favorite
                          </span>
                        </button>

                        {/* Quick Add Overlay */}
                        <div className="quick-add-overlay absolute bottom-0 left-0 right-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="w-full bg-black text-white border border-black py-3 font-label-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 z-20"
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 block">
                          {product.brand || "Luxe"}
                        </span>
                        <h3 className="font-body-md font-medium text-primary mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="font-body-md font-bold text-primary block">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  );
                });

                // Fallback: If total count is small and didn't trigger editorial moment card, append it
                if (paginatedProducts.length <= 2) {
                  gridItems.push(
                    <div
                      key="editorial-moment-card-fallback"
                      className="relative overflow-hidden rounded-lg group md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto h-full min-h-[350px]"
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                      <img
                        src={editorialData.image}
                        alt="Luxe Editorial Lifestyle"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
                      />
                      <div className="bottom-left-text-block absolute bottom-12 left-12 z-20 max-w-md pr-8">
                        <p className="font-display text-white italic mb-4 text-[26px] md:text-[32px] leading-snug">
                          {editorialData.quote}
                        </p>
                        <p className="font-label-sm text-white uppercase tracking-[0.3em]">
                          {editorialData.caption}
                        </p>
                      </div>
                    </div>
                  );
                }

                return gridItems;
              })()}
            </div>

            {/* PAGINATION SECTION */}
            <div className="mt-24 flex flex-col items-center">
              {/* Load More Button */}
              {startIndex + itemsToRender < filteredProducts.length && (
                <button
                  onClick={handleLoadMore}
                  className="px-12 py-4 border border-primary font-label-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all duration-300 mb-8"
                >
                  Load More
                </button>
              )}

              {/* Page Number Navigation */}
              <div className="flex items-center space-x-6">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <span
                      key={pNum}
                      onClick={() => handlePageClick(pNum)}
                      className={`font-label-sm cursor-pointer transition-colors ${
                        currentPage === pNum
                          ? "text-primary underline underline-offset-4 font-bold"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {pNum}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-surface-container py-20 mt-auto w-full">
        <div className="max-w-max-width mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Col 1 */}
            <div className="flex flex-column gap-3">
              <span className="font-headline-md font-bold text-primary block mb-2">
                LUXE
              </span>
              <p className="font-body-md text-on-surface-variant pr-4">
                Curating horological masterpieces and timeless fashion collections for the refined connoisseur.
              </p>
            </div>

            {/* Col 2 */}
            <div className="flex flex-column gap-3">
              <h4 className="font-label-sm text-primary mb-2">Explore</h4>
              <Link
                to="#"
                className="font-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                Journal
              </Link>
              <Link
                to="#"
                className="font-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                Collections
              </Link>
              <Link
                to="#"
                className="font-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                Watches
              </Link>
            </div>

            {/* Col 3 */}
            <div className="flex flex-column gap-3">
              <h4 className="font-label-sm text-primary mb-2">Support</h4>
              <Link
                to="#"
                className="font-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                Contact
              </Link>
              <Link
                to="#"
                className="font-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                Shipping
              </Link>
              <Link
                to="#"
                className="font-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline"
              >
                Privacy Policy
              </Link>
            </div>

            {/* Col 4 */}
            <div className="flex flex-column gap-3">
              <h4 className="font-label-sm text-primary mb-2">Newsletter</h4>
              <div className="flex items-center border-b border-outline py-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent border-0 outline-none w-full text-sm placeholder-on-surface-variant/50 pr-2"
                />
                <button
                  onClick={() => toast.success("Joined Luxe list successfully")}
                  className="text-primary hover:translate-x-1 transition-transform"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant my-8" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-label-sm text-on-surface-variant">
              © 2024 LUXE Editorial. All rights reserved.
            </span>
            <div className="flex items-center space-x-6 text-on-surface-variant">
              <span className="material-symbols-outlined hover:text-primary transition-colors cursor-pointer">
                share
              </span>
              <span className="material-symbols-outlined hover:text-primary transition-colors cursor-pointer">
                public
              </span>
              <span className="material-symbols-outlined hover:text-primary transition-colors cursor-pointer">
                camera
              </span>
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
        <div style={{ padding: "24px", position: "relative", minWidth: "320px" }}>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#000000"
            }}
          >
            Choose your Delivery Location
          </h4>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "#666666",
              marginBottom: "20px"
            }}
          >
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "4px 12px",
              marginBottom: "20px"
            }}
          >
            <input
              onChange={filterCountryList}
              placeholder="Search your area..."
              type="text"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                padding: "8px 0",
                color: "#000000",
                background: "transparent"
              }}
            />
            <Button style={{ minWidth: "auto", color: "#666666" }}>
              <FaSearch />
            </Button>
          </div>

          <ul
            className="clist"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "260px",
              overflowY: "auto"
            }}
          >
            {countryList?.length !== 0 &&
              countryList?.map((item, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  <Button
                    onClick={() => selectCountry(index)}
                    className={`${selectedLocationTab === index ? "active" : ""}`}
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      textTransform: "none",
                      color: selectedLocationTab === index ? "#000000" : "#444748",
                      fontWeight: selectedLocationTab === index ? "600" : "400",
                      backgroundColor:
                        selectedLocationTab === index ? "#eaeaea" : "transparent",
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

export default Listing1;
