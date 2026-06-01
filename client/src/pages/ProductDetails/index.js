import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineCompareArrows } from "react-icons/md";
import Productzoom from "../../components/Productzoom";
import Quantity from "../../components/Quantity";
import Productmodal from "../../components/Productmodal";
import { fetchDataFromAPI } from "../../utils/api";
import Relatedproduct from "../Relatedproduct";
import { Mycontext } from "../../App";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { postDataToAPI } from "../../utils/api";



const ProductDetails = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // sound effect
  const playBeep = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 800;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.3
    );
  };
  // 
  const playSuccessSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";

    // success tone
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      900,
      audioCtx.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.3
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  };

  const [khula, setkhula] = useState(false);
  const [testimonials, settestimonials] = useState([]);

  const context = useContext(Mycontext);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [formfield, setformfield] = useState({
    ProductId: "",
    CustomerRating: 0,
    Review: "",
    CustomerName: "",
    CustomerId: "",

  })
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState("description");
  const [productdata, setproductData] = useState({});
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [relateddata, setrelateddata] = useState([]);
  const [productquantity, setproductquantity] = useState(1);
  const [cartfield, setcartfield] = useState({})
  const [listfield, setlistfield] = useState({});
  const onchangeinput = (e) => {
    setformfield({ ...formfield, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.userid) {
      setError("Please login first to add a review!");
      setOpen(true);  // opens error snackbar
      playBeep();
      return;
    }

    const payload = {
      ...formfield,
      CustomerId: user.userid,
      ProductId: id,        // ← id is guaranteed to be current here
    };
    console.log(formfield)
    postDataToAPI("/api/review/add", payload).then((res) => {
      setError("Review added successfully");
      setkhula(true);
      playSuccessSound();
      setformfield({
        ProductId: "",
        CustomerRating: 0,
        Review: "",
        CustomerName: "",
        CustomerId: "",

      })
    }).then(() => {
      fetchDataFromAPI(`/api/review/?ProductId=${id}`).then((res) => {
        settestimonials(res)
      })
    })
  }
  useEffect(() => {
    fetchDataFromAPI(`/api/review/?ProductId=${id}`).then((res) => {
      settestimonials(res)
    })
  }, [id])





  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromAPI(`/api/products/${id}`).then((res) => {
      setproductData(res);
      fetchDataFromAPI(`/api/products/subCat/${res.subcategory}`).then((resp) => {
        const filterdata = resp?.products?.filter(item => item.id !== id)
        setrelateddata(filterdata)

      })
    })
  }, [id])
  const quantity = (val) => {
    setproductquantity(val)
  }
  const addtocart = (data) => {


    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.userid) {
      setError("Please login first to add items to cart!");
      setOpen(true);
      playBeep();
      return; // ← stop here, don't add to cart
    }
    console.log("user from storage:", user);
    console.log(data)

    cartfield.title = data?.name
    cartfield.image = data?.images[0]
    cartfield.rating = data?.rating
    cartfield.price = data?.price
    cartfield.quantity = productquantity
    cartfield.subtotal = parseInt(productquantity * data?.price)
    cartfield.productId = data?._id
    cartfield.userId = user?.userid

    context.addtocart(cartfield)

  }

  const addToWishlist = (data) => {


    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.userid) {
      setError("Please login first to add items to cart!");
      setOpen(true);
      playBeep();
      return; // ← stop here, don't add to cart
    }
    console.log("user from storage:", user);
    console.log(data)

    listfield.title = data?.name
    listfield.image = data?.images[0]
    listfield.rating = data?.rating
    listfield.price = data?.price

    listfield.productId = data?._id
    listfield.userId = user?.userid

    context.addToWishlist(listfield)



    setError("Added to wishlist");
    setkhula(true);
    playSuccessSound();
  };

  // Static for now (can be replaced with API fetch by id later)
  const product = useMemo(
    () => ({
      _id: id || "static-product",
      name: "All Natural Italian-Style Chicken Meatballs",
      brand: "Welch's",
      sku: "ZU49VOR",
      rating: 4.5,
      reviewCount: 1,
      price: 363,
      oldPrice: 395,
      inStock: true,
      shortDesc:
        "Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent.",
      images: [
        "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-50.jpg",
        "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-51.jpg",
        "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-52.jpg",
      ],
      description: [
        "Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin vitae magna in dui finibus malesuada et at nulla. Morbi elit ex, viverra vitae ante vel, blandit feugiat ligula.",
        "Fusce elementum iaculis nibh, at sodales leo maximus a. Nullam ultrices sodales nunc, in pellentesque lorem mattis quis.",
        "Cras imperdiet est in nunc tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt. Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.",
      ],
    }),
    [id]
  );

  const offers = useMemo(
    () => [
      {

        lines: [
          "Applicable on: Orders above Rs. 349 (only on first purchase)",
          "Coupon code: MBBSAVE",
          "Coupon Discount: 30% off upto Rs. 250 (check cart for final savings)",
        ],
        cta: "View Eligible Products",
      },
      {
        title: "10% Instant Discount on ICICI Bank Credit Card",
        lines: ["Min Spend ₹3,500, Max Discount ₹500"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on ICICI Bank Credit Card EMI",
        lines: ["Min Spend ₹3,500, Max Discount ₹1,000"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on ICICI Bank Netbanking",
        lines: ["Min Spend ₹3,500, Max Discount ₹500"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on RBL Bank Credit Card",
        lines: ["Min Spend ₹3,500, Max Discount ₹500"],
        cta: "Terms & Condition",
      },
      {
        title: "10% Instant Discount on RBL Bank Credit Card EMI",
        lines: ["Min Spend ₹3,500, Max Discount ₹1,000"],
        cta: "Terms & Condition",
      },
    ],
    []
  );

  return (
    <section className="productDetailsPage">
      <div className="container productDetailsContainer">
        <div className="pd-breadcrumb">
          <span>Home</span>
          <span className="sep">/</span>
          <span>Meats & Seafood</span>
          <span className="sep">/</span>
          <span className="current">{productdata?.name}</span>
        </div>

        <div className="pd-header">
          <h1 className="pd-title">{productdata?.brand}</h1>

          <div className="pd-meta">
            <div className="pd-meta-item">
              <span className="label">Brands:</span>
              <span className="value">{productdata?.brand}</span>
            </div>
            <div className="pd-meta-item">
              <Rating value={productdata?.rating || 0} precision={0.5} readOnly />
              <span className="pd-reviews">{product.reviewCount} Review</span>
            </div>
            <div className="pd-meta-item">
              <span className="label">SKU:</span>
              <span className="value">{product.sku}</span>
            </div>
          </div>
        </div>

        <div className="row pd-main">
          <div className="col-md-4">
            <div className="pd-main">

              <Productzoom images={productdata?.images || []} zoomDisabled={true} />
            </div>
          </div>

          <div className="col-md-5">
            <div className="pd-info">
              <div className="pd-price">
                <span className="oldprice">₹{productdata?.price + productdata?.discount}</span>
                <span className="newprice text-danger ml-3">₹{productdata?.price}</span>
              </div>
              {productdata?.countInstock > 0 ? (
                <span className="bg-success badge pd-stock">IN STOCK</span>
              ) : (
                <span className="badge badge-secondary pd-stock">OUT OF STOCK</span>
              )}

              <p className="pd-shortdesc">{productdata?.description}</p>

              <div className="pd-actions">
                <Quantity quantity={quantity} />
                <Button className="btn-blue btn-lg btn-big btn-round ml-4" onClick={() => addtocart(productdata)}>
                  Add to cart
                </Button>
              </div>

              <div className="pd-secondary-actions">
                <Button
                  variant="outlined"
                  className="btn-round pd-wishlist"
                  onClick={() => addToWishlist(productdata)}
                >
                  <FaRegHeart className="mr-3" />
                  Add to wishlist
                </Button>
                <Button variant="text" className="pd-compare">
                  <MdOutlineCompareArrows className="mr-2" />
                  Compare
                </Button>
              </div>

              <ul className="pd-specs">
                <li>
                  <span className="k">Type:</span> <span className="v">Organic</span>
                </li>
                <li>
                  <span className="k">MFG:</span> <span className="v">Jun 4.2021</span>
                </li>
                <li>
                  <span className="k">LIFE:</span> <span className="v">30 days</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3">
            <div className="pd-offers">
              <div className="pd-offers-title">BEST OFFERS</div>

              {offers.map((o, idx) => (
                <div key={idx} className="pd-offer">
                  <div className="pd-offer-h">{o.title}</div>
                  <ul className="pd-offer-list">
                    {o.lines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  <a className="pd-offer-link" href="#" onClick={(e) => e.preventDefault()}>
                    {o.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pd-tabs">
          <button
            type="button"
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            type="button"
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({productdata?.reviewCount || 0})
          </button>
        </div>



        {/* {activeTab === "description" ? (
          <div className="pd-tabpanel">
            {product.description.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div> */}
        {activeTab === "description" ? (

          <div className="pd-tabpanel">
            {(() => {
              const lines = productdata?.description?.split("\n").filter(l => l.trim() !== "") || [];
              const half = Math.ceil(lines.length / 2);
              const left = lines.slice(0, half);
              const right = lines.slice(half);

              const renderLine = (line, i) => {
                // Bold short label lines like "Fit", "Length", "Collar", etc.
                const isLabel = /^[A-Za-z &]+$/.test(line.trim()) && line.trim().split(" ").length <= 4;
                return (
                  <p key={i} style={{ margin: "4px 0" }}>
                    {isLabel ? <strong>{line}</strong> : line}
                  </p>
                );
              };

              return (
                <div style={{ display: "flex", gap: "40px" }}>
                  <div style={{ flex: 1 }}>{left.map(renderLine)}</div>
                  <div style={{ flex: 1 }}>{right.map(renderLine)}</div>
                </div>
              );
            })()}
          </div>
        ) : (<form onSubmit={handleSubmit}>
          <div className="pd-tabpanel">
            <div className="pd-review-form">
              <div className="pd-tabpanel mb-4">
                <div className="customer-section-1 mt-2">

                  <h2>CUSTOMER COMMENT</h2>

                  {testimonials.map((item, index) => (
                    <div className="testimonial-card-1" key={index}>
                      <div className="card-rating">
                        <Rating value={item.CustomerRating} readOnly />
                      </div>

                      <h3>{item.CustomerName}</h3>

                      <p>{item.Review}</p>

                      <div className="user-info-1">

                        <div className="user-avatar-1">
                          {item.CustomerName?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h4>{item.name}</h4>
                          <span>{item.role}</span>
                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

              <h5>Add a review</h5>
              <p className="pd-review-note">
                Your email address will not be published. Required fields are marked *
              </p>

              <div className="pd-field">
                <label>Your rating *</label>
                <Rating
                  value={formfield.CustomerRating}
                  onChange={(event, newValue) => {
                    setformfield({ ...formfield, CustomerRating: newValue });
                  }}
                />
              </div>

              <div className="pd-field">
                <label>Your review *</label>
                <textarea rows={8} placeholder="" value={formfield.Review} onChange={onchangeinput} name="Review" />
              </div>

              <div className="pd-field">
                <label>Name *</label>
                <input type="text" onChange={onchangeinput} value={formfield.CustomerName} name="CustomerName" />
              </div>

              <div className="pd-field">
                <label>Email *</label>
                <input type="email" onChange={onchangeinput} name="email" />
              </div>

              <label className="pd-check">
                <input type="checkbox" />
                <span>Save my name, email, and website in this browser for the next time I comment.</span>
              </label>

              <Button type="submit" className="btn-blue btn-round pd-submit">Submit</Button>
            </div>
          </div>

        </form>

        )}
      </div>

      <div className="pd-tabpanel mt-5 mr-5 ml-5 overflow-hidden">
        <h3 className="mt-3">Related Products:</h3>


        {
          relateddata?.length !== 0 && <Relatedproduct data={relateddata} />
        }



      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={khula}
        autoHideDuration={3000}
        onClose={() => setkhula(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          {error}
        </Alert>
      </Snackbar>


      <Productmodal
        open={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        data={productdata}
      />

    </section>
  );
};

export default ProductDetails;

