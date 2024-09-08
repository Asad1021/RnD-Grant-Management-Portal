import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import chat from '../../images/chat.png';
import faq from '../../images/faq.png';
import help from '../../images/questions.png';
import phone from '../../images/phone.png';
import './sidebar.css';

function handleClick() {
  const email = 'dep.p03.2024@gmail.com';
  const subject = 'RnD Query';
  const body = ''; 
  
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.location.href = mailtoLink;
}

const Sidebar = () => (
  <div className="sidebar gpt3__brand section__padding">
    <div>
      {/* Navigate to Help page */}
      <Link to="/help" target="_blank" rel="noreferrer">
        <img
          src={help}
          alt="Help"
        />
      </Link>
    </div>
    <div>
      {/* Navigate to FAQ page */}
      <Link to="/faq" target="_blank" rel="noreferrer">
        <img
          src={faq}
          alt="FAQs"
        />
      </Link>
    </div>
    <div>
      {/* Call handleClick function when clicked */}
      <img
        src={chat}
        alt="Contact"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
    <div>
      {/* Navigate to Message page */}
      <Link to="/call" target="_blank" rel="noreferrer">
        <img
          src={phone}
          alt="Message"
        />
      </Link>
    </div>
  </div>
);

export default Sidebar;
