import Sidebar from "../../components/Sidebar";
import bg from "../../assets/images/bg.PNG"
import { BsFillGridFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaAngleDown } from "react-icons/fa6";
import { Button } from "@mui/material";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import * as React from 'react';
import { useState } from "react";
import { useEffect } from "react";



import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Productitem2 from "../../components/Productitem2";
import { fetchDataFromAPI } from "../../utils/api";
import { useParams } from "react-router-dom";

const Listing = () => {
    const[listdata,setlistdata]=useState([]);
const [anchorEl, setAnchorEl] = useState(null) 
const [productdata,setproductdata]=useState([]);
const[productview,setproductview]=useState(null)
const{ id} =useParams();




const opendropdown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if(!id) return;

    fetchDataFromAPI(`/api/products/subCat/${id}`)

        .then((res) => {
            setproductdata(res.products);
            console.log(res.products);
        });

}, [id]);
const filterbyprice = (priceRange) => {
    if (!priceRange || priceRange.length < 2) return;

    const minprice = priceRange[0];
    const maxprice = priceRange[1];
  
    fetchDataFromAPI(
      `/api/products/products?minprice=${minprice}&maxprice=${maxprice}&subcategory=${id}`
    ).then((res) => {
      setproductdata(res.products);
    });
  
  };
const filterdata=(id)=>{
    fetchDataFromAPI(`/api/products/subCat/${id}`)

        .then((res) => {
            setproductdata(res.products);
            console.log(res.products);
        });

}


    return (
        <section className="product_list_page mt-3">
            <div className="container-fluid pr-5">
                <div className="productlisting d-flex">
                    <Sidebar filterdata={filterdata} filterbyprice={filterbyprice} data={productdata}   categoryId={id}/>


                    <div className="content_right ">
                        

                        <div className="showby mb-3 d-flex align-item-center">
                            <div className="d-flex btnWrapper">
                                <Button className="i1" onClick={()=>setproductview("one")}><GiHamburgerMenu /></Button>
                                <Button className="i2" onClick={()=>setproductview("two")}><BsFillGridFill /></Button>
                                <Button className="i3" onClick={()=>setproductview("three")}><TfiLayoutGrid3Alt /></Button>
                                <Button className="i4" onClick={()=>setproductview("four")}><TfiLayoutGrid4Alt /></Button>
                            </div>
                            <div className="ml-auto showbyfilter mr-4">
                                <Button onClick={handleClick}>show&nbsp; <FaAngleDown /></Button>

                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={opendropdown}
                                    onClose={handleClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>9</MenuItem>
                                    <MenuItem onClick={handleClose}>13</MenuItem>
                                    <MenuItem onClick={handleClose}>23</MenuItem>
                                </Menu>
                            </div>


                        </div>

                        <div className={`Productlisting ${productview || ""}`}>
                        <Productitem2 data={productdata} itemview={productview} />
                      
                        </div>
                    </div>


                </div>


            </div>
        </section>

    )
}
export default Listing;