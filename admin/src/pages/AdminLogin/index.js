import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import './AdminLogin.css';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { postDataToAPI } from '../../utils/api';



const AdminLogin = () => {

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


    postDataToAPI("/api/user/signin",formfield).then((res)=>{


     localStorage.setItem("token",res.token)
     const user ={
      name:res.user?.name,
      email:res.user?.email,
      userid:res.user?.id,
     }
     localStorage.setItem("user",JSON.stringify(user))
    console.log(res);
    setError("Login succesfull");
    setkhula(true);
    playSuccessSound();
    window.location.href="/dashboard"

    }).catch((err) => {
      // — shows server error message in snackbar
      const msg = err?.response?.data?.msg || "Login failed";
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
          <h2>Admin Login</h2>
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


       

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
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
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLogin;

