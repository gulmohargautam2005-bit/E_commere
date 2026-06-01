import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";

// Icon Imports
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";

// Luxe Components
import Productzoom from "../../components/Productzoom";
import Quantity from "../../components/Quantity";
import Productmodal from "../../components/Productmodal";
import Relatedproduct from "../Relatedproduct";

// APIs & Context
import { fetchDataFromAPI, postDataToAPI } from "../../utils/api";
import { Mycontext } from "../../App";

// Toast Import
import toast, { Toaster } from "react-hot-toast";

// Slide Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductDetails1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

    // Success tone
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

  // States
  const [khula, setkhula] = useState(false);
  const [testimonials, settestimonials] = useState([]);
  const [open, setOpen] = useState(false);
  const [formfield, setformfield] = useState({
    ProductId: "",
    CustomerRating: 0,
    Review: "",
    CustomerName: "",
    CustomerId: "",
  });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState("description");
  const [productdata, setproductData] = useState({});
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [relateddata, setrelateddata] = useState([]);
  const [productquantity, setproductquantity] = useState(1);
  const [cartfield, setcartfield] = useState({});
  const [listfield, setlistfield] = useState({});

  // Navbar states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState("Watches");

  // Location modal states
  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("London");

  // Profile dropdown state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Refs
  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);

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

  // Handlers
  const onchangeinput = (e) => {
    setformfield({ ...formfield, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.userid) {
      toast.error("Please login first to add a review!", {
        style: {
          border: '1px solid #ba1a1a',
          padding: '16px',
          color: '#ba1a1a',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontWeight: '600'
        }
      });
      playBeep();
      return;
    }

    const payload = {
      ...formfield,
      CustomerId: user.userid,
      ProductId: id,
    };

    postDataToAPI("/api/review/add", payload).then((res) => {
      toast.success("Review added successfully!", {
        style: {
          border: '1px solid #000000',
          padding: '16px',
          color: '#000000',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontWeight: '600'
        }
      });
      playSuccessSound();
      setformfield({
        ProductId: "",
        CustomerRating: 0,
        Review: "",
        CustomerName: "",
        CustomerId: "",
      });
    }).then(() => {
      fetchDataFromAPI(`/api/review/?ProductId=${id}`).then((res) => {
        settestimonials(res || []);
      });
    });
  };

  // Load reviews
  useEffect(() => {
    fetchDataFromAPI(`/api/review/?ProductId=${id}`).then((res) => {
      settestimonials(res || []);
    });
  }, [id]);

  // Load product details
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromAPI(`/api/products/${id}`).then((res) => {
      setproductData(res || {});
      if (res?.subcategory) {
        fetchDataFromAPI(`/api/products/subCat/${res.subcategory}`).then((resp) => {
          const filterdata = resp?.products?.filter(item => item.id !== id);
          setrelateddata(filterdata || []);
        });
      }
    });
  }, [id]);

  // Quantity updates callback
  const quantity = (val) => {
    setproductquantity(val);
  };

  // Add to cart handler
  const addtocart = (data) => {
    if (!user?.userid) {
      toast.error("Please login first to add items to cart!", {
        style: {
          border: '1px solid #ba1a1a',
          padding: '16px',
          color: '#ba1a1a',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontWeight: '600'
        }
      });
      playBeep();
      return;
    }

    cartfield.title = data?.name;
    cartfield.image = data?.images[0];
    cartfield.rating = data?.rating;
    cartfield.price = data?.price;
    cartfield.quantity = productquantity;
    cartfield.subtotal = parseInt(productquantity * data?.price);
    cartfield.productId = data?._id;
    cartfield.userId = user?.userid;

    context.addtocart(cartfield);
    toast.success("Garment added to your bag!", {
      style: {
        border: '1px solid #000000',
        padding: '16px',
        color: '#000000',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.1em',
        fontWeight: '600'
      }
    });
    playSuccessSound();
  };

  // Add to wishlist handler
  const addToWishlist = (data) => {
    if (!user?.userid) {
      toast.error("Please login first to add items to wishlist!", {
        style: {
          border: '1px solid #ba1a1a',
          padding: '16px',
          color: '#ba1a1a',
          textTransform: 'uppercase',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontWeight: '600'
        }
      });
      playBeep();
      return;
    }

    listfield.title = data?.name;
    listfield.image = data?.images[0];
    listfield.rating = data?.rating;
    listfield.price = data?.price;
    listfield.productId = data?._id;
    listfield.userId = user?.userid;

    context.addToWishlist(listfield);
    toast.success("Added to your wishlist selection!", {
      style: {
        border: '1px solid #000000',
        padding: '16px',
        color: '#000000',
        textTransform: 'uppercase',
        fontSize: '11px',
        letterSpacing: '0.1em',
        fontWeight: '600'
      }
    });
    playSuccessSound();
  };

  // Load locations
  useEffect(() => {
    setCountryList(context.countrylist || []);
  }, [context.countrylist]);

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

  const totalItemsCount = (context.cartData || []).reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Mocks
  const product = useMemo(
    () => ({
      _id: id || "static-product",
      name: "All Natural Italian-Style Chicken Meatballs",
      brand: "Welch's",
      sku: "ZU49VOR",
      rating: 4.5,
      reviewCount: 1,
      price: 363,
      oldPrice: 395,
      inStock: true,
      shortDesc:
        "Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent.",
      images: [
        "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-50.jpg",
        "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-51.jpg",
        "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-52.jpg",
      ],
      description: [
        "Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at nulla. Morbi elit ex, viverra vitae ante vel, blandit feugiat ligula.",
        "Fusce elementum iaculis nibh, at sodales leo maximus a. Nullam ultrices sodales nunc, in pellentesque lorem mattis quis.",
        "Cras imperdiet est in nunc tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt. Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.",
      ],
    }),
    [id]
  );

  const offers = useMemo(
    () => [
      {
        lines: [
          "Applicable on: Orders above Rs. 349 (only on first purchase)",
          "Coupon code: MBBSAVE",
          "Coupon Discount: 30% off upto Rs. 250 (check cart for final savings)",
        ],
        cta: "View Eligible Products",
      },
      {
        title: "10% Instant Discount on ICICI Bank Credit Card",
        lines: ["Min Spend ₹3,500, Max Discount ₹500"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on ICICI Bank Credit Card EMI",
        lines: ["Min Spend ₹3,500, Max Discount ₹1,000"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on ICICI Bank Netbanking",
        lines: ["Min Spend ₹3,500, Max Discount ₹500"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on RBL Bank Credit Card",
        lines: ["Min Spend ₹3,500, Max Discount ₹500"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on RBL Bank Credit Card EMI",
        lines: ["Min Spend ₹3,500, Max Discount ₹1,000"],
        cta: "Terms & Condition",
      },
    ],
    []
  );

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
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* High-priority Premium CSS Overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        :root {
          --primary: #111111;
          --on-primary: #ffffff;
          --surface: #ffffff;
          --on-surface: #111111;
          --surface-dim: #f5f5f5;
          --surface-container-low: #fbfbfb;
          --surface-container: #eaeaea;
          --on-surface-variant: #666666;
          --outline-variant: #e0e0e0;
          --bg-surface: rgba(255, 255, 255, 0.9);
          
          --font-display: 'Bodoni Moda', serif;
          --font-body: 'Inter', sans-serif;
        }

        body {
          font-family: var(--font-body);
          color: var(--primary);
          background-color: #ffffff;
        }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          font-size: 24px;
          display: inline-block;
          line-height: 1;
        }

        .spring-hover {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease;
        }
        .spring-hover:hover {
          transform: scale(1.02);
        }

        .active-tab-indicator::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: currentColor;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        /* Scoped overrides to defeat global styles in Productzoom */
        .productzoom {
          position: relative !important;
        }
        .zoomSliderBig {
          aspect-ratio: 4/5 !important;
          background-color: var(--surface-dim) !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          border: 1px solid rgba(224, 224, 224, 0.3) !important;
        }
        .zoomSliderBig {
          height: 100% !important;
          width: 100% !important;
        }
        .zoomSliderBig .slick-list,
        .zoomSliderBig .slick-track,
        .zoomSliderBig .slick-slide,
        .zoomSliderBig .slick-slide > div {
          height: 100% !important;
        }
        .zoomSliderBig .item {
          height: 100% !important;
          width: 100% !important;
          background: transparent !important;
          display: block !important;
        }
        .zoomSliderBig .item img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          transition: transform 1.5s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }
        .zoomSliderBig .item img:hover {
          transform: scale(1.05) !important;
        }
        /* InnerImageZoom full scale integration */
        .zoomSliderBig .iiz {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
        }
        .zoomSliderBig img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 8px !important;
        }
        /* Hide duplicate default zoom button */
        .iiz__btn {
          display: none !important;
        }
        /* Custom round zoom button styling */
        .zoom-overlay-btn {
          position: absolute !important;
          bottom: 16px !important;
          right: 16px !important;
          z-index: 50 !important;
          background-color: #ffffff !important;
          border-radius: 50% !important;
          width: 44px !important;
          height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border: 1px solid #eaeaea !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }
        .zoom-overlay-btn:hover {
          transform: scale(1.1) !important;
        }

        .zoomSlider {
          margin-top: 16px !important;
        }
        .zoomSlider .slick-track {
          display: flex !important;
          gap: 16px !important;
        }
        .zoomSlider .item img {
          aspect-ratio: 1/1 !important;
          object-fit: cover !important;
          border-radius: 4px !important;
          border: 1px solid rgba(224, 224, 224, 0.3) !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }
        .zoomSlider .item img:hover {
          border-color: #000000 !important;
        }
        .zoomSlider .slick-current .item img {
          border: 2px solid #000000 !important;
        }

        /* Nav links layout */
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

        .right-cluster {
          display: flex;
          align-items: center;
          gap: 24px;
        }

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

        /* Stepper override */
        .quantitydrop {
          display: inline-flex !important;
          align-items: center !important;
          border: 1px solid var(--outline-variant) !important;
          border-radius: 999px !important;
          padding: 4px 12px !important;
          background-color: #ffffff !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02) !important;
        }
        .quantitydrop button {
          min-width: 32px !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          padding: 0 !important;
          color: #000000 !important;
        }
        .quantitydrop input {
          width: 48px !important;
          border: none !important;
          text-align: center !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          outline: none !important;
          background: transparent !important;
        }

        /* Scoped overrides to style Itemtwo / productitem-myntra */
        .productitem-myntra {
          border-radius: 8px !important;
          background-color: var(--surface-container-low) !important;
          border: 1px solid rgba(224, 224, 224, 0.3) !important;
          overflow: hidden !important;
          transition: all 0.4s ease !important;
          position: relative !important;
          cursor: pointer !important;
        }
        .productitem-myntra:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
          transform: translateY(-4px) !important;
        }
        .productitem-myntra .imgwrap {
          aspect-ratio: 3/4 !important;
          position: relative !important;
          overflow: hidden !important;
          background-color: var(--surface-dim) !important;
          border-radius: 8px !important;
        }
        .productitem-myntra .slideimg {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        .productitem-myntra .badge {
          background-color: #ba1a1a !important;
          color: #ffffff !important;
          text-transform: uppercase !important;
          font-size: 9px !important;
          letter-spacing: 0.1em !important;
          border-radius: 2px !important;
          position: absolute !important;
          top: 12px !important;
          left: 12px !important;
          z-index: 10 !important;
        }
        .productitem-myntra .info {
          padding: 16px !important;
          background-color: var(--surface-container-low) !important;
        }
        .productitem-myntra .info h4 {
          font-family: 'Inter', sans-serif !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #000000 !important;
          margin-bottom: 6px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .productitem-myntra .info .oldprice {
          color: var(--on-surface-variant) !important;
          opacity: 0.6 !important;
          text-decoration: line-through !important;
          font-size: 12px !important;
        }
        .productitem-myntra .info .newprice {
          color: #ba1a1a !important;
          font-weight: 700 !important;
          font-size: 13px !important;
        }

        /* Editorial Footer */
        footer.editorial-footer {
          background: #000000 !important;
          background-color: #000000 !important;
          color: #ffffff !important;
          padding: 120px 48px 48px;
        }
        .editorial-footer a,
        .editorial-footer .footer-logo,
        .editorial-footer .footer-logo:hover,
        .editorial-footer .footer-link,
        .editorial-footer .footer-heading,
        .editorial-footer span {
          font-family: 'Inter', sans-serif !important;
        }
        .editorial-footer a,
        .editorial-footer .footer-logo {
          color: #ffffff !important;
          text-decoration: none !important;
        }
        .editorial-footer .footer-link {
          color: rgba(255, 255, 255, 0.6) !important;
          text-decoration: none !important;
          transition: color 0.3s ease !important;
        }
        .editorial-footer .footer-link:hover {
          color: #ffffff !important;
        }
        .editorial-footer span.material-symbols-outlined {
          color: #ffffff !important;
          opacity: 0.8 !important;
          transition: opacity 0.3s ease !important;
        }
        .editorial-footer span.material-symbols-outlined:hover {
          opacity: 1 !important;
        }
        .editorial-footer .footer-heading {
          color: #ffffff !important;
        }

        /* Force all blue text to black */
        .productDetailsPage .text-primary,
        .productDetailsPage a,
        .productDetailsPage a:hover,
        .productDetailsPage .brand-logo,
        .productDetailsPage .sku,
        .productDetailsPage .reviews-link,
        .productDetailsPage .nav-link-btn,
        .productDetailsPage .luxe-submenu-item,
        .productDetailsPage .material-symbols-outlined,
        .productDetailsPage h1,
        .productDetailsPage h2,
        .productDetailsPage h3,
        .productDetailsPage h4,
        .productDetailsPage h5,
        .productDetailsPage p,
        .productDetailsPage li,
        .productDetailsPage span:not(.text-danger):not(.text-error):not(.MuiRating-icon):not(.badge) {
          color: #000000 !important;
        }

        /* Scoped location modal overrides */
        .location .MuiButton-root,
        .location button,
        .location input,
        .location p,
        .location h4,
        .location li,
        .location span {
          color: #000000 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .location .active {
          background-color: #f5f5f5 !important;
          font-weight: 600 !important;
        }

        /* Exceptions for prices, error, and stars */
        .productDetailsPage .text-error,
        .productDetailsPage .text-danger,
        .productDetailsPage .newprice {
          color: #ba1a1a !important;
        }
        .productDetailsPage .MuiRating-root,
        .productDetailsPage .MuiRating-icon {
          color: #FFB800 !important;
        }

        /* Stock badge styling */
        .productDetailsPage .bg-primary {
          background-color: #000000 !important;
          color: #ffffff !important;
        }

        /* Font family display override */
        .font-display-lg {
          font-family: var(--font-display) !important;
        }

        /* Add to Cart button overrides */
        .productDetailsPage .add-to-cart-btn {
          background-color: #000000 !important;
          background: #000000 !important;
          color: #ffffff !important;
          border-radius: 4px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          height: 48px !important;
          padding: 0 36px !important;
          border: none !important;
          box-shadow: none !important;
          transition: background-color 0.3s ease !important;
        }
        .productDetailsPage .add-to-cart-btn:hover {
          background-color: #222222 !important;
          background: #222222 !important;
        }

        /* Wishlist and Compare button overrides */
        .productDetailsPage .wishlist-btn,
        .productDetailsPage .compare-btn {
          border: 1px solid #cccccc !important;
          background-color: #ffffff !important;
          color: #000000 !important;
          border-radius: 4px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          letter-spacing: 0.15em !important;
          text-transform: uppercase !important;
          height: 48px !important;
          padding: 0 24px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: all 0.2s ease !important;
          box-shadow: none !important;
        }
        .productDetailsPage .wishlist-btn:hover,
        .productDetailsPage .compare-btn:hover {
          background-color: #f5f5f5 !important;
          border-color: #000000 !important;
          color: #000000 !important;
        }
        .productDetailsPage .wishlist-btn span,
        .productDetailsPage .compare-btn span {
          color: #000000 !important;
        }

        /* Product Modal Alignments & Layout Fixes */
        .pmodal .MuiDialog-paper {
          max-width: 900px !important;
          width: 100% !important;
          border-radius: 12px !important;
          border: 1px solid var(--outline-variant) !important;
          background-color: #ffffff !important;
          overflow: hidden !important;
        }
        .pmodal-close {
          position: absolute !important;
          top: 16px !important;
          right: 16px !important;
          color: #000000 !important;
          min-width: auto !important;
          padding: 8px !important;
          z-index: 100 !important;
        }
        .pmodal-content {
          padding: 40px !important;
        }
        .pmodal-content h4 {
          font-family: 'Bodoni Moda', serif !important;
          font-size: 28px !important;
          font-weight: 600 !important;
          color: #000000 !important;
          line-height: 1.2 !important;
          margin-bottom: 12px !important;
        }
        .pmodal-content hr {
          border-top: 1px solid #e0e0e0 !important;
          margin: 20px 0 !important;
        }
        .pmodal-content .row {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: wrap !important;
          margin-left: -12px !important;
          margin-right: -12px !important;
        }
        .pmodal-content .col-md-6 {
          flex: 0 0 50% !important;
          max-width: 50% !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
        .pmodal-content .quantitydrop {
          margin-right: 16px !important;
        }
        .pmodal-content .oldprice {
          color: var(--on-surface-variant) !important;
          opacity: 0.6 !important;
          text-decoration: line-through !important;
          font-size: 14px !important;
        }
        .pmodal-content .newprice {
          color: #ba1a1a !important;
          font-weight: 700 !important;
          font-size: 16px !important;
        }
        @media (max-width: 768px) {
          .pmodal-content .col-md-6 {
            flex: 0 0 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div className="productDetailsPage bg-white min-h-screen text-black">
        {/* 1. STICKY LUXE NAVBAR */}
        <nav className="luxe-navbar">
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
                  className={`nav-link-btn ${activeSubmenu === "Watches" || activeLink === "Watches" ? "active" : ""}`}
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
                      className={`dropdown-row ${selectedCategory === cat.name ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="material-symbols-outlined dropdown-icon">{cat.icon}</span>
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

              {/* Profile Avatar / Auth Dropdown */}
              {context.isLogin !== true ? (
                <button
                  className="nav-link-btn"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </button>
              ) : (
                <>
                  <div
                    className="profile-avatar icon-hover-trigger"
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

        {/* PADDING TO AVOID FIXED NAVBAR */}
        <div style={{ height: "80px" }}></div>

        {/* BREADCRUMBS */}
        <div className="max-w-max-width mx-auto px-margin-desktop py-6 flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
          <span className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate("/")}>Home</span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate("/cat")}>
            {productdata?.category?.name ? String(productdata.category.name).toUpperCase() : "WATCHES"}
          </span>
          <span className="text-neutral-300 font-normal">&gt;</span>
          <span className="text-black font-bold">{productdata?.name}</span>
        </div>

        {/* MAIN CONTENT BLOCK */}
        <main className="max-w-max-width mx-auto px-margin-desktop py-8 grid grid-cols-12 gap-gutter items-start">

          {/* LEFT COLUMN: PRODUCT ZOOM (Col span 4) */}
          <div className="col-span-12 lg:col-span-4 relative group">
            <Productzoom images={productdata?.images || []} onZoomClick={() => setIsZoomOpen(true)} zoomDisabled={true} />
          </div>

          {/* CENTER COLUMN: MAIN INFO CARD (Col span 5) */}
          <div className="col-span-12 lg:col-span-5 space-y-6 lg:pl-6">
            {/* Kicker label */}
            <span className="font-label-sm uppercase tracking-[0.3em] text-on-surface-variant text-[11px] mb-4 block">
              {productdata?.brand || "PRECISION ENGINEERING"}
            </span>

            {/* Product Name */}
            <h1 className="font-display-lg text-4xl font-medium tracking-tight text-primary leading-tight">
              {productdata?.name}
            </h1>

            {/* Stars & Reviews & SKU Row */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 font-semibold tracking-wider">
              <Rating
                value={productdata?.rating || 0}
                precision={0.5}
                readOnly
                size="small"
                style={{ color: "#FFB800" }}
              />
              <span
                onClick={() => setActiveTab("reviews")}
                className="hover:text-black transition-colors cursor-pointer underline"
              >
                {testimonials?.length || 0} Review{testimonials?.length !== 1 ? 's' : ''}
              </span>
              <span className="text-neutral-300">|</span>
              <span className="uppercase text-[11px] tracking-widest">
                SKU: <span className="text-black font-bold">{productdata?.sku || product.sku}</span>
              </span>
            </div>

            {/* Price Block */}
            <div className="py-2">
              {productdata?.discount > 0 ? (
                <div className="line-through text-neutral-400 text-sm font-medium mb-1">
                  ₹{productdata?.price + productdata?.discount}
                </div>
              ) : (
                <div className="line-through text-neutral-400 text-sm font-medium mb-1 opacity-0">
                  ₹0.00
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold font-display-lg" style={{ color: "#ba1a1a" }}>
                  ₹{productdata?.price}
                </span>
                {productdata?.countInstock > 0 || productdata?.countInStock > 0 || productdata?.inStock ? (
                  <span className="bg-black text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-widest badge" style={{ borderRadius: "99px" }}>
                    IN STOCK
                  </span>
                ) : (
                  <span className="bg-neutral-500 text-white text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-widest badge" style={{ borderRadius: "99px" }}>
                    OUT OF STOCK
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="font-body-md text-on-surface-variant leading-relaxed text-[15px] pb-6 border-b border-outline-variant/30">
              {productdata?.description || product.shortDesc}
            </p>

            {/* Stepper Row */}
            <div className="flex items-center gap-4 pt-4 w-full">
              <Quantity quantity={quantity} />
              <button
                className="add-to-cart-btn flex-grow"
                onClick={() => addtocart(productdata)}
              >
                Add To Cart
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-4 pt-2 pb-6">
              <button
                className="wishlist-btn flex-1"
                onClick={() => addToWishlist(productdata)}
              >
                <FaRegHeart size={14} />
                Wishlist
              </button>
              <button
                className="compare-btn flex-1"
                onClick={(e) => { e.preventDefault(); toast.success("Added to Compare List!"); }}
              >
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>+</span>
                Compare
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: SIDEBAR OFFERS PANEL (Col span 3) */}
          <div className="col-span-12 lg:col-span-3 lg:pl-6 space-y-6">
            <aside className="w-full bg-[#f9f9f9] p-6 rounded border border-[#e2e2e2]">
              <h3 className="text-xs text-black font-bold tracking-[0.25em] uppercase mb-3">
                BEST OFFERS
              </h3>
              <hr className="border-t border-[#e2e2e2] my-3" />

              <div className="border-l-[2px] border-black pl-4 py-1 space-y-3">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Applicable on:<br />
                  Orders above Rs. 349 (only on first purchase)
                </p>

                <div className="border border-dashed border-[#cccccc] rounded p-3 text-center bg-white">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">COUPON:</div>
                  <div className="text-xl font-bold font-display-lg text-[#ba1a1a] tracking-wider mb-1">MBBSAVE</div>
                  <div className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">30% off upto Rs. 250</div>
                </div>

                <a
                  href="#"
                  className="inline-block text-xs text-black uppercase tracking-wider font-bold underline hover:text-neutral-700"
                  onClick={(e) => e.preventDefault()}
                >
                  View Products
                </a>
              </div>
            </aside>

            {/* Bank Promotions outside/below the card */}
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs font-bold text-black mb-1">10% Instant Discount on ICICI Bank</p>
                <p className="text-[11px] text-neutral-500 leading-normal">Min Spend ₹3,500, Max Discount ₹500.</p>
                <a href="#" className="text-[9px] text-[#ba1a1a] uppercase tracking-widest font-bold hover:underline" onClick={(e) => e.preventDefault()}>T&C APPLY</a>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <p className="text-xs font-bold text-black mb-1">10% Instant Discount</p>
                <p className="text-[11px] text-neutral-500 leading-normal">Min Spend ₹3,500, Max Discount ₹1,000.</p>
                <a href="#" className="text-[9px] text-[#ba1a1a] uppercase tracking-widest font-bold hover:underline" onClick={(e) => e.preventDefault()}>T&C APPLY</a>
              </div>
            </div>
          </div>

        </main>

        {/* DESCRIPTION & REVIEWS TABS */}
        <section className="max-w-max-width mx-auto px-margin-desktop mt-10">
          <div className="flex border-b border-outline-variant/30 mb-8 gap-10">
            <button
              type="button"
              className={`relative font-headline-md text-xl py-4 pb-5 font-medium tracking-tight transition-all duration-300 outline-none ${activeTab === "description" ? "text-primary active-tab-indicator font-semibold" : "text-on-surface-variant hover:text-primary"
                }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              type="button"
              className={`relative font-headline-md text-xl py-4 pb-5 font-medium tracking-tight transition-all duration-300 outline-none ${activeTab === "reviews" ? "text-primary active-tab-indicator font-semibold" : "text-on-surface-variant hover:text-primary"
                }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({testimonials?.length || 0})
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-8 animate-fade-in">
              {/* Two Column Specifications list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                {(() => {
                  const lines = productdata?.description?.split("\n").filter(l => l.trim() !== "") || [];
                  return lines.map((line, i) => {
                    let label = "Feature Details";
                    let value = line.trim();

                    if (line.includes(":")) {
                      const parts = line.split(":");
                      label = parts[0].trim();
                      value = parts.slice(1).join(":").trim();
                    } else {
                      const isHeader = /^[A-Za-z0-9 &'-]+$/.test(line.trim()) && line.trim().split(" ").length <= 4;
                      if (isHeader) {
                        label = line.trim();
                        value = "Included";
                      }
                    }

                    return (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                        <span className="font-label-sm text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                          {label}
                        </span>
                        <span className="font-body-md text-sm text-primary font-medium text-right max-w-xs">
                          {value}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Material & Care Card */}
              <div className="bg-surface-container-low p-10 rounded-lg border border-outline-variant/30 max-w-3xl">
                <h4 className="font-label-sm text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Material &amp; Care Details</h4>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
                  Crafted from high-grade luxury fibers. To preserve its premium texture and long-term durability, we recommend delicate dry cleaning only. Keep stored in a cool, dry place. Avoid direct sunlight and humidity.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in" id="reviews">

              {/* Reviews list */}
              <div className="lg:col-span-7 space-y-8">
                <h3 className="font-headline-md text-2xl italic text-primary mb-6">Customer Reviews</h3>
                {testimonials?.length === 0 ? (
                  <p className="text-on-surface-variant font-body-md text-sm italic">No reviews yet. Be the first to express your thoughts!</p>
                ) : (
                  <div className="space-y-8">
                    {testimonials.map((item, index) => (
                      <div className="flex gap-6 p-6 rounded-xl border border-outline-variant/20 bg-surface-container-low/40 relative" key={index}>
                        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {item.CustomerName?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-primary">{item.CustomerName}</h4>
                            <Rating value={item.CustomerRating} readOnly size="small" style={{ color: "#FFB800" }} />
                          </div>
                          <p className="text-sm text-on-surface-variant font-body-md leading-relaxed">{item.Review}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="lg:col-span-5 bg-surface-container-low/50 p-8 rounded-xl border border-outline-variant/30">
                <h3 className="font-label-sm text-xs font-bold uppercase tracking-widest text-primary mb-4">Add a review</h3>
                <p className="text-[11px] text-on-surface-variant uppercase tracking-wider mb-6">Your email address will not be published. Required fields are marked *</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Your Rating *</label>
                    <Rating
                      value={formfield.CustomerRating}
                      onChange={(event, newValue) => {
                        setformfield({ ...formfield, CustomerRating: newValue });
                      }}
                      style={{ color: "#FFB800" }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Your Review *</label>
                    <textarea
                      rows={6}
                      name="Review"
                      value={formfield.Review}
                      onChange={onchangeinput}
                      className="bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-sm transition-all duration-300 text-primary w-full resize-none"
                      placeholder="Share your experience with this premium product..."
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Name *</label>
                    <input
                      type="text"
                      name="CustomerName"
                      value={formfield.CustomerName}
                      onChange={onchangeinput}
                      className="bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-sm transition-all duration-300 text-primary w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Email *</label>
                    <input
                      type="email"
                      name="email"
                      onChange={onchangeinput}
                      className="bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 text-sm transition-all duration-300 text-primary w-full"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-sm text-xs uppercase tracking-widest font-bold spring-hover shadow-lg shadow-primary/10 hover:bg-neutral-800 transition-all duration-300"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* RELATED PRODUCTS */}
        <section className="max-w-max-width mx-auto px-margin-desktop mt-28 mb-20">
          <div className="flex items-end justify-between border-b border-outline-variant/30 pb-6 mb-10">
            <div>
              <span className="block font-label-sm text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2">PAIRS PERFECTLY</span>
              <h2 className="font-headline-xl text-3xl font-medium tracking-tight text-primary">Related Products</h2>
            </div>
            <a href="#" className="font-label-sm text-xs text-primary uppercase tracking-widest font-bold hover:underline" onClick={(e) => { e.preventDefault(); navigate("/cat"); }}>
              Explore All
            </a>
          </div>

          {relateddata?.length !== 0 ? (
            <Relatedproduct data={relateddata} />
          ) : (
            <p className="text-on-surface-variant font-body-md text-sm italic">No related products found in this category.</p>
          )}
        </section>

        {/* 4. LUXE EDITORIAL FOOTER */}
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
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>The Journal</a>
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Archives</a>
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Process</a>
              </div>

              {/* Assistance Links */}
              <div className="col-6 col-lg-2 mb-4 mb-lg-0 d-flex flex-column gap-3">
                <h4 className="footer-heading" style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", marginBottom: "12px" }}>Assistance</h4>
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Shipping</a>
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Contact</a>
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Returns</a>
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
                    onClick={() => toast.success("Joined Luxe Editorial list successfully!")}
                  >
                    Join
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
              <span className="font-label-sm" style={{ opacity: 0.4, fontSize: "11px", letterSpacing: "0.1em", color: "#ffffff" }}>© 2024 LUXE EDITORIAL. ALL RIGHTS RESERVED.</span>
              <div className="d-flex gap-4 align-items-center" style={{ opacity: 0.4 }}>
                <span className="material-symbols-outlined !text-[20px] text-white">payments</span>
                <span className="material-symbols-outlined !text-[20px] text-white">credit_card</span>
                <span className="material-symbols-outlined !text-[20px] text-white">account_balance_wallet</span>
              </div>
            </div>

          </div>
        </footer>
      </div>

      {/* DELIVERY LOCATION SELECTION DIALOG */}
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

      {/* Product modal zoomed view popup */}
      <Productmodal
        open={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        data={productdata}
        zoomDisabled={true}
      />
    </>
  );
};

export default ProductDetails1;
