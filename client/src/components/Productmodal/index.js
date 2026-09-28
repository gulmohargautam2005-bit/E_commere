import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Rating from '@mui/material/Rating';
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { Mycontext } from "../../App";
import { useState } from "react";
import Quantity from "../../components/Quantity";
import Productzoom from "../Productzoom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';  
import { FaRegHeart } from "react-icons/fa";

const Productmodal = (props) => {
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
    const [error, setError] = useState('');
    const [productquantity, setproductquantity] = useState(1);
    const [cartfield, setcartfield] = useState({});
    const context = useContext(Mycontext);
    const { id } = useParams();
    const [opens, setOpen] = useState(false);

    const { open, onClose, data } = props;
 
    const addtocart = (data) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.userid) {
        setError("Please login first to add items to cart!");
        setOpen(true);
        playBeep();
        return; 
      }

      cartfield.title = data?.name;
      cartfield.image = data?.images?.[0];
      cartfield.rating = data?.rating;
      cartfield.price = data?.price;
      cartfield.quantity = productquantity;
      cartfield.subtotal = parseInt(productquantity * data?.price);
      cartfield.productId = data?._id;
      cartfield.userId = user?.userid;

      context.addtocart(cartfield);
      playSuccessSound();
      onClose();
    };

    return (<>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        className="pmodal"
        sx={{ zIndex: 2000 }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&display=swap');
          
          .pmodal .MuiDialog-paper {
            max-width: 900px !important;
            width: 100% !important;
            border-radius: 12px !important;
            border: 1px solid #eaeaea !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
            margin: 16px !important;
          }
          @media (min-width: 769px) {
            .pmodal .MuiDialog-paper {
              height: 580px !important;
            }
            .pmodal-content {
              height: 100% !important;
            }
            .pmodal-content .row {
              height: 100% !important;
            }
            .pmodal-content .col-md-6 {
              height: 100% !important;
            }
          }
          @media (max-width: 768px) {
            .pmodal .MuiDialog-paper {
              height: auto !important;
              max-height: 90vh !important;
              overflow-y: auto !important;
            }
          }
          .pmodal-close {
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            color: #000000 !important;
            min-width: auto !important;
            padding: 8px !important;
            z-index: 100 !important;
            background: rgba(255, 255, 255, 0.8) !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
          }
          .pmodal-close:hover {
            background-color: #000000 !important;
            color: #ffffff !important;
            border-color: #000000 !important;
          }
          .pmodal-content {
            padding: 0 !important;
            color: #000000 !important;
            font-family: 'Inter', sans-serif !important;
            background-color: #ffffff !important;
            overflow: hidden !important;
          }
          .pmodal-content .row {
            margin: 0 !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          .pmodal-content .col-md-6 {
            padding: 0 !important;
          }
          
          /* Left Column Image Area styling */
          .pmodal-left-col {
            position: relative !important;
            background-color: #f5f5f5 !important;
            overflow: hidden !important;
          }
          .pmodal-left-col .productzoom {
            height: 100% !important;
            width: 100% !important;
            position: relative !important;
          }
          .pmodal-left-col .zoomSliderBig {
            height: 100% !important;
            width: 100% !important;
          }
          .pmodal-left-col .zoomSliderBig .slick-list,
          .pmodal-left-col .zoomSliderBig .slick-track,
          .pmodal-left-col .zoomSliderBig .slick-slide,
          .pmodal-left-col .zoomSliderBig .slick-slide > div {
            height: 100% !important;
          }
          .pmodal-left-col .zoomSliderBig .item {
            height: 100% !important;
            width: 100% !important;
            background: transparent !important;
            display: block !important;
          }
          .pmodal-left-col .zoomSliderBig .iiz {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          .pmodal-left-col .zoomSliderBig img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          
          /* Floating absolute thumbnails inside modal */
          .pmodal-left-col .zoomSlider {
            position: absolute !important;
            bottom: 20px !important;
            left: 20px !important;
            right: 20px !important;
            z-index: 100 !important;
            margin-top: 0 !important;
          }
          .pmodal-left-col .zoomSlider .slick-track {
            display: flex !important;
            gap: 8px !important;
            justify-content: center !important;
          }
          .pmodal-left-col .zoomSlider .item img {
            width: 50px !important;
            height: 50px !important;
            aspect-ratio: 1/1 !important;
            object-fit: cover !important;
            border-radius: 4px !important;
            border: 2px solid rgba(255, 255, 255, 0.6) !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25) !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            background-color: #ffffff !important;
          }
          .pmodal-left-col .zoomSlider .item img:hover {
            border-color: #ffffff !important;
            transform: scale(1.05) !important;
          }
          .pmodal-left-col .zoomSlider .slick-current img {
            border-color: #000000 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
          }
          
          @media (max-width: 768px) {
            .pmodal-left-col .zoomSliderBig {
              aspect-ratio: 4/5 !important;
              height: 400px !important;
            }
            .pmodal-left-col .zoomSlider {
              position: relative !important;
              bottom: auto !important;
              left: auto !important;
              right: auto !important;
              margin: 16px !important;
              z-index: auto !important;
            }
            .pmodal-left-col .zoomSlider .item img {
              width: 60px !important;
              height: 60px !important;
              border: 1px solid rgba(0, 0, 0, 0.1) !important;
              box-shadow: none !important;
            }
          }
          
          /* Right Column Details Area styling */
          .pmodal-right-col {
            padding: 40px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important;
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          @media (min-width: 769px) {
            .pmodal-right-col {
              overflow-y: auto !important;
              height: 100% !important;
            }
          }
          .pmodal-right-col h4 {
            font-family: 'Bodoni Moda', serif !important;
            font-size: 26px !important;
            font-weight: 500 !important;
            color: #000000 !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }
          .pmodal-right-col hr {
            border-top: 1px solid #eaeaea !important;
            margin: 16px 0 !important;
            opacity: 1 !important;
          }
          .pmodal-right-col .oldprice {
            color: #888888 !important;
            text-decoration: line-through !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          }
          .pmodal-right-col .newprice {
            color: #ba1a1a !important;
            font-weight: 700 !important;
            font-size: 22px !important;
          }
          .pmodal-right-col .modal-brand-label {
            font-size: 11px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.15em !important;
            color: #666666 !important;
            font-weight: 600;
          }
          .pmodal-right-col .modal-desc {
            font-size: 14px !important;
            color: #555555 !important;
            line-height: 1.6 !important;
            margin-top: 16px !important;
            margin-bottom: 24px !important;
          }
          .pmodal-right-col .modal-stock-badge {
            background-color: #000000 !important;
            color: #ffffff !important;
            font-size: 9px !important;
            font-weight: bold !important;
            padding: 6px 12px !important;
            border-radius: 99px !important;
            letter-spacing: 0.1em !important;
            display: inline-block !important;
            text-transform: uppercase !important;
          }
          
          /* Force color block overrides to eliminate any blue elements */
          .pmodal-right-col,
          .pmodal-right-col h4,
          .pmodal-right-col p,
          .pmodal-right-col span:not(.newprice):not(.MuiRating-icon):not(.modal-stock-badge),
          .pmodal-right-col button:not(.add-to-cart-btn),
          .pmodal-right-col label,
          .pmodal-right-col li,
          .pmodal-right-col a {
            color: #000000 !important;
          }
          
          /* Hide duplicate magnifier button inside pmodal */
          .pmodal .iiz__btn {
            display: none !important;
          }
        `}</style>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="pmodal-close"
        >
          <IoMdClose size={24} />
        </Button>

        {/* Content */}
        <DialogContent className="pmodal-content">
          <div className="row">
            {/* Left Column: Product zoom edge-to-edge */}
            <div className="col-md-6 pmodal-left-col">
              <Productzoom images={props?.data?.images || []} zoomDisabled={props.zoomDisabled} />
            </div>

            {/* Right Column: Stacked product details */}
            <div className="col-md-6 pmodal-right-col">
              <span className="modal-brand-label">Brand: {props.data?.brand || "Luxe"}</span>
              <h4 className="mt-1">
                {props.data?.name}
              </h4>

              <div className="d-flex align-items-center mt-2 mb-3">
                <Rating name="half-rating-read" value={props.data?.rating || 0} precision={0.5} readOnly style={{ color: "#FFB800" }} />
              </div>
              <hr />

              <div className="d-flex align-items-center mb-3">
                {props.data?.discount > 0 && (
                  <span className="oldprice mr-3">
                    &#8377;{props.data?.price + props.data?.discount}
                  </span>
                )}
                <span className="newprice">&#8377;{props.data?.price}</span>
              </div>

              <div>
                {props.data?.countInstock > 0 || props.data?.countInStock > 0 || props.data?.inStock ? (
                  <span className="modal-stock-badge">IN STOCK</span>
                ) : (
                  <span className="modal-stock-badge" style={{ backgroundColor: '#888888 !important' }}>OUT OF STOCK</span>
                )}
              </div>

              <p className="modal-desc">
                {props.data?.description || "Experience top tier craftsmanship with precision details, selected for the ultimate expression of architecture and style."}
              </p>

              <div className="d-flex align-items-center mt-4">
                <Quantity quantity={setproductquantity} />
                <Button 
                  onClick={() => addtocart(props.data)}
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 28px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '12px',
                    marginLeft: '16px',
                    height: '48px',
                    boxShadow: 'none'
                  }}
                >
                  Add to Cart
                </Button>
              </div>
              
              <div className="d-flex align-items-center mt-3">
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    if (typeof context.addToWishlist === 'function') {
                      context.addToWishlist({
                        title: props.data?.name,
                        image: props.data?.images?.[0],
                        rating: props.data?.rating,
                        price: props.data?.price,
                        productId: props.data?._id,
                        userId: JSON.parse(localStorage.getItem('user') || '{}')?.userid
                      });
                    }
                  }}
                  style={{
                    borderColor: '#000000',
                    color: '#000000',
                    backgroundColor: 'transparent',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '48px',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <FaRegHeart />
                  ADD TO WISHLIST
                </Button>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={opens}
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
    </>);
};

export default Productmodal;
