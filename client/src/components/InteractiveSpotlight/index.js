import React from "react";
import { useNavigate } from "react-router-dom";

const InteractiveSpotlight = () => {
  const navigate = useNavigate();

  return (
    <section className="spotlight-outer-wrap">
      <div className="spotlight-glass-card animate-on-scroll">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <span 
            style={{ 
              fontFamily: "var(--font-body)", 
              fontSize: "11px", 
              letterSpacing: "0.2em", 
              color: "var(--on-surface-variant)", 
              textTransform: "uppercase", 
              display: "block", 
              marginBottom: "16px" 
            }}
          >
            LIMITED EDITION SPOTLIGHT
          </span>
          <h2 
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "40px", 
              fontWeight: "600", 
              textTransform: "uppercase", 
              color: "var(--primary)", 
              marginBottom: "20px",
              lineHeight: "1.2"
            }}
          >
            The Art of Horology
          </h2>
          <p 
            style={{ 
              fontFamily: "var(--font-body)", 
              fontSize: "15px", 
              lineHeight: "1.7", 
              color: "var(--on-surface-variant)", 
              marginBottom: "32px",
              maxWidth: "480px"
            }}
          >
            Where timekeeping meets fine art. Discover our limited-run collections, hand-assembled to stand the test of generations.
          </p>
          <button 
            className="vll_butn" 
            onClick={() => navigate("/cat")}
            style={{ border: "none", outline: "none" }}
          >
            View Collection
          </button>
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div 
            style={{ 
              width: "100%", 
              maxWidth: "380px", 
              overflow: "hidden", 
              borderRadius: "12px", 
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.08)",
              background: "#fafaf8" 
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" 
              alt="Spotlight Product" 
              className="spring-hover"
              style={{ 
                width: "100%", 
                height: "auto", 
                display: "block",
                objectFit: "cover", 
                filter: "grayscale(10%)",
                transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSpotlight;
