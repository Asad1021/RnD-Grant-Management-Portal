
import { Button, IconButton, Typography } from "@mui/material";
 import Buttons from 'react-bootstrap/Button';
import { FaGoogle } from "react-icons/fa";
import React, { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import GoogleLogo from "./images/Google.png";
import { toast, Toaster } from 'react-hot-toast';
import TextField from "@mui/material/TextField";
import "./login.css";
import { useEffect } from "react";
import OtpInput from 'react-otp-input';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import CustomizedTable from "./components/ProjectsTable";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { gapi } from 'gapi-script';
import { URL } from "./App";


const clientId =
  // "84294184491-0n3vkd0vr2taefrmv0g5se53h4cbe2ds.apps.googleusercontent.com";
  "60491003338-csa5oo4a1o1d8jvp6ejcqq8dq80k2sf2.apps.googleusercontent.com"

function Login() {

  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const [email, setemail] = useState()
  const [otp, setotp] = useState("")
  const navigate = useNavigate();
  const [otpRequested, setOtpRequested] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track user authentication

  const [countdown, setCountdown] = useState(30); // State to hold countdown value
  const [isResending, setIsResending] = useState(false); // State to track if OTP is currently being resent
  
  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) {
      // Call handleOtpVerificationSuccess function upon successful OTP verification
      handleOtpVerificationSuccess(userData);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isResending && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsResending(false); // Reset isResending state when countdown reaches 0
      setCountdown(30); // Reset countdown value
    }
    return () => clearTimeout(timer); // Cleanup function to clear the timer
  }, [countdown, isResending]);

  const onLoginSuccess = async (res) => {
    var server_address = `${URL}/authenticate`
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: res.tokenId,
        email: res.profileObj.email,
      }),
    });

    const jwt_data = await resp2.json();

    // console.log("JWT->", jwt_data)
    // console.log("status code is: " + resp2.status)
    if (resp2.status >= 400) {
      // if (jwt_data == -1) {
      var auth2 = gapi.auth2.getAuthInstance();
      toast.error('You are not a valid user', {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });
      // alert("You are not a valid USER!");
      navigate("/");
      auth2.signOut();
      return;
    }


    // the token received from the backend 

    // setting the token in local storage 
    localStorage.setItem("token", jwt_data.token)

    server_address = `${URL}/test_temp`
    const resp34 = await fetch(server_address, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
    });

    const data34 = await resp34.json();

    // console.log("checking jwt->", data34)



    console.log("Login Success:", res.profileObj);
    var server_address = `${URL}/user/` + res.profileObj.email;
    const resp = await fetch(server_address, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "jwt-token": localStorage.getItem("token"),
      },

    });
    const response = await resp.json();
    console.log("Server response", response);
    const flag = response;
    if (flag == -1) {
      var auth2 = gapi.auth2.getAuthInstance();
      toast.error('You are not a valid user', {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });
      navigate("/");
      auth2.signOut();


    }

    else {
      // console.log("This is: ", flag);
      navigate("/dashboard", { state: { userName: res.profileObj.givenName, userImg: res.profileObj.imageUrl, userEmail: res.profileObj.email, userFlag: flag } });
      console.log(res.profileObj);
      setShowloginButton(false);
      setShowlogoutButton(true);
    }

  };

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };
// Function to save user details to local storage
  const saveUserToLocalStorage = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Function to retrieve user details from local storage
  const getUserFromLocalStorage = () => {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  };

  // Function to remove user details from local storage
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('userData');
  };

  async function getOtp(EmailID) {
    if (EmailID.trim() === "") {
      toast.error('Email address cannot be empty', {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });
      return;
    }
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(EmailID)) {
      toast.error('Invalid email address format', {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });
      return;
    }
    if (EmailID.length > 320) { // Maximum email length according to RFC 5321
      toast.error('Email address is too long', {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });
      return;
    }
    try {
      const response = await fetch(`${URL}/generateOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_id: EmailID })
      });


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get OTP');
      }

      const result = await response.json();

      if (result.success) {
        setOtpRequested(true); // Set state to indicate OTP has been requested
        toast.success('OTP sent', {
          style: {
            borderRadius: '10px',
            padding: '16px',
            color: '#291d58',
          },
          iconTheme: {
            primary: '#e6e1f7',
            secondary: '#291d58',
          },
        });
      } else {
        toast.error(result.error, {
          style: {
            borderRadius: '10px',
            padding: '16px',
            color: '#291d58',
          },
          iconTheme: {
            primary: '#e6e1f7',
            secondary: '#291d58',
          },
        });
        // throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message, {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });;
    }
  }

  async function verifyOtp(EmailID, OTP) {
    try {
      const response = await fetch(`${URL}/verifyOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_id: EmailID, otp: OTP })
      });
      const responseData = await response.json(); // Parse response JSON

      if (responseData.message === "Invalid OTP") {
        toast.error("Invalid OTP", {
          style: {
            borderRadius: '10px',
            padding: '16px',
            color: '#291d58',
          },
          iconTheme: {
            primary: '#e6e1f7',
            secondary: '#291d58',
          },
        });
        return;
      }

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to verify OTP');
      }

      if (!responseData.auth) throw Error(responseData.message)

        const userData = {
          userName: responseData. user_name,
          userEmail: responseData.user_email,
          userFlag: responseData.user_type,
          token: responseData.token
        };
      // Call handleOtpVerificationSuccess function upon successful OTP verification
      handleOtpVerificationSuccess(userData);

      return responseData
    } catch (error) {
      throw new Error(error.message || 'Failed to verify OTP');
    }
  }

  const handleOtpVerificationSuccess = (userData) => {
    setIsAuthenticated(true); // Set user authentication state to true
    saveUserToLocalStorage(userData);
    localStorage.setItem("token", userData.token)
    // Redirect user to dashboard with user data
    navigate("/dashboard", {
      state: {
        userName: userData.userName,
        userEmail: userData.userEmail,
        userImg: userData.userImg,
        userFlag: userData.userFlag
      }
    });
  };

  const onSignoutSuccess = () => {
    toast.success('You have been logged out successfully', {
      style: {
        borderRadius: '10px',
        padding: '16px',
        color: '#291d58',
      },
      iconTheme: {
        primary: '#e6e1f7',
        secondary: '#291d58',
      },
    });
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
    navigate("/");
    window.location.reload();
  };

  const handleOtpChange = (otpValue) => {
    setotp(otpValue);
  };

  const handleResendOtp = (email) => {
    setIsResending(true); // Set isResending to true to start the countdown
    getOtp(email);
    // Example: getOtp(email);
  };

  return (
    <div className="otp-container"> {/* Add a container with flexbox properties */}
      <Toaster />
      {!otpRequested ? 
      
      
      (
        <div>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(event) => setemail(event.target.value)}
          />
          <br />
          <Buttons className="otp-button"
            color="primary"
            onClick={() => getOtp(email)}
            style={{ margin: "10px 0" }}
          >
            Send OTP
          </Buttons>
        </div>
      ) 
      
    
      : 
 
      
      (
        <div>
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            separator={<span className="otp-separator">-</span>}
            inputStyle="otp-input"
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
          />


          <Buttons className="otp-button"
            color="primary"
            onClick={() => verifyOtp(email, otp)}
            
          >
            Verify OTP
          </Buttons>

          <Buttons
            className="otp-button"
            color="primary"
            onClick={() => handleResendOtp(email)}
            
            disabled={isResending} // Disable button while countdown is active
          >
            Resend OTP
          </Buttons>
          {/* Display countdown timer */}
      {isResending && <p>Resend OTP in {countdown} seconds</p>}
        </div>
      )}
      <h2 className="or-heading">OR</h2>

      {showloginButton ? (
        <GoogleLogin
          clientId={clientId}
          render={(renderProps) => (
            <Button
              variant="contained"
              color="primary"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              style={{ backgroundColor: '#1b1340', color: '#ffffff', margin: '10px' }}
              startIcon={<img src={GoogleLogo} alt="Google Logo" style={{ height: '16px', width:'16px', margin: '4px', marginTop: '5px', marginBottom: '5px' }} />}
            >
              <Typography variant="body1" style={{ marginLeft: "8px", fontSize: "14px" }}
>
                Continue with Google
              </Typography>
            </Button>
          )}
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      ) : null}
      {showlogoutButton ? (
        <GoogleLogout
          clientId={clientId}
          render={(renderProps) => (
            <button
              className="loginButton"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Logout
            </button>
          )}
          buttonText="Sign Out"
          onLogoutSuccess={onSignoutSuccess}
        ></GoogleLogout>
      ) : null}
    </div>
  );


}
export default Login;

