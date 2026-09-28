import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mycontext } from "../../App";
import { fetchDataFromAPI } from "../../utils/api";

// Material UI Imports
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
import { FaSearch, FaRegHeart } from "react-icons/fa";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";

// Slide Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header1 = ({ transparentInitially = false, activePage = "" }) => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);

  // States
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState(activePage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchDataFromAPI(`/api/products?search=${encodeURIComponent(searchQuery)}`).then((res) => {
          if (res && res.products) {
            setSearchResults(res.products);
            setIsSearchOpen(true);
          }
        });
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("selectedCountry") || "India"
  );
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const navLinksRef = useRef(null);
  const dropdownRef = useRef(null);

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

  const selectcountry = (index) => {
    setSelectedLocationTab(index);
    const country = countryList[index].country;
    setSelectedCountry(country);
    localStorage.setItem("selectedCountry", country);
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

  // Group subcategories from context
  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find((k) => k.toLowerCase() === "fashion");
  const kidzKey = Object.keys(groupedSubCats).find((k) =>
    ["kidz", "kids", "kidszz"].includes(k.toLowerCase())
  );
  const watchesKey = Object.keys(groupedSubCats).find((k) => k.toLowerCase() === "watches");

  // Scroll listener for sticky navbar effects
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

  // Categories list with Material Symbol Outlined icons
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

  return (
    <>
      <nav
        className={`luxe-navbar ${transparentInitially ? "navbar-transparent" : ""} ${
          scrolled ? "scrolled" : ""
        } ${scrolled ? "h-compact" : "h-normal"}`}
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
                    className={`dropdown-row ${selectedCategory === cat.name ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setDropdownOpen(false);
                      navigate(`/cat?catName=${encodeURIComponent(cat.name)}`);
                    }}
                  >
                    <span className="material-symbols-outlined dropdown-icon">{cat.icon}</span>
                    <span className="dropdown-label">{cat.name}</span>
                  </button>
                ))}
              </div>
            </li>
          </ul>

          {/* Right Action Icons Cluster */}
          <div className="right-cluster">
            {/* Search Bar */}
            <div
              className="search-bar-luxury d-none d-md-flex align-items-center"
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--outline-variant)",
                borderRadius: "20px",
                padding: "4px 16px",
                backgroundColor: "var(--surface-dim)",
                marginRight: "4px",
                position: "relative"
              }}
            >
              <input
                placeholder="Search products..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchResults.length > 0) setIsSearchOpen(true); }}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "12px",
                  fontFamily: "var(--font-body)",
                  color: "var(--primary)",
                  width: "120px",
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", color: "var(--on-surface-variant)", cursor: "pointer" }}
              >
                search
              </span>
              
              {isSearchOpen && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '280px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                  maxHeight: '350px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        borderBottom: index !== searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                        cursor: 'pointer',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      <img src={item.images[0]} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{item.name.substring(0, 35)}{item.name.length > 35 ? '...' : ''}</span>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500', marginTop: '4px' }}>${item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                style={{ color: "var(--on-surface-variant)" }}
              >
                location_on
              </span>
              <span className="location-text">{selectedCountry}</span>
            </div>

            {/* Cart Icon with badge */}
            <button className="cart-icon-wrapper icon-hover-trigger" onClick={() => navigate("/cart")}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                shopping_bag
              </span>
              <span className="cart-badge">{context?.cartData?.length || 0}</span>
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
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
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
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={() => {
                      handleProfileClose();
                      navigate("/my-account");
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> My account
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleProfileClose();
                      navigate("/order");
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> Orders
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleProfileClose();
                      navigate("/wishlist");
                    }}
                  >
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

      {/* MOBILE HEADER (only visible on mobile) */}
      <header className="mobile-header-wrapper d-md-none">
        <div className="mobile-shipping-banner">
          <p>COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING OVER $250</p>
        </div>
        <div className="mobile-header-main">
          <div className="d-flex align-items-center gap-1">
            <button 
              className="btn btn-link p-0 text-dark" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <a href="/" className="mobile-brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>LUXE</a>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-link p-0 text-dark" onClick={() => setIsOpenLocationModal(true)}>
              <span className="material-symbols-outlined text-[20px]" style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedCountry.substring(0, 2).toUpperCase()}</span>
            </button>
            <button className="btn btn-link p-0 text-dark position-relative" onClick={() => navigate("/cart")} style={{ marginRight: '4px' }}>
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {context?.cartData?.length > 0 && (
                <span className="position-absolute badge rounded-pill bg-dark" style={{fontSize: '9px', top: '-4px', right: '-8px', padding: '2px 4px', minWidth: '14px'}}>
                  {context?.cartData?.length}
                </span>
              )}
            </button>
            <div onClick={context.isLogin ? handleProfileClick : () => navigate("/signin")} style={{ cursor: "pointer", marginLeft: '4px' }}>
              {context.isLogin ? (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                  {context.user?.name?.substring(0, 2).toUpperCase() || "JD"}
                </div>
              ) : (
                <span className="material-symbols-outlined text-[20px]">person</span>
              )}
            </div>
          </div>
        </div>
        <div className="mobile-sub-nav">
          <button className={`mobile-sub-nav-item ${activeLink === "Home" ? "active" : ""}`} onClick={() => { setActiveLink("Home"); navigate("/"); }}>ALL</button>
          <button className={`mobile-sub-nav-item ${activeLink === "Fashion" ? "active" : ""}`} onClick={() => { setActiveLink("Fashion"); }}>FASHION</button>
          <button className={`mobile-sub-nav-item ${activeLink === "Kidz" ? "active" : ""}`} onClick={() => { setActiveLink("Kidz"); }}>KIDZ</button>
          <button className={`mobile-sub-nav-item ${activeLink === "Watches" ? "active" : ""}`} onClick={() => { setActiveLink("Watches"); }}>WATCHES</button>
          <button className={`mobile-sub-nav-item ${activeLink === "Categories" ? "active" : ""}`} onClick={() => { setActiveLink("Categories"); }}>CATEGORIES</button>
        </div>
      </header>

      {/* MOBILE HAMBURGER MENU FULL SCREEN */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay d-md-none">
          <div className="mobile-menu-header">
            <button className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0" onClick={() => setMobileMenuOpen(false)}>
              <span className="material-symbols-outlined">close</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Close</span>
            </button>
            <div className="mobile-brand" style={{ fontSize: '20px' }}>LUXE</div>
            <button className="btn btn-link text-dark p-0" onClick={() => { setMobileMenuOpen(false); navigate("/cart"); }}>
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
          
          <div className="mobile-menu-search" style={{ position: "relative", zIndex: 10 }}>
            <div className="mobile-menu-search-inner">
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>search</span>
              <input 
                type="text" 
                placeholder="Search collections, apparel, watches..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchResults.length > 0) setIsSearchOpen(true); }}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            </div>

            {isSearchOpen && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: '24px',
                  right: '24px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        borderBottom: index !== searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                        cursor: 'pointer',
                        gap: '12px'
                      }}
                    >
                      <img src={item.images[0]} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>{item.name.substring(0, 30)}{item.name.length > 30 ? '...' : ''}</span>
                        <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>${item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
          
          <div className="mobile-menu-items mt-3">
            <div className="mobile-menu-item">
              <div className="mobile-menu-item-header" onClick={() => setActiveSubmenu(activeSubmenu === "MobileFashion" ? null : "MobileFashion")}>
                <div className="d-flex align-items-baseline gap-3">
                  <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 'bold' }}>01</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase' }}>Fashion</span>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', transform: activeSubmenu === "MobileFashion" ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" }}>arrow_forward</span>
              </div>
              {activeSubmenu === "MobileFashion" && fashionKey && groupedSubCats[fashionKey] && (
                <div className="mobile-menu-subitems">
                  {groupedSubCats[fashionKey].map((sub, idx) => (
                    <a key={idx} href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate(`/subCat/${sub._id}`); }}>{sub.subCat}</a>
                  ))}
                </div>
              )}
            </div>

            <div className="mobile-menu-item">
              <div className="mobile-menu-item-header" onClick={() => setActiveSubmenu(activeSubmenu === "MobileKidz" ? null : "MobileKidz")}>
                <div className="d-flex align-items-baseline gap-3">
                  <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 'bold' }}>02</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase' }}>Kidz</span>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', transform: activeSubmenu === "MobileKidz" ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" }}>arrow_forward</span>
              </div>
              {activeSubmenu === "MobileKidz" && kidzKey && groupedSubCats[kidzKey] && (
                <div className="mobile-menu-subitems">
                  {groupedSubCats[kidzKey].map((sub, idx) => (
                    <a key={idx} href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate(`/subCat/${sub._id}`); }}>{sub.subCat}</a>
                  ))}
                </div>
              )}
            </div>

            <div className="mobile-menu-item">
              <div className="mobile-menu-item-header" onClick={() => setActiveSubmenu(activeSubmenu === "MobileWatches" ? null : "MobileWatches")}>
                <div className="d-flex align-items-baseline gap-3">
                  <span style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: 'bold' }}>03</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', textTransform: 'uppercase' }}>Watches</span>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--outline)', transform: activeSubmenu === "MobileWatches" ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" }}>arrow_forward</span>
              </div>
              {activeSubmenu === "MobileWatches" && watchesKey && groupedSubCats[watchesKey] && (
                <div className="mobile-menu-subitems">
                  {groupedSubCats[watchesKey].map((sub, idx) => (
                    <a key={idx} href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate(`/subCat/${sub._id}`); }}>{sub.subCat}</a>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}

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
              color: "var(--primary)",
            }}
          >
            <IoMdClose size={24} />
          </Button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--outline-variant)",
              borderRadius: "4px",
              padding: "4px 12px",
              marginBottom: "20px",
            }}
          >
            <input
              onChange={filterlist}
              placeholder="Search your area..."
              type="text"
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                padding: "8px 0",
              }}
            />
            <Button style={{ minWidth: "auto", color: "var(--on-surface-variant)" }}>
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
              overflowY: "auto",
            }}
          >
            {countryList?.length !== 0 &&
              countryList?.map((item, index) => (
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
                      padding: "8px 16px",
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

export default Header1;
