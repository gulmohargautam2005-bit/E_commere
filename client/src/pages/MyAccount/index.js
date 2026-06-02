import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mycontext } from '../../App';
import Header1 from '../../components/Header1';
import Footer1 from '../../components/Footer1';

const MyAccount = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);



  // Form profile states (Alexandra Vance)
  const [formData, setFormData] = useState({
    fullName: 'Alexandra Vance',
    email: 'alexandra.vance@reserve.luxe.com',
    phone: '+1 (555) 012-3456'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Luxury profile successfully updated.");
  };

  // Dynamically load Tailwind CDN & Scoped configuration
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
                background: "#fbf9f8",
                "on-surface": "#1b1c1c",
                "on-surface-variant": "#444748",
                primary: "#000000",
                "on-primary": "#ffffff",
                outline: "#747878",
                "outline-variant": "#c4c7c7",
                "surface-container": "#efeded",
                "surface-container-low": "#f5f3f3",
                "surface-container-high": "#eae8e7"
              },
              spacing: {
                gutter: "24px",
                "margin-desktop": "64px",
                "max-width": "1440px"
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





  return (
    <div className="luxe-body min-h-screen flex flex-col font-body selection:bg-black selection:text-white">

      <Header1 />

      {/* 2. Account Main Content Area */}
      <main className="account-main">
        {/* Account Hero Header */}
        <header className="account-hero">
          <h1>My Account</h1>
          <p>Manage your luxury profile, shipping addresses, secure payments, and reserve memberships.</p>
        </header>

        {/* Account Split Grid Layout */}
        <div className="account-grid">

          {/* Profile Details Panel (Left Column) */}
          <section className="profile-panel">
            <div className="profile-avatar-wrap">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdBp390nhO9NUxYUJcY8EMly_MIapsZH63OecXKDpnq32GLm7aqgOcnOdhUy0Dse9biNDOLHAwyTakYcr85RTbgAlbJw5TiSt72aQmYeFZeu3_CIKgPKdL7ptcOEXT735nOYReLLh7yrneHx1TNj9BhHkaxxXAbScw3QPSF0KZCbSPA2UVlCZlN2NIT3HtR0lkAJj-5P7g5mLLDuvwnsYD3OGhpfN4UVK9XRWuE8z9bnBOOiMStqgiEzqi7aDmBvkfjGr7P7tSPs0"
                alt="Alexandra Vance"
                className="profile-avatar-img"
              />
              <div className="avatar-overlay">
                <span className="material-symbols-outlined">photo_camera</span>
              </div>
            </div>

            <h2 className="profile-name">{formData.fullName}</h2>
            <div className="profile-badge">PLATINUM MEMBER</div>

            {/* Profile Form fields */}
            <form className="profile-form" onSubmit={handleSaveProfile}>
              <div className="form-field">
                <label>Full NameLabel</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                SAVE PROFILE DETAILS
              </button>
            </form>
          </section>

          {/* Cards Portfolio Grid Layout (Right Column) */}
          <section className="cards-grid">

            {/* Card 1: Addresses */}
            <div className="account-card" onClick={() => alert("Redirecting to Addresses...")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">location_on</span>
                <span className="card-badge">DEFAULT</span>
              </div>
              <div>
                <h3 className="card-title">Addresses</h3>
                <p className="card-body">
                  724 Madison Avenue<br />
                  New York, NY 10065<br />
                  United States
                </p>
              </div>
              <span className="card-link">EDIT ADDRESSES</span>
            </div>

            {/* Card 2: Orders */}
            <div className="account-card" onClick={() => navigate("/order")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">inventory_2</span>
                <span className="card-badge">IN TRANSIT</span>
              </div>
              <div>
                <h3 className="card-title">Your Orders</h3>
                <p className="card-body">
                  Order #LX-99021<br />
                  Arriving by Friday, May 24
                </p>
              </div>
              <span className="card-link">TRACK ORDER</span>
            </div>

            {/* Card 3: Payment Options */}
            <div className="account-card" onClick={() => alert("Redirecting to Payments...")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">credit_card</span>
              </div>
              <div>
                <h3 className="card-title">Payment Options</h3>
                <p className="card-body">
                  Visa ending in 4492<br />
                  Expires 08/26
                </p>
              </div>
              <span className="card-link">MANAGE CARDS</span>
            </div>

            {/* Card 4: Subscription */}
            <div className="account-card account-card--dark" onClick={() => alert("Redirecting to Membership...")}>
              <div className="card-header-row">
                <span className="material-symbols-outlined card-icon">verified</span>
              </div>
              <div>
                <h3 className="card-title">Subscription</h3>
                <p className="card-body">
                  Luxe Reserve Member<br />
                  Auto-renews Aug 2024
                </p>
              </div>
              <span className="card-link">MEMBERSHIP SETTINGS</span>
            </div>

            {/* Card 5: Wide Card Concierge */}
            <div className="account-card account-card--wide" onClick={() => alert("Contacting support...")}>
              <div className="card-image-wrap">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnQ1L4uJ11QNeBzvtvm4A6tLmJRjYwVfQ_FjupeKg4IJGAGPrFTJEWgIe05eY4y-pxz-iIlBBEcKzyhQ0T_kbUmZjOnfPtg7aRzSs7qlZXZRMKIsNEclnV7xR8RG_vZeU6csIbNhqiF5GXKevQWCPimmBtVCj5k9SMdQRcoVZqxPHcFODlCRk0QN4XizRKGlBHnp909_uFw6S3URppVmuehPJHJQLXM6YDvJcaz51SmE3poXQ-0cjPUSD93Bt4hvUCj87Iu7vsoPo"
                  alt="Concierge Service"
                />
              </div>
              <div className="card-text-content">
                <div className="card-header-row mb-4">
                  <span className="material-symbols-outlined card-icon">support_agent</span>
                </div>
                <div>
                  <h3 className="card-title" style={{ marginTop: 0 }}>Concierge Service</h3>
                  <p className="card-body" style={{ marginBottom: "24px" }}>
                    Our dedicated team is available 24/7 to assist with private viewings, style consultations, or order inquiries.
                  </p>
                </div>
                <span className="card-link">CONTACT SUPPORT</span>
              </div>
            </div>

          </section>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default MyAccount;
