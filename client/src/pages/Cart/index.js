import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import Quantity from "../../components/Quantity";
import { RxCross2 } from "react-icons/rx";
import Button from "@mui/material/Button";
import { Mycontext } from "../../App";
import { useContext, useEffect } from "react";
import { fetchDataFromAPI } from "../../utils/api";
import { useState } from "react";
import {  deletedata } from "../../utils/api"; 
import { Editdata } from "../../utils/api";

const Cart = () => {
 
    const removeItem = (id) => {
        deletedata(`/api/cart/${id}`).then(() => {  // ← use deletedata not fetchDataFromAPI
          setcartData(prev => prev.filter(item => item._id !== id));
        })
      };
    const updateQuantity = (cartItemId, price, newQty) => {
        // update subtotal locally immediately
        setcartData(prev => prev.map(item =>
          item._id === cartItemId
            ? { ...item, quantity: newQty, subtotal: newQty * price }
            : item
        )) 
          Editdata(`/api/cart/${cartItemId}`, {
            quantity: newQty,
            subtotal: newQty * price,
          }).then((res) => {
            console.log("Backend updated:", res); // ← check if this fires
          }).catch((err) => {
            console.error("Failed to update quantity:", err);
          });
        
      };

    const [productquantity,setproductquantity]=useState(1);
    const [cartData, setcartData] = useState([])
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        fetchDataFromAPI(`/api/cart?userId=${user?.userid}`).then((res) => {
          setcartData(res.cartList || []);
          console.log(res.cartList)
        });
      }, []);
      const totalAmount = cartData.reduce((sum, item) => sum + item.subtotal, 0);
      const totalQ = cartData.reduce((sum, item) => sum + item.quantity, 0);
    return (
        <>
            <section className="section mt-4 mb-5 cartpage">
                <div className="container mt-5">

                    <p>there are {totalQ} products in your cart</p>
                    <div className="row">
                        <div className="border col-md-9">


                            <div className="table-responsive ">
                                <table className="table mt-4">
                                    <thead>
                                        <tr>
                                            <th width="42%">product</th>
                                            <th>unit price</th>
                                            <th>Quantity</th>

                                            <th width="15%">sub-total</th>
                                            <th>remove</th>

                                        </tr>
                                    </thead>
                                </table>
                                <table>
                                    {
                                        cartData.length!==0 && cartData.map((item,index)=>{
                                            return(<>
                                                            <tbody>
                                                        <tr>
                                                            <td width="35%">
                                                                <Link to="/product/1">
                                                                    <div className="d-flex align-item-center carti">
                                                                        <div className="imgwrapper mt-2 mb-2">
                                                                            <img className="w-100" src={item?.image} />
                                                                        </div>

                                                                        <div className="info px-3">
                                                                            <h6>{item?.title.split(' ').slice(0, 6).join(' ') + '...'}</h6>
                                                                            <Rating name="half-rating-read" Value={item?.rating} precision={0.5} readOnly />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            <td width="10%">Rs.{item?.price}</td>
                                                            <td className="ml-4">  <Quantity  initialValue={item.quantity}  quantity={(val) => updateQuantity(item._id, item.price, val)}/></td>
                                                            <td width="15%">Rs.{item?.subtotal}</td>
                                                            <td width="8%"><span className="remove"  onClick={() => removeItem(item._id)}><RxCross2 /></span></td>
                                                        </tr>
                                                    </tbody>
                                             </>)
                                        })
                                    }
                                 
                                </table>
                            </div>


                        </div>

                        <div className="col-md-3 ">
                            <div className="shadow p-3 card-details">
                                <h4>CART TOTAL</h4>


                                <div className="d-flex align-items-center mb-3">
                                    <span >subtotal</span>
                                    <span className="ml-auto t-red font-weight-bold">Rs.{totalAmount}</span>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <span >shipping</span>
                                    <span className="ml-auto"><b>free</b></span>
                                </div>

                          


                                <div className="d-flex align-items-center mb-3">
                                    <span >total</span>
                                    <span className=" ml-auto t-red font-weight-bold">Rs.{totalAmount}</span>
                                </div>

                                <br />
                                <br />
                                <br />
                                <br />
                                <Button className="checkout-btn ml-5">
                                    Proceed to Checkout
                                </Button>


                            </div>







                        </div>
                    </div>

                </div>
            </section>


        </>
    )
}
export default Cart;