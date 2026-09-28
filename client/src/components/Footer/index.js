import { LuMilk } from "react-icons/lu";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineDollar } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <div className="container-fluid">
                <div className="topinfo row">
                    < div className="col d-flex align-item-center">
                        <span><LuMilk /></span>
                        <span className="ml-2">Every Day Fresh Products</span>
                    </div>

                    < div className="col d-flex align-item-center">
                        <span><TbTruckDelivery /></span>
                        <span className="ml-2">Free delivery for order over $70</span>
                    </div>

                    < div className="col d-flex align-item-center">
                        <span><RiDiscountPercentLine /></span>
                        <span className="ml-2">Daily Mega Discounts</span>
                    </div>


                    < div className="col d-flex align-item-center">
                        <span><AiOutlineDollar /></span>
                        <span className="ml-2">Best price on the markety</span>
                    </div>
                </div>


                <div className="row mt-3 lingwrap">
                    <div className="col">
                        <h5>FRUIT & VEGETABLES</h5>
                        <ul>
                            <li><Link to="#">Fresh Vegetables</Link></li>
                            <li><Link to="#">Herbs & Seasonings</Link></li>
                            <li><Link to="#">Fresh Fruits</Link></li>
                            <li><Link to="#">Cuts & Sprouts</Link></li>
                            <li><Link to="#">Exotic Fruits & Veggies</Link></li>
                            <li><Link to="#">Packaged Produce</Link></li>
                            <li><Link to="#">Party Trays</Link></li>

                        </ul>

                    </div>

                    <div className="col">
                        <h5>BREAKFAST & DAIRY</h5>
                        <ul>
                            <li><Link to="#">Milk & Flavoured Milk</Link></li>
                            <li><Link to="#">Butter and Margarine</Link></li>
                            <li><Link to="#">Cheese</Link></li>
                            <li><Link to="#">Eggs Substitutes</Link></li>
                            <li><Link to="#">Honey</Link></li>
                            <li><Link to="#">Marmalades</Link></li>
                            <li><Link to="#">Sour Cream and Dips</Link></li>
                            <li><Link to="#">Yogurt</Link></li>


                        </ul>
                    </div>

                    <div className="col">
                        <h5>MEAT & SEAFOOD</h5>
                        <ul>

                            <li><Link to="#">Breakfast Sausage</Link></li>
                            <li><Link to="#">Dinner Sausage</Link></li>
                            <li><Link to="#">Beef</Link></li>
                            <li><Link to="#">Chicken</Link></li>
                            <li><Link to="#">Sliced Deli Meat</Link></li>
                            <li><Link to="#">Shrimp</Link></li>
                            <li><Link to="#">Wild Caught Fillets</Link></li>
                            <li><Link to="#">Crab and Shellfish</Link></li>
                            <li><Link to="#">Farm Raised Fillets</Link></li>


                        </ul>
                    </div>


                    <div className="col">
                        <h5>BEVERAGES</h5>
                        <ul>

                            <li><Link to="#">Water</Link></li>
                            <li><Link to="#">Sparkling Water</Link></li>
                            <li><Link to="#">Soda & Pop</Link></li>
                            <li><Link to="#">Coffee</Link></li>
                            <li><Link to="#">Milk & Plant-Based Milk</Link></li>
                            <li><Link to="#">Tea & Kombucha</Link></li>
                            <li><Link to="#">Drink Boxes & Pouches</Link></li>
                            <li><Link to="#">Craft Beer</Link></li>
                            <li><Link to="#">Wine</Link></li>


                        </ul>
                    </div>

                    <div className="col">
                        <h5>BREADS & BAKERY</h5>
                        <ul>
                            <li><Link to="#">Milk & Flavoured Milk</Link></li>
                            <li><Link to="#">Butter and Margarine</Link></li>
                            <li><Link to="#">Cheese</Link></li>
                            <li><Link to="#">Eggs Substitutes</Link></li>
                            <li><Link to="#">Honey</Link></li>
                            <li><Link to="#">Marmalades</Link></li>
                            <li><Link to="#">Sour Cream and Dips</Link></li>
                            <li><Link to="#">Yogurt</Link></li>


                        </ul>
                    </div>




                </div>





            </div>
        </footer>
    )
}
export default Footer;