import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromAPI } from '../../utils/api';
import { downloadLuxeInvoice } from '../../utils/invoiceGenerator';
import Header1 from '../../components/Header1';
import Footer1 from '../../components/Footer1';
import '../../web.css';

const OrderPage = () => {
  const navigate = useNavigate();

  // Dynamic Orders States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [invoiceStates, setInvoiceStates] = useState({});

  // Stagger entry animations
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInvoiceClick = (orderId, order) => {
    if (invoiceStates[orderId] === 'PREPARING...') return;

    setInvoiceStates((prev) => ({
      ...prev,
      [orderId]: 'PREPARING...'
    }));

    try {
      downloadLuxeInvoice(orderId);
    } catch (err) {
      console.error("Failed to generate PDF Luxe invoice:", err);
    }

    setTimeout(() => {
      setInvoiceStates((prev) => ({
        ...prev,
        [orderId]: 'INVOICE'
      }));
    }, 1000);
  };

  // Fetch orders from database on component load
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.userid || userData.id;
    setUser(userData);

    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchDataFromAPI(`/api/order?userId=${userId}`)
      .then((res) => {
        const fetchedOrders = Array.isArray(res) ? res : (res && res.orders ? res.orders : []);
        // Sort orders by most recent first
        fetchedOrders.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setOrders(fetchedOrders);

        // Initialize invoice states dictionary
        const initialInvoiceStates = {};
        fetchedOrders.forEach((o) => {
          const key = o.id || o._id || o.paymentId;
          initialInvoiceStates[key] = 'INVOICE';
        });
        setInvoiceStates(initialInvoiceStates);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load user orders:", err);
        setLoading(false);
      });
  }, []);

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



  const renderSkeletons = () => (
    <div className="flex flex-col gap-2 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse grid grid-cols-1 md:grid-cols-12 gap-6 py-8 md:py-12 border-b border-[#c4c7c7] items-center">
          <div className="order-2 md:order-1 md:col-span-2 flex flex-col gap-2">
            <div className="h-5 bg-[#efeded] rounded w-2/3" />
            <div className="h-3 bg-[#efeded] rounded w-1/2" />
          </div>
          <div className="order-1 md:order-2 md:col-span-4 flex items-center gap-6">
            <div className="w-[96px] h-[128px] bg-[#efeded] rounded shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-6 bg-[#efeded] rounded w-3/4" />
              <div className="h-4 bg-[#efeded] rounded w-1/2" />
            </div>
          </div>
          <div className="order-3 md:order-3 md:col-span-2 h-6 bg-[#efeded] rounded" />
          <div className="order-4 md:order-4 md:col-span-1 h-6 bg-[#efeded] rounded" />
          <div className="order-5 md:order-5 md:col-span-1 h-6 bg-[#efeded] rounded" />
          <div className="order-6 md:order-6 md:col-span-2 h-12 bg-[#efeded] rounded md:justify-self-end w-32" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center py-16 gap-6 animate-fade-up">
      <span className="material-symbols-outlined text-[64px] text-[#747878] opacity-40">shopping_bag</span>
      <h2 className="font-display text-2xl font-medium tracking-tight text-[#1b1c1c]">
        No Selections Acquired
      </h2>
      <p className="body-standard max-w-[480px]">
        Your purchase history is currently empty. Each piece in our collection is an intentional, high-fashion statement waiting for your curation.
      </p>
      <button
        onClick={() => navigate('/cat')}
        className="btn-load-more px-8 py-4 mt-2 font-semibold text-12px tracking-[0.15em] uppercase cursor-pointer"
      >
        EXPLORE COLLECTIONS
      </button>
    </div>
  );

  // If user is not logged in, render authentication guard view
  if (!loading && (!user || !user.userid)) {
    return (
      <div className="luxe-body min-h-screen flex flex-col font-body selection:bg-black selection:text-white">
        <Header1 activePage="Orders" />

        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 pt-40 max-w-[1440px] mx-auto w-full gap-8 animate-fade-up">
          <span className="material-symbols-outlined text-[64px] text-outline">lock</span>
          <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-[#1b1c1c]">
            Authentication Required
          </h1>
          <p className="body-standard max-w-[480px]">
            Please sign in to your editorial account to review your acquired selections and purchase history.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="btn-load-more px-12 py-4 font-semibold text-12px tracking-[0.15em] uppercase cursor-pointer"
          >
            SIGN IN
          </button>
        </main>

        <Footer1 />
      </div>
    );
  }

  return (
    <div className="luxe-body min-h-screen flex flex-col font-body selection:bg-black selection:text-white">

      {/* Render matching header */}
      <Header1 activePage="Orders" />

      {/* Main Page Container (Offset by navbar height) */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-5 md:px-16 pt-36 md:pt-40 pb-16 flex flex-col gap-20">

        {/* 2. Page Header */}
        <section className={`flex flex-col animate-fade-up delay-100 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-[#1b1c1c] mb-6">
            My Orders
          </h1>
          <div className="h-[1px] w-24 bg-black mb-8" />
          <p className="body-standard max-w-[672px] text-[#444748]">
            Review your editorial selections and tracking history. Each piece is a curated part of your narrative.
          </p>
        </section>

        {/* 3. Orders Table */}
        <section className={`flex flex-col animate-fade-up delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          {/* Column Header Row (Desktop Only) */}
          <div className="hidden md:grid grid-cols-12 gap-6 pb-4 border-b border-[#c4c7c7]">
            <div className="col-span-2 col-header-label">Payment ID</div>
            <div className="col-span-4 col-header-label">Product</div>
            <div className="col-span-2 col-header-label text-center">Contact</div>
            <div className="col-span-1 col-header-label text-center">Zip</div>
            <div className="col-span-1 col-header-label text-right">Total</div>
            <div className="col-span-2 col-header-label text-right">Action</div>
          </div>

          {/* Orders Rows */}
          <div className="flex flex-col">
            {loading ? (
              renderSkeletons()
            ) : orders.length === 0 ? (
              renderEmptyState()
            ) : (
              orders.map((order) => {
                const orderKey = order.id || order._id || order.paymentId;
                const productList = order.products || order.items || [];

                return productList.map((product, idx) => {
                  const itemKey = `${orderKey}-${idx}`;

                  return (
                    <div key={itemKey} className="order-row-luxe grid grid-cols-1 md:grid-cols-12 gap-6 py-8 md:py-12 items-center animate-fade-up">
                      {/* Payment ID (Desktop col 1-2) */}
                      <div className="order-2 md:order-1 md:col-span-2 flex flex-row md:flex-col justify-between items-center md:items-start">
                        <span className="md:hidden col-header-label opacity-50">Order ID</span>
                        <div>
                          <div className="text-14px font-semibold text-[#1b1c1c] truncate max-w-[140px]" title={order.paymentId}>
                            {order.paymentId || `#${orderKey.substring(0, 8)}`}
                          </div>
                          <div className="text-10px text-[#444748] mt-1">
                            {order.date || new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </div>
                        </div>
                      </div>

                      {/* Product Info (Desktop col 3-6) */}
                      <div className="order-1 md:order-2 md:col-span-4 flex items-center gap-6">
                        <div className="img-container-editorial shrink-0">
                          <img
                            src={product?.image || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"}
                            alt={product?.title || "Luxury Goods"}
                            className="img-thumbnail-editorial"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h2 className="product-name-luxury mb-2 line-clamp-1">{product?.title || "Luxe Apparel Selection"}</h2>
                          <span className="text-12px font-semibold tracking-wider text-[#444748] uppercase">
                            {product?.size || product?.rating ? `SIZE: ${product?.size || 'Standard'}` : ''}
                            {product?.color ? ` • COLOR: ${product?.color}` : ''}
                          </span>
                          <span className="text-12px text-[#444748] mt-1 font-medium">
                            QTY: {product?.quantity || 1} • ₹{(product?.price || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Contact (Desktop col 7-8) */}
                      <div className="order-3 md:order-3 md:col-span-2 flex md:justify-center justify-between items-center">
                        <span className="md:hidden col-header-label opacity-50">Contact</span>
                        <span className="text-16px text-[#1b1c1c]">{order.phoneNumber || order.billingDetails?.phone || "N/A"}</span>
                      </div>

                      {/* Zip Code (Desktop col 9) */}
                      <div className="order-4 md:order-4 md:col-span-1 flex md:justify-center justify-between items-center">
                        <span className="md:hidden col-header-label opacity-50">Zip</span>
                        <span className="text-16px text-[#1b1c1c]">{order.pincode || order.billingDetails?.postcode || "N/A"}</span>
                      </div>

                      {/* Total (Desktop col 10) */}
                      <div className="order-5 md:order-5 md:col-span-1 flex md:justify-end justify-between items-center">
                        <span className="md:hidden col-header-label opacity-50">Total</span>
                        <span className="text-16px font-bold text-[#1b1c1c]">
                          ₹{(order.total || order.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Action Button (Desktop col 11-12) */}
                      <div className="order-6 md:order-6 md:col-span-2 flex md:justify-end justify-center pt-4 md:pt-0">
                        <button
                          onClick={() => handleInvoiceClick(orderKey, order)}
                          className="btn-outline-luxe px-6 py-3 flex items-center justify-center gap-2 cursor-pointer font-semibold uppercase tracking-wider text-12px min-w-[140px]"
                        >
                          <span>{invoiceStates[orderKey] || 'INVOICE'}</span>
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      </div>
                    </div>
                  );
                });
              })
            )}
          </div>
        </section>

        {/* 4. Load More Button */}
        {orders.length > 0 && (
          <section className={`flex justify-center animate-fade-up delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <button className="btn-load-more px-12 py-5 font-semibold text-12px tracking-[0.15em] uppercase cursor-pointer">
              VIEW OLDER TRANSACTIONS
            </button>
          </section>
        )}

      </main>

      {/* Render matching footer */}
      <Footer1 />

    </div>
  );
};

export default OrderPage;
