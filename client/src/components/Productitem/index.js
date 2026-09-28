import { Navigation, Pagination } from 'swiper/modules';
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Rating } from '@mui/material';
import Button from "@mui/material/Button";
import { useState } from 'react';
import Productmodal from '../../components/Productmodal';
import 'swiper/css';
import 'swiper/css/navigation';
import Item1 from '../Itemone';
import { useEffect } from 'react';
import { fetchDataFromAPI } from '../../utils/api';




const Productitem = (props) => {
    const data = props.data || [];
    const shuffleArray = (array) => {
        const shuffled = [...array]; // copy original array
      
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
      
        return shuffled;
      };
      const shuffledData = shuffleArray(data);

    const [isopenproductmodal, setisopenproductmodal] = useState(false);
    const [featuredproduct,setfeaturedproduct]=useState([])

    const viewproductdetail = (id) => {
        setisopenproductmodal(true);
    }
    useEffect(()=>{
      
        fetchDataFromAPI('/api/products/featured').then((res)=>{
            setfeaturedproduct(res)

        })

        

    },[])


    return (
        <>

            <div className="productrow w-100">
                <Swiper
                    slidesPerView={4}
                    spaceBetween={20}
                    slidesPerGroup={1}
                    navigation
                 
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                >
                    {shuffledData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <Item1 item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


            {/* new  */}
        
          
            



            <Productmodal
                open={isopenproductmodal}
                onClose={() => setisopenproductmodal(false)}
            />



        </>)


}
export default Productitem;