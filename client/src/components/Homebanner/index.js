import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import slider1 from "../../assets/images/fashion_slider_1.png";
import slider2 from "../../assets/images/fashion_slider_2.png";
import slider3 from "../../assets/images/fashion_slider_3.png";


const Homebanner = () => {
    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true
    };
    return (
        <div className="container mt-4 ">
            < div className="Homebanner">
                <Slider {...settings}>

                    <div className="item">
                        <img src={slider1} alt="image" className="w-100" />
                    </div>

                    <div className="item">
                        <img src={slider2} alt="image" className="w-100" />
                    </div>
                    <div className="item">
                        <img src={slider3} alt="image" className="w-100" />
                    </div>


                </Slider>
            </div>
        </div>

    )
}
export default Homebanner;
