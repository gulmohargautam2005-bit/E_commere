import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mycontext } from '../../App';
import { FaHeart } from "react-icons/fa";
import { deletedata, fetchDataFromAPI } from '../../utils/api';
import '../../web.css';
import Header1 from '../../components/Header1';
import Footer1 from '../../components/Footer1';

const Wishlist1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);



  // Wishlist specific states
  const [items, setItems] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

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
                background: "#fbf9f8",
                "on-surface": "#1b1c1c",
                "on-surface-variant": "#444748",
                primary: "#000000",
                "on-primary": "#ffffff",
                outline: "#747878",
                "outline-variant": "#c4c7c7",
                "surface-container": "#efeded",
                "surface-container-low": "#f5f3f3",
                "surface-container-high": "#eae8e7"
              },
              spacing: {
                gutter: "24px",
                "margin-desktop": "64px",
                "max-width": "1440px"
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



  // Load wishlist items + catalog concurrently
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.userid || user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch wishlist items and catalog products
    Promise.all([
      fetchDataFromAPI(`/api/Whishlist?userId=${userId}`),
      fetchDataFromAPI('/api/products?limit=1000')
    ])
      .then(([wishlistRes, catalogRes]) => {
        setItems(wishlistRes?.MyList || []);
        setCatalog(catalogRes?.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading wishlist or catalog:", err);
        setLoading(false);
      });
  }, []);



  // Wishlist Actions
  const handleRemove = (id) => {
    deletedata(`/api/Whishlist/${id}`)
      .then(() => {
        setItems((prev) => prev.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.error("Error removing item:", err);
      });
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) return;

    const deletePromises = items.map((item) => deletedata(`/api/Whishlist/${item._id}`));
    Promise.all(deletePromises)
      .then(() => {
        setItems([]);
      })
      .catch((err) => {
        console.error("Error clearing wishlist:", err);
      });
  };

  const handleShareWishlist = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const handleAddToBag = (item, productDetail) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.userid) {
      window.alert("Please login first to add items to cart!");
      return;
    }

    const productId = item?.productId || item?._id || item?.id;
    const cartfield = {
      title: productDetail?.name || item?.title || "Luxury item",
      image: productDetail?.images?.[0] || item?.image,
      rating: productDetail?.rating || item?.rating || 0,
      price: productDetail?.price || item?.price || 0,
      quantity: 1,
      subtotal: (productDetail?.price || item?.price || 0) * 1,
      productId,
      userId: user?.userid,
    };

    context.addtocart(cartfield);
  };



  return (
    <div className="luxe-body min-h-screen flex flex-col font-body selection:bg-black selection:text-white">

      <Header1 />

      {/* 2. Wishlist Main Content Area */}
      <main className="wishlist-page-container">
        
        {/* Header Section */}
        <header className="wishlist-page-header">
          <h1 className="wishlist-page-title">My Wishlist</h1>
          <p className="wishlist-page-subtitle">
            A curated space for your selected wardrobe components and seasonal design acquisitions.
          </p>
        </header>

        {/* Wishlist Summary Bar */}
        <div className="wishlist-summary-bar">
          <span className="wishlist-summary-count">
            {loading ? "SAVED PIECES" : `${items.length} ${items.length === 1 ? "PIECE" : "PIECES"} SAVED`}
          </span>

          <div className="wishlist-summary-actions">
            <button className="wishlist-share-btn font-sans" onClick={handleShareWishlist}>
              {shareCopied ? "LINK COPIED!" : "SHARE WISHLIST"}
            </button>
            <button className="wishlist-clear-all-link font-sans" onClick={handleClearAll}>
              CLEAR ALL
            </button>
          </div>
        </div>

        {/* Main Grid or Loading/Empty States */}
        {loading ? (
          /* Editorial Skeleton Loaders */
          <div className="wishlist-grid-layout">
            {[1, 2, 3].map((n) => (
              <div className="wishlist-luxury-card animate-pulse" key={n}>
                <div className="wishlist-card-image-wrap bg-neutral-200" />
                <div className="wishlist-card-info gap-3">
                  <div className="h-3 w-1/4 bg-neutral-200 rounded" />
                  <div className="h-6 w-3/4 bg-neutral-200 rounded" />
                  <div className="h-4 w-1/3 bg-neutral-200 rounded" />
                  <div className="h-10 w-full bg-neutral-200 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Premium Empty State */
          <div className="wishlist-empty-layout">
            <div className="wishlist-empty-svg-wrap">
              <svg viewBox="0 0 200 200" width="120" height="120" className="opacity-80">
                <circle cx="100" cy="100" r="78" fill="#eae8e7" opacity="0.3" />
                <path
                  d="M100 142s-32-18-50-40c-16-19-8-44 16-47 12-2 23 3 29 12 6-9 17-14 29-12 24 3 32 28 16 47-18 22-50 40-50 40z"
                  fill="none"
                  stroke="#747878"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="wishlist-empty-title italic">Your gallery is empty.</h2>
            <p className="wishlist-empty-subtitle">
              Sift through our curation and select the heart icon to save rare items here for private evaluation.
            </p>
            <Link to="/cat" className="wishlist-empty-cta font-sans">
              BROWSE ALL COLLECTIONS
            </Link>
          </div>
        ) : (
          /* Wishlist Cards Grid */
          <div className="wishlist-grid-layout">
            {items.map((item) => {
              const productId = item.productId;
              // Cross reference with catalog to fetch latest countInstock and metadata
              const productDetail = catalog.find((p) => p._id === productId || p.id === productId);

              const name = productDetail?.name || item.title || "Luxury Item";
              const price = productDetail?.price || item.price || 0;
              const discount = productDetail?.discount || 0;
              const hasDiscount = discount > 0;
              const oldPrice = price + discount;
              const brand = productDetail?.brand || "LUXE";
              const categoryName = productDetail?.catName || "Acquisition";

              const firstImage = productDetail?.images?.[0] || item.image;
              
              // Stock badge resolution
              const stockLevel = productDetail ? productDetail.countInstock : 10; // Fallback to 10 if not found
              const isSoldOut = stockLevel === 0;
              const isLowStock = stockLevel > 0 && stockLevel < 5;
              const isBackInStock = stockLevel >= 5 && (productDetail?.isFeatured === true || discount > 0);

              let badge = "";
              let badgeClass = "";
              if (isSoldOut) {
                badge = "SOLD OUT";
                badgeClass = "wishlist-card-badge--sold-out";
              } else if (isLowStock) {
                badge = "LOW STOCK";
                badgeClass = "wishlist-card-badge--low-stock";
              } else if (isBackInStock) {
                badge = "BACK IN STOCK";
                badgeClass = "wishlist-card-badge--back-in-stock";
              }

              return (
                <div
                  key={item._id}
                  className={`wishlist-luxury-card ${isSoldOut ? "sold-out" : ""}`}
                >
                  {/* Image Wrap */}
                  <div 
                    className="wishlist-card-image-wrap"
                    onClick={() => navigate(`/product/${productId}`)}
                  >
                    {badge && (
                      <span className={`wishlist-card-badge ${badgeClass}`}>
                        {badge}
                      </span>
                    )}

                    <button
                      className="wishlist-card-remove-btn"
                      aria-label="Remove from wishlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item._id);
                      }}
                    >
                      <FaHeart style={{ color: '#ef4444' }} />
                    </button>

                    {firstImage ? (
                      <img
                        className="wishlist-card-image"
                        src={firstImage}
                        alt={name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>

                  {/* Card Details Info */}
                  <div className="wishlist-card-info">
                    <span className="wishlist-card-category">{brand} • {categoryName}</span>
                    <h3 
                      className="wishlist-card-name text-ellipsis overflow-hidden whitespace-nowrap"
                      onClick={() => navigate(`/product/${productId}`)}
                    >
                      {name}
                    </h3>
                    
                    <div className="wishlist-card-price-row">
                      {hasDiscount && (
                        <span className="oldprice line-through text-neutral-400 mr-2 text-[14px]">
                          ₹{oldPrice}
                        </span>
                      )}
                      <span className="wishlist-card-price">
                        ₹{price}
                      </span>
                    </div>

                    <button
                      className="wishlist-card-cta-btn font-sans"
                      disabled={isSoldOut}
                      onClick={() => handleAddToBag(item, productDetail)}
                    >
                      {isSoldOut ? "NOTIFY ME" : "ADD TO BAG"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Membership Perks Panel & Concierge Callout */}
        <div className="wishlist-panels-container grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-16 border-t border-neutral-200">
          
          {/* Platinum Membership Perks Panel */}
          <div className="account-card account-card--dark flex flex-col justify-between p-8 min-h-[300px]">
            <div className="card-header-row mb-6">
              <span className="material-symbols-outlined card-icon text-white">verified</span>
              <span className="card-badge bg-neutral-800 text-white border border-neutral-700">VIP RESERVE</span>
            </div>
            <div>
              <h3 className="card-title text-white mt-0 mb-4">Reserve Platinum Benefits</h3>
              <p className="card-body text-neutral-400 mb-6">
                Wishlist members receive exclusive complimentary priority shipping, early notifications on restocks, and priority sizing reservations on high-demand collections.
              </p>
            </div>
            <span 
              className="card-link text-white border-white cursor-pointer" 
              onClick={() => alert("Your Platinum benefits are active.")}
            >
              LEARN MORE
            </span>
          </div>

          {/* Concierge Callout */}
          <div className="account-card flex flex-col justify-between p-8 min-h-[300px] border border-neutral-200">
            <div className="card-header-row mb-6">
              <span className="material-symbols-outlined card-icon">support_agent</span>
            </div>
            <div>
              <h3 className="card-title mt-0 mb-4">Luxe Private Concierge</h3>
              <p className="card-body text-neutral-500 mb-6">
                Need assistance securing rare catalog items or customizing your order sizing? Our private styling directors are online 24/7 to coordinate your boutique delivery.
              </p>
            </div>
            <span 
              className="card-link cursor-pointer" 
              onClick={() => alert("Our Private Concierge will email you shortly.")}
            >
              CONTACT STYLIST
            </span>
          </div>

        </div>

      </main>

      <Footer1 />
    </div>
  );
};

export default Wishlist1;
