import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
//price range slider
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

// Context & API
import { Mycontext } from "../../App";
import { fetchDataFromAPI } from "../../utils/api";
import "../../web.css";
import Header1 from "../../components/Header1";
import Footer1 from "../../components/Footer1";

// Toast Import
import toast, { Toaster } from "react-hot-toast";

// Editorial Images Import
import watchesEditorialImg from "../../assets/images/watches_editorial.png";
import fashionEditorialImg from "../../assets/images/fashion_editorial.png";
import kidsEditorialImg from "../../assets/images/kids_editorial.png";

// Price Range slider - fallback to custom sliders if package styles are missing


const Listing1 = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // States
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState("Default");
  const [priceRange, setPriceRange] = useState([100, 6000]);
  const [activeMaterial, setActiveMaterial] = useState("All Materials");
  const [activeMovement, setActiveMovement] = useState("All Movements");
  const [activeColor, setActiveColor] = useState("All Colors");

  // Dropdown Panels Toggle State
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLink, setActiveLink] = useState("Watches");

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToRender, setItemsToRender] = useState(8);
  const itemsPerPage = 8;

  // Header & Navbar scroll logic
  const [scrolled, setScrolled] = useState(false);

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

  // Dynamically load Tailwind CDN & Scoped theme configurations
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



  // Fetch products by subcategory parameter
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setItemsToRender(8);

    fetchDataFromAPI(`/api/products/subCat/${id}`)
      .then((res) => {
        setRawProducts(res.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products for subcategory:", err);
        setError("Could not retrieve collection. Please try again.");
        setLoading(false);
      });
  }, [id]);



  // Scroll position listener for sticky filter bar and styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  // API query: Filter products by Price Range
  const handlePriceApply = () => {
    setLoading(true);
    setActiveDropdown(null);
    fetchDataFromAPI(
      `/api/products/products?minprice=${priceRange[0]}&maxprice=${priceRange[1]}&subcategory=${id}`
    )
      .then((res) => {
        setRawProducts(res.products || []);
        setLoading(false);
        toast.success(`Price filter applied: ₹${priceRange[0]} - ₹${priceRange[1]}`, {
          style: {
            border: "1px solid #111111",
            padding: "16px",
            color: "#111111",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: "600"
          }
        });
      })
      .catch((err) => {
        console.error("Failed price range filtering:", err);
        setLoading(false);
      });
  };

  // Reset/Clear all filters
  const handleClearFilters = () => {
    setSortBy("Default");
    setPriceRange([100, 6000]);
    setActiveMaterial("All Materials");
    setActiveMovement("All Movements");
    setActiveColor("All Colors");
    setActiveDropdown(null);
    setCurrentPage(1);
    setItemsToRender(8);

    setLoading(true);
    fetchDataFromAPI(`/api/products/subCat/${id}`)
      .then((res) => {
        setRawProducts(res.products || []);
        setLoading(false);
        toast.success("Filters cleared successfully", {
          style: {
            border: "1px solid #111111",
            padding: "16px",
            color: "#111111",
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: "600"
          }
        });
      })
      .catch((err) => {
        console.error("Failed to clear filters:", err);
        setLoading(false);
      });
  };



  // Quick Add To Cart with Auth Guard
  const handleAddToCart = (product) => {
    if (!context.isLogin) {
      toast.error("Please login first to add items to cart!", {
        style: {
          border: "1px solid #ba1a1a",
          padding: "16px",
          color: "#ba1a1a",
          textTransform: "uppercase",
          fontSize: "11px",
          letterSpacing: "0.1em",
          fontWeight: "600"
        }
      });
      playBeep();
      return;
    }

    const payload = {
      title: product.name,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
      rating: product.rating,
      price: product.price,
      quantity: 1,
      subtotal: parseInt(product.price),
      productId: product._id,
      userId: user.userid || user.id
    };

    context.addtocart(payload);
    toast.success("Watch added to your bag!", {
      style: {
        border: "1px solid #111111",
        padding: "16px",
        color: "#111111",
        textTransform: "uppercase",
        fontSize: "11px",
        letterSpacing: "0.1em",
        fontWeight: "600"
      }
    });
    playSuccessSound();
  };

  // Add To Wishlist with Auth Guard
  const handleAddToWishlist = (product) => {
    if (!context.isLogin) {
      toast.error("Please login first to add items to wishlist!", {
        style: {
          border: "1px solid #ba1a1a",
          padding: "16px",
          color: "#ba1a1a",
          textTransform: "uppercase",
          fontSize: "11px",
          letterSpacing: "0.1em",
          fontWeight: "600"
        }
      });
      playBeep();
      return;
    }

    const payload = {
      title: product.name,
      image: Array.isArray(product.images) ? product.images[0] : product.images,
      rating: product.rating,
      price: product.price,
      productId: product._id,
      userId: user.userid || user.id
    };

    context.addToWishlist(payload);
    toast.success("Added to your wishlist selection!", {
      style: {
        border: "1px solid #111111",
        padding: "16px",
        color: "#111111",
        textTransform: "uppercase",
        fontSize: "11px",
        letterSpacing: "0.1em",
        fontWeight: "600"
      }
    });
    playSuccessSound();
  };

  // Nav categories grouper
  const groupedSubCats = (context.subCatData || []).reduce((acc, item) => {
    const catName = item.category?.name || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  const fashionKey = Object.keys(groupedSubCats).find(
    (k) => k.toLowerCase() === "fashion"
  );
  const kidzKey = Object.keys(groupedSubCats).find((k) =>
    ["kidz", "kids", "kidszz"].includes(k.toLowerCase())
  );
  const watchesKey = Object.keys(groupedSubCats).find(
    (k) => k.toLowerCase() === "watches"
  );

  const categoriesList = [
    { name: "Fashion", icon: "apparel" },
    { name: "Kidz", icon: "child_care" },
    { name: "Watches", icon: "watch" }
  ];

  const totalItemsCount = (context.cartData || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  // Dynamic Page Title
  const subCategory = (context.subCatData || []).find((item) => item._id === id);
  const categoryName = subCategory?.category?.name || "Watches";
  const subCategoryName = subCategory?.subCat || "";
  const displayTitle = subCategoryName
    ? `THE ${subCategoryName.toUpperCase()} COLLECTION`
    : `THE ${categoryName.toUpperCase()} COLLECTION`;

  // Dynamic Editorial moment card data based on Category
  const editorialData = useMemo(() => {
    const name = categoryName.toLowerCase();
    if (name.includes("watches") || name.includes("watch")) {
      return {
        image: watchesEditorialImg,
        quote: '"Timeless elegance is not about being noticed, it is about being remembered."',
        caption: "HOROLOGY EDITORIAL / VOL. II"
      };
    } else if (name.includes("fashion") || name.includes("apparel") || name.includes("clothing")) {
      return {
        image: fashionEditorialImg,
        quote: '"Style is a way to say who you are without having to speak."',
        caption: "COUTURE COLLECTION / VOL. IV"
      };
    } else if (name.includes("kidz") || name.includes("kids") || name.includes("child")) {
      return {
        image: kidsEditorialImg,
        quote: '"Encourage their curiosity, cherish their wonder, style their dreams."',
        caption: "KIDZ CURATION / SPRING SUMMER"
      };
    } else {
      return {
        image: fashionEditorialImg,
        quote: '"Simplicity is the ultimate sophistication."',
        caption: "LUXE EDITORIAL / VOL. I"
      };
    }
  }, [categoryName]);

  // Local/Client-side Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Filter by Material
    if (activeMaterial && activeMaterial !== "All Materials") {
      const kw = activeMaterial.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return (
          name.includes(kw) ||
          desc.includes(kw) ||
          (kw === "stainless steel" && (name.includes("steel") || desc.includes("steel")))
        );
      });
    }

    // Filter by Movement
    if (activeMovement && activeMovement !== "All Movements") {
      const kw = activeMovement.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return name.includes(kw) || desc.includes(kw);
      });
    }

    // Filter by Color
    if (activeColor && activeColor !== "All Colors") {
      const kw = activeColor.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return name.includes(kw) || desc.includes(kw);
      });
    }

    // Client-side Sorting
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Customer Rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Newest Arrivals") {
      result.sort((a, b) => b._id.localeCompare(a._id));
    }

    return result;
  }, [rawProducts, activeMaterial, activeMovement, activeColor, sortBy]);

  // Pagination subsets
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsToRender
  );

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setItemsToRender(itemsPerPage);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setItemsToRender((prev) =>
      Math.min(prev + itemsPerPage, filteredProducts.length - startIndex)
    );
  };

  const isFilterActive =
    sortBy !== "Default" ||
    priceRange[0] !== 100 ||
    priceRange[1] !== 6000 ||
    activeMaterial !== "All Materials" ||
    activeMovement !== "All Movements" ||
    activeColor !== "All Colors";

  return (
    <div className="listingPage bg-background min-h-screen text-primary font-body flex flex-col">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header1 activePage="Fashion" />

      {/* CATEGORY HEADER SECTION */}
      <header className="category-header pt-32 pb-0 max-w-max-width mx-auto px-margin-desktop w-full">
        <h1 className="font-headline-xl text-headline-xl text-primary font-bold uppercase tracking-tight mb-2">
          {displayTitle}
        </h1>
        <p className="font-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
          {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"} Curation
        </p>
      </header>

      {/* STICKY FILTER BAR */}
      <div
        className={`filter-bar-sticky sticky top-20 bg-background/95 backdrop-blur-sm z-40 border-b border-outline-variant py-4 mb-12 transition-all duration-300 w-full ${
          scrolled ? "filter-sticky-shadow" : ""
        }`}
      >
        <div className="filter-container max-w-max-width mx-auto px-margin-desktop flex items-center justify-between">
          {/* Left filter options */}
          <div className="flex items-center flex-wrap gap-6 md:gap-8">
            {/* Sort Dropdown */}
            <button
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                sortBy !== "Default" ? "font-bold underline underline-offset-4" : ""
              }`}
            >
              <span>{sortBy === "Default" ? "Sort By" : sortBy}</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "sort" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Price Dropdown */}
            <button
              onClick={() => toggleDropdown("price")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                priceRange[0] !== 100 || priceRange[1] !== 6000
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Price</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "price" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Material Dropdown */}
            <button
              onClick={() => toggleDropdown("material")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                activeMaterial !== "All Materials"
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Material</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "material" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Movement Dropdown */}
            <button
              onClick={() => toggleDropdown("movement")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                activeMovement !== "All Movements"
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Movement</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "movement" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Color Dropdown */}
            <button
              onClick={() => toggleDropdown("color")}
              className={`flex items-center space-x-2 font-label-sm uppercase tracking-wider text-primary group ${
                activeColor !== "All Colors"
                  ? "font-bold underline underline-offset-4"
                  : ""
              }`}
            >
              <span>Color</span>
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform duration-200">
                {activeDropdown === "color" ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Clear Filters Button */}
            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="font-label-sm text-error underline underline-offset-4 cursor-pointer hover:text-red-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Right labels */}
          <div className="flex items-center space-x-2 text-on-surface-variant font-label-sm">
            <span className="material-symbols-outlined">filter_list</span>
            <span>Filters</span>
          </div>
        </div>

        {/* Dropdown Expand Panels */}
        {activeDropdown && (
          <div className="border-t border-outline-variant bg-white py-6 mt-4 w-full">
            <div className="max-w-max-width mx-auto px-margin-desktop">
              {activeDropdown === "sort" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Sort Products By
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "Default",
                      "Price: Low to High",
                      "Price: High to Low",
                      "Customer Rating",
                      "Newest Arrivals"
                    ].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setActiveDropdown(null);
                        }}
                        className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                          sortBy === opt
                            ? "bg-primary text-on-primary border-primary"
                            : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeDropdown === "price" && (
                <div className="max-w-md">
                  <span className="font-label-sm text-on-surface-variant mb-4 block">
                    Price Range Selector
                  </span>
                  <div className="px-2 pt-2">
                    <RangeSlider
                      min={100}
                      max={6000}
                      step={10}
                      value={priceRange}
                      onInput={(val) => setPriceRange(val)}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="font-body-md text-primary font-semibold">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </div>
                    <button
                      onClick={handlePriceApply}
                      className="bg-primary text-on-primary px-6 py-2 font-label-sm hover:bg-neutral-800 transition-colors rounded-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {activeDropdown === "material" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Watch Materials
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "All Materials",
                      "Stainless Steel",
                      "Rose Gold",
                      "Leather",
                      "Titanium"
                    ].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => {
                          setActiveMaterial(mat);
                          setActiveDropdown(null);
                        }}
                        className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                          activeMaterial === mat
                            ? "bg-primary text-on-primary border-primary"
                            : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeDropdown === "movement" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Watch Movements
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {["All Movements", "Automatic", "Quartz", "Mechanical"].map(
                      (mov) => (
                        <button
                          key={mov}
                          onClick={() => {
                            setActiveMovement(mov);
                            setActiveDropdown(null);
                          }}
                          className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                            activeMovement === mov
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                          }`}
                        >
                          {mov}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeDropdown === "color" && (
                <div className="flex flex-col gap-3">
                  <span className="font-label-sm text-on-surface-variant mb-2 block">
                    Dial Colors
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {["All Colors", "Black", "Silver", "Gold", "Blue", "White"].map(
                      (col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setActiveColor(col);
                            setActiveDropdown(null);
                          }}
                          className={`px-4 py-2 border font-label-sm rounded-full transition-colors ${
                            activeColor === col
                              ? "bg-primary text-on-primary border-primary"
                              : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                          }`}
                        >
                          {col}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <main className="listing-container max-w-max-width mx-auto px-margin-desktop flex-1 w-full pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            <p className="font-label-sm tracking-widest text-on-surface-variant">
              LOADING CURATION...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="font-headline-md text-error mb-4">{error}</p>
            <button
              onClick={handleClearFilters}
              className="bg-primary text-on-primary px-8 py-3 font-label-sm uppercase tracking-widest"
            >
              Reset Collection
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-headline-md text-on-surface-variant mb-4">
              No Pieces match your current selection.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-primary text-on-primary px-8 py-3 font-label-sm uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* PRODUCT GRID */}
            <div className="product-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
              {(() => {
                const gridItems = [];
                paginatedProducts.forEach((product, index) => {
                  // Inject editorial moment card after card 2 (index 2)
                  if (index === 2) {
                    gridItems.push(
                      <div
                        key="editorial-moment-card"
                        className="relative overflow-hidden rounded-lg group md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto h-full min-h-[350px]"
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                        <img
                          src={editorialData.image}
                          alt="Luxe Editorial Lifestyle"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
                        />
                        <div className="bottom-left-text-block absolute bottom-12 left-12 z-20 max-w-md pr-8">
                          <p className="font-display text-white italic mb-4 text-[26px] md:text-[32px] leading-snug">
                            {editorialData.quote}
                          </p>
                          <p className="font-label-sm text-white uppercase tracking-[0.3em]">
                            {editorialData.caption}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Render standard product card
                  const imgSrc = Array.isArray(product.images)
                    ? product.images[0]
                    : product.images;

                  gridItems.push(
                    <div
                      key={product._id}
                      className="product-card group relative cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.transition =
                          "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0px)";
                      }}
                    >
                      {/* Image wrapper */}
                      <div className="relative aspect-square overflow-hidden bg-surface-container-low mb-6 rounded-lg">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product);
                          }}
                          className="wishlist-hover-btn absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-20"
                        >
                          <span
                            className="material-symbols-outlined text-primary"
                            style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                          >
                            favorite
                          </span>
                        </button>

                        {/* Quick Add Overlay */}
                        <div className="quick-add-overlay absolute bottom-0 left-0 right-0 p-4 opacity-0 transform translate-y-4 transition-all duration-300 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="w-full bg-black text-white border border-black py-3 font-label-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 z-20"
                          >
                            Quick Add
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1 block">
                          {product.brand || "Luxe"}
                        </span>
                        <h3 className="font-body-md font-medium text-primary mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="font-body-md font-bold text-primary block">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  );
                });

                // Fallback: If total count is small and didn't trigger editorial moment card, append it
                if (paginatedProducts.length <= 2) {
                  gridItems.push(
                    <div
                      key="editorial-moment-card-fallback"
                      className="relative overflow-hidden rounded-lg group md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto h-full min-h-[350px]"
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                      <img
                        src={editorialData.image}
                        alt="Luxe Editorial Lifestyle"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
                      />
                      <div className="bottom-left-text-block absolute bottom-12 left-12 z-20 max-w-md pr-8">
                        <p className="font-display text-white italic mb-4 text-[26px] md:text-[32px] leading-snug">
                          {editorialData.quote}
                        </p>
                        <p className="font-label-sm text-white uppercase tracking-[0.3em]">
                          {editorialData.caption}
                        </p>
                      </div>
                    </div>
                  );
                }

                return gridItems;
              })()}
            </div>

            {/* PAGINATION SECTION */}
            <div className="mt-24 flex flex-col items-center">
              {/* Load More Button */}
              {startIndex + itemsToRender < filteredProducts.length && (
                <button
                  onClick={handleLoadMore}
                  className="px-12 py-4 border border-primary font-label-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all duration-300 mb-8"
                >
                  Load More
                </button>
              )}

              {/* Page Number Navigation */}
              <div className="flex items-center space-x-6">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <span
                      key={pNum}
                      onClick={() => handlePageClick(pNum)}
                      className={`font-label-sm cursor-pointer transition-colors ${
                        currentPage === pNum
                          ? "text-primary underline underline-offset-4 font-bold"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {pNum}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer1 />
    </div>
  );
};

export default Listing1;
