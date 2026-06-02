import React from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Footer1 = ({ showPaymentIcons = false }) => {
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success("Joined Luxe Editorial list successfully!");
  };

  return (
    <footer
      className="editorial-footer text-on-primary pt-32 pb-12"
      style={{ backgroundColor: "#000000", color: "#ffffff", padding: "120px 48px 48px" }}
    >
      <div className="container-fluid" style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <div className="row mb-5 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Logo and description */}
          <div className="col-lg-5 mb-5 mb-lg-0">
            <Link
              className="footer-logo"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "48px",
                fontWeight: "800",
                letterSpacing: "-0.05em",
                textTransform: "uppercase",
                color: "#ffffff",
                textDecoration: "none",
                display: "block",
                marginBottom: "24px",
              }}
              to="/"
            >
              LUXE
            </Link>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                maxWidth: "380px",
                opacity: 0.6,
                lineHeight: "1.7",
                marginBottom: "32px",
                color: "#ffffff",
              }}
            >
              Elevating the everyday through curated perspectives and architectural fashion.
            </p>
            <div className="d-flex gap-4">
              <a
                className="icon-hover-trigger"
                style={{ color: "#ffffff", opacity: 0.5, transition: "opacity 0.3s" }}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#ffffff" }}>
                  public
                </span>
              </a>
              <a
                className="icon-hover-trigger"
                style={{ color: "#ffffff", opacity: 0.5, transition: "opacity 0.3s" }}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#ffffff" }}>
                  photo_camera
                </span>
              </a>
              <a
                className="icon-hover-trigger"
                style={{ color: "#ffffff", opacity: 0.5, transition: "opacity 0.3s" }}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#ffffff" }}>
                  play_arrow
                </span>
              </a>
            </div>
          </div>

          {/* Inspiration Links */}
          <div className="col-6 col-lg-2 offset-lg-1 mb-4 mb-lg-0 d-flex flex-column gap-3">
            <h4
              className="footer-heading"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Inspiration
            </h4>
            <a
              className="footer-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              The Journal
            </a>
            <a
              className="footer-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Archives
            </a>
            <a
              className="footer-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Process
            </a>
          </div>

          {/* Assistance Links */}
          <div className="col-6 col-lg-2 mb-4 mb-lg-0 d-flex flex-column gap-3">
            <h4
              className="footer-heading"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Assistance
            </h4>
            <a
              className="footer-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Shipping
            </a>
            <a
              className="footer-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Contact
            </a>
            <a
              className="footer-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                textDecoration: "none",
                transition: "color 0.3s",
              }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Returns
            </a>
          </div>

          {/* Newsletter */}
          <div className="col-lg-2">
            <h4
              className="footer-heading"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: "20px",
              }}
            >
              Newsletter
            </h4>
            <form onSubmit={handleNewsletterSubmit} className="position-relative" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)", paddingBottom: "8px" }}>
              <input
                className="w-100 bg-transparent border-0 py-2 outline-none text-white font-body-md"
                placeholder="Enter your email"
                type="email"
                required
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#ffffff",
                  width: "100%",
                  fontSize: "14px",
                }}
              />
              <button
                type="submit"
                className="position-absolute end-0 bottom-0 bg-transparent border-0 font-label-sm uppercase tracking-widest text-white"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
          <span
            className="font-label-sm"
            style={{ opacity: 0.4, fontSize: "11px", letterSpacing: "0.1em", color: "#ffffff" }}
          >
            © 2024 LUXE EDITORIAL. ALL RIGHTS RESERVED.
          </span>
          {showPaymentIcons ? (
            <div className="d-flex gap-4 align-items-center" style={{ opacity: 0.4 }}>
              <span className="material-symbols-outlined !text-[20px] text-white">payments</span>
              <span className="material-symbols-outlined !text-[20px] text-white">credit_card</span>
              <span className="material-symbols-outlined !text-[20px] text-white">
                account_balance_wallet
              </span>
            </div>
          ) : (
            <div className="d-flex gap-4 align-items-center" style={{ opacity: 0.4 }}>
              <span
                className="font-label-sm"
                style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", color: "#ffffff" }}
                onClick={() => navigate("/")}
              >
                PRIVACY
              </span>
              <span
                className="font-label-sm"
                style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", color: "#ffffff" }}
                onClick={() => navigate("/")}
              >
                TERMS
              </span>
              <span
                className="font-label-sm"
                style={{ fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", color: "#ffffff" }}
                onClick={() => navigate("/")}
              >
                COOKIES
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
