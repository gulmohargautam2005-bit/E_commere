import Logo from "../../assets/images/theme-logo-dark.webp"
import { Link } from "react-router-dom"
import CountryDropdown from "../CountryDropdown"
import { FaSearch } from "react-icons/fa";
import Button from "@mui/material/Button";
import { CiUser } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { useContext, useState } from "react";
import { Mycontext } from "../../App";
import { useEffect } from "react";
import { fetchDataFromAPI } from "../../utils/api";
import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';



// ===========================================================
const Header = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [subcatdata, setsubcatdata] = useState([]);
  useEffect(() => {
    fetchDataFromAPI("/api/subCat").then(res => {
      setsubcatdata(res.subCategoryList);
    });
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };
  const handlewish = () => {
    navigate("/wishlist")
  }
  const handleorder = () => {
    navigate("/order")
  }





  const context = useContext(Mycontext);

  const cartCount = context.cartData?.length || 0;
  const cartSubtotal = context.cartData?.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + (item.subtotal || (price * quantity));
  }, 0) || 0;

  return (
    <div className="headerWrapper">
      <div className="">
        <div className="container">
          <p className="strip mb-0 mt-0 text-center"><strong>LIMITED TIME OFFER:&nbsp;  </strong>
            Get <strong>&nbsp; EXTRA 20% OFF </strong>&nbsp; on your first order —
            <strong>&nbsp; HURRY!</strong></p>
        </div>
      </div>
      <div className="header">
        <div className="container">
          <div className="row">
            <div className="logoWrapper d-flex align-item-center col-sm-2">
              <Link to={"/"}><img ms-auto src={Logo} alt="logo" /></Link>
            </div>
            <div className="col-sm-10 d-flex align-item-center part2">

              {
                context.countrylist !== 0 && <CountryDropdown />
              }

              <SearchBox />

              <div className="part3 d-flex align-items-center ml-auto">
                {
                  // <Button className='circle mr-3'><FaUser /></Button>
                  context.isLogin !== true ? (<Link to="/signin"><Button className="small-auth-btn mr-3 mt-0">Sign In</Button></Link>) :
                    (<><Button className='circle mr-3' onClick={handleClick}><FaUser /></Button><Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      disableScrollLock={true}
                      onClick={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={handleClose}>
                        <Avatar /> My account
                      </MenuItem>
                      <MenuItem onClick={handleorder}>
                        <Avatar /> Orders
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handlewish}>
                        <ListItemIcon>
                          <FaRegHeart />
                        </ListItemIcon>
                        wishlist
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu></>)
                }



                <div className="ml-auto cart-tab d-flex align-item-center">
                  <span className="price">&#8377;{cartSubtotal}</span>

                  <div className="position-relative ml-2">
                    <Link to="/cart"><Button size="small" className="circle ml-2 "><PiShoppingCartThin /></Button></Link>
                    <span className="d-flex align-item-center count justify-content-center">{cartCount}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Navigation navdata={subcatdata} />

    </div>

  )

};
export default Header;