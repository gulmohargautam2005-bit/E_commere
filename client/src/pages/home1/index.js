import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mycontext } from "../../App";
import Productitem3 from "../../components/Productitem3";
import Productitem5 from "../../components/Productitem5";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import { IoMdClose } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { FaRegHeart } from "react-icons/fa";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { fetchDataFromAPI } from "../../utils/api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const Context = context;

  // States
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fruits & Vegetables");
  const [activeLink, setActiveLink] = useState("Home");

  const navLinksRef = useRef(null);

  const [isOpenLocationModal, setIsOpenLocationModal] = useState(false);
  const [selectedLocationTab, setSelectedLocationTab] = useState(null);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Tab Filtering States
  const [tabValue, setTabValue] = useState(0);
  const [catData, setCatData] = useState([]);
  const [selectedcat, setSelectedcat] = useState('');
  const [filterData, setFilterData] = useState([]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchDataFromAPI("/api/category/").then((res) => {
      if (res && res.categoryList) {
        setCatData(res.categoryList);
      }
    });
  }, []);

  useEffect(() => {
    if (catData.length > 0) {
      setSelectedcat(catData[0].name);
    }
  }, [catData]);

  useEffect(() => {
    if (!selectedcat) return;
    fetchDataFromAPI(`/api/products?catName=${selectedcat}`).then((res) => {
      setFilterData(res.products || []);
    });
  }, [selectedcat]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const selectcat = (cat) => {
    setSelectedcat(cat);
  };

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

  // Group subcategories from context
  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'fashion');
  const kidzKey = Object.keys(groupedSubCats).find(k => ['kidz', 'kids', 'kidszz', 'kidszz'].includes(k.toLowerCase()));
  const watchesKey = Object.keys(groupedSubCats).find(k => k.toLowerCase() === 'watches');

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

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const animElements = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 }
    );

    animElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
      <style>{`
/* LUXE Premium Design System - LuxeStyles.css */

@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300..700,0..1,-50..200');

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
  --backdrop-blur: blur(12px);
  --font-display: 'Bodoni Moda', serif;
  --font-body: 'Inter', sans-serif;
}

body {
  font-family: var(--font-body);
  background-color: #ffffff;
  color: var(--primary);
  overflow-x: hidden;
}

/* Material Symbols Outlined Custom weight */
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: 300;
  font-size: 24px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
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

/* Sticky/Fixed luxury navbar styling */
.luxe-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  background-color: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.luxe-navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--outline-variant);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
}

.luxe-navbar-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: height 0.4s ease;
}
.luxe-navbar.h-normal .luxe-navbar-container {
  height: 96px;
}
.luxe-navbar.h-compact .luxe-navbar-container {
  height: 80px;
}

/* Brand logo/wordmark LUXE */
.brand-logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 32px;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: var(--primary);
  cursor: pointer;
  user-select: none;
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
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
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
  color: var(--primary);
}
.nav-link-btn.active {
  color: var(--primary);
}
.nav-link-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--primary);
}

/* Category dropdown styling */
.categories-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background-color: var(--surface);
  border: 1px solid var(--outline-variant);
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
  background-color: var(--surface-dim);
}
.dropdown-row.highlighted {
  background-color: var(--surface-container);
}
.dropdown-row.selected {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 700;
}

.dropdown-icon {
  color: var(--on-surface-variant);
}
.dropdown-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary);
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
  background-color: var(--surface-dim);
  border: 1px solid var(--outline-variant);
  padding: 8px 16px;
  border-radius: 99px;
  cursor: pointer;
}
.location-text {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--primary);
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
  color: var(--primary);
}
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #000000 !important;
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
  background-color: var(--primary);
  color: var(--on-primary);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--outline-variant);
}

.icon-hover-trigger {
  transition: transform 0.3s ease;
}
.icon-hover-trigger:hover {
  transform: scale(1.15);
}

/* Layout Section padding */
.editorial-section {
  padding: 120px 0;
  overflow: hidden;
}

/* Scroll Animation States */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(48px);
  transition: opacity 1.2s cubic-bezier(0.2, 1, 0.3, 1), transform 1.2s cubic-bezier(0.2, 1, 0.3, 1);
}
.animate-on-scroll.appear {
  opacity: 1;
  transform: translateY(0);
}

/* Category Immersive Tiles */
/* Category Immersive Tiles */
.immersive-tiles-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 80px 48px;
  max-width: 1440px;
  margin: 0 auto;
}

.tile-card {
  width: 100%;
  height: 580px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease;
}
.tile-card.stagger-normal {
  transform: translateY(0);
}
.tile-card.stagger-down {
  transform: translateY(40px);
}
.tile-card.stagger-up {
  transform: translateY(-40px);
}

.tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.8s ease, transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.tile-card:hover .tile-img {
  filter: grayscale(0%);
  transform: scale(1.06);
}

.tile-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  color: #ffffff;
  transition: background-color 0.5s ease;
}
.tile-card:hover .tile-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.15) 60%, transparent 100%);
}

.tile-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.tile-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  margin-bottom: 16px;
  color: #ffffff;
}

.tile-explore {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #ffffff;
  text-decoration: none;
  border-bottom: 1px solid #ffffff;
  padding-bottom: 4px;
  align-self: flex-start;
  transition: color 0.3s, border-color 0.3s;
}
.tile-explore:hover {
  color: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

@media (max-width: 1024px) {
  .immersive-tiles-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 40px 24px;
  }
  .tile-card {
    height: 480px;
  }
  .tile-card.stagger-down,
  .tile-card.stagger-up {
    transform: translateY(0) !important;
  }
}

@media (max-width: 640px) {
  .immersive-tiles-container {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
  .tile-card {
    height: 400px;
  }
  .tile-card.stagger-down,
  .tile-card.stagger-up {
    transform: translateY(0) !important;
  }
}

/* Curated highlights styling */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 64px;
  border-bottom: 1px solid var(--outline-variant);
  padding-bottom: 24px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}
.view-catalog-link {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
}
.view-catalog-link:hover {
  color: var(--on-surface-variant);
  text-decoration: none;
}

.curated-card {
  margin-bottom: 40px;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
.curated-card:hover {
  transform: translateY(-4px);
}

.immersive-zoom-container {
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--surface-dim);
  margin-bottom: 24px;
}
.immersive-zoom-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(10%);
  transition: transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), filter 0.8s ease;
}
.curated-card:hover .immersive-zoom-img {
  transform: scale(1.05);
  filter: grayscale(0%);
}

.curated-product-name {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--primary);
  line-height: 1.2;
}

.curated-product-price {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
}

/* Editorial Dark Banner styling */
.dark-banner {
  background-color: #0c0c0c;
  color: #ffffff;
  padding: 120px 48px;
  overflow: hidden;
  margin: 80px 0;
}
.overlapping-images-wrapper {
  position: relative;
  height: 520px;
  width: 100%;
}
.pan-hover-container {
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}
.editorial-image-large {
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;
  height: 90%;
  z-index: 1;
}
.editorial-image-small {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 45%;
  height: 60%;
  z-index: 2;
  border: 8px solid #0c0c0c;
}
.pan-hover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 2s cubic-bezier(0.25, 1, 0.5, 1);
}
.pan-hover-container:hover .pan-hover-img {
  transform: scale(1.08);
}

.dark-banner-text-side {
  padding-left: 48px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.dark-banner-headline {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 24px;
  color: #ffffff;
}
.dark-banner-body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 48px;
  max-width: 480px;
}
.dark-banner-cta {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #ffffff;
  background-color: transparent;
  border: 1px solid #ffffff;
  padding: 16px 36px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dark-banner-cta:hover {
  background-color: #ffffff;
  color: #000000;
}

/* Watches Spotlight Horological Edit styling */
.watches-spotlight-section {
  padding: 120px 48px;
  background-color: #f9f9f9;
  overflow: hidden;
  border-bottom: 1px solid var(--outline-variant);
}
.watermark-container {
  position: relative;
  text-align: center;
  margin-bottom: 80px;
}
.watermark-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 900;
  letter-spacing: 0.25em;
  color: rgba(0, 0, 0, 0.02);
  user-select: none;
  pointer-events: none;
}
.watermark-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--primary);
}

.watch-card {
  background-color: #ffffff;
  padding: 32px;
  border: 1px solid var(--outline-variant);
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease;
}
.watch-card.elevated {
  background-color: #111111;
  color: #ffffff !important;
  border-color: #111111;
  transform: translateY(-16px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.15);
}
.watch-card:hover {
  transform: translateY(-8px);
}
.watch-card.elevated:hover {
  transform: translateY(-24px);
}

.watch-img-container {
  width: 100%;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 28px;
  border-radius: 2px;
}
.watch-card.normal .watch-img-container {
  background-color: #ffffff;
}
.watch-card.elevated .watch-img-container {
  background-color: #111111;
}
.watch-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}
.watch-card:hover .watch-img {
  transform: scale(1.04);
}

.watch-card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.watch-category-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
  margin-bottom: 12px;
}
.watch-card.elevated .watch-category-label {
  color: rgba(255, 255, 255, 0.5);
}

.watch-product-name {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 12px;
  line-height: 1.2;
  color: inherit;
}

.watch-product-price {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 32px;
  color: inherit;
}

.watch-action-btn {
  display: block;
  width: 100% !important;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  margin-top: auto;
}
.watch-card.normal .watch-action-btn {
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  color: var(--primary);
}
.watch-card.normal .watch-action-btn:hover {
  background-color: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}
.watch-card.elevated .watch-action-btn {
  border: none;
  background-color: #ffffff;
  color: #000000;
}
.watch-card.elevated .watch-action-btn:hover {
  background-color: transparent;
  color: #ffffff;
  box-shadow: inset 0 0 0 1px #ffffff;
}

/* Luxe View All Button Override */
.vll_butn {
  font-family: var(--font-body) !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.15em !important;
  text-transform: uppercase !important;
  padding: 12px 28px !important;
  height: auto !important;
  border-radius: 999px !important;
  border: 1px solid var(--outline-variant) !important;
  background-color: transparent !important;
  color: var(--primary) !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  line-height: 1 !important;
}
.vll_butn:hover {
  background-color: var(--primary) !important;
  color: var(--on-primary) !important;
  border-color: var(--primary) !important;
}
.vll_butn svg {
  font-size: 16px !important;
  transition: transform 0.3s ease !important;
  color: inherit !important;
}
.vll_butn:hover svg {
  transform: translateX(4px) !important;
}

/* Luxe Heading Font Overrides */
.Homeproduct .info3 h3 {
  font-family: 'Bodoni Moda', serif !important;
  font-size: 40px !important;
  font-weight: 600 !important;
  color: var(--primary) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  line-height: 1.2 !important;
}

/* Kidz Editorial Section */
.kidz-section {
  background-color: var(--surface);
  padding: 120px 48px;
  border-bottom: 1px solid var(--outline-variant);
}
.kidz-card {
  margin-bottom: 40px;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}
.kidz-card:hover {
  transform: translateY(-4px);
}
.kidz-img-container {
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: var(--surface-dim);
  border-radius: 4px;
}
.kidz-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.7s ease, transform 1.2s cubic-bezier(0.2, 1, 0.3, 1);
}
.kidz-card:hover .kidz-img {
  filter: grayscale(0%);
  transform: scale(1.06);
}

.kidz-product-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 4px;
  color: var(--primary);
}
.kidz-product-subtitle {
  font-family: var(--font-body);
  font-size: 13px;
  font-style: italic;
  color: var(--on-surface-variant);
}

/* Editorial Footer */
footer.editorial-footer,
footer {
  background: #000000 !important;
  background-color: #000000 !important;
  color: #ffffff !important;
  padding: 80px 48px 40px !important;
}
.footer-logo {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  margin-bottom: 24px;
  color: #ffffff !important;
  text-decoration: none;
  display: block;
}
.footer-desc {
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
  max-width: 320px;
}
.footer-socials {
  display: flex;
  gap: 16px;
}
.footer-social-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
  transition: color 0.3s ease;
  text-decoration: none;
}
.footer-social-icon:hover {
  color: #ffffff;
}

.footer-heading {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 24px;
  color: #ffffff !important;
}
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-link-item {
  margin-bottom: 12px;
}
.footer-link {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6) !important;
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-link:hover {
  color: #ffffff !important;
}

.footer-bottom {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-copyright {
  font-family: var(--font-body);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}
.footer-bottom-links {
  display: flex;
  gap: 24px;
}
.footer-bottom-link {
  font-family: var(--font-body);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.3s ease;
}
.footer-bottom-link:hover {
  color: #ffffff;
}

/* Dynamic Luxe Submenus */
.nav-item {
  position: relative;
}
.luxe-submenu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(16px);
  background-color: var(--surface);
  border: 1px solid var(--outline-variant);
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
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}
.luxe-submenu-item:hover {
  background-color: var(--surface-dim);
  color: var(--primary);
}

      `}</style>


      {/* 1. STICKY/STICK-ON NAVIGATION BAR */}
      <nav
        className={`luxe-navbar ${scrolled ? "scrolled" : ""} ${scrolled ? "h-compact" : "h-normal"
          }`}
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
                    className={`dropdown-row ${selectedCategory === cat.name ? "selected" : ""
                      }`}
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

          {/* Right Action Icons Cluster */}
          <div className="right-cluster">
            {/* Search Bar */}
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

            {/* Location Pill */}
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

            {/* Cart Icon with badge */}
            <button className="cart-icon-wrapper icon-hover-trigger" onClick={() => navigate("/cart")}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                shopping_bag
              </span>
              <span className="cart-badge">
                {context?.cartData?.length || 0}
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

      {/* PADDING TO AVOID FIXED NAVBAR OVERLAPPING FIRST CONTENT */}
      <div style={{ height: "96px" }}></div>

      {/* 2. HERO SECTION (Bold Immersive / Asymmetric) */}
      <section className="min-h-screen relative d-flex align-items-center overflow-hidden pt-5 bg-surface" style={{ minHeight: "80vh", position: "relative", backgroundColor: "var(--surface)", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "48px" }}>
        <div className="position-absolute end-0 top-0 w-75 h-100 overflow-hidden" style={{ position: "absolute", right: 0, top: 0, width: "65%", height: "100%", overflow: "hidden" }}>
          <img
            alt="Editorial Fashion"
            className="w-100 h-100 object-cover immersive-zoom-img"
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="position-absolute inset-0" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, var(--surface) 10%, rgba(251,249,248,0.3) 60%, transparent 100%)" }}></div>
        </div>
        <div className="container-fluid relative z-20" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "650px" }}>
            <span className="font-label-sm uppercase tracking-[0.4em] mb-3 d-block" style={{ fontFamily: "var(--font-body)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.4em", color: "var(--on-surface-variant)", display: "block", marginBottom: "16px" }}>Editorial Vol. 24</span>
            <h1 className="mb-4 d-flex flex-column align-items-start leading-none" style={{ marginBottom: "32px", display: "flex", flexDirection: "column", lineHeight: 0.9 }}>
              <span className="italic" style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontStyle: "italic", color: "var(--primary)" }}>SPRING</span>
              <span className="uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "96px", fontWeight: "700", textTransform: "uppercase", color: "var(--primary)", tracking: "-0.04em" }}>REFINED</span>
            </h1>
            <p className="mb-5" style={{ fontFamily: "var(--font-body)", fontSize: "18px", color: "var(--on-surface-variant)", lineHeight: "1.6", maxWidth: "450px", marginBottom: "40px" }}>
              A study in structural elegance. Redefining the intersection of architectural precision and high fashion for the modern era.
            </p>
            <div className="d-flex align-items-center gap-4">
              <button
                className="btn d-flex align-items-center gap-3 p-0 border-0 bg-transparent"
                onClick={() => navigate("/cat")}
                style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: "16px", padding: 0 }}
              >
                <span style={{ width: "64px", height: "1px", backgroundColor: "var(--primary)", display: "inline-block", transition: "width 0.3s" }}></span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em" }}>Shop the Series</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY IMMERSIVE TILES SECTION */}
      <section className="editorial-section animate-on-scroll" style={{ overflowX: "hidden" }}>
        <div className="immersive-tiles-container">
          {/* Tile 1: Women */}
          <div className="tile-card stagger-normal">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
              alt="Women"
              className="tile-img"
            />
            <div className="tile-overlay">
              <span className="tile-label">Exclusive Collection</span>
              <h3 className="tile-title">WOMEN</h3>
              <a href="#" className="tile-explore" onClick={(e) => { e.preventDefault(); navigate("/cat"); }}>
                Explore
              </a>
            </div>
          </div>

          {/* Tile 2: Men */}
          <div className="tile-card stagger-down">
            <img
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop"
              alt="Men"
              className="tile-img"
            />
            <div className="tile-overlay">
              <span className="tile-label">Modern Tailoring</span>
              <h3 className="tile-title">MEN</h3>
              <a href="#" className="tile-explore" onClick={(e) => { e.preventDefault(); navigate("/cat"); }}>
                Explore
              </a>
            </div>
          </div>

          {/* Tile 3: Kidz */}
          <div className="tile-card stagger-up">
            <img
              src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop"
              alt="Kidz"
              className="tile-img"
            />
            <div className="tile-overlay">
              <span className="tile-label">Playful Edits</span>
              <h3 className="tile-title">KIDZ</h3>
              <a href="#" className="tile-explore" onClick={(e) => { e.preventDefault(); navigate("/cat"); }}>
                Explore
              </a>
            </div>
          </div>

          {/* Tile 4: Watches */}
          <div className="tile-card stagger-normal">
            <img
              src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop"
              alt="Watches"
              className="tile-img"
            />
            <div className="tile-overlay">
              <span className="tile-label">Fine Horology</span>
              <h3 className="tile-title">WATCHES</h3>
              <a href="#" className="tile-explore" onClick={(e) => { e.preventDefault(); navigate("/cat"); }}>
                Explore
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT ROW & TABS */}
      <section className="Homeproduct animate-on-scroll" style={{ width: "100%", padding: "48px 0" }}>
        <div className="container-fluid" style={{ maxWidth: "1680px", margin: "0 auto", padding: "0 64px" }}>
          <div className="mb-3">
            <div className="info3 mt-5 w-100">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: "600", color: "var(--primary)", marginBottom: "8px" }}>Featured</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--on-surface-variant)" }}>Do not miss current offers until the end of March.</p>
            </div>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                className="filterTabs"
                textColor="primary"
                indicatorColor="primary"
              >
                {catData?.map((item, index) => (
                  <Tab onClick={() => selectcat(item.name)} key={item._id} value={index} label={item.name} />
                ))}
              </Tabs>
            </Box>
          </div>

          <div className="productrow2 w-100 d-flex">
            <Productitem3 data={filterData} />
          </div>
        </div>
      </section>

      {/* 5. CURATED HIGHLIGHTS / TRENDING SECTION */}
      <section className="editorial-section animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Curated Highlights</h2>
            <a
              href="#"
              className="view-catalog-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/cat");
              }}
            >
              View Catalog
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                arrow_forward
              </span>
            </a>
          </div>

          <div className="row align-items-stretch">
            {/* Left Big Focus Card (col-span-7) */}
            <div className="col-md-7">
              <div
                className="curated-card"
                onClick={() => navigate("/product/6a1c3d3bb3322bb0eff0b1d8")}
                style={{ cursor: "pointer" }}
              >
                <div className="immersive-zoom-container" style={{ aspectRatio: "4/5" }}>
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
                    alt="Chic Statement Trench Coat"
                    className="immersive-zoom-img"
                  />
                </div>
                <h4 className="curated-product-name">Chic Statement Trench Coat</h4>
                <span className="curated-product-price">$280.00</span>
              </div>
            </div>

            {/* Right Stacked Square Cards (col-span-5 pt-32) */}
            <div className="col-md-5 d-flex flex-column justify-content-between pt-md-5">
              {/* Stacked 1 */}
              <div
                className="curated-card"
                style={{ marginTop: "48px", cursor: "pointer" }}
                onClick={() => navigate("/product/6a1c3d3cb3322bb0eff0b1db")}
              >
                <div className="immersive-zoom-container" style={{ aspectRatio: "1/1" }}>
                  <img
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                    alt="Luxe Knitwear Sweater"
                    className="immersive-zoom-img"
                  />
                </div>
                <h4 className="curated-product-name">Luxe Knitwear Sweater</h4>
                <span className="curated-product-price">$145.00</span>
              </div>

              {/* Stacked 2 */}
              <div
                className="curated-card"
                onClick={() => navigate("/product/6a1c3d3cb3322bb0eff0b1de")}
                style={{ cursor: "pointer" }}
              >
                <div className="immersive-zoom-container" style={{ aspectRatio: "1/1" }}>
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
                    alt="Ethereal Linen Dress"
                    className="immersive-zoom-img"
                  />
                </div>
                <h4 className="curated-product-name">Ethereal Linen Dress</h4>
                <span className="curated-product-price">$195.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL DARK BANNER */}
      <section className="dark-banner animate-on-scroll">
        <div className="container-fluid" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div className="row align-items-center">
            {/* Overlapping Images Column */}
            <div className="col-md-6">
              <div className="overlapping-images-wrapper">
                {/* Large Background Image */}
                <div className="editorial-image-large pan-hover-container">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                    alt="Editorial Editorial"
                    className="pan-hover-img"
                  />
                </div>
                {/* Small Overlapping Foreground Image */}
                <div className="editorial-image-small pan-hover-container">
                  <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=500&auto=format&fit=crop"
                    alt="Studio Accent"
                    className="pan-hover-img"
                  />
                </div>
              </div>
            </div>

            {/* Text and CTA Column */}
            <div className="col-md-6">
              <div className="dark-banner-text-side">
                <h1 className="dark-banner-headline">Breaking Silence.</h1>
                <p className="dark-banner-body">
                  A dramatic narrative told in subtle neutral silhouettes. Our Autumn/Winter
                  editorial encapsulates premium design structures with modern high-street comfort,
                  revealing fashion that refuses to settle.
                </p>
                <button
                  className="dark-banner-cta"
                  onClick={() => navigate("/cat")}
                >
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WATCHS SPOTLIGHT (Horological Edit) */}
      <section className="watches-spotlight-section animate-on-scroll">
        <div className="container">
          <div className="watermark-container">
            <div className="watermark-text">PRECISION</div>
            <h2 className="watermark-title">Horological Edit</h2>
          </div>

          <div className="row align-items-stretch">
            {/* Card 1 */}
            <div className="col-md-4 mb-4">
              <div
                className="watch-card normal"
                onClick={() => navigate("/product/6a1c44ab932632e8bd61214f")}
                style={{ cursor: "pointer" }}
              >
                <div className="watch-img-container">
                  <img
                    src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop"
                    alt="Heritage Chronograph"
                    className="watch-img"
                  />
                </div>
                <div className="watch-card-body">
                  <span className="watch-category-label">Classic Chrono</span>
                  <h3 className="watch-product-name">Heritage Chronograph</h3>
                  <span className="watch-product-price">$1,850.00</span>
                  <button
                    className="watch-action-btn"
                    onClick={(e) => { e.stopPropagation(); navigate("/product/6a1c44ab932632e8bd61214f"); }}
                  >
                    Acquire Item
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2 (Elevated Middle Card) */}
            <div className="col-md-4 mb-4">
              <div
                className="watch-card elevated"
                onClick={() => navigate("/product/6a1c44ab932632e8bd612151")}
                style={{ cursor: "pointer" }}
              >
                <div className="watch-img-container">
                  <img
                    src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop"
                    alt="Minimalist Rose Gold"
                    className="watch-img"
                  />
                </div>
                <div className="watch-card-body">
                  <span className="watch-category-label" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    Signature Limited
                  </span>
                  <h3 className="watch-product-name">Minimalist Rose Gold</h3>
                  <span className="watch-product-price">$2,450.00</span>
                  <button
                    className="watch-action-btn"
                    onClick={(e) => { e.stopPropagation(); navigate("/product/6a1c44ab932632e8bd612151"); }}
                  >
                    Pre-Order Now
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-4 mb-4">
              <div
                className="watch-card normal"
                onClick={() => navigate("/product/6a1c44ab932632e8bd612153")}
                style={{ cursor: "pointer" }}
              >
                <div className="watch-img-container">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
                    alt="Aero Sport Black"
                    className="watch-img"
                  />
                </div>
                <div className="watch-card-body">
                  <span className="watch-category-label">Sport Edit</span>
                  <h3 className="watch-product-name">Aero Sport Black</h3>
                  <span className="watch-product-price">$1,200.00</span>
                  <button
                    className="watch-action-btn"
                    onClick={(e) => { e.stopPropagation(); navigate("/product/6a1c44ab932632e8bd612153"); }}
                  >
                    Acquire Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.5 NEW PRODUCTS SECTION */}
      <section className="Homeproduct animate-on-scroll" style={{ width: "100%", padding: "80px 0 100px", backgroundColor: "var(--surface)" }}>
        <div className="container-fluid" style={{ maxWidth: "1680px", margin: "0 auto", padding: "0 64px" }}>
          <div className="row">
            <div className="col">
              <div className="d-flex align-items-center mb-4">
                <div className="info3 w-75">
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "40px", fontWeight: "600", color: "var(--primary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.02em" }}>New Products</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--on-surface-variant)", margin: 0 }}>Do not miss current offers until the end of March.</p>
                </div>
                <button className="vll_butn mar ml-auto" onClick={() => {
                  Context.setisheaderfootershow(true);
                  navigate("/cat");
                }}>
                  View all <HiOutlineArrowNarrowRight />
                </button>
              </div>

              <div className="productrow2 w-100 d-flex" style={{ marginTop: "24px" }}>
                <Productitem5 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. KIDZ EDITORIAL SECTION */}
      <section className="kidz-section animate-on-scroll">
        <div className="container">
          <div className="section-header" style={{ borderBottom: "1px solid var(--outline-variant)", paddingBottom: "16px" }}>
            <h2 className="section-title">KIDZ EDITORIAL</h2>
            <a
              href="#"
              className="view-catalog-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/cat");
              }}
            >
              The Full Collection
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                arrow_forward
              </span>
            </a>
          </div>

          <div className="row">
            {/* Card 1 */}
            <div className="col-md-4">
              <div className="kidz-card">
                <div className="kidz-img-container">
                  <img
                    src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600&auto=format&fit=crop"
                    alt="Organic Cotton Parka"
                    className="kidz-img"
                  />
                </div>
                <h4 className="kidz-product-name">Organic Cotton Parka</h4>
                <span className="kidz-product-subtitle">Chic Outerwear Essentials</span>
              </div>
            </div>

            {/* Card 2 (Staggered Column - pt-16) */}
            <div className="col-md-4 pt-md-5">
              <div className="kidz-card" style={{ marginTop: "32px" }}>
                <div className="kidz-img-container">
                  <img
                    src="https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=600&auto=format&fit=crop"
                    alt="Comfort Woolen Pullover"
                    className="kidz-img"
                  />
                </div>
                <h4 className="kidz-product-name">Comfort Woolen Pullover</h4>
                <span className="kidz-product-subtitle">Premium Comfort Knitwear</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-4">
              <div className="kidz-card">
                <div className="kidz-img-container">
                  <img
                    src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop"
                    alt="Contemporary Soft Knit Set"
                    className="kidz-img"
                  />
                </div>
                <h4 className="kidz-product-name">Contemporary Soft Knit Set</h4>
                <span className="kidz-product-subtitle">Modern Everyday Staples</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. LUXE EDITORIAL FOOTER */}
      <footer className="editorial-footer text-on-primary pt-32 pb-12" style={{ backgroundColor: "#000000", color: "#ffffff", padding: "120px 48px 48px" }}>
        <div className="container-fluid" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div className="row mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Logo and description */}
            <div className="col-lg-5 mb-5 mb-lg-0">
              <a className="footer-logo" style={{ fontFamily: "var(--font-display)", fontSize: "48px", fontWeight: "800", letterSpacing: "-0.05em", textTransform: "uppercase", color: "var(--on-primary)", textDecoration: "none", display: "block", marginBottom: "24px" }} href="#">LUXE</a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", maxWidth: "380px", opacity: 0.6, lineHeight: "1.7", marginBottom: "32px" }}>
                Elevating the everyday through curated perspectives and architectural fashion.
              </p>
              <div className="d-flex gap-4">
                <a className="icon-hover-trigger" style={{ color: "var(--on-primary)", opacity: 0.5, transition: "opacity 0.3s" }} href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>public</span>
                </a>
                <a className="icon-hover-trigger" style={{ color: "var(--on-primary)", opacity: 0.5, transition: "opacity 0.3s" }} href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>photo_camera</span>
                </a>
                <a className="icon-hover-trigger" style={{ color: "var(--on-primary)", opacity: 0.5, transition: "opacity 0.3s" }} href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>play_arrow</span>
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
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          {/* Bottom links */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <span className="font-label-sm" style={{ opacity: 0.4, fontSize: "11px", letterSpacing: "0.1em" }}>© 2024 LUXE EDITORIAL. ALL RIGHTS RESERVED.</span>
            <div className="d-flex gap-4 align-items-center" style={{ opacity: 0.4 }}>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>PRIVACY</span>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>TERMS</span>
              <span className="font-label-sm" style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer" }}>COOKIES</span>
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
    </>
  );
};

export default Home1;
