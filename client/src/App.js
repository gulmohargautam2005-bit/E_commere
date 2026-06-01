import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './components/Footer';
import Listing from './pages/Listing';
import Listing1 from './pages/Listing/Listing1';
import Cart from './pages/Cart';
import Cart1 from './pages/cart1';
import Wishlist1 from './pages/Wishlist1';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Productmodal from './components/Productmodal';
import { fetchDataFromAPI, postDataToAPI } from './utils/api';
import ProductDetails from './pages/ProductDetails';
import ProductDetails1 from './pages/ProductDetails/ProductDetails1';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Home1 from './pages/home1';
import Checkout1 from './pages/Checkout/Checkout1.jsx';
import OrderPage from './pages/order/index.js';
import MyAccount from './pages/MyAccount';

const Mycontext = createContext();

function App() {

  // sound
  const playSuccessSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";

    // success tone
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      900,
      audioCtx.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.3
    );

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  };
  // 2
  const playBeep = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 800;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioCtx.currentTime + 0.3
    );
  };
  // 
  const [open, setOpen] = useState(false);
  const [khula, setkhula] = useState(false);
  const [error, setError] = useState('');

  const [productdata, setproductdata] = useState([]);
  const [productmodal, setproductmodal] = useState({ id: "", open: false });
  const [countrylist, setcountrylist] = useState([]);
  const [electronicdata, setelectronicdata] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [catData, setcatData] = useState([]);
  const [cartData, setcartData] = useState([])
  const [cartfield, setcartfield] = useState([])
  const [isheaderfootershow, setisheaderfootershow] = useState(true);
  const [isLogin, setisLogin] = useState(false);
  const [user, setuser] = useState({});
  useEffect(() => {
    getcountry("https://countriesnow.space/api/v0.1/countries/");
  }, [])


  useEffect(() => {
    if (!productmodal.id) return;  // guard: don't fetch when id is empty
    fetchDataFromAPI(`/api/products/${productmodal.id}`).then((res) => {
      setproductdata(res);
    })  // check what your api util expects
  }, [productmodal.id])

  useEffect(() => {
    fetchDataFromAPI("/api/category/").then((res) => {
      setcatData(res);
    })
  }, [])
  useEffect(() => {
    fetchDataFromAPI("/api/subCat").then(res => {
      setSubCatData(res.subCategoryList);
    });
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== '' && token !== undefined && token !== null) {
      setisLogin(true);
      const userdata = JSON.parse(localStorage.getItem("user"));
      setuser(userdata);

      const userId = userdata?.userid || userdata?.id || userdata?._id;
      if (userId) {
        fetchDataFromAPI(`/api/cart?userId=${userId}`)
          .then((res) => {
            if (res && res.cartList) {
              setcartData(res.cartList);
            }
          })
          .catch((err) => {
            console.warn("Failed to load cart on mount:", err);
          });
      }
    }

  }, [])

  const getcountry = async (url) => {
    const response = await axios.get(url).then((res) => {
      setcountrylist(res.data.data)
      console.log(res.data.data)
    })


  }
  const addtocart = (data) => {
    postDataToAPI("/api/cart/add", data).then((res) => {
      if (res !== null && res !== undefined && res !== "") {
        setError("Added succesfully");
        setkhula(true);
        playSuccessSound();
        setcartData((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          if (list.some((item) => item._id === res._id || item.productId === res.productId)) {
            return list;
          }
          return [...list, res];
        });

      }
    }).catch((err) => {
      const msg = err?.response?.data?.msg || "Something went wrong";
      setError(msg); // "Item already in cart"
      setOpen(true);
      playBeep();

    });

  }
  const addToWishlist = (data) => {
    postDataToAPI("/api/Whishlist/add", data).then((res) => {
      if (res !== null && res !== undefined && res !== "") {
        setError("Added succesfully");
        setkhula(true);
        playSuccessSound();

      }
    }).catch((err) => {
      const msg = err?.response?.data?.msg || "Something went wrong";
      setError(msg); // "Item already in cart"
      setOpen(true);
      playBeep();

    });

  }
  const values = {
    countrylist,
    isheaderfootershow,
    setisheaderfootershow,
    isLogin,
    setisLogin,
    productmodal,
    setproductmodal,
    electronicdata,
    setelectronicdata,
    catData, setcatData,
    subCatData,
    setSubCatData,
    addtocart,
    cartData, setcartData, addToWishlist
  }

  return (
    <BrowserRouter>
      <Mycontext.Provider value={values}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" exact={true} element={<Home1 />} />
          <Route path="/cat" exact={true} element={<Listing1 />} />
          <Route path="/subcat/:id" element={<Listing1 />} />
          <Route path="/cart" exact={true} element={<Cart1 />} />
          <Route path="/checkout1" exact={true} element={<Checkout1 />} />

          <Route path="/wishlist" exact={true} element={<Wishlist1 />} />
          <Route path="/signin" exact={true} element={<Signin />} />
          <Route path="/signup" exact={true} element={<Signup />} />
          <Route path="/product/:id" exact={true} element={<ProductDetails1 />} />
          <Route path="/order" exact={true} element={<OrderPage />} />
          <Route path="/my-account" exact={true} element={<MyAccount />} />
        </Routes>
        {productmodal.open === true && (
          <Productmodal
            open={productmodal.open}
            id={productmodal.id}
            data={productdata}
            onClose={() => setproductmodal({ id: "", open: false })}
            zoomDisabled={true}
          />
        )}
      </Mycontext.Provider >
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={khula}
        autoHideDuration={3000}
        onClose={() => setkhula(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </BrowserRouter>
  );
}

export default App;
export { Mycontext };
