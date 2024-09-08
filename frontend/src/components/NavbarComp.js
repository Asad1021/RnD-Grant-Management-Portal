import React from 'react';
import logoIIT1 from "../images/logo1.jpg";
import { Navbar, Nav } from 'react-bootstrap';


export default function NavbarComp() {
  return (
    <>
      <Navbar bg="light" expand="lg" className='navbarClass' style={{ height: 'auto', padding: '15px', backgroundColor: '#1b1340' }}>
        <Navbar.Brand><img className='photo' src={logoIIT1} alt="" height='75px' /></Navbar.Brand>
        <Navbar.Brand className='IITText' style={{ fontSize: '18px', color: 'black' }}>
          Indian Institute of Technology Ropar <br />
          भारतीय प्रौद्योगिकी संस्थान रोपड़
        </Navbar.Brand>
        {/* <Sidebar/> */}
          <Nav className="ms-auto" style={{ maxHeight: '100px' }} navbarScroll>
            {/* Add Nav items here */}
          </Nav>
       
      </Navbar>
    </>
  );
}
