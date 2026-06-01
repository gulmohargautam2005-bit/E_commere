import { fetchDataFromAPI } from "../../utils/api";
import { useEffect, useState, useMemo } from "react";
import Itemthree from "../Itemthree";
import { Navigation, Pagination, Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/grid';






const Productitem5=(props)=>{
    const [productData, setproductData] = useState([]);
    useEffect(() => {
        if (props.data) {
            setproductData(props.data);
            return;
        }
        fetchDataFromAPI('/api/products/subCat/69a91e5cfadb49102d57d876')
            .then((res) => {
                if (res && res.products && res.products.length > 0) {
                    setproductData(res.products);
                } else {
                    fetchDataFromAPI('/api/products/').then((allRes) => {
                        setproductData(allRes.products || allRes || []);
                    });
                }
            })
            .catch(() => {
                fetchDataFromAPI('/api/products/').then((allRes) => {
                    setproductData(allRes.products || allRes || []);
                });
            });
    }, [props.data]);

    const shuffleArray = (array) => {
        const shuffled = [...array]; // copy original array
      
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      
        return shuffled;
      };
      
      const shuffledData = useMemo(() => {
        return shuffleArray(productData);
      }, [productData]);

    return(
      <> 
        <div className="productrow2 w-100" style={{ overflow: "hidden", padding: "10px 0" }}>
          <style>{`
            .productrow2 .mySwiper {
              width: 100%;
              height: 980px; /* Increased height to give the "ADD TO BAG" button ample bottom clearance */
              padding: 10px 0;
            }
            .productrow2 .swiper-slide {
              height: calc((100% - 40px) / 2) !important; /* Perfect height division for 2 grid rows with 40px gap */
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
            .productrow2 .productitem {
              height: 100% !important;
              display: flex;
              flex-direction: column;
              background: #000000 !important; /* Rich obsidian black background matching mockup */
              border-radius: 0px !important; /* Strictly sharp corners - no curves */
              border: 1px solid #1c1c1e !important; /* Elegant subtle dark charcoal border */
              overflow: hidden !important;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
              transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
            }
            .productrow2 .productitem:hover {
              transform: translateY(-8px);
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
              border-color: #ffffff !important; /* Elegant white border on hover */
              border-radius: 0px !important; /* Enforced sharp corners on hover */
            }
            .productrow2 .productitem .imgwrap {
              height: 260px !important;
              border-radius: 0px !important; /* Strictly sharp corners */
              overflow: hidden !important;
              position: relative;
              background: #0d0d0d !important; /* Deep black behind images */
            }
            .productrow2 .productitem:hover .imgwrap {
              border-radius: 0px !important; /* Enforced sharp corners on hover */
            }
            .productrow2 .productitem .imgwrap .sliderTrack {
              display: flex !important;
              width: 100% !important;
              height: 100% !important;
              transition: transform 0.45s ease-in-out !important;
            }
            .productrow2 .productitem .imgwrap img {
              width: 100% !important;
              height: 100% !important;
              flex-shrink: 0 !important;
              object-fit: cover !important; /* Product image covers the upper cell container completely */
              display: block !important;
              transition: transform 1.2s cubic-bezier(0.2, 1, 0.3, 1) !important;
              padding: 0 !important; /* No padding so image fully fills the cell */
            }
            .productrow2 .productitem:hover .imgwrap img {
              transform: scale(1.08) !important;
            }
            .productrow2 .productitem .badge {
              position: absolute;
              top: 16px;
              left: 16px;
              background-color: #2bbef9 !important; /* Accent blue badge from add.png */
              color: #ffffff !important;
              font-family: 'Inter', sans-serif;
              font-size: 11px !important;
              font-weight: 700 !important;
              padding: 4px 8px !important;
              border-radius: 2px !important;
              z-index: 10;
              line-height: 1.2;
              border: none !important;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .productrow2 .productitem .wishlist-btn {
              position: absolute;
              top: 16px;
              right: 16px;
              z-index: 15;
              background: rgba(255, 255, 255, 0.1) !important;
              backdrop-filter: blur(8px) !important;
              -webkit-backdrop-filter: blur(8px) !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
              color: #ffffff !important;
              width: 38px !important;
              height: 38px !important;
              min-width: 38px !important;
              border-radius: 50% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              cursor: pointer !important;
              transition: all 0.3s ease !important;
              padding: 0 !important;
            }
            .productrow2 .productitem .wishlist-btn:hover {
              background: #ef4444 !important;
              color: #ffffff !important;
              border-color: #ef4444 !important;
              transform: scale(1.1) !important;
            }
            .productrow2 .productitem .wishlist-btn svg {
              font-size: 16px !important;
              color: #ffffff !important;
            }
            .productrow2 .productitem .info {
              padding: 24px 24px 32px 24px !important; /* Extra bottom padding so add to bag does not overflow and looks gorgeous */
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              background: #000000 !important; /* Blend with obsidian black card */
            }
            .productrow2 .productitem .info h4 {
              font-family: 'Inter', sans-serif !important; /* Clean uppercase title font matching mockup */
              font-size: 13px !important;
              font-weight: 600 !important;
              color: rgba(255, 255, 255, 0.6) !important; /* Subtle muted white title */
              text-transform: uppercase !important;
              letter-spacing: 0.1em !important;
              margin-bottom: 8px !important;
              line-height: 1.3 !important;
            }
            .productrow2 .productitem .info .text-success {
              font-family: 'Inter', sans-serif !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #10b981 !important; /* Emerald green */
              margin-bottom: 8px !important;
            }
            .productrow2 .productitem .info .oldprice {
              font-family: 'Bodoni Moda', serif !important;
              font-size: 14px !important;
              color: rgba(255, 255, 255, 0.3) !important;
              text-decoration: line-through !important;
              margin-right: 12px !important;
            }
            .productrow2 .productitem .info .newprice {
              font-family: 'Bodoni Moda', serif !important; /* Elegant white serif font matching mockup */
              font-size: 20px !important;
              font-weight: 500 !important;
              color: #ffffff !important; /* Elegant white price */
            }
            .productrow2 .productitem .add-to-bag-btn {
              width: 100% !important;
              background-color: #ffffff !important; /* White rectangular button */
              color: #000000 !important; /* Black text */
              font-family: 'Inter', sans-serif !important;
              font-size: 11px !important;
              font-weight: 700 !important;
              letter-spacing: 0.15em !important;
              text-transform: uppercase !important;
              padding: 14px 0 !important;
              border-radius: 0 !important; /* Rectangular shape matching mockup */
              margin-top: 16px !important;
              transition: all 0.3s ease !important;
              border: 1px solid #ffffff !important;
              cursor: pointer !important;
              line-height: 1 !important;
              position: relative !important;
              z-index: 100 !important;
            }
            .productrow2 .productitem .add-to-bag-btn:hover {
              background-color: #000000 !important; /* Turn black on hover */
              color: #ffffff !important; /* White text on hover */
              border-color: #ffffff !important;
            }
            .productrow2 .productitem .action {
              display: none !important;
            }
          `}</style>
          <Swiper
              slidesPerView={1}
              breakpoints={{
                576: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 40 },
                1400: { slidesPerView: 4, spaceBetween: 40 }
              }}
              grid={{ rows: 2, fill: 'row' }}
              spaceBetween={20}
              navigation
              modules={[Navigation, Pagination, Grid]}
              className="mySwiper"
          >
              {shuffledData.map((item) => (
                  <SwiperSlide key={item._id}>
                      <Itemthree item={item} />
                  </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </>
    )
}
export default Productitem5;