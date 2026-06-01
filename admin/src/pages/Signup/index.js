import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import './Signup.css';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { postDataToAPI } from '../../utils/api';



const Signup = () => {

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
  const [open, setOpen] = useState(false);
  const [khula, setkhula] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
    navigate("/login")

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
  // Simple validation


  // // Simple authentication (replace with actual auth logic)
  // if (email === 'admin@hotash.com' && password === 'admin123') {
  //   localStorage.setItem('adminAuth', 'true');
  //   navigate('/dashboard');
  // } else {
  //   setError('Invalid email or password');
  // }

  return (
    <div className="admin-login-page">

      <div className="login-container">

        <div className="login-header">
          <div className="login-logo">
            <span className="logo-text">HOTASH</span>
          </div>
          <h2>Admin Signup</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={signup} className="login-form">



          <div className="form-group">
            <label>
              <FaUser className="input-icon" />
              Email Address
            </label>
            <input
              type="email"
              value={formfield.email}
              name="email"

              onChange={onchangeinput}
              placeholder="Enter your email"

            />
          </div>

          <div className="form-group">
            <label>
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              name="password"

              value={formfield.password}
              onChange={onchangeinput}
              placeholder="Enter your password"
             
            />
          </div>


          <div className="form-group">
            <div className='row'>
              <div className='col-md-6'>
                    <label>
                    <FaLock className="input-icon" />
                     Name
                  </label>
                  <input
                    type="name"
                    name="name"

                    value={formfield.name}
                    onChange={onchangeinput}
                    placeholder="Enter your name"
                  
                  />
             

              </div>
              <div className='col-md-6'>
                  <label>
                  <FaLock className="input-icon" />
                  Phone:
                </label>
                <input
                  type="phone"
                  name="phone"

                  value={formfield.phone}
                  onChange={onchangeinput}
                  placeholder="Enter your phone no:"
                
                />

              </div>
            </div>
           
            
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
        
          </div>

          <button type="submit" className="login-button">
            Sign up
          </button>
        </form>

     
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
    </div>
  );
};

export default Signup;

