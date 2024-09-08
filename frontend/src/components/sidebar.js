import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { FaHome, FaUserMinus, FaUsersCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { GoogleLogout } from "react-google-login";
import { URL } from "../App";
import { toast, Toaster } from 'react-hot-toast';
import profilepic from "../images/user.jpg";


const drawerWidth = 15;
const clientId =
  "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com";

export default function PermanentDrawerLeft(props) {
  const navigate = useNavigate();

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
    // alert("You have been logged out successfully");

    navigate("/");
    window.location.reload();
  };
  const logout = () => {

    localStorage.removeItem('userData');
    localStorage.removeItem('token');

    gapi.load('auth2', function () {
      gapi.auth2.init();
    });
    var auth2 = gapi.auth2.getAuthInstance();
    navigate("/");
    console.log("LOGOUT");
    auth2.signOut();
    window.location.reload();
    toast.success('Logged out successfully', {
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
    // alert("Logged out successfully");
  }
  const toDashboard = () => {

    navigate("/dashboard", { state: { userName: props.userName, userImg: props.userImg, userEmail: props.userEmail, userFlag: props.userFlag } });
  }
  const toManageUser = async () => {


    try {
      var server_address = `${URL}/user/` + props.userEmail;
      const resp = await fetch(server_address, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
      });
      const response = await resp.json();
      // console.log("Server response", response);

      if (response !== 1) {
        toast.error('You are not the admin', {
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
      navigate("/manageuser", { state: { userName: props.userName, userImg: props.userImg, userEmail: props.userEmail, userFlag: props.userFlag } });

    } catch (error) {
      console.error("Error:", error);
      toast.error('Error in fetching user data', {
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

    }

  }

  return (
    <>
      <div><Toaster /></div>
      <Box sx={{ display: 'flex' }} className="Drawer">
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ width: ` ${drawerWidth}%`, ml: `${drawerWidth}%` }}
        >

        </AppBar>
        <Drawer
          sx={{
            width: `${drawerWidth}%`,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: `${drawerWidth}%`,
              boxSizing: 'border-box',
              border: 'none',
              backgroundColor: '#1B1340',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              color: '#fff',


            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          {/* {console.log(props.userImg)}
        {console.log(props.userEmail)} */}


          {/* <span className="userImgContainer">
            <img className='userImage' src='./chat.png' alt='user Image' />
          </span> */}
          <span className="userImgContainer">
            {props.userImg ? (
              <img className='userImage' src={props.userImg} alt={props.userImg} />
            ) : (

              <span className="userImgContainer">
                <img className='userImage' src={profilepic} alt='user Image' />
              </span>
            )}
          </span>


          <span className='userInfo'>Welcome {props.userName}</span>
          <span className='userInfo'>{props.userEmail}</span>

          {/* <span className='userInfo'>{props.userFlag === 1 ? "Admin" : ""}{props.userFlag === 2 ? "Professor" : ""}{props.userFlag === 3 ? "Fellow" : ""}</span> */}
          <div style={{ backgroundColor: '#6D4AFF', display: 'inline-block', padding: '4px', borderRadius: '14px', textAlign: 'center', margin: "6px", marginBottom: '20px' }}>
            <span className='userInfo' style={{ fontWeight: 'bold' }}>
              {props.userFlag === 1 ? "Admin" : ""}
              {props.userFlag === 2 ? "Professor" : ""}
              {props.userFlag === 3 ? "Fellow" : ""}
            </span>
          </div>

          <Divider />
          {props.userFlag === 1 ? (
            <ul className='ulSideBar'>


              <li onClick={toDashboard} className='liSideBar'>
                <span className='iconSideBar'><FaHome /></span>
                <span className='titleSideBar'>Dashboard</span>
              </li>

              <li onClick={toManageUser} className='liSideBar'>
                <span className='iconSideBar'><FaUsersCog /></span>

                <span className='titleSideBar'>Manage Users</span>
              </li>
              <li onClick={logout} className='liSideBar'>
                <span className='iconSideBar'><FaUserMinus /></span>

                <GoogleLogout
                  clientId={clientId}
                  render={(renderProps) => (
                    <span
                      className='titleSideBar'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Logout
                    </span>
                  )}
                  buttonText="Sign Out"
                  onLogoutSuccess={onSignoutSuccess}
                ></GoogleLogout>
              </li>
            </ul>
          ) : (
            <ul className='ulSideBar'>
              <li onClick={toDashboard} className='liSideBar'>
                <span className='iconSideBar'><FaHome /></span>
                <span className='titleSideBar'>Dashboard</span>
              </li>
              <li onClick={logout} className='liSideBar'>
                <span className='iconSideBar'><FaUserMinus /></span>

                <GoogleLogout
                  clientId={clientId}
                  render={(renderProps) => (
                    <span
                      className='titleSideBar'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Logout
                    </span>
                  )}
                  buttonText="Sign Out"
                  onLogoutSuccess={onSignoutSuccess}
                ></GoogleLogout>
              </li>
            </ul>
          )}

          <Divider />
        </Drawer>
      </Box>
    </>

  );
}
