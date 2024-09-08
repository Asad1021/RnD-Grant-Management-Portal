import React from 'react';
import './footer.css';
import location from '../../images/placeholder.png';
import call from '../../images/call.png';
const Footer = () => (
  <div className="gpt3__footer section__padding">


    <div className="gpt3__footer-links">
      
      <div className="gpt3__footer-links_div">
        <h4>Quick Finds</h4>
        <p><a href="https://www.iitrpr.ac.in/circulars" target="_blank" rel="noreferrer">Circulars</a></p>
        <p><a href="https://www.iitrpr.ac.in/annual-reports" target="_blank" rel="noreferrer">Annual Reports</a></p>
        <p><a href="https://www.iitrpr.ac.in/crf1" target="_blank" rel="noreferrer">Central Research Facilities</a></p>
        
      </div>
      <div className="gpt3__footer-links_div">
        <h4>Useful Links</h4>
        <p><a href="https://www.iitrpr.ac.in/indo-taiwan/" target="_blank" rel="noreferrer">Indo-Taiwan Joint Research Centre</a></p>
        <p><a href="https://www.iitrpr.ac.in/research-iit-roar" target="_blank" rel="noreferrer">Research @ IIT Ropar</a></p>
        <p><a href="https://www.iitrpr.ac.in/research/research-highlights" target="_blank" rel="noreferrer">Research Highlights</a></p>
      </div>

      <div className="gpt3__footer-links_div">
      <h4>Other Links</h4>
        <p><a href="https://www.iitrpr.ac.in/helpdesk/" target="_blank" rel="noreferrer">Help Desk</a></p>
        <p><a href="https://www.iitrpr.ac.in/store-purchase/" target="_blank" rel="noreferrer">Store & Purchase</a></p>
        <p><a href="https://www.iitrpr.ac.in/telephone-directory" target="_blank" rel="noreferrer">Institute Telephone Directory</a></p>
      </div>


      <div className="gpt3__footer-links_div">
        <h4>Contact Details</h4>
        <p>Indian Institute of Technology Ropar, Rupnagar,Punjab - 140001,India</p>
        <p><img src={call} /> +91 88888 99999</p>
        <p>
    <img src={location} />
    <a href="https://www.google.co.in/maps/dir/Rupnagar+Old+Bus+Stand,+Chhota+Khera,+Basant+Nagar,+Rupnagar,+Punjab/Indian+institute+of+Technology+Ropar,+Bara+Phool,+Punjab/@30.9744724,76.4618648,13z/am=t/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3905543310e70e63:0x63397d7938035537!2m2!1d76.5338166!2d30.9669695!1m5!1m1!1s0x390554d4ffffffff:0xb81f1e2708c91100!2m2!1d76.473305!2d30.9686169?entry=ttu" target="_blank" rel="noreferrer">
        How to Reach IIT Ropar
    </a>
</p>
      </div>
    </div>

    <div className="gpt3__footer-copyright">
      <p>Copyright © 2024, IIT Ropar</p>
    </div>
  </div>
);

export default Footer;