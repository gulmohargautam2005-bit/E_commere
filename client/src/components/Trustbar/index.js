import React from "react";

const Trustbar = () => {
  return (
    <div style={{
      borderTop: "1px solid var(--outline-variant)",
      borderBottom: "1px solid var(--outline-variant)",
      backgroundColor: "var(--surface)",
      padding: "16px 48px",
    }}>
      <div style={{
        maxWidth: "1320px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0",
        flexWrap: "wrap",
      }}>
        {[
          { icon: "local_shipping", text: "Free Shipping on orders above ₹2,999" },
          { icon: "autorenew", text: "Easy 30-Day Returns" },
          { icon: "verified", text: "100% Authenticity Guaranteed" },
          { icon: "headset_mic", text: "Concierge Support 24/7" },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0 40px",
            borderRight: i < arr.length - 1 ? "1px solid var(--outline-variant)" : "none",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--primary)" }}>
              {item.icon}
            </span>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--on-surface-variant)",
              whiteSpace: "nowrap",
            }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trustbar;