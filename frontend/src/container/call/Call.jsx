import React, { useState } from 'react';
import './call.css';
import NavbarCompHome from '../../components/NavbarCompHome';

const phoneNumbers = [
  { id: 1, name: 'Emergency', number: '911' },
  { id: 2, name: 'Police', number: '100' },
  { id: 3, name: 'Fire Department', number: '101' },
  // Add more numbers as needed
];

const Call = () => {
  const [copied, setCopied] = useState(false);

  const handleClick = (number) => {
    navigator.clipboard.writeText(number); // Copy number to clipboard
    setCopied(true); // Set copied to true
    setTimeout(() => setCopied(false), 3000); // Reset copied after 3 seconds
  };

  return (
    <div>
      <NavbarCompHome />

      <div className="Call-container">
        <h1 className="Call-title">Contact R&D Department IIT Ropar</h1>
        {copied && <p className="copy-msg">Phone number copied!</p>}
        <div className="Call-content">
          <table className="phone-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {phoneNumbers.map((phoneNumber) => (
                <tr key={phoneNumber.id} onClick={() => handleClick(phoneNumber.number)}>
                  <td>{phoneNumber.name}</td>
                  <td>{phoneNumber.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Call;
