import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mycontext } from '../../App';
const Sidebar = (props) => {
    const handlePriceChange = (val) => {
        console.log("Slider range:", val);
        setvalue(val);
        props.filterbyprice(val);   // send price to parent
    };
    console.log(props.data)
    const context = useContext(Mycontext);
    const [selectedCat, setSelectedCat] = useState(null);
    const [value, setvalue] = useState([100, 6000])
    const parentCategoryId = props.data?.[0]?.category?._id;

    const handleChange = (id) => {
        setSelectedCat(id);
        props.filterdata(id)
    }
    const filteredSubCats = context.subCatData?.filter(
        (item) => item.category?._id?.toString() === parentCategoryId?.toString()
    );
    console.log("parentCategoryId:", parentCategoryId);
    console.log("subcats:", context.subCatData);



    return (
        <>
            <div className="sidebar">

                {/* PRODUCT CATEGORIES */}
                <div className="filterbox">
                    <h6>PRODUCT CATEGORIES</h6>

                    <div className="scroll mt-4">
                        <ul>

                            {
                                filteredSubCats?.length !== 0 && filteredSubCats?.map((item, index) => {
                                    console.log(context.subCatData)
                                    return (<li>

                                        <FormControlLabel
                                            checked={selectedCat === item._id}
                                            sx={{
                                                color: "#9ca3af",
                                                '&.Mui-checked': {
                                                    color: "#2bbef9",
                                                },
                                            }}
                                            onChange={() => handleChange(item?._id)}
                                            control={<Checkbox />} label={item?.subCat} />

                                    </li>)
                                })
                            }


                            {/* Biscuits & Snacks */}
                            <li>
                                <FormControlLabel control={<Checkbox />} label="Biscuits & Snacks" />
                            </li>

                            {/* Breads & Bakery */}
                            <li>
                                <FormControlLabel control={<Checkbox />} label="Breads & Bakery" />
                                <ul>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Buns and Rolls" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Cakes and Cupcakes" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Cookies and Brownies" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Donuts and Muffins" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Order Specialty Cakes" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Packaged Breads" /></li>
                                </ul>
                            </li>

                            {/* Breakfast & Dairy */}
                            <li>
                                <FormControlLabel control={<Checkbox />} label="Breakfast & Dairy" />
                                <ul>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Butter and Margarine" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Cheese" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Eggs Substitutes" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Honey" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Marmalades" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Milk & Flavoured Milk" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Sour Cream and Dips" /></li>
                                    <li className='sexa'><FormControlLabel control={<Checkbox />} label="Yogurt" /></li>
                                </ul>
                            </li>

                            <li><FormControlLabel control={<Checkbox />} label="Frozen Foods" /></li>
                            <li><FormControlLabel control={<Checkbox />} label="Fruits & Vegetables" /></li>
                            <li><FormControlLabel control={<Checkbox />} label="Grocery & Staples" /></li>
                            <li><FormControlLabel control={<Checkbox />} label="Household Needs" /></li>
                            <li><FormControlLabel control={<Checkbox />} label="Meats & Seafood" /></li>

                        </ul>
                    </div>
                </div>

                {/* FILTER BY PRICE */}
                <div className="filterbox pr-5">


                    <h6>FILTER BY PRICE</h6>
                    <RangeSlider
    value={value}
    onInput={(val) => setvalue(val)}
    onThumbDragEnd={() => props.filterbyprice(value)}
    min={100}
    max={6000}
    step={5}
/>


                    <div className="d-flex pt-2 pb-2 priceRange">
                        <span>
                            From: <strong className="text-success">Rs: {value[0]}</strong>
                        </span>

                        <span className="ml-auto">
                            From: <strong className="text-success">Rs: {value[1]}</strong>
                        </span>
                    </div>

                </div>

                {/* PRODUCT STATUS */}
                <div className="filterbox mt-5">
                    <h6>PRODUCT STATUS</h6>
                    <ul>
                        <li className='sexa'><FormControlLabel control={<Checkbox />} label="In Stock" /></li>
                        <li className='sexa'> <FormControlLabel control={<Checkbox />} label="On Sale" /></li>
                    </ul>
                </div>

                {/* BRANDS */}
                <div className="filterbox">
                    <h6>BRANDS</h6>
                    <ul>

                        {
                            props.data?.length !== 0 &&
                            props.data?.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label={item?.brand}
                                        />
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>

                <Link to="#"><img src="https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif"></img></Link>

            </div>
        </>
    );
};

export default Sidebar;
