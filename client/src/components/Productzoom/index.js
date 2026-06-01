import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom"
import 'inner-image-zoom/lib/styles.min.css';
import { useRef } from "react";
import { FaSearch } from "react-icons/fa";

const Productzoom=(props)=>{
  const zoomSliderBig = useRef();
  const zoomSlider = useRef()

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    fade: false,
    arrows: true
  };

  var settings2 = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
  };

  const goto = (index) => {
    zoomSlider.current.slickGoTo(index)
    zoomSliderBig.current.slickGoTo(index)
  }

  return(<>
    <div className="productzoom" style={{ position: 'relative' }}>
      <Slider {...settings2} className="zoomSliderBig" ref={zoomSliderBig}>
          {props?.images?.map((image,index)=>{
               return(  <div className="item" key={index}>
                   {props.zoomDisabled ? (
                     <img src={image} className="w-100 h-100 object-cover" style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }} />
                   ) : (
                     <InnerImageZoom
                       zoomType="hover"
                       zoomScale={1}
                       src={image}
                     />
                   )}
                 </div>)
          })}
      </Slider>

      {typeof props.onZoomClick === 'function' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.onZoomClick();
          }}
          className="zoom-overlay-btn"
        >
          <FaSearch size={18} style={{ color: '#000000' }} />
        </button>
      )}
    </div>

    <Slider {...settings} className='zoomSlider' ref={zoomSlider}>
        {props?.images?.map((image,index)=>{
              return(<div className='item' key={index}>
                <img src={image} onClick={() => goto(index)} className="w-100" />
                   </div>)
        })
        }
    </Slider>
  </>)
}
export default Productzoom;