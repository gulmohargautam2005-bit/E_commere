import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from "react";
import Trustbar from "../../components/Trustbar";
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

// Phase 3 imports
import { useSmoothScroll } from "../../utils/useSmoothScroll";
import BrandMarquee from "../../components/BrandMarquee";
import ReviewsTicker from "../../components/ReviewsTicker";
import StaggeredReveal from "../../components/StaggeredReveal";
import HorizontalScroller from "../../components/HorizontalScroller";
import FAQ from "../../components/FAQ";
import ManifestoBanner from "../../components/ManifestoBanner";
import InteractiveSpotlight from "../../components/InteractiveSpotlight";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home1 = () => {
  useSmoothScroll();
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

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Parallax: image moves slower than text on scroll
      gsap.to(".hero-parallax-img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-parallax-img",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".hero-parallax-text", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-parallax-text",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 2. Category Tiles Staggered Reveal
      gsap.fromTo(
        ".immersive-tiles-container .tile-card",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".immersive-tiles-container",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      // 3. Scroll-triggered fade-in for all sections with .animate-on-scroll
      const animElements = document.querySelectorAll(".animate-on-scroll");
      animElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // 4. Parallax effect for Curated Highlights images
      const highlightImages = document.querySelectorAll(".curated-card .immersive-zoom-img");
      highlightImages.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".curated-card"),
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });
    });

    // Clean up ScrollTrigger instances on unmount
    return () => {
      ctx.revert();
    };
  }, []);

  // Categories list is now managed inside <Header1 />

  return (
    <>
      {/* 1. STICKY/STICK-ON NAVIGATION BAR */}
      <Header1 transparentInitially={true} activePage="Home" />

      {/* PADDING TO AVOID FIXED NAVBAR OVERLAPPING FIRST CONTENT */}
      <div style={{ height: "96px" }}></div>

      {/* 2. HERO SECTION (Bold Immersive / Asymmetric) */}
      <section className="min-h-screen relative d-flex align-items-center overflow-hidden pt-5 bg-surface" style={{ minHeight: "80vh", position: "relative", backgroundColor: "var(--surface)", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "48px" }}>
        <div className="position-absolute end-0 top-0 w-75 h-100 overflow-hidden" style={{ position: "absolute", right: 0, top: 0, width: "65%", height: "100%", overflow: "hidden" }}>
          <img
            alt="Editorial Fashion"
            className="w-100 h-100 object-cover immersive-zoom-img hero-parallax-img"
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="position-absolute inset-0" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, var(--surface) 10%, rgba(251,249,248,0.3) 60%, transparent 100%)" }}></div>
        </div>
        <div className="container-fluid relative z-20" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "650px" }} className="hero-parallax-text">
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

      {/* Brand Marquee ← NEW */}
      <BrandMarquee />
      {/* trustbar  */}
      <Trustbar />

      {/* Manifesto Banner */}
      <ManifestoBanner />


      {/* 3. CATEGORY IMMERSIVE TILES SECTION */}
      <section className="editorial-section" style={{ overflowX: "hidden" }}>
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

      {/* Interactive Spotlight Banner */}
      <InteractiveSpotlight />

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

      {/* Horizontal Scroll Product Slider ← NEW */}
      <HorizontalScroller />

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

      {/* Reviews Ticker ← NEW */}
      <ReviewsTicker />

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

      {/* Staggered Product Card Reveal ← NEW */}
      <StaggeredReveal />

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
      {/* ── BRAND VISION SECTION ── */}
      {/* Paste this block AFTER the kidz-section and BEFORE <FAQ /> */}

      {/* BRAND VISION, GOALS & ACHIEVEMENTS */}
      <section className="mobile-section-pad" style={{
        padding: "120px 48px",
        backgroundColor: "#0c0c0c",
        color: "#ffffff",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>

          {/* Section label */}
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            display: "block",
            marginBottom: "24px"
          }}>Our Story</span>

          {/* Headline */}
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", marginBottom: "100px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: "#ffffff",
              margin: 0
            }}>
              Redefining<br /><em style={{ fontStyle: "italic", fontWeight: 400 }}>Luxury</em><br />For Every Era.
            </h2>
            <div style={{ paddingTop: "12px" }}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.65)",
                marginBottom: "24px"
              }}>
                LUXE was founded on a single conviction — that exceptional design should not be a privilege. We curate the world's finest labels and craft-forward pieces, delivering them directly to those who understand that true luxury is felt, not flaunted.
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "18px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.65)",
                margin: 0
              }}>
                Our vision is a wardrobe that endures — seasonless, deliberate, and unapologetically refined. Every piece we carry earns its place through craft, provenance, and the quiet authority it commands.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: "80px" }} />

          {/* Goals - 3 columns */}
          <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "48px", marginBottom: "100px" }}>
            {[
              {
                number: "01",
                title: "Radical Curation",
                body: "We reject volume. Every brand and product on LUXE is selected by our editorial team through a rigorous process — only pieces that meet our standard of material excellence and design integrity make the cut."
              },
              {
                number: "02",
                title: "Conscious Luxury",
                body: "Our goal is a future where luxury and responsibility are inseparable. We prioritize brands committed to sustainable sourcing, ethical production, and environmental accountability."
              },
              {
                number: "03",
                title: "Frictionless Access",
                body: "We believe the experience of acquiring beauty should itself be beautiful. From discovery to delivery, LUXE is engineered to be effortless — because your time is the ultimate luxury."
              }
            ].map((item) => (
              <div key={item.number}>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.3)",
                  display: "block",
                  marginBottom: "20px"
                }}>{item.number}</span>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "#ffffff",
                  marginBottom: "16px",
                  letterSpacing: "-0.01em"
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.55)",
                  margin: 0
                }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginBottom: "80px" }} />

          {/* Achievements - stat row */}
          <div className="mobile-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", textAlign: "center" }}>
            {[
              { stat: "200+", label: "Curated Brands" },
              { stat: "50K+", label: "Happy Clients" },
              { stat: "98%", label: "Satisfaction Rate" },
              { stat: "12", label: "Cities Delivered" }
            ].map((item, i) => (
              <div key={i} style={{
                padding: "40px 24px",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none"
              }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px, 5vw, 72px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: "12px",
                  letterSpacing: "-0.03em"
                }}>{item.stat}</div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)"
                }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VOUCHERS & BANK OFFERS SECTION ── */}
      <section className="mobile-section-pad" style={{
        padding: "100px 48px",
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--outline-variant)"
      }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>

          {/* Section Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderBottom: "1px solid var(--outline-variant)",
            paddingBottom: "24px",
            marginBottom: "64px"
          }}>
            <div>
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--on-surface-variant)",
                display: "block",
                marginBottom: "8px"
              }}>Exclusive Savings</span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "40px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: 0
              }}>Offers & Benefits</h2>
            </div>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--on-surface-variant)",
              fontStyle: "italic"
            }}>Valid on selected items. T&C apply.</span>
          </div>

          {/* Voucher Cards */}
          <div style={{ marginBottom: "16px" }}>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--on-surface-variant)",
              display: "block",
              marginBottom: "28px"
            }}>Voucher Codes</span>

            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "64px" }}>
              {[
                {
                  code: "LUXE15",
                  discount: "15% OFF",
                  description: "On your first order above ₹5,000",
                  tag: "New Arrivals",
                  bg: "#111111",
                  color: "#ffffff",
                  accent: "rgba(255,255,255,0.15)"
                },
                {
                  code: "FLAT500",
                  discount: "₹500 OFF",
                  description: "On orders above ₹3,999. All categories.",
                  tag: "Limited Time",
                  bg: "#f5f5f5",
                  color: "#111111",
                  accent: "rgba(0,0,0,0.06)"
                },
                {
                  code: "LUXE20",
                  discount: "20% OFF",
                  description: "On watches & accessories above ₹8,000",
                  tag: "Watches Edit",
                  bg: "#111111",
                  color: "#ffffff",
                  accent: "rgba(255,255,255,0.15)"
                }
              ].map((v, i) => (
                <div key={i} style={{
                  backgroundColor: v.bg,
                  color: v.color,
                  borderRadius: "8px",
                  padding: "36px",
                  position: "relative",
                  overflow: "hidden",
                  border: v.bg === "#f5f5f5" ? "1px solid var(--outline-variant)" : "none"
                }}>
                  {/* Decorative circle */}
                  <div style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-40px",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    backgroundColor: v.accent,
                    pointerEvents: "none"
                  }} />

                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    opacity: 0.5,
                    display: "block",
                    marginBottom: "16px"
                  }}>{v.tag}</span>

                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "48px",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: "12px"
                  }}>{v.discount}</div>

                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    opacity: 0.65,
                    marginBottom: "28px"
                  }}>{v.description}</p>

                  {/* Code chip */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    border: `1px dashed ${v.color === "#ffffff" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)"}`,
                    borderRadius: "4px",
                    padding: "10px 18px"
                  }}>
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.15em"
                    }}>{v.code}</span>
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      opacity: 0.5
                    }}>Copy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Offers */}
          <div>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--on-surface-variant)",
              display: "block",
              marginBottom: "28px"
            }}>Bank & Card Offers</span>

            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {[
                {
                  bank: "HDFC Bank",
                  offer: "10% Instant Discount",
                  detail: "On Credit & Debit Cards",
                  max: "Up to ₹1,500",
                  icon: "🏦",
                  color: "#004C97"
                },
                {
                  bank: "ICICI Bank",
                  offer: "5% Cashback",
                  detail: "On ICICI Coral Credit Card",
                  max: "Up to ₹750",
                  icon: "💳",
                  color: "#B02A30"
                },
                {
                  bank: "Axis Bank",
                  offer: "No Cost EMI",
                  detail: "3, 6 & 12 Month Options",
                  max: "On orders ₹3,000+",
                  icon: "📆",
                  color: "#97144D"
                },
                {
                  bank: "SBI Cards",
                  offer: "₹250 OFF",
                  detail: "On SBI SimplyCLICK Card",
                  max: "Min. order ₹2,499",
                  icon: "🔵",
                  color: "#22409A"
                }
              ].map((b, i) => (
                <div key={i} style={{
                  border: "1px solid var(--outline-variant)",
                  borderRadius: "8px",
                  padding: "28px 24px",
                  backgroundColor: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Color accent bar */}
                  <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "3px",
                    backgroundColor: b.color
                  }} />

                  <div style={{ fontSize: "28px", marginBottom: "16px" }}>{b.icon}</div>

                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: b.color,
                    marginBottom: "8px"
                  }}>{b.bank}</div>

                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--primary)",
                    marginBottom: "6px",
                    lineHeight: 1.2
                  }}>{b.offer}</div>

                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--on-surface-variant)",
                    marginBottom: "12px",
                    lineHeight: 1.5
                  }}>{b.detail}</p>

                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--primary)",
                    backgroundColor: "var(--surface-dim)",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    display: "inline-block"
                  }}>{b.max}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION ← NEW */}
      <FAQ />

      {/* 9. LUXE EDITORIAL FOOTER */}
      <Footer1 />
    </>
  );
};

export default Home1;
