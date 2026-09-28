
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { Rating } from '@mui/material';
import Button from "@mui/material/Button";
import { useState } from "react";
import Productmodal from '../Productmodal';
import { useContext, useEffect } from "react";
import { Mycontext } from "../../App";
import { memo } from 'react';
import { useNavigate } from "react-router-dom";

const Item4 = memo((props) => {
    const context = useContext(Mycontext);

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [khula, setkhula] = useState(false);
    const[listfield,setlistfield]=useState({});
    const navigate = useNavigate();
    
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


    const goToDetails = (e) => {
      if (e?.target?.closest('.action') || e?.target?.closest('.wishlist-btn') || e?.target?.closest('.add-to-bag-btn')) {
        return;
      }
      navigate(`/product/${props.item?._id}`);
    };
   

    const viewproductdetail = (id) => {
        context.setproductmodal({
            id,
            open: true
        });
    };

    const imgSrc = Array.isArray(props.item?.images)
        ? props.item?.images?.[0]
        : props.item?.images;

    const images = Array.isArray(props.item?.images)
        ? props.item.images
        : [props.item?.images];

    const [index, setIndex] = useState(0);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (!hover || images.length <= 1) return;

        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 800); // slide speed (ms)

        return () => clearInterval(interval);
    }, [hover, images.length]);


    return (
        <div className="productitem w-100"
        onClick={goToDetails}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                setIndex(0); // reset to first image
            }}>
            <div className="imgwrap">
                <div
                    className="sliderTrack"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {images.map((img, i) => (
                        <img
                            key={i}
                            className="slideimg"
                            src={img}
                            alt={props.item?.name}
                            loading="lazy"
                        />
                    ))}
                </div>
                {props.item?.discount > 0 && props.item?.price && (
                    <span className="badge badge-primary">
                        {Math.round(
                            (props.item.discount /
                                (props.item.discount + props.item.price)) * 100
                        )}%
                    </span>
                )}
            </div>

            <div className="info">
                <h4>{props.item?.name?.substring(0, 20) + "..."}</h4>
                <span className="text-success d-block">In Stock</span>

                <Rating
                    className="mt-2"
                    value={props.item?.rating}
                    precision={0.5}
                    readOnly
                />

                <div className="d-flex">
                    <span className="oldprice">
                        &#8377;{props.item?.price + props.item?.discount}
                    </span>
                    <span className="newprice text-danger ml-3">
                        &#8377;{props.item?.price}
                    </span>
                </div>

                <div className="action">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        viewproductdetail(props.item?._id);
                    }}
                ><AiOutlineFullscreen /></Button>
                   <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(props.item)
                       
                    }}
                ><FaRegHeart /></Button>
                </div>
            </div>
        </div>
    );
});

export default Item4;