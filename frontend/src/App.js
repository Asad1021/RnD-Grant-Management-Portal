import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import ReactDOM from "react-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Dashboard from "./components/Dashboard";
import SOE from "./components/SOE";
import Manageuser from "./components/manageuser";
import { Footer,Navbar, Sidebar, Help, Faq, Call, Chat} from './container';

export const URL=process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    
    <HashRouter>
      {/*<Navbar />*/ }
      <div className="app-container">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/manageuser" element={<Manageuser />} />
        <Route exact path="/soe" element={<SOE />} />
        <Route exact path="/help" element={<Help/>} /> 
        <Route exact path="/faq" element={<Faq/>} /> 
        <Route exact path="/call" element={<Call/>} /> 
        <Route exact path="/chat" element={<Chat/>} /> 
        
      </Routes>
      {/* <Sidebar/> */}
      {/* <Footer />  */}
      </div>
    </HashRouter>
  );
  
}
export default App;
