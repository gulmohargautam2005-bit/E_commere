import { FaAngleDown } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom"
import { RiMenLine } from "react-icons/ri";
import { useState } from "react";

import { FaAppleAlt } from "react-icons/fa";
import { GiMeat, GiBread, GiMilkCarton } from "react-icons/gi";
import { MdLocalDrink, MdOutlineCookie } from "react-icons/md";
import { LuSnowflake } from "react-icons/lu";
import { FiShoppingBag } from "react-icons/fi";
import { Mycontext } from "../../../App";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';


const Navigation = () => {

    const navigate = useNavigate();
    const { subCatData } = useContext(Mycontext);
    const groupedSubCats = subCatData.reduce((acc, item) => {
        const catName = item.category?.name || "Other";
      
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(item);
      
        return acc;
      }, {});

    const [isopensidebarval, setsidebarval] = useState(false);
    return (
        <nav>
            <div className="container">
                <div className="row">
                    <div className="col-sm-2 navpart1">
                        <div className="catwrapper">
                            <Button className="allcattab  d-flex text-nowrap" onClick={() => setsidebarval(!isopensidebarval)}>
                                <span className="mr-2"><IoMenu /></span>
                                <span className="text">All Categories</span>
                                <span className="ml-2"><FaAngleDown /></span>
                            </Button>
                            <div className={`sidebar ${isopensidebarval ? "open" : ""}`}><ul>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><FaAppleAlt /></span>&nbsp;<span className="text">&nbsp;Fruits & Vegetables</span></Button></Link>
                                    <div className="submenu">
                                        <Link to="/"><Button>Clothing</Button></Link>
                                        <Link to="/"><Button>Footwear</Button></Link>
                                        <Link to="/"><Button>Watches</Button></Link>
                                        <Link to="/"><Button>Bags & Backpacks</Button></Link>
                                        <Link to="/"><Button>Sunglasses</Button></Link>
                                        <Link to="/"><Button>Jewellery</Button></Link>
                                        <Link to="/"><Button>Ethnic Wear</Button></Link>


                                    </div>
                                </li>



                                <li><Link to="/"><Button>&nbsp;<span className="icon"><GiMeat /></span>&nbsp;&nbsp;<span className="text">Meats & Seafood</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>Chicken</Button></Link></li>
                                        <li><Link to="/"><Button>Mutton</Button></Link></li>
                                        <li><Link to="/"><Button>Fish</Button></Link></li>
                                        <li><Link to="/"><Button>Prawns</Button></Link></li>
                                        <li><Link to="/"><Button>Crab</Button></Link></li>
                                        <li><Link to="/"><Button>Cold Cuts</Button></Link></li>
                                        <li><Link to="/"><Button>Ready-to-Cook</Button></Link></li>

                                    </div>
                                </li>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><GiMilkCarton /></span>&nbsp;&nbsp;<span className="text">Breakfast & Dairy</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>Milk</Button></Link></li>
                                        <li><Link to="/"><Button>Curd & Yogurt</Button></Link></li>
                                        <li><Link to="/"><Button>Butter & Cheese</Button></Link></li>
                                        <li><Link to="/"><Button>Bread & Toast</Button></Link></li>
                                        <li><Link to="/"><Button>Cereals</Button></Link></li>
                                        <li><Link to="/"><Button>Eggs</Button></Link></li>
                                        <li><Link to="/"><Button>Breakfast Spreads</Button></Link></li>

                                    </div>
                                </li>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><MdLocalDrink /></span>&nbsp;&nbsp;<span className="text">Beverages</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>Soft Drinks</Button></Link></li>
                                        <li><Link to="/"><Button>Fruit Juices</Button></Link></li>
                                        <li><Link to="/"><Button>Tea</Button></Link></li>
                                        <li><Link to="/"><Button>Coffee</Button></Link></li>
                                        <li><Link to="/"><Button>Energy Drinks</Button></Link></li>
                                        <li><Link to="/"><Button>Health Drinks</Button></Link></li>
                                        <li><Link to="/"><Button>Water</Button></Link></li>

                                    </div>
                                </li>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><GiBread /></span>&nbsp;&nbsp;<span className="text">Breads & Bakery</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>White Bread</Button></Link></li>
                                        <li><Link to="/"><Button>Brown Bread</Button></Link></li>
                                        <li><Link to="/"><Button>Buns & Pav</Button></Link></li>
                                        <li><Link to="/"><Button>Cakes</Button></Link></li>
                                        <li><Link to="/"><Button>Pastries</Button></Link></li>
                                        <li><Link to="/"><Button>Cookies</Button></Link></li>
                                        <li><Link to="/"><Button>Bakery Snacks</Button></Link></li>

                                    </div>
                                </li>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><LuSnowflake /></span>&nbsp;&nbsp;<span className="text">Frozen Foods</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>Frozen Vegetables</Button></Link></li>
                                        <li><Link to="/"><Button>Frozen Snacks</Button></Link></li>
                                        <li><Link to="/"><Button>Frozen Parathas</Button></Link></li>
                                        <li><Link to="/"><Button>Ice Cream</Button></Link></li>
                                        <li><Link to="/"><Button>Frozen Meat</Button></Link></li>
                                        <li><Link to="/"><Button>French Fries</Button></Link></li>
                                        <li><Link to="/"><Button>Ready Meals</Button></Link></li>

                                    </div>
                                </li>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><MdOutlineCookie /></span>&nbsp;&nbsp;<span className="text">Biscuits & Snacks</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>Biscuits</Button></Link></li>
                                        <li><Link to="/"><Button>Cookies</Button></Link></li>
                                        <li><Link to="/"><Button>Chips</Button></Link></li>
                                        <li><Link to="/"><Button>Namkeen</Button></Link></li>
                                        <li><Link to="/"><Button>Chocolates</Button></Link></li>
                                        <li><Link to="/"><Button>Wafers</Button></Link></li>
                                        <li><Link to="/"><Button>Healthy Snacks</Button></Link></li>

                                    </div>
                                </li>
                                <li><Link to="/"><Button>&nbsp;<span className="icon"><FiShoppingBag /></span>&nbsp;&nbsp;<span className="text">Grocery & Staples</span></Button></Link>
                                    <div className="submenu">
                                        <li><Link to="/"><Button>Rice</Button></Link></li>
                                        <li><Link to="/"><Button>Wheat & Flour</Button></Link></li>
                                        <li><Link to="/"><Button>Pulses & Dal</Button></Link></li>
                                        <li><Link to="/"><Button>Cooking Oils</Button></Link></li>
                                        <li><Link to="/"><Button>Spices</Button></Link></li>
                                        <li><Link to="/"><Button>Sugar & Salt</Button></Link></li>
                                        <li><Link to="/"><Button>Dry Fruits</Button></Link></li>

                                    </div>
                                </li>
                            </ul></div>

                        </div>
                    </div>
                    <div className="col-sm-9 navpart2 d-flex align-items-center">
                        <ul className="list list-inline w-100">
                            <li>
                            <Button onClick={() => navigate("/")}>Home</Button>
                            </li>
                            {Object.keys(groupedSubCats).map(cat => (
                                <li key={cat} className="list-inline-item">
                                    <Link to="#">{cat}</Link>

                                    <div className="submenu shadow">
                                   
                                        {groupedSubCats[cat].map(sub => (
                                           
                                            <Link key={sub._id} to={`/subCat/${sub._id}`}>
                                               
                                                <Button>{sub.subCat}</Button>
                                                
                                            </Link>
                                          
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav >
    )
}
export default Navigation;