import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchDataFromAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import './StaggeredReveal.css';

gsap.registerPlugin(ScrollTrigger);

const StaggeredReveal = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch products and select 4 luxury products
    fetchDataFromAPI('/api/products/')
      .then((res) => {
        const allProds = res.products || res || [];
        // Filter out grocery items if possible, or just take first 4 premium-looking items
        const luxuryProds = allProds.filter(p => 
          p.category?.name === "Fashion" || 
          p.category?.name === "Watches" || 
          p.category?.name === "Electronics"
        ).slice(0, 4);

        // Fallback if no luxury products match
        setProducts(luxuryProds.length >= 4 ? luxuryProds : allProds.slice(0, 4));
      })
      .catch((err) => {
        console.error("Failed to load staggered products:", err);
      });
  }, []);

  useLayoutEffect(() => {
    if (products.length === 0) return;

    const cards = containerRef.current.querySelectorAll('.reveal-card');
    
    // Use gsap.context to manage DOM reverting on unmount
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(cards, { y: 100, opacity: 0, scale: 0.9 });

      // GSAP ScrollTrigger Pinned animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1500', // Scroll length to pin
          pin: true,     // Pin the section
          pinSpacing: true,
          scrub: 1,      // Link to scrollbar position
          invalidateOnRefresh: true
        }
      });

      // Staggered animation
      tl.to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.5, // 0.5s stagger between card appearances
        ease: 'power2.out',
        duration: 1.5
      });
    }, sectionRef);

    // Refresh layout calculations to align markers
    ScrollTrigger.refresh();

    return () => {
      ctx.revert(); // Reverts the DOM entirely, removing all pin wrappers before unmount
    };
  }, [products]);

  return (
    <section ref={sectionRef} className="staggered-reveal-section">
      <div className="reveal-header">
        <span className="reveal-subtitle">NEW ARRIVALS</span>
        <h2 className="reveal-title">THE NOVELTIES</h2>
      </div>

      <div ref={containerRef} className="reveal-container">
        {products.map((item) => {
          const imgSrc = Array.isArray(item.images) ? item.images[0] : item.images;
          return (
            <div 
              key={item._id} 
              className="reveal-card"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <div className="reveal-image-wrapper">
                <img src={imgSrc} alt={item.name} className="reveal-image" />
                <div className="reveal-card-badge">NEW</div>
              </div>
              <div className="reveal-card-info">
                <span className="reveal-card-brand">{item.brand || "Luxe"}</span>
                <h4 className="reveal-card-name">{item.name}</h4>
                <span className="reveal-card-price">₹{item.price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StaggeredReveal;
