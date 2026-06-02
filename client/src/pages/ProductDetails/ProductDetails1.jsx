import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

// Icon Imports
import { FaRegHeart } from "react-icons/fa";
import Header1 from "../../components/Header1";
import Footer1 from "../../components/Footer1";

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
import '../../web.css';



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

  const activePage = useMemo(() => {
    const catName = productdata?.category?.name?.toLowerCase() || "";
    if (catName.includes("watch")) return "Watches";
    if (catName.includes("kid")) return "Kidz";
    if (catName.includes("fashion")) return "Fashion";
    return "";
  }, [productdata]);

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

        /* Header Navigation styles moved to web.css */

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

        /* Editorial Footer styles moved to web.css */

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
        .productDetailsPage span:not(.text-danger):not(.text-error):not(.MuiRating-icon):not(.badge):not(.cart-badge) {
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
        <Header1 activePage={activePage} />

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

        <Footer1 showPaymentIcons={true} />
      </div>

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
