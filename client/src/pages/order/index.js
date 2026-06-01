import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mycontext } from '../../App';
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { fetchDataFromAPI } from '../../utils/api';
import { downloadLuxeInvoice } from '../../utils/invoiceGenerator';
import '../../web.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderPage = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);

  // States copied from home1
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState("Orders");

  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);

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

  // Shared Helper Renderers to avoid duplicate code
  const renderNavbar = () => (
    <nav
      className={`luxe-navbar ${scrolled ? "scrolled" : ""} ${scrolled ? "h-compact" : "h-normal"}`}
    >
      <div className="luxe-navbar-container">
        <div className="brand-logo" onClick={() => navigate("/")}>
          LUXE
        </div>

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

            <div className={`categories-dropdown ${dropdownOpen ? "show" : ""}`}>
              {categories.map((cat, idx) => (
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

        <div className="right-cluster">
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

          <button className="cart-icon-wrapper icon-hover-trigger" onClick={() => navigate("/cart")}>
            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
              shopping_bag
            </span>
            <span className="cart-badge">
              {context?.cartData?.length || 0}
            </span>
          </button>

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
                <MenuItem onClick={() => { handleProfileClose(); navigate("/my-account"); }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }} />  My account
                </MenuItem>
                <MenuItem onClick={() => { handleProfileClose(); navigate("/order"); }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> Orders
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
  );

  const renderFooter = () => (
    <footer className="editorial-footer mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        <div className="row justify-content-between gap-5 mb-5">
          <div className="col-lg-4">
            <Link to="/" className="footer-logo">LUXE</Link>
            <p className="footer-desc">
              A curated space for the sophisticated wardrobe. Each collection represents an intentional synthesis of high couture and high design.
            </p>
            <div className="footer-socials">
              <a className="footer-social-icon" href="#" onClick={(e) => e.preventDefault()}>FB</a>
              <a className="footer-social-icon" href="#" onClick={(e) => e.preventDefault()}>IG</a>
              <a className="footer-social-icon" href="#" onClick={(e) => e.preventDefault()}>YT</a>
              <a className="footer-social-icon" href="#" onClick={(e) => e.preventDefault()}>PIN</a>
            </div>
          </div>
          <div className="col-lg-2">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Journal</a>
              </li>
              <li className="footer-link-item">
                <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); navigate("/cat"); }}>Collections</a>
              </li>
              <li className="footer-link-item">
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Contact</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-2">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Shipping</a>
              </li>
              <li className="footer-link-item">
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </li>
              <li className="footer-link-item">
                <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Returns</a>
              </li>
            </ul>
          </div>
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
              >
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 pt-4 border-t border-white border-opacity-10">
          <span className="font-label-sm text-white text-opacity-40" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()} LUXE EDITORIAL. ALL RIGHTS RESERVED.
          </span>
          <div className="d-flex gap-4 align-items-center text-white text-opacity-40">
            <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>PRIVACY</span>
            <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>TERMS</span>
            <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>COOKIES</span>
          </div>
        </div>
      </div>
    </footer>
  );

  const renderLocationDialog = () => (
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
  );

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
        {renderNavbar()}

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

        {renderFooter()}
        {renderLocationDialog()}
      </div>
    );
  }

  return (
    <div className="luxe-body min-h-screen flex flex-col font-body selection:bg-black selection:text-white">

      {/* Render matching header */}
      {renderNavbar()}

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
      {renderFooter()}

      {/* Render location selection popups */}
      {renderLocationDialog()}

    </div>
  );
};

export default OrderPage;
