import React, { useState, useEffect } from 'react'
import data from "./data.json"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import "./ProjectsTable.css";
import { URL } from "../App";
import { blueGrey, grey } from '@mui/material/colors';
import { toast, Toaster } from 'react-hot-toast';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: grey[800],
    color: theme.palette.common.white,
    '&:hover': {
      boxShadow: `0 0 10px ${blueGrey[300]}`, // Change the glow color on hover to secondary color #1B1340

    },
    fontWeight: 'bold', // Set font weight to bold
    //fontFamily: 'Georgia, serif', // Set font family to Georgia
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    fontWeight: 600,
    color: grey[900],
    //  fontFamily: 'Georgia, serif', // Set font family to Georgia
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,

  },
}));

export default function ProjectTable(props) {
  const navigate = useNavigate();

  useEffect(() => {
    // Update the document title using the browser API
    set_rows(props.allProjectData);
  }, [props.allProjectData]);


  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [aa, setaa] = useState(-1);
  const [rows, set_rows] = useState(data);

  const [projectTable, setProjectTable] = useState(true);
  const [requestTable, setRequestTable] = useState(true);



  const handleSort = (b, a, column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
    setaa(b);
    // console.log('column', column)
    const sortedRows = rows.filter(row => row.is_appr === a).sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      if(column==="project_id" || column==="sanc_order_no" || column==="project_grant"){
        aValue=parseInt(aValue);
        bValue=parseInt(bValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return isAsc ? aValue - bValue : bValue - aValue;
      } else {
        return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
    });


    set_rows(sortedRows.concat(rows.filter(row => row.is_appr === 1 - a)));
  };


  async function downloadBackup() {
    try {
      const response = await fetch(`${URL}/getProjectBackup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if(response.status === 500){
        throw new Error("Internal Server Error");
      }
      // Convert response to blob
      const blob = await response.blob();

      // Create a link element to trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      toast.error(`Export Failed, ${error.message}`, {
        style: {
          borderRadius: '10px',
          padding: '16px',
          color: '#291d58',
        },
        iconTheme: {
          primary: '#e6e1f7',
          secondary: '#291d58',
        },
      });
      // Handle error as needed
    }
  }

  const toggleProjectTable = () => {
    if (projectTable) {
      setProjectTable(false);
    }
    else {
      setProjectTable(true);
    }

  };
  const toggleRequestTable = () => {
    if (requestTable) {
      setRequestTable(false);
    }
    else {
      setRequestTable(true);
    }

  };




  return (
    <div className="tableContainer">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="custom-button"
          table="tbl1"
          filename="Project List"
          sheet="Sheet1"
          buttonText="Export Projects"
        /> */}
      

      <button className='custom-button' onClick={()=>downloadBackup()}>Export Projects</button>

      <button className='custom-button' onClick={() => toggleProjectTable()}> {projectTable ? 'Close Project Table' : 'Open Project Table'}</button>
      <button className='custom-button' onClick={() => toggleRequestTable()}>{requestTable ? 'Close Requests Table' : 'Open Requests Table'}</button>
      </div>
      
      {projectTable && (
        <>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1B1340', margin: '20px 0',marginRight:'46px' }}>Project Table</h2>
          </div>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 900 }}
              aria-label="customized table"
              //className="table"
              className="table custom-table"
              id="tbl1">
              <TableHead>
                <TableRow>

                  <StyledTableCell onClick={() => handleSort(0, 0, "project_id")} style={{ cursor: "pointer" }}>
                    ID
                    {orderBy === "project_id" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "project_id" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>

                  <StyledTableCell onClick={() => handleSort(0, 0, "email_id")} style={{ cursor: "pointer" }}>
                    Professor Mail
                    {orderBy === "email_id" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "email_id" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>

                  <StyledTableCell onClick={() => handleSort(0, 0, "pi")} style={{ cursor: "pointer" }}>
                    Investigators
                    {orderBy === "pi" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "pi" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>

                  {/* <StyledTableCell onClick={() => handleSort(0, 0, "co_pi")} style={{ cursor: "pointer" }}>
                Co-PI
                {orderBy === "co_pi" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                {orderBy === "co_pi" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
              </StyledTableCell> */}


                  <StyledTableCell onClick={() => handleSort(0, 0, "dept")} style={{ cursor: "pointer" }}>
                    Dept.
                    {orderBy === "dept" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "dept" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  
                  <StyledTableCell onClick={() => handleSort(0, 0, "fund_agency")} style={{ cursor: "pointer" }}>
                    Funding
                    {orderBy === "fund_agency" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "fund_agency" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(0, 0, "project_title")} style={{ cursor: "pointer" }}>
                    Title
                    {orderBy === "project_title" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "project_title" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(0, 0, "sanc_order_no")} style={{ cursor: "pointer" }}>
                    Order No.
                    {orderBy === "sanc_order_no" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "sanc_order_no" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  {/* <StyledTableCell onClick={() => handleSort(0, 0, "sanctioned_date")} style={{ cursor: "pointer" }}>
                Sanctd. Date
                {orderBy === "sanctioned_date" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                {orderBy === "sanctioned_date" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
              </StyledTableCell> */}

                  <StyledTableCell onClick={() => handleSort(0, 0, "project_grant")} style={{ cursor: "pointer" }}>
                    Project Cost
                    {orderBy === "project_grant" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "project_grant" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(0, 0, "duration")} style={{ cursor: "pointer" }}>
                    Duration
                    {orderBy === "duration" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "duration" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  {/* <StyledTableCell onClick={() => handleSort(0, 0, "start_year")} style={{ cursor: "pointer" }}>
                Year Sanctioned
                {orderBy === "start_year" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                {orderBy === "start_year" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
              </StyledTableCell> */}
                  {/* <StyledTableCell onClick={() => handleSort(0, 0, "dos")} style={{ cursor: "pointer" }}>
                DOS
                {orderBy === "dos" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                {orderBy === "dos" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort(0, 0, "doc")} style={{ cursor: "pointer" }}>
                DOC
                {orderBy === "doc" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                {orderBy === "doc" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
              </StyledTableCell> */}

                  <StyledTableCell >View Project</StyledTableCell>



                  <StyledTableCell onClick={() => handleSort(0, 0, "is_running")} style={{ cursor: "pointer" }}>
                    Status
                    {orderBy === "is_running" && order === "desc" && aa === 0 && <ArrowDownwardIcon />}
                    {orderBy === "is_running" && order !== "desc" && aa === 0 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  {props.userFlag === 1 ? (<StyledTableCell >Delete </StyledTableCell>) : (null)}
                  {props.userFlag === 1 || props.userFlag === 2 ? (<StyledTableCell >Update Status</StyledTableCell>) : (null)}
                  <StyledTableCell >Details</StyledTableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {rows.filter(row => row.is_appr === 0).map((row) => (
                  <StyledTableRow
                    key={row.project_id}
                    className={row.comm_flag === 1 ? "green" : ""}
                  >
                    <StyledTableCell component="th" scope="row" align="center">
                      {(row.project_id).toString().substring(0)}
                    </StyledTableCell>
                    {/* <StyledTableRow key={row.project_id} ref={(row) => Projectcolor(row.project_id)}>
                <StyledTableCell component="th" scope="row" align="center">
                  {(row.project_id).toString().substring(0)}
                </StyledTableCell> */}
                    <StyledTableCell align="center">{row.email_id}</StyledTableCell>
                    {/* <StyledTableCell align="center"> {`${row.pi} ${row.co_pi ? `(${row.co_pi})` : ''}`}</StyledTableCell> */}
                    <StyledTableCell align="center"> <div> PI: {row.pi}</div> <div>CO-PI: {row.co_pi}</div></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.pi}</StyledTableCell>
                <StyledTableCell align="center">{row.co_pi}</StyledTableCell> */}
                    <StyledTableCell align="center" style={{ padding: 0 }}>{row.dept}</StyledTableCell>
                    <StyledTableCell align="center">{row.fund_agency}</StyledTableCell>
                    <StyledTableCell align="center">{row.project_title}</StyledTableCell>
                    <StyledTableCell align="center">  <div>{row.sanc_order_no}</div> <div>({row.start_year})</div></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.sanctioned_date}</StyledTableCell> */}
                    <StyledTableCell align="center">{row.project_grant}</StyledTableCell>
                    <StyledTableCell align="center"><div>{row.dos}</div> <div>to</div>  <div> {row.doc}</div></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.start_year}</StyledTableCell> */}
                    {/* <StyledTableCell align="center">{row.dos}</StyledTableCell>
                <StyledTableCell align="center">{row.doc}</StyledTableCell> */}
                    <StyledTableCell align="center" style={{ padding: 0 }}><Button onClick={async () => {

                      var server_address = `${URL}/get_main_table`;
                      const resp2 = await fetch(server_address, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "jwt-token": localStorage.getItem("token"),
                        },
                        body: JSON.stringify({ project_id: row.project_id }),
                      });

                      const json_response = await resp2.json();

                      server_address = `${URL}/get_summary_table`;
                      const resp3 = await fetch(server_address, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "jwt-token": localStorage.getItem("token"),
                        },
                        body: JSON.stringify({ project_id: row.project_id }),
                      });

                      const json_response2 = await resp3.json();


                      navigate("/soe", { state: { userName: props.userName, userImg: props.userImg, userEmail: props.userEmail, projId: row.project_id, project_title: row.project_title, projProfName: row.pi, project_grant: row.project_grant, table_data: json_response, summary_table_data: json_response2, userFlag: props.userFlag, is_running: row.is_running } });

                    }} startIcon={<ArrowCircleRightIcon />} /></StyledTableCell>




                    <StyledTableCell align="center" style={{ padding: 0 }}>{row.is_running === 0 ? 'Running' : 'Completed'}</StyledTableCell>
                    {props.userFlag === 2 || props.userFlag === 3 ? (null) : (<StyledTableCell>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={async () => {
                          if (
                            window.confirm("Are you sure, you want to delete")
                          ) {
                            var server_address = `${URL}/del_project`;
                            const resp2 = await fetch(server_address, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({
                                p_id: row.project_id,
                                professors: row.email_id,

                              }),
                            });
                            // Runtime error check start
                            if (!resp2.ok) {
                              console.error("Failed to delete project:", resp2.statusText);
                            } else {
                              console.log("Project deleted successfully");
                            }
                            // Runtime error check end
                            const json_response = await resp2.json();

                            var server_address2 = `${URL}/project/`;

                            const resp3 = await fetch(server_address2, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({ sort: 1 }),
                            });
                            // Runtime error check start
                            if (!resp3.ok) {
                              console.error("Failed to fetch project data:", resp3.statusText);
                            } else {
                              console.log("Project data fetched successfully");
                            }
                            // Runtime error check end
                            const json_response2 = await resp3.json();

                            set_rows(json_response2);
                            // setTableShow(true);
                          }

                        }}
                      /></StyledTableCell>)}

                    {props.userFlag === 3 ? (null)
                      : row.is_running === 1 ? (<StyledTableCell align="center" style={{ padding: 0 }}>
                        <Button onClick={
                          async () => {
                            if (
                              window.confirm("Are you sure, you want to change the project to running")
                            ) {
                              var server_address =
                                `${URL}/updatestatus`;
                              const resp2 = await fetch(server_address, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "jwt-token": localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  p_id: row.project_id,
                                  professors: row.email_id,
                                  ans: 0
                                }),
                              });
                              const json_response = await resp2.json();

                              if (props.userFlag == 1) {
                                var server_address2 = `${URL}/project/`;
                                const resp3 = await fetch(server_address2, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "jwt-token": localStorage.getItem("token"),
                                  },
                                  body: JSON.stringify({ sort: 1 }),
                                });

                                const json_response2 = await resp3.json();

                                set_rows(json_response2);
                              }
                              else if (props.userFlag == 2) {
                                var server_address2 = `${URL}/project_prof/` + props.userEmail;
                                const resp2 = await fetch(server_address2, {
                                  method: "GET",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "jwt-token": localStorage.getItem("token"),
                                  },
                                });
                                const response2 = await resp2.json();

                                set_rows(response2);
                                // setTableShow(true);
                              }
                              // setTableShow(true);
                            }
                          }} startIcon={<CancelIcon />} /></StyledTableCell>)
                        :
                        (
                          <StyledTableCell align="center" style={{ padding: 0 }}>
                            <Button onClick={
                              async () => {
                                if (
                                  window.confirm("Are you sure, you want to complete the project")
                                ) {
                                  var server_address =
                                    `${URL}/updatestatus`;
                                  const resp2 = await fetch(server_address, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      "jwt-token": localStorage.getItem("token"),
                                    },
                                    body: JSON.stringify({
                                      p_id: row.project_id,
                                      professors: row.email_id,
                                      ans: 1
                                    }),
                                  });
                                  // const json_response = await resp2.json();

                                  if (props.userFlag === 1) {
                                    var server_address2 = `${URL}/project/`;
                                    const resp3 = await fetch(server_address2, {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "jwt-token": localStorage.getItem("token"),
                                      },
                                      body: JSON.stringify({ sort: 1 }),
                                    });

                                    const json_response2 = await resp3.json();

                                    set_rows(json_response2);
                                  }
                                  else if (props.userFlag === 2) {
                                    var server_address2 = `${URL}/project_prof/` + props.userEmail;
                                    const resp2 = await fetch(server_address2, {
                                      method: "GET",
                                      headers: {
                                        "Content-Type": "application/json",
                                        "jwt-token": localStorage.getItem("token"),
                                      },
                                    });
                                    const response2 = await resp2.json();

                                    set_rows(response2);
                                    // setTableShow(true);
                                  }
                                  // setTableShow(true);
                                }
                              }} startIcon={<CheckCircleIcon />} /></StyledTableCell>)}



                    {row.drive_link === null ? (null) : (<StyledTableCell align="center">
                      <Button
                        startIcon={<FileOpenIcon />}
                        onClick={async () => {
                          window.open(row.drive_link);
                        }}
                      />
                    </StyledTableCell>)}

                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {requestTable && (
        <>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1B1340', margin: '20px 0',marginRight:'40px' }}>Project Requests</h2>
          </div>


          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 900 }}
              aria-label="customized table"
              className="table custom-table"
              id="tbl2">
              <TableHead>
                <TableRow>
                  <StyledTableCell onClick={() => handleSort(1, 1, "project_id")} style={{ cursor: "pointer" }}>
                    ID
                    {orderBy === "project_id" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "project_id" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(1, 1, "email_id")} style={{ cursor: "pointer" }}>
                    Professor Mail
                    {orderBy === "email_id" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "email_id" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(1, 1, "pi")} style={{ cursor: "pointer" }}>
                    PI
                    {orderBy === "pi" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "pi" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  {/* <StyledTableCell onClick={() => handleSort(1, 0, "co_pi")} style={{ cursor: "pointer" }}>
                Co-PI
                {orderBy === "co_pi" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                {orderBy === "co_pi" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
              </StyledTableCell> */}
                  <StyledTableCell onClick={() => handleSort(1, 1, "dept")} style={{ cursor: "pointer" }}>
                    Department
                    {orderBy === "dept" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "dept" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(1, 0, "fund_agency")} style={{ cursor: "pointer" }}>
                    Funding
                    {orderBy === "fund_agency" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "fund_agency" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(1, 1, "project_title")} style={{ cursor: "pointer" }}>
                    Title
                    {orderBy === "project_title" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "project_title" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(1, 1, "sanc_order_no")} style={{ cursor: "pointer" }}>
                    Order No.
                    {orderBy === "sanc_order_no" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "sanc_order_no" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  {/* <StyledTableCell onClick={() => handleSort(1, 0, "sanctioned_date")} style={{ cursor: "pointer" }}>
                Sanctd. Date
                {orderBy === "sanctioned_date" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                {orderBy === "sanctioned_date" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
              </StyledTableCell> */}
                  <StyledTableCell onClick={() => handleSort(1, 1, "project_grant")} style={{ cursor: "pointer" }}>
                    Project Cost
                    {orderBy === "project_grant" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "project_grant" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  <StyledTableCell onClick={() => handleSort(1, 1, "duration")} style={{ cursor: "pointer" }}>
                    Duration
                    {orderBy === "duration" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                    {orderBy === "duration" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
                  </StyledTableCell>
                  {/* <StyledTableCell onClick={() => handleSort(1, 0, "start_year")} style={{ cursor: "pointer" }}>
                Year Sanctioned
                {orderBy === "start_year" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                {orderBy === "start_year" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
              </StyledTableCell> */}
                  {/* <StyledTableCell onClick={() => handleSort(1, 0, "dos")} style={{ cursor: "pointer" }}>
                DOS
                {orderBy === "dos" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                {orderBy === "dos" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort(1, 0, "doc")} style={{ cursor: "pointer" }}>
                DOC
                {orderBy === "doc" && order === "desc" && aa === 1 && <ArrowDownwardIcon />}
                {orderBy === "doc" && order !== "desc" && aa === 1 && <ArrowUpwardIcon />}
              </StyledTableCell> */}
                  {props.userFlag === 1 ? (<StyledTableCell >Approve </StyledTableCell>) : (null)}
                  <StyledTableCell >Delete </StyledTableCell>
                  <StyledTableCell >Details</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.filter(row => row.is_appr === 1).map((row) => (
                  <StyledTableRow key={row.project_id} className={"highlighted-row"}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {(row.project_id).toString().substring(0)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.email_id}</StyledTableCell>
                    <StyledTableCell align="center"> <div>{row.pi}</div> <div>({row.co_pi})</div></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.co_pi}</StyledTableCell> */}
                    <StyledTableCell align="center">{row.dept}</StyledTableCell>
                    <StyledTableCell align="center">{row.fund_agency}</StyledTableCell>
                    <StyledTableCell align="center">{row.project_title}</StyledTableCell>
                    <StyledTableCell align="center"><div>{row.sanc_order_no}</div> <div>({row.start_year})</div></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.sanctioned_date}</StyledTableCell> */}
                    <StyledTableCell align="center">{row.project_grant}</StyledTableCell>
                    <StyledTableCell align="center"><div>{row.dos}</div> <div>to</div>  <div> {row.doc}</div></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.start_year}</StyledTableCell> */}
                    {/* <StyledTableCell align="center">{row.dos}</StyledTableCell>
                <StyledTableCell align="center">{row.doc}</StyledTableCell> */}
                    {props.userFlag === 2 || props.userFlag === 3 ? (null) : (
                      <StyledTableCell align="center">
                        <Button onClick={
                          async () => {
                            if (
                              window.confirm("Are you sure, you want to approve the project")
                            ) {
                              var server_address =
                                `${URL}/appr_project`;
                              const resp2 = await fetch(server_address, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "jwt-token": localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  p_id: row.project_id,
                                  professors: row.email_id,

                                }),
                              });
                              const json_response = await resp2.json();

                              var server_address2 = `${URL}/project/`;
                              const resp3 = await fetch(server_address2, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "jwt-token": localStorage.getItem("token"),
                                },
                                body: JSON.stringify({ sort: 1 }),
                              });

                              const json_response2 = await resp3.json();

                              set_rows(json_response2);
                              // setTableShow(true);
                            }
                          }} startIcon={<CheckCircleIcon />} /></StyledTableCell>)}
                    <StyledTableCell>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={async () => {
                          if (
                            window.confirm("Are you sure, you want to delete")
                          ) {
                            var server_address =
                              `${URL}/del_project`;
                            const resp2 = await fetch(server_address, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({
                                p_id: row.project_id,
                                professors: row.email_id,

                              }),
                            });
                            const json_response = await resp2.json();

                            var server_address2 = `${URL}/project/`;
                            const resp3 = await fetch(server_address2, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({ sort: 1 }),
                            });

                            const json_response2 = await resp3.json();

                            set_rows(json_response2);
                            // setTableShow(true);
                          }

                        }}
                      /></StyledTableCell>
                    {row.drive_link === null ? (null) : (<StyledTableCell align="center">
                      <Button
                        startIcon={<FileOpenIcon />}
                        onClick={async () => {
                          window.open(row.drive_link);
                        }}
                      />
                    </StyledTableCell>)}

                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}


    </div>
  );
}
