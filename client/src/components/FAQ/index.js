import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqData = [
    {
      id: 1,
      question: "What is your return policy?",
      answer: "We offer a 14-day hassle-free return policy on all unworn, tag-attached fashion items and accessories. Groceries and beauty items are excluded from returns for hygiene reasons."
    },
    {
      id: 2,
      question: "Is Cash on Delivery available?",
      answer: "Yes, we support Cash on Delivery (COD) for most pin codes across India for order amounts up to ₹10,000. You can select it as your payment method during checkout."
    },
    {
      id: 3,
      question: "How can I track my order?",
      answer: "Once dispatched, a tracking link from our premium courier partner will be sent via email and SMS. You can also view active order tracking under the 'Order' page in your account."
    },
    {
      id: 4,
      question: "Do you ship internationally?",
      answer: "Currently, LUXE ships exclusively within India. We are working on expanding our delivery network to support international orders in the near future."
    },
    {
      id: 5,
      question: "How do I guarantee authenticity?",
      answer: "All luxury watches, designer clothing, and premium goods are sourced directly from verified brand ateliers and authorized distributors, arriving with full certificates of authenticity."
    },
    {
      id: 6,
      question: "What is the standard delivery time?",
      answer: "Metro city deliveries usually take 2 to 4 business days. Regional and remote shipments may require 5 to 7 business days to reach your address."
    },
    {
      id: 7,
      question: "Can I get a GST invoice?",
      answer: "Yes, you can register corporate orders. Simply provide your company's GSTIN and billing address at the checkout page to receive a tax-compliant invoice."
    },
    {
      id: 8,
      question: "How do I use a promo code?",
      answer: "Apply your code in the promo input field within the order summary box on the checkout page. The system will recalculate and apply the discount instantly."
    }
  ];

  const [activeId, setActiveId] = useState(null);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="faq-section animate-on-scroll">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">QUESTIONS, ANSWERED</h2>
          <p className="faq-subtitle">Everything you need to know before you shop.</p>
        </div>

        <div className="faq-list">
          {faqData.map((item) => {
            const isOpen = activeId === item.id;
            return (
              <div 
                key={item.id} 
                className={`faq-card-item ${isOpen ? 'active' : ''}`}
                onClick={() => toggleFAQ(item.id)}
              >
                <div className="faq-question-row">
                  <span className="faq-question">{item.question}</span>
                  <svg 
                    className={`faq-chevron ${isOpen ? 'open' : ''}`} 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div className="faq-answer-container">
                  <p className="faq-answer">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
