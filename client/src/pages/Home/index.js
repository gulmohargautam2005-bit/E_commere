
import Homebanner from "../../components/Homebanner"
import Button from "@mui/material/Button";
import 'swiper/css';
import 'swiper/css/pagination';
import Productitem from "../../components/Productitem"
import Endban from "../../components/Endban";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Homecat from "../../components/Homecat";
import G4 from "../../assets/images/g4.PNG"
import b5 from "../../assets/images/b5PNG.png"
import b9 from "../../assets/images/b11.png"
import b10 from "../../assets/images/b10.png"
import b88 from "../../assets/images/1.png"
import A9 from "../../assets/images/A3.png"
import fashionBanner from "../../assets/images/fashion_banner.png"
import { CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Mycontext } from "../../App";
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Productitem3 from "../../components/Productitem3";
import Productitem4 from "../../components/Productitem4";


import Productitem2 from "../../components/Productitem2";
import { fetchDataFromAPI } from "../../../src/utils/api";
import Productitem5 from "../../components/Productitem5";
const Home = () => {
    const categories = [
        {
            name: "BEVERAGES",
            items: 11,
            image: "https://cdn-icons-png.flaticon.com/512/3050/3050152.png",
            big: true
        },
        {
            name: "Biscuits & Snacks",
            items: 6,
            image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
        },
        {
            name: "Breads & Bakery",
            items: 6,
            image: "https://cdn-icons-png.flaticon.com/512/3081/3081986.png"
        },
        {
            name: "Breakfast & Dairy",
            items: 8,
            image: "https://cdn-icons-png.flaticon.com/512/2674/2674486.png"
        },
        {
            name: "Frozen Foods",
            items: 7,
            image: "https://cdn-icons-png.flaticon.com/512/2718/2718224.png"
        },
        {
            name: "Fruits & Vegetables",
            items: 12,
            image: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png"
        },
        {
            name: "Grocery & Staples",
            items: 7,
            image: "https://cdn-icons-png.flaticon.com/512/2909/2909766.png"
        },
        {
            name: "Household Needs",
            items: 1,
            image: "https://cdn-icons-png.flaticon.com/512/995/995053.png"
        },
        {
            name: "Meats & Seafood",
            items: 5,
            image: "https://cdn-icons-png.flaticon.com/512/1046/1046751.png"
        }
    ];
    const testimonials = [
        {
            title: "The Best Marketplace",
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
            name: "Tina Mcdonnell",
            role: "Sales Manager",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
        },
    ];
    const navigate = useNavigate();
    const Context = useContext(Mycontext)
    const [selectedcat, setselectedcat] = useState('')
    const [value, setValue] = useState(0);
    const [catData, setcatData] = useState([])
    const [filterdata, setfilterdata] = useState([])


    const [featuredproduct, setfeaturedproduct] = useState([]);
    const [productData, setproductData] = useState([])
    useEffect(() => {
        fetchDataFromAPI("/api/category/").then((res) => {
            setcatData(res.categoryList);
        })

        fetchDataFromAPI('/api/products/featured').then((res) => {
            setfeaturedproduct(res)

        })
        fetchDataFromAPI('/api/products/').then((res) => {
            setproductData(res)

        })



    }, [])
    useEffect(() => {
        if (catData.length > 0) {
            setselectedcat(catData[0].name);
        }
    }, [catData]);
    useEffect(() => {
        if (!selectedcat) return;

        fetchDataFromAPI(`/api/products?catName=${selectedcat}`)
            .then((res) => {
                setfilterdata(res.products || []);
            });

    }, [selectedcat]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const selectcat = (cat) => {
        setselectedcat(cat)
    }


    return (
        <>
            <Homebanner />


            <section className="Homeproduct">
                <div className="container">
                    <div className="row" style={{ alignItems: 'flex-start' }}>
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner banner-1 mb-4">
                                    <img src={fashionBanner} className="cursor w-100" alt="Luxury Fashion New Season Collection Banner" />
                                </div>


                                {/* <div className="banner banner-2 mt-4">
                                    <img src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/bacola-banner-04.jpg" className="cursor" />
                                </div> */}

                                <div className="banner-3 sticky2 mt-5 w-100">
                                    <img src={b88} className="cursor" />
                                </div>

                                <div className="customer-section mt-2">

                                    <h2>CUSTOMER COMMENT</h2>

                                    {testimonials.map((item, index) => (
                                        <div className="testimonial-card" key={index}>

                                            <h3>{item.title}</h3>

                                            <p>{item.comment}</p>

                                            <div className="user-info">

                                                <img src={item.image} alt={item.name} />

                                                <div>
                                                    <h4>{item.name}</h4>
                                                    <span>{item.role}</span>
                                                </div>

                                            </div>

                                        </div>
                                    ))}

                                </div>


                            </div>
                        </div>
                        <div className="col-md-9">

                            {/* Best Sellers heading above products */}
                            <div className="mb-3">
                                <div className="info3 mt-5 w-100">
                                    <h3>Featured</h3>
                                    <p>Do not miss current offers until the end of March.</p>

                                </div>

                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 4 }}>
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        className="filterTabs"
                                        textColor="primary"
                                        indicatorColor="primary"
                                    >
                                        {catData?.map((item, index) => (
                                            <Tab onClick={() => selectcat(item.name)} key={item._id} value={index} label={item.name} />
                                        ))}
                                    </Tabs>
                                </Box>


                            </div>

                            <div className="productrow w-100 d-flex">
                                <Productitem data={filterdata} />
                            </div>

                            {/* =================================== */}

                            <div className="d-flex align-item-center">
                                <div className="info3 mt-5 w-75">
                                    <h3>Mens</h3>
                                    <p>Do not miss current offers until the end of March.</p>
                                </div>
                                <button className="vll_butn mar ml-auto" onClick={() => {
                                    Context.setisheaderfootershow(true);
                                    navigate("/cat");
                                }}>
                                    View all
                                    <HiOutlineArrowNarrowRight />
                                </button>
                            </div>

                            <div className="productrow w-100 pupil d-flex">
                                <Productitem4 />
                            </div>


                            <div className="d-flex align-item-center  ">
                                <div className="info3 mt-5 w-75">
                                    <h3>New Products</h3>
                                    <p>Do not miss current offers until the end of March.</p>
                                </div>
                                <button className="vll_butn mar ml-auto" onClick={() => {
                                    Context.setisheaderfootershow(true);
                                    navigate("/cat");
                                }}>View all<HiOutlineArrowNarrowRight /></button>
                            </div>

                            <div className="productrow2 w-100  d-flex">
                                <Productitem3 />
                            </div>
                            {/* <Endban /> */}
                        </div>


                    </div>

                    {/* ======== */}
                    <div class="blinkit-grid mt-5">

                        {categories.map((cat, index) => (
                            <div
                                key={index}
                                className={`category ${cat.big ? "big" : ""}`}
                            >
                                <img src={cat.image} alt={cat.name} />

                                <h3>{cat.name}</h3>

                                <p>{cat.items} Items</p>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="d-flex align-item-center  ">
                                <div className="info3 mt-5 w-75">
                                    <h3>New Products</h3>
                                    <p>Do not miss current offers until the end of March.</p>
                                </div>
                                <button className="vll_butn mar ml-auto" onClick={() => {
                                    Context.setisheaderfootershow(true);
                                    navigate("/cat");
                                }}>View all<HiOutlineArrowNarrowRight /></button>
                            </div>

                            <div className="productrow2 w-100  d-flex">
                                <Productitem5 />
                            </div>
                        </div>
                    </div>
                </div>

            </section>



            {/* ======================= */}




            <section className="Newslettersection mt-3  d-flex align-item-center">
                <div className="container ">
                    <div className="row">
                        <div className="col-md-6 mt-5 pt-5 pr-5 pop">
                            <p className="text-white mb-1">20% discoount of on your first order</p>
                            <h1 className="text-white">join our newsletter and get....</h1>
                            <p className="text-white">Join our email subscription now to get updates <br /> on promotions and coupons.</p>
                            <form>
                                <CiMail />
                                <input type="text" placeholder="Your Email Adddress....."></input>
                                <Button>Subscribe</Button>
                            </form>
                        </div>
                        <div className="col-md-6 ">
                            <img src={b5} />

                        </div>







                    </div>
                </div>
            </section>



        </>
    )

}
export default Home