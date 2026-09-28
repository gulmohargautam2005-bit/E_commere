import React from 'react';
import './ReviewsTicker.css';

const reviewsRow1 = [
  { name: "Alexander V.", rating: 5, text: "The attention to detail on the Heritage Chronograph is stunning. Completely redefines my style.", date: "2 days ago" },
  { name: "Seraphina K.", rating: 5, text: "Exquisite fabric. The Satin evening slip dress fits like a glove and feels incredibly premium.", date: "1 week ago" },
  { name: "Marcus L.", rating: 4, text: "Superb laptop performance. NexusTech delivers cutting-edge specs in a beautifully slim chassis.", date: "3 days ago" },
  { name: "Clara M.", rating: 5, text: "Highly fresh produce! The fruits and vegetables came crisp and sweet. Will buy again.", date: "Yesterday" },
  { name: "Julian T.", rating: 5, text: "Minimalist Rose Gold watch is a horological masterpiece. It draws compliments everywhere I go.", date: "5 days ago" },
  { name: "Evelyn R.", rating: 4, text: "Excellent customer service. The organic cotton parka for my kid is soft, warm, and highly durable.", date: "2 weeks ago" }
];

const reviewsRow2 = [
  { name: "David H.", rating: 5, text: "The sourdough country loaf was warm and crusty on arrival. The best bread in town by far!", date: "Today" },
  { name: "Victoria P.", rating: 5, text: "Pure botanical ingredients that actually work. My skin feels deeply hydrated and glowing.", date: "4 days ago" },
  { name: "Nathan S.", rating: 4, text: "The audio quality is crystal clear. The ANC headphones block out all street noise perfectly.", date: "1 week ago" },
  { name: "Sophia W.", rating: 5, text: "Absolutely in love with the linen wrap dress. Breathable, elegant, and perfect for hot days.", date: "6 days ago" },
  { name: "Oliver B.", rating: 5, text: "Premium ribeye steaks. Juicy, tender, and ethically sourced. Luxe Groceries is unparalleled.", date: "3 days ago" },
  { name: "Emma G.", rating: 5, text: "Modern styling meets ultimate comfort. The velvet lounge armchair transformed my living space.", date: "1 month ago" }
];

const ReviewsTicker = () => {
  const row1 = [...reviewsRow1, ...reviewsRow1];
  const row2 = [...reviewsRow2, ...reviewsRow2];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <div className="reviews-ticker-container">
      <div className="reviews-ticker-header">
        <span className="ticker-label">TESTIMONIALS</span>
        <h2 className="ticker-title">WHAT OUR PATRONS SAY</h2>
      </div>

      {/* Row 1: Left to Right */}
      <div className="ticker-wrap left-to-right">
        <div className="ticker-row animate-ltr">
          {row1.map((rev, idx) => (
            <div key={idx} className="review-card">
              <div className="review-stars">{renderStars(rev.rating)}</div>
              <p className="review-text">"{rev.text}"</p>
              <div className="review-footer">
                <span className="review-name">{rev.name}</span>
                <span className="review-date">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right to Left */}
      <div className="ticker-wrap right-to-left">
        <div className="ticker-row animate-rtl">
          {row2.map((rev, idx) => (
            <div key={idx} className="review-card">
              <div className="review-stars">{renderStars(rev.rating)}</div>
              <p className="review-text">"{rev.text}"</p>
              <div className="review-footer">
                <span className="review-name">{rev.name}</span>
                <span className="review-date">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTicker;
