import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchDataFromAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './HorizontalScroller.css';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroller = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchDataFromAPI('/api/products/')
      .then((res) => {
        const allProds = res.products || res || [];
        // Slice a few highly photogenic products (e.g. 5 items) for horizontal editorial view
        const displayProds = allProds.filter(p => 
          p.category?.name === "Fashion" || 
          p.category?.name === "Watches" || 
          p.category?.name === "Beauty"
        ).slice(3, 8); // Offset to get different items than staggered reveal

        setProducts(displayProds.length >= 5 ? displayProds : allProds.slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to load horizontal products:", err);
      });
  }, []);

  useLayoutEffect(() => {
    if (products.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    const containerWidth = sectionRef.current?.getBoundingClientRect().width || window.innerWidth;
    const scrollWidth = scrollContainer.scrollWidth - containerWidth;

    // Use gsap.context to manage DOM reverting on unmount
    const ctx = gsap.context(() => {
      // Horizontal Translate Timeline with ScrollTrigger pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollContainer.scrollWidth}`, // Scroll height matches content width
          pin: true,        // Pin the viewport section
          pinSpacing: true,
          scrub: 1,         // Connect transition directly to scroll position
          invalidateOnRefresh: true
        }
      });

      tl.to(scrollContainer, {
        x: -scrollWidth,
        ease: 'none'
      });
    }, sectionRef);

    // Refresh layout calculations to align markers
    ScrollTrigger.refresh();

    return () => {
      ctx.revert(); // Reverts the DOM entirely, removing all pin wrappers before unmount
    };
  }, [products]);

  return (
    <section ref={sectionRef} className="horizontal-scroller-section">
      <div className="horizontal-intro">
        <span className="scroller-label">TRENDING GALLERY</span>
        <h2 className="scroller-title">THE CURATED EDIT</h2>
        <p className="scroller-text">
          A visual exploration of luxury styling, fine timepieces, and statement pieces. Scroll to explore the details.
        </p>
      </div>

      <div ref={scrollContainerRef} className="horizontal-scroll-container">
        {products.map((item, idx) => {
          const imgSrc = Array.isArray(item.images) ? item.images[0] : item.images;
          return (
            <div 
              key={item._id} 
              className="horizontal-item"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <div className="horizontal-img-wrapper">
                <img src={imgSrc} alt={item.name} className="horizontal-img" />
                <div className="horizontal-overlay">
                  <span className="horizontal-item-number">0{idx + 1}</span>
                  <div className="horizontal-item-text">
                    <span className="horizontal-item-brand">{item.brand}</span>
                    <h3 className="horizontal-item-name">{item.name}</h3>
                    <span className="horizontal-item-price">₹{item.price}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HorizontalScroller;
