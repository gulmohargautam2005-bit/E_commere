import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';

const Homecat = (props) => {
  const [catData,setcatData]=useState([])

  

  // background colors
  const [itemBg] = useState([
    '#fffceb',
    '#ecffec',
    '#feefea',
    '#fff3eb',
    '#fff3ff',
    '#f2fce4',
    '#feefea',
    '#fffceb',
    '#feefea',
    '#ecffec',
    '#feefea',
    '#fff3eb',
    '#fff3ff',
    '#f2fce4',
    '#feefea',
    '#ecffec',
  ]);

  // categories (same dimension images)
  const categories = [
    { name: "Cake & Milk", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-13.png" },
    { name: "Organic Kiwi", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-12.png" },
    { name: "Peach", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-11.png" },
    { name: "Red Apple", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-9.png" },
    { name: "Snacks", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-3.png" },
    { name: "Vegetables", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-1.png" },
    { name: "Strawberry", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-2.png" },
    { name: "Black Plum", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-4.png" },
    { name: "Custard Apple", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-5.png" },
    { name: "Coffee & Tea", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-14.png" },
    { name: "Headphones", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-15.png" },
    { name: "Fast Food", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-6.png" },
    { name: "Bread", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-7.png" },
    { name: "Chicken", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-8.png" },
    { name: "Fish", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-10.png" },
    { name: "Eggs", img: "https://nest-frontend-v6.netlify.app/assets/imgs/shop/cat-16.png" },
  ];

  return (
    <section className="homecat">
      <div className="container">
        <h3 className="mb-5 hd">Featured Categories</h3>

        <Swiper
          slidesPerView={10}
          spaceBetween={20}
          navigation
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            0: { slidesPerView: 2 },
            576: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            992: { slidesPerView: 8 },
            1200: { slidesPerView: 10 },
          }}
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index}>
              <div
                className="item text-center"
                style={{ background: itemBg[index % itemBg.length] }}
              >
                <img src={cat.img} alt={cat.name} />
              </div>
              <h6>{cat.name}</h6>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Homecat;
