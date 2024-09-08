import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SOE_Table from "./SOE_Table";
import NavbarComp from "./NavbarComp";
import PermanentDrawerLeft from "./sidebar";


export default function SOE() {
  const { state } = useLocation();
  const [tableShow, setTableShow] = useState(false);
  // const [all_projects,setall_projects] = useState(null);
  // console.log(state.userImg);
  // console.log("HELPL");
  // console.log(state.userName);
  // console.log(state.userEmail);
  // console.log("The project id is: "+ (state.projId).toString().substring(0))

  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    projId: state.projId,
    project_title: state.project_title,
    projProfName:state.projProfName,
    project_grant:state.project_grant,
    table_data : state.table_data,
    summary_table_data : state.summary_table_data,
    userFlag: state.userFlag,
    is_run: state.is_running
  };
  

  
    const [comment, setComment] = useState('');
  
    const handleSubmit = () => {
      console.log(comment);
    };

    const [openAddCommentPopup, setOpenAddCommentPopup] = useState(false)
  return (
    <div>
      <NavbarComp />
      {/* {tableShow ? <SOE_Table data={all_projects} /> : null} */}
      {/* <div className="projectInfo"> */}
        
      {/* </div> */}
      <div className="projectHeading">
        <div className="projInfo">
        <span>Project Id: {(state.projId).toString().substring(0)}</span>
        <span>Project Title: {state.project_title}</span>
        <span>PI Name: {state.projProfName}</span>
        <span>Total Cost: ₹{state.project_grant}</span>
        </div>

        <div className="hr"></div>

        {/* <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '32px', color: '#333',marginTop:"40px",marginBottom:"15px",marginLeft:"35px" }}>Statement of Expenditure</h2> */}

      </div>
      <SOE_Table {...obj}/>
      
      <PermanentDrawerLeft {...obj}></PermanentDrawerLeft>
    </div>
  );
}
