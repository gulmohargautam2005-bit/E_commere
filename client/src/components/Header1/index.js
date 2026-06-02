import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mycontext } from "../../App";

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
              }}
            >
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
                  width: "120px",
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", color: "var(--on-surface-variant)", cursor: "pointer" }}
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
