import React, { useState, useEffect } from 'react';
import './CSS/LoginSignup.css';
import toast from 'react-hot-toast';

const LoginSignup = () => {

  const [state ,setState] = useState("LOGIN");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [showAdminCheckbox, setShowAdminCheckbox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adminKeySequence, setAdminKeySequence] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    const handleKeyDown = (event) => {
      if (!isMobile) {
        // show checkbox - 'Alt' + 'A' 
        if (event.altKey && event.key === 'a') {
          setShowAdminCheckbox(true);
        }
        // hide checkbox - 'Alt' + 'H'
        if (event.altKey && event.key === 'h') {
          setShowAdminCheckbox(false);
        }
      } else {
        // Key sequence for mobile
        setAdminKeySequence((prevSequence) => {
          const newSequence = [...prevSequence, event.key.toLowerCase()];
          if (newSequence.slice(-2).join('') === 'ad') {
            setShowAdminCheckbox(true);
          } else if (newSequence.slice(-2).join('') === 'hi') {
            setShowAdminCheckbox(false);
          }
          return newSequence;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);
  
  const chanegHandler = (e)=> {
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const login = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please enter valid email and password.')
      return;
    }
    if (!isAdminLogin && (formData.password.length < 6 || formData.password.length > 8)) {
      toast.error("Password must be between 6 and 8 characters.");
      return;
    }
    // console.log(formData);
    let responseData;
    const loginEndpoint = isAdminLogin ? '/api/admin/login' : '/api/login';
    await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        // Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.setItem('userName', responseData.name || ''); 
      localStorage.setItem('userEmail', formData.email);
      if (responseData.isAdmin) {
        localStorage.setItem('isAdmin', 'true'); 
        toast.success('Admin Login Successful.');
        setTimeout(() => {
          window.location.replace("http://localhost:5174/listproduct"); // Redirect to admin panel
        }, 1500);
      } else {
        localStorage.removeItem('isAdmin');
        localStorage.setItem('userName', responseData.name || ''); 
        localStorage.setItem('userEmail', formData.email);
        toast.success('Login Successful.');
        setTimeout(() => {
          window.location.replace("/");
        }, 1500);
      }
    } else if (responseData?.error) {
      toast.error(responseData.error);
    } else {
      toast.error('Login Failed. Please try again.');
    }
  }

  const signup = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please enter require fields.");
      return;
    }
    if (formData.password.length < 6 || formData.password.length > 8) {
      toast.error("Password must be between 6 and 8 characters.");
      return;
    }
    // console.log(formData);
    let responseData;
    await fetch('/api/signup', {
      method: 'POST',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data);
    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      localStorage.setItem('userName', formData.username);
      localStorage.setItem('userEmail', formData.email);
      toast.success('Registration Successful.');
      setTimeout(() => {
        window.location.replace("/");
      }, 1500);
    } else if (responseData?.error) {
      toast.error(responseData.error);
    } else {
      toast.error('Registration Failed. Please try again.');
    }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "SIGN UP" ? <input name='username' value={formData.username} onChange={chanegHandler} type="text" placeholder="Your Name" /> : <></>}
          <input name='email' value={formData.email} onChange={chanegHandler} type="email" placeholder="Email" required />
          <input name='password' value={formData.password} onChange={chanegHandler} type="password" placeholder="Password" required />
        </div>

        <button onClick={() => { state === "LOGIN" ? login() : signup() }}>Continue</button>
        {state === "SIGN UP" ?
          <p className='loginsignup-login'>Already have an account ? <span onClick={() => { setState("LOGIN") }}>Login here</span></p> :
          <p className='loginsignup-login'>Create an account ? <span onClick={() => { setState("SIGN UP") }}>SignUp here</span></p>
        }
        {state === "LOGIN" && showAdminCheckbox && (
          <div className="admin-login-checkbox">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
            />
            <label htmlFor="isAdmin"> Login as Admin</label>
          </div>
        )}
        {isMobile && state === "LOGIN" && !showAdminCheckbox && (
          <p className="admin-hint"></p>  // type "ad" - show checkbox for mobile
        )}
        {isMobile && state === "LOGIN" && showAdminCheckbox && (
          <p className="admin-hint"></p>  // type "hi" - hide checkbox for mobile
        )}
      </div>
    </div>
  )
}

export default LoginSignup;
