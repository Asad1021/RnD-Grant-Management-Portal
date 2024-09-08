// Chat.jsx
import React from 'react';
import './chat.css';

import NavbarCompHome from '../../components/NavbarCompHome';

const Chat = () => {
  return (
    <div>
       <NavbarCompHome />
    <div className="Chat-container">
       
      <h1 className="Chat-title">Chat Page</h1>
      <div className="Chat-content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue semper lacus, vel fermentum nisi accumsan in. Donec aliquam leo nec justo varius tincidunt. Integer vestibulum luctus ex, et commodo lacus ultricies vel. In hac habitasse platea dictumst. Quisque nec fermentum arcu. Proin eget fermentum sem, ac cursus mauris. Sed auctor diam vitae efficitur mattis. Sed lobortis, justo id tincidunt placerat, neque justo gravida nunc, et consequat justo risus vel purus. Sed at sapien vel tellus ultricies viverra a at dui. Phasellus laoreet justo a lectus tempus, sit amet dignissim dolor tincidunt. Integer tincidunt, sapien eu tempus tincidunt, erat justo hendrerit lectus, eget mattis lectus risus ut velit. Fusce nec leo scelerisque, tristique diam sed, eleifend dui. In bibendum purus ac metus tempor, vel fermentum tortor dignissim.
        </p>
        <p>
          Vivamus ut lacus vel neque tincidunt consequat. Fusce nec sem ex. Phasellus rhoncus magna et lorem ultricies laoreet. Cras id metus eget neque ullamcorper commodo non ut velit. Sed finibus feugiat felis, vitae sollicitudin eros suscipit et. In vel sapien at velit elementum ultricies. Nulla auctor eros id tempus rhoncus. Phasellus vitae malesuada lectus. Donec eget lacus at eros pretium pharetra vitae sed arcu. Nunc sollicitudin velit sed leo malesuada, nec lobortis elit malesuada. Mauris auctor mauris in mi hendrerit, a fermentum turpis malesuada. Donec pulvinar bibendum felis ac feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ac laoreet ligula. Nam quis nisi eget velit pellentesque condimentum ac quis justo.
        </p>
      </div>
    </div>
    </div>
  );
};

export default Chat;
