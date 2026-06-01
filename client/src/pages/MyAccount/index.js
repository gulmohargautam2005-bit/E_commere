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
import '../../web.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyAccount = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);

  // Nav header states
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState("Account");

  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const dropdownRef = useRef(null);
  const navLinksRef = useRef(null);

  // Form profile states (Alexandra Vance)
  const [formData, setFormData] = useState({
    fullName: 'Alexandra Vance',
    email: 'alexandra.vance@reserve.luxe.com',
    phone: '+1 (555) 012-3456'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Luxury profile successfully updated.");
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

  // Scroll listener for navbar background opacity changes
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

  // Close nav submenus on clicking outside
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

  useEffect(() => {
    setCountryList(context.countrylist || []);
  }, [context.countrylist]);

  // Profile Menu Handlers
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

  // Location Selector handlers
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

  // Luxury Categories List
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

  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'fashion');
  const kidzKey = Object.keys(groupedSubCats).find(k => ['kidz', 'kids', 'kidszz'].includes(k.toLowerCase()));
  const watchesKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'watches');

  return (
    <div className="luxe-body min-h-screen flex flex-col font-body selection:bg-black selection:text-white">

      {/* 1. Navbar */}
      <nav className={`navbar luxe-navbar ${scrolled ? 'scrolled' : ''} ${scrolled ? 'h-compact' : 'h-normal'}`}>
        <div className="navbar-inner luxe-navbar-container">
          <div className="navbar-brand brand-logo" onClick={() => navigate("/")}>
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

          <div className="right-cluster navbar-icons">
            <div className="search-bar-luxury d-none d-md-flex align-items-center" style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--outline-variant)",
              borderRadius: "20px",
              padding: "4px 16px",
              backgroundColor: "var(--surface-container-low)",
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
                  fontFamily: "var(--font-sans)",
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
                  <MenuItem onClick={() => navigate("/my-account")}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} />  My account
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/order")}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }} /> Orders
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => navigate("/wishlist")}>
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

      {/* 2. Account Main Content Area */}
      <main className="account-main">
        {/* Account Hero Header */}
        <header className="account-hero">
          <h1>My Account</h1>
          <p>Manage your luxury profile, shipping addresses, secure payments, and reserve memberships.</p>
        </header>

        {/* Account Split Grid Layout */}
        <div className="account-grid">

          {/* Profile Details Panel (Left Column) */}
          <section className="profile-panel">
            <div className="profile-avatar-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdBp390nhO9NUxYUJcY8EMly_MIapsZH63OecXKDpnq32GLm7aqgOcnOdhUy0Dse9biNDOLHAwyTakYcr85RTbgAlbJw5TiSt72aQmYeFZeu3_CIKgPKdL7ptcOEXT735nOYReLLh7yrneHx1TNj9BhHkaxxXAbScw3QPSF0KZCbSPA2UVlCZlN2NIT3HtR0lkAJj-5P7g5mLLDuvwnsYD3OGhpfN4UVK9XRWuE8z9bnBOOiMStqgiEzqi7aDmBvkfjGr7P7tSPs0"
                alt="Alexandra Vance"
                className="profile-avatar-img"
              />
              <div className="avatar-overlay">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
            </div>

            <h2 className="profile-name">{formData.fullName}</h2>
            <div className="profile-badge">PLATINUM MEMBER</div>

            {/* Profile Form fields */}
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-field">
                <label>Full NameLabel</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                SAVE PROFILE DETAILS
              </button>
            </form>
          </section>

          {/* Cards Portfolio Grid Layout (Right Column) */}
          <section className="cards-grid">

            {/* Card 1: Addresses */}
            <div className="account-card" onClick={() => alert("Redirecting to Addresses...")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">location_on</span>
                <span className="card-badge">DEFAULT</span>
              </div>
              <div>
                <h3 className="card-title">Addresses</h3>
                <p className="card-body">
                  724 Madison Avenue<br />
                  New York, NY 10065<br />
                  United States
                </p>
              </div>
              <span className="card-link">EDIT ADDRESSES</span>
            </div>

            {/* Card 2: Orders */}
            <div className="account-card" onClick={() => navigate("/order")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">inventory_2</span>
                <span className="card-badge">IN TRANSIT</span>
              </div>
              <div>
                <h3 className="card-title">Your Orders</h3>
                <p className="card-body">
                  Order #LX-99021<br />
                  Arriving by Friday, May 24
                </p>
              </div>
              <span className="card-link">TRACK ORDER</span>
            </div>

            {/* Card 3: Payment Options */}
            <div className="account-card" onClick={() => alert("Redirecting to Payments...")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">credit_card</span>
              </div>
              <div>
                <h3 className="card-title">Payment Options</h3>
                <p className="card-body">
                  Visa ending in 4492<br />
                  Expires 08/26
                </p>
              </div>
              <span className="card-link">MANAGE CARDS</span>
            </div>

            {/* Card 4: Subscription */}
            <div className="account-card account-card--dark" onClick={() => alert("Redirecting to Membership...")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">verified</span>
              </div>
              <div>
                <h3 className="card-title">Subscription</h3>
                <p className="card-body">
                  Luxe Reserve Member<br />
                  Auto-renews Aug 2024
                </p>
              </div>
              <span className="card-link">MEMBERSHIP SETTINGS</span>
            </div>

            {/* Card 5: Wide Card Concierge */}
            <div className="account-card account-card--wide" onClick={() => alert("Contacting support...")}>
              <div className="card-image-wrap">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnQ1L4uJ11QNeBzvtvm4A6tLmJRjYwVfQ_FjupeKg4IJGAGPrFTJEWgIe05eY4y-pxz-iIlBBEcKzyhQ0T_kbUmZjOnfPtg7aRzSs7qlZXZRMKIsNEclnV7xR8RG_vZeU6csIbNhqiF5GXKevQWCPimmBtVCj5k9SMdQRcoVZqxPHcFODlCRk0QN4XizRKGlBHnp909_uFw6S3URppVmuehPJHJQLXM6YDvJcaz51SmE3poXQ-0cjPUSD93Bt4hvUCj87Iu7vsoPo"
                  alt="Concierge Service"
                />
              </div>
              <div className="card-text-content">
                <div className="card-header-row mb-4">
                  <span className="material-symbols-outlined card-icon">support_agent</span>
                </div>
                <div>
                  <h3 className="card-title" style={{ marginTop: 0 }}>Concierge Service</h3>
                  <p className="card-body" style={{ marginBottom: "24px" }}>
                    Our dedicated team is available 24/7 to assist with private viewings, style consultations, or order inquiries.
                  </p>
                </div>
                <span className="card-link">CONTACT SUPPORT</span>
              </div>
            </div>

          </section>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">LUXE</Link>
            <p className="footer-tagline">
              A curated space for the sophisticated wardrobe. Each collection represents an intentional synthesis of couture and high design.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Collections</h4>
            <ul className="footer-links">
              <li><Link to="/cat">New Arrivals</Link></li>
              <li><Link to="/cat">Ready-to-Wear</Link></li>
              <li><Link to="/cat">Editorial Acquired</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Private Viewings</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Shipping Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Contact Support</a></li>
            </ul>
          </div>

          <div className="footer-newsletter-col">
            <h4 className="footer-heading">Newsletter</h4>
            <div className="position-relative" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.2)", paddingBottom: "8px" }}>
              <input
                className="w-100 bg-transparent border-0 py-2 outline-none font-sans"
                placeholder="Enter your email"
                type="email"
                style={{ border: "none", outline: "none", background: "transparent", color: "var(--primary)", width: "100%", fontSize: "14px" }}
              />
              <button
                className="position-absolute end-0 bottom-0 bg-transparent border-0 tracking-widest"
                style={{ background: "transparent", border: "none", color: "var(--primary)", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", cursor: "pointer" }}
              >
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} LUXE EDITORIAL. ALL RIGHTS RESERVED.
          </span>
        </div>
      </footer>

      {/* 4. Location dialog popup */}
      <Dialog
        open={isOpenLocationModal}
        disableScrollLock={true}
        className="location"
        onClose={() => setIsOpenLocationModal(false)}
        TransitionComponent={Transition}
      >
        <div style={{ padding: "24px", position: "relative" }}>
          <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
            Choose your Delivery Location
          </h4>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--on-surface-variant)", marginBottom: "20px" }}>
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
              style={{ border: "none", outline: "none", width: "100%", fontFamily: "var(--font-sans)", fontSize: "13px", padding: "8px 0" }}
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
                    fontFamily: "var(--font-sans)",
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

export default MyAccount;
