
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

const Itemthree = memo((props) => {
    const navigate = useNavigate();

    const goToDetails = (e) => {
        if (e?.target?.closest('.add-to-bag-btn') || e?.target?.closest('.wishlist-btn')) {
            return;
        }
        navigate(`/product/${props.item?._id}`);
    };
    const Context = useContext(Mycontext);

    const viewproductdetail = (id) => {
        Context.setproductmodal({
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


    const addToWishlist = (e) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.userid) {
            alert("Please login first to add items to wishlist!");
            return;
        }
        const listfield = {
            title: props.item?.name,
            image: imgSrc,
            rating: props.item?.rating,
            price: props.item?.price,
            productId: props.item?._id,
            userId: user?.userid
        };
        Context.addToWishlist(listfield);
    };

    const addtocart = (e) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.userid) {
            alert("Please login first to add items to cart!");
            return;
        }
        const cartfield = {
            title: props.item?.name,
            image: imgSrc,
            rating: props.item?.rating,
            price: props.item?.price,
            quantity: 1,
            subtotal: parseInt(1 * props.item?.price),
            productId: props.item?._id,
            userId: user?.userid
        };
        Context.addtocart(cartfield);
    };

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
                {/* {props.item?.discount > 0 && props.item?.price && (
                    <span className="badge badge-primary">
                        {Math.round(
                            (props.item.discount /
                                (props.item.discount + props.item.price)) * 100
                        )}%
                    </span>
                )} */}
                <button
                    className="wishlist-btn"
                    onClick={addToWishlist}
                >
                    <FaRegHeart />
                </button>
            </div>

            <div className="info">
                <span className="product-brand-category">
                    {(props.item?.brand || "LUXE")} • {(props.item?.catName || "Fashion")}
                </span>
                <h4 className="product-title-h4">{props.item?.name}</h4>
                <span className="text-success d-block">In Stock</span>

                <div className="rating-spacer"></div>

                <div className="d-flex align-items-center mt-2">
                    <span className="oldprice">
                        &#8377;{props.item?.price + props.item?.discount}
                    </span>
                    <span className="newprice text-danger ml-3">
                        &#8377;{props.item?.price}
                    </span>
                </div>

                <button
                    className="add-to-bag-btn"
                    onClick={addtocart}
                >
                    Add to Bag
                </button>
            </div>
        </div>
    );
});

export default Itemthree;