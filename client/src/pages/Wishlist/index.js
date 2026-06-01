import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { RxCross2 } from "react-icons/rx";
import { FaRegHeart } from "react-icons/fa";
import { PiShoppingCartThin } from "react-icons/pi";
import { Mycontext } from "../../App";
import { deletedata, fetchDataFromAPI } from "../../utils/api";

const STORAGE_KEY = "wishlist";


const readWishlist = () => {
  // graphucs

  // 
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeWishlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const Wishlist = () => {
  const navigate = useNavigate();
  const context = useContext(Mycontext);
  const [items, setItems] = useState([])
  const [listdata, setlistdata] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    fetchDataFromAPI(`/api/Whishlist?userId=${user?.userid}`).then((res) => {
      setItems(res?.MyList || []);
      console.log(res);
    })
  }, [])
  // grphics
  useEffect(() => {
    const canvas = document.getElementById('geoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const shapes = [];
    const count = 18;

    const palette = [
      'rgba(35,58,149,',   // blue
      'rgba(255,63,108,',  // pink
      'rgba(99,179,237,',  // sky
      'rgba(80,200,150,',  // teal
    ];

    for (let i = 0; i < count; i++) {
      shapes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 80,
        type: Math.floor(Math.random() * 3), // 0=triangle, 1=hexagon, 2=square
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.04 + Math.random() * 0.08,
        filled: Math.random() > 0.5,
      });
    }

    const drawPolygon = (ctx, cx, cy, r, sides, rotation) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = rotation + (i * 2 * Math.PI) / sides;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;

        // wrap around edges
        if (s.x < -s.size) s.x = canvas.width + s.size;
        if (s.x > canvas.width + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = canvas.height + s.size;
        if (s.y > canvas.height + s.size) s.y = -s.size;

        const sides = s.type === 0 ? 3 : s.type === 1 ? 6 : 4;
        drawPolygon(ctx, s.x, s.y, s.size, sides, s.rotation);

        if (s.filled) {
          ctx.fillStyle = `${s.color}${s.alpha})`;
          ctx.fill();
        } else {
          ctx.strokeStyle = `${s.color}${s.alpha + 0.05})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  // 




  const wishlistCount = items.length;

  const removeFromWishlist = (id) => {
    deletedata(`/api/Whishlist/${id}`).then(() => {
      setItems(prev => prev.filter(item => item._id !== id));
    })

  };

  const addToCartFromWishlist = (item) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.userid) {
      window.alert("Please login first to add items to cart!");
      return;
    }

    const productId = item?._id || item?.productId || item?.id;
    const cartfield = {
      title: item?.name || item?.title || "Wishlist item",
      image: Array.isArray(item?.images) ? item?.images?.[0] : item?.images,
      rating: item?.rating || 0,
      price: item?.price || 0,
      quantity: 1,
      subtotal: (item?.price || 0) * 1,
      productId,
      userId: user?.userid,
    };

    context.addtocart(cartfield);
  };

  const emptyState = useMemo(() => {
    return (
      <div className="wishlist-empty">
        <div className="wishlist-empty-illustration" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="120" height="120">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#233a95" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ff3f6c" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="78" fill="url(#g1)" opacity="0.12" />
            <path
              d="M100 150s-38-22-60-47C21 79 31 49 60 45c14-2 27 4 34 15 7-11 20-17 34-15 29 4 39 34 20 58-22 25-60 47-60 47z"
              fill="url(#g1)"
            />
            <circle cx="140" cy="62" r="6" fill="#ff3f6c" opacity="0.25" />
            <circle cx="68" cy="70" r="5" fill="#233a95" opacity="0.25" />
          </svg>
        </div>
        <h2 className="wishlist-empty-title">Your wishlist is empty</h2>
        <p className="wishlist-empty-text">Save products you love. They’ll show up here for quick access.</p>
        <Link to="/cat">
          <Button className="btn-blue btn-round btn-lg wishlist-empty-cta">Browse products</Button>
        </Link>
      </div>
    );
  }, []);

  return (
    <section className="wishlist-page mt-4 mb-5">
      {/* orbs */}
      <div className="geo-bg" aria-hidden="true">
        <canvas id="geoCanvas"></canvas>
      </div>

      {/* orbs */}
      <div className="container productDetailsContainer">
        <div className="wishlist-header">
          <div className="wishlist-header-left">
            <span className="wishlist-header-icon" aria-hidden="true">
              <FaRegHeart />
            </span>
            <h1 className="wishlist-title">Wishlist</h1>
            <span className="wishlist-count">{wishlistCount}</span>
          </div>

          <div className="wishlist-header-right">
            <Link to="/cat">
              <Button className="btn-blue btn-round">Continue shopping</Button>
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          emptyState
        ) : (
          <div className="wishlist-grid">
            {items.map((item) => {

              const firstImage = item?.image || (Array.isArray(item?.images) ? item?.images[0] : item?.images);
              const productId = item?._id || item?.productId || item?.id;

              const hasDiscount = (item?.discount || 0) > 0;
              const oldPrice = (item?.price || 0) + (item?.discount || 0);
              const name = item?.name || item?.title || "Product";

              return (
                <div
                  key={productId}
                  className="productitem-myntra wishlist-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/product/${productId}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(`/product/${productId}`);
                  }}
                >
                  <div className="imgwrap">
                    {hasDiscount && (
                      <span className="badge badge-primary">
                        {Math.round((item.discount / (item.discount + item.price)) * 100)}%
                      </span>
                    )}
                    {firstImage ? (
                      <img className="slideimg" src={firstImage} alt={name} loading="lazy" />
                    ) : (
                      <div className="wishlist-image-fallback" />
                    )}
                  </div>

                  <div className="info">
                    <h4>{name.substring(0, 22) + (name.length > 22 ? "..." : "")}</h4>
                    <span className="text-success d-block">
                      {item?.countInstock > 0 ? "In Stock" : "Out of Stock"}
                    </span>

                    <Rating className="mt-2" value={item?.rating || 0} precision={0.5} readOnly />

                    <div className="d-flex">
                      {hasDiscount && <span className="oldprice">₹{oldPrice}</span>}
                      <span className="newprice text-danger ml-3">₹{item?.price || 0}</span>
                    </div>

                    <div className="action" onClick={(e) => e.stopPropagation()}>
                      <Button
                        aria-label="Remove from wishlist"
                        onClick={() => removeFromWishlist(productId)}
                      >
                        <RxCross2 />
                      </Button>
                      <Button
                        aria-label="Add to cart"
                        onClick={() => addToCartFromWishlist(item)}
                      >
                        <PiShoppingCartThin />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;

