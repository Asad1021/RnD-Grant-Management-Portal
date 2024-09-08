import React from 'react'
import NavbarCompHome from './NavbarCompHome';
import Login from '../Login';
import './Home.css';
import { Footer, Navbar, Sidebar } from '../container';

import logo from "../images/logo1.jpg";

export default function Home() {


  return (
    <>
      <NavbarCompHome />
      <div className='first'>

        <div className='right-column' >

          <h3 style={{ fontStyle: 'normal', letterSpacing: '-1px', padding: '1px' }}>Welcome To</h3>
          <h3 style={{ fontStyle: 'normal', letterSpacing: '-1px', padding: '1px' }}>R&D Grant Management Portal</h3>
          <h3 style={{ fontStyle: 'normal', letterSpacing: '-1px', padding: '1px' }}>IIT Ropar</h3>
        </div>

        <div className='left-column'>

          <div className='homeClass text-center' style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>
              {/* <h4 style={{ marginTop: '0' }}>Welcome To </h4> */}
              <img src={logo} alt="Logo" style={{ width: 'auto', height: '140px' }} />
              <h3 style={{ fontWeight: 'bold', color: '#1B1340', fontStyle: 'normal', letterSpacing: '-1px', padding: '10px' }}>Sign in to your Account</h3>
              <Login />
            </div>
          </div>


        </div>

      </div>

      <Footer />
    </>
  );
}