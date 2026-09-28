import React from "react";

const ManifestoBanner = () => {
  return (
    <section className="manifesto-gradient-banner">
      <div className="manifesto-glow"></div>
      <div 
        style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          textAlign: "center", 
          position: "relative", 
          zIndex: 2 
        }} 
        className="animate-on-scroll"
      >
        <span 
          style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "11px", 
            letterSpacing: "0.3em", 
            color: "rgba(255,255,255,0.4)", 
            textTransform: "uppercase", 
            display: "block", 
            marginBottom: "20px" 
          }}
        >
          THE EDITORIAL ESSENCE
        </span>
        <h2 
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "48px", 
            fontWeight: "400", 
            color: "#ffffff", 
            letterSpacing: "-0.01em", 
            textTransform: "uppercase", 
            marginBottom: "24px",
            lineHeight: "1.2"
          }}
        >
          Crafted for the Uncompromising
        </h2>
        <p 
          style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "16px", 
            lineHeight: "1.8", 
            color: "rgba(255,255,255,0.6)", 
            maxWidth: "600px", 
            margin: "0 auto" 
          }}
        >
          A study in structural elegance. Redefining the intersection of architectural precision and luxury self-expression.
        </p>
      </div>
    </section>
  );
};

export default ManifestoBanner;
