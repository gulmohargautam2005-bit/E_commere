import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Itemthree from "../../components/Itemthree";

const Relatedproduct = (props) => {
    return (<>   
     <div className='related-products-slider w-full'>
        <style>{`
          .related-products-slider {
            width: 100%;
            overflow: hidden; /* Fix swiper expanding infinitely */
          }
          .related-products-slider .mySwiper {
            width: 100%;
            height: 480px !important;
            padding: 10px 0;
          }
          .related-products-slider .swiper-slide {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            height: auto !important;
          }
          .related-products-slider .productitem {
            height: 100% !important;
            display: flex;
            flex-direction: column;
            background: #000000 !important; 
            border-radius: 0px !important; 
            border: 1px solid #1c1c1e !important; 
            overflow: hidden !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          }
          .related-products-slider .productitem:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
            border-color: #ffffff !important; 
            border-radius: 0px !important; 
          }
          .related-products-slider .productitem .imgwrap {
            height: 240px !important;
            border-radius: 0px !important; 
            overflow: hidden !important;
            position: relative;
            background: #ffffff !important; 
          }
          .related-products-slider .productitem .imgwrap img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important; 
            padding: 0 !important;
          }
          .related-products-slider .productitem .badge {
            position: absolute;
            top: 16px;
            left: 16px;
            background-color: #2bbef9 !important; 
            color: #ffffff !important;
            font-family: 'Inter', sans-serif;
            font-size: 11px !important;
            font-weight: 700 !important;
            padding: 4px 8px !important;
            border-radius: 2px !important;
            z-index: 10;
            line-height: 1.2;
            border: none !important;
          }
          .related-products-slider .productitem .wishlist-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 15;
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #ffffff !important;
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
          }
          .related-products-slider .productitem .wishlist-btn:hover {
            background: #ef4444 !important;
            border-color: #ef4444 !important;
          }
          .related-products-slider .productitem .info {
            padding: 20px 20px 24px 20px !important;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            background: #000000 !important; 
          }
          .related-products-slider .productitem .info h4 {
            font-family: 'Inter', sans-serif !important; 
            font-size: 13px !important;
            font-weight: 600 !important;
            color: rgba(255, 255, 255, 0.6) !important; 
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            margin-bottom: 8px !important;
          }
          .related-products-slider .productitem .info .text-success {
            font-family: 'Inter', sans-serif !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            text-transform: uppercase;
            color: #10b981 !important; 
            margin-bottom: 8px !important;
          }
          .related-products-slider .productitem .info .oldprice {
            font-family: 'Bodoni Moda', serif !important;
            font-size: 13px !important;
            color: rgba(255, 255, 255, 0.3) !important;
            text-decoration: line-through !important;
            margin-right: 12px !important;
          }
          .related-products-slider .productitem .info .newprice {
            font-family: 'Bodoni Moda', serif !important; 
            font-size: 18px !important;
            font-weight: 500 !important;
            color: #ffffff !important; 
          }
          .related-products-slider .productitem .add-to-bag-btn {
            width: 100% !important;
            background-color: #ffffff !important; 
            color: #000000 !important; 
            font-family: 'Inter', sans-serif !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            letter-spacing: 0.15em !important;
            text-transform: uppercase !important;
            padding: 12px 0 !important;
            border-radius: 0 !important; 
            margin-top: 16px !important;
            border: 1px solid #ffffff !important;
            cursor: pointer !important;
          }
          .related-products-slider .productitem .add-to-bag-btn:hover {
            background-color: transparent !important; 
            color: #ffffff !important;
            border-color: #ffffff !important;
          }
        `}</style>

        <Swiper
            slidesPerView={5}
            spaceBetween={24}
            slidesPerGroup={1}
            navigation
            modules={[Navigation, Pagination]}
            className="mySwiper"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1200: { slidesPerView: 5, spaceBetween: 24 }
            }}
        >
            {props.data?.map((item, index) => (
                <SwiperSlide key={index}>
                    <Itemthree item={item} />
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
    
    </>)
}
export default Relatedproduct;