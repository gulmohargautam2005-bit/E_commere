import { TfiAngleDown } from "react-icons/tfi";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import React from "react";
import Slide from '@mui/material/Slide';
import { Mycontext } from "../../App";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const CountryDropdown = () => {
    const context = useContext(Mycontext)

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedtab, setselectedtab] = useState(null);
    const [countrylist, setcountrylist] = useState([])
    const [selectedcountry,setSelectedCountry]=useState("india")
     useEffect(() => {
        setcountrylist(context.countrylist);
    }, [context.countrylist])

    const selectcountry = (index) => {
        setselectedtab(index)
        setSelectedCountry(countrylist[index].country);
        setIsOpenModal(false)
    
    }
   


    const filterlist = (e) => {
        const Keyword = e.target.value.toLowerCase();
        if (Keyword !== "") {
            const list = context.countrylist.filter((item) => {
                return item.country.toLowerCase().includes(Keyword)
            });
            setcountrylist(list)
        }
        else {
            setcountrylist(context.countrylist);
        }
    }

        return (
            <>
                <Button className="countryDrop d-flex"   onClick={() => {setcountrylist(context.countrylist);setIsOpenModal(true);}}>
                    <div className="d-flex flex-column">
                        <span className="info_ label">your location</span>
                        <span className="name">{context.selectedcountry!==""?selectedcountry:"Select Location"}</span>
                    </div>
                    <span ms-auto ml-auto ><TfiAngleDown /></span>
                </Button>

                <Dialog open={isOpenModal}   disableScrollLock={true}   className="location" onclose={() => setIsOpenModal(false)} TransitionComponent={Transition}>
                    <h4>Choose your Delivery Location</h4>
                    <p>Enter your address and we will specify the offer for your area.</p>
                    <Button className="close_" onClick={() => setIsOpenModal(false)}><IoMdClose /></Button>

                    <div className="Headersearch2 w-auto mb-3">
                        <input onChange={filterlist} placeholder="search your area...." type="text" />
                        <Button  ><FaSearch /></Button>
                    </div>
                    <ul className="clist">
                        {
                            countrylist?.length !== 0 && countrylist?.map((item, index) => {
                               

                                return (
                                    <li key={index}><Button onClick={() => selectcountry(index)}
                                        className={`${selectedtab === index ? "active" : ''}`}

                                    >{item.country}</Button></li>
                                )
                            })
                        }




                    </ul>
                </Dialog>
            </>
        )

    };
export default CountryDropdown;