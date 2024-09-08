import React from 'react';
import './help.css';
import NavbarCompHome from '../../components/NavbarCompHome';
import adminflow from './images/adminflow.png'
import Expense from './images/expense.png'
import user from './images/user.png'
import st from './images/st.png'
import addp from './images/addp.png'
import search from './images/search.png'
const helpItems = [
  {
    id: 1,
    imageUrl: adminflow,
    title: 'Admin Roles',
    text: 'Here is a detailed flowchart of Admin Page and the functionalities supported for Admin',
  },
  {
    id: 2,
    imageUrl: search,
    title: 'Search for a project',
    text: 'From the dashboard itself you can search for the project by giving appropriate key',
  },
  {
    id: 2,
    imageUrl: addp,
    title: 'Add New Project',
    text: 'Admin can add new project and professor can request new project',
  },
  {
    id: 2,
    imageUrl: st,
    title: 'Details of the project',
    text: 'From project table, you can navigate to summary page that contains detailed summary tables',
  },
  {
    id: 2,
    imageUrl: Expense,
    title: 'Add New Expense',
    text: 'Expenses can be added for a project in their summary page',
  },
  {
    id: 2,
    imageUrl: user,
    title: 'Add New User',
    text: 'Admin can add new user ',
  },

];

const Help = () => {
  return (
    <div>
      <NavbarCompHome />
    <div className="help-page">
      
      <h1> Navigation through R&D Grant Mangement Portal Made Easy!</h1>
      <div className="help-container">
        {helpItems.map((item) => (
          <div key={item.id} className="help-box">
            <img src={item.imageUrl} alt={`Image ${item.id}`} />
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Help;
