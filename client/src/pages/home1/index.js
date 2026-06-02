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
import "../../web.css";
import Header1 from "../../components/Header1";
import Footer1 from "../../components/Footer1";
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
  // Header and Location Modal states are now encapsulated inside <Header1 />

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

  // Header methods and listeners are now managed inside <Header1 />

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

  // Categories list is now managed inside <Header1 />

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

/* Header Navigation styles moved to web.css */

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

/* Footer and Submenu styles moved to web.css */
      `}</style>


      {/* 1. STICKY/STICK-ON NAVIGATION BAR */}
      <Header1 transparentInitially={true} activePage="Home" />

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
      <Footer1 />
    </>
  );
};

export default Home1;
