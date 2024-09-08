import React from 'react';
import logoIIT1 from "../images/logo1.jpg";
import { Navbar, Nav } from 'react-bootstrap';
import { Sidebar} from '../container';
export default function NavbarCompHome() {
  return (
    <>
      <Navbar expand="lg" className='navbarClassHome' style={{ height: 'auto', backgroundColor: '#1B1340', padding: '15px 100px' }}>
        <Navbar.Brand>
          <img className='photo' src={logoIIT1} alt="" height='75px' style={{ width: 'auto', paddingRight: '4px', backgroundColor: 'white' }} />
        </Navbar.Brand>
        <Navbar.Brand className='IITText' style={{ fontSize: '18px', color: 'white' }}>
          Indian Institute of Technology Ropar <br />
          भारतीय प्रौद्योगिकी संस्थान रोपड़
        </Navbar.Brand>
        <Sidebar/>
          <Nav className="ms-auto" style={{ maxHeight: '150px' }} navbarScroll>
            {/* Add Nav items here */}
          </Nav>
       
      </Navbar>
    </>
  );
}
