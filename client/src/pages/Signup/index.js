import { useContext, useEffect } from "react";
import { Mycontext } from "../../App";
import Logo from "../../assets/images/theme-logo-dark.webp"

import TextField from '@mui/material/TextField';
import { useState } from 'react';

import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { postDataToAPI } from '../../utils/api';








const Signup = () => {
     // 
  const [open, setOpen] = useState(false);
  const [khula, setkhula] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
    // ===================
    // sound effect
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
  // 2
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
  // 
    // ===================
    const [formfield, setformfield] = useState({
        email: "",
        password: "",
        name:"",
        phone:''
    
      });

      const signup = (e) => {
        e.preventDefault();
    
        if (!formfield.email) {
          setError("Email is required");
          setOpen(true);
          playBeep();
          return;
        }
        if (!formfield.password) {
          setError("Password is required");
          setOpen(true);
          playBeep();
          return;
        }
        if (!formfield.name) {
          setError("Name is required");
          setOpen(true);
          playBeep();
          return;
        }
        if (!formfield.phone) {
          setError("Phone is required");
          setOpen(true);
          playBeep();
          return;
        }
        postDataToAPI("/api/user/signup",formfield).then((res)=>{
        console.log(res);
        setError("signup succesfull");
        setkhula(true);
        playSuccessSound();
        navigate("/signin")

    
        }).catch((err) => {
            // — shows server error message in snackbar
            const msg = err?.response?.data?.msg || "Signup failed";
            setError(msg);
            setOpen(true);
            playBeep();

          });
    
      };
      const onchangeinput = (e) => {
        setformfield((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
    
        }))
      }

    const navigate = useNavigate();
    const handleGoogleLogin = async () => {

        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User:", result.user);
            alert("Login successful!");
            Context.setisheaderfootershow(true);
            navigate("/");
        } catch (error) {
            console.log("ERROR CODE:", error.code);
            console.log("ERROR MESSAGE:", error.message);
        }
    };

    const Context = useContext(Mycontext)

    useEffect(() => {
        Context.setisheaderfootershow(false)

    }, []);
    return (

        <section className="section signInPage">
            <div className="shape-bottom">
                <svg
                    fill="#fff"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 1921 819.8"
                    style={{ enableBackground: "new 0 0 1921 819.8" }}
                    xmlSpace="preserve"
                >
                    <path
                        className="st0"
                        d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
                    />
                </svg>
            </div>
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img className="w-100" src={Logo} />
                    </div>
                    <h2>sign up</h2>

                    <form onSubmit={signup}>
                        <div className="row">
                            <div className="col-mod-6  ml-3">
                                <div className="form-group ">
                                    <TextField id="standard-basic" onChange={onchangeinput} label="Full-Name"   name="name" value={formfield.name} type="text" variant="standard" required />
                                </div>
                            </div>

                            <div className="col-mod-6 ml-3">

                                <div className="form-group2 ">
                                    <TextField id="standard-basic"  onChange={onchangeinput}  name="phone" value={formfield.phone} label="Contact" type="number" variant="standard" required />
                                </div>


                            </div>
                        </div>
                        <div  className="row">
                                <div className="form-group mb-4 col-md-6">
                                    <TextField id="standard-basic" label="Email" onChange={onchangeinput}  value={formfield.email}  name="email" type="Email" variant="standard" required />
                                </div>

                                <div className="form-group2 mb-4  col-md-6">
                                    <TextField id="standard-basic"   name="password" onChange={onchangeinput} value={formfield.password} label="Password" type="Password" variant="standard" required />
                                </div>
                        </div>
                       
                        <div className="d-flex align-items-center mt-3 mb-3 row ">
                            <Button fullWidth className="col mr-3" type="submit"
                                sx={{
                                    height: '45px',              // THIS controls thickness
                                    fontSize: '20px',
                                    fontWeight: 800,
                                    marginTop: '29px',
                                    marginBottom: '19px',
                                    borderRadius: '16px',
                                    color: "white",
                                    background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
                                    boxShadow: '0 16px 40px rgba(79, 70, 229, 0.45)',
                                    textTransform: 'uppercase',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4338ca, #1d4ed8)',
                                        boxShadow: '0 22px 50px rgba(79, 70, 229, 0.55)',
                                    }
                                }}>Sign Up</Button>

                                <Button fullWidth variant="outlined" className="col"
                                sx={{
                                    height: '45px',              // THIS controls thickness
                                    fontSize: '20px',
                                    fontWeight: 800,
                                    marginTop: '29px',
                                    marginBottom: '19px',
                                    borderRadius: '16px',
                                    color: "#2563eb",
                                    background: '#fff',
                                    boxShadow: '0 16px 40px rgba(79, 70, 229, 0.45)',
                                    textTransform: 'uppercase',
                                    '&:hover': {
                                        background: '#2563eb',
                                        color: "#fff"

                                    }
                                }} onClick={() => {
                                    Context.setisheaderfootershow(true);
                                    navigate("/");
                                }}>Cancel </Button>





                        </div>




                        <h6 className="mt-3 text-center font-weight-bold">Or continue with social account</h6>
                        <Button className="google-btn" onClick={handleGoogleLogin}>
                            <span className="google-icon">
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.7 3.2l6.5-6.5C35.3 2.3 30 0 24 0 14.6 0 6.6 5.5 2.7 13.4l7.6 5.9C12.3 13 17.6 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.1 24.5c0-1.7-.2-3.3-.5-4.9H24v9.2h12.4c-.5 2.7-2 5-4.3 6.5l6.7 5.2c3.9-3.6 6.3-8.9 6.3-16z" />
                                    <path fill="#FBBC05" d="M10.3 28.3c-.5-1.4-.8-2.9-.8-4.3s.3-3 .8-4.3l-7.6-5.9C1 17.2 0 20.5 0 24s1 6.8 2.7 10.2l7.6-5.9z" />
                                    <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.7l-6.7-5.2c-2 1.4-4.5 2.2-9.3 2.2-6.4 0-11.7-3.5-13.7-8.3l-7.6 5.9C6.6 42.5 14.6 48 24 48z" />
                                </svg>
                            </span>
                            Continue with Google
                        </Button>




                    </form>
                </div>

            </div>
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
        </section>
        
    );


}
export default Signup;