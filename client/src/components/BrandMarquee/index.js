import React from 'react';
import './BrandMarquee.css';

const brands = [
  "Nike", "Adidas", "Gucci", "Prada", "Rolex", "Burberry", 
  "Dior", "Zara", "H&M", "Calvin Klein", "Cartier", "Omega"
];

const BrandMarquee = () => {
  // Double the brands array for seamless loop
  const list = [...brands, ...brands];

  return (
    <div className="brand-marquee-container">
      <div className="brand-marquee-title">CURATED BRAND PARTNERS</div>
      <div className="brand-marquee-track">
        {list.map((brand, idx) => (
          <div key={idx} className="brand-logo-pill">
            {brand.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
