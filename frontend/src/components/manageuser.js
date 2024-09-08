import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import AddUserPopup from "./AddUserPopup";
import NavbarComp from "./NavbarComp";
import PermanentDrawerLeft from "./sidebar";
import { BsFillTrashFill } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import data from "./data.json";
import Box from "@mui/material/Box";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ViewCommentPopup from "./ViewCommentPopup";
import RemoveUserPop from "./RemoveUserPop";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { URL } from "../App";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ExampleDoc from './import_user.xlsx';
import "./ManageUser.css";
import { toast, Toaster } from 'react-hot-toast';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Manageuser() {
  const { state } = useLocation();

  const [rows, set_rows] = useState(data);
  const [currentadmin, setcurrentadmin] = useState(0);
  const [currentUserEmail, setcurrentUserEmail] = useState("");
  const [newUserRole, setnewUserRole] = useState();
  const [newUserEmail, setnewUserEmail] = useState();
  const [newUsername, setnewUsername] = useState();
  const [newDepartment, setnewDepartment] = useState();
  const [openAddUserPopup, setopenAddUserPopup] = useState(false);
  const [searchOption, setsearchOption] = useState("");
  const [searchProject, setsearchProject] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  const [searchError, setSearchError] = useState(false);

  const searchFieldRef = useRef(null);
  const handleSearchOptionChange = (event) => {
    const selectedOption = event.target.value;

    // Disable the search box if the selected option is "Clear"
    if (selectedOption === "") {
      setIsSearchEnabled(false);
      setsearchProject(""); // Clear the search box value
      searchFieldRef.current.value = ""; // Clear the search field text
    } else {
      setIsSearchEnabled(true);
    }

    // Set the search option state
    setsearchOption(selectedOption);
  };
  useEffect(async () => {


    try {
      var server_address = `${URL}/get_user`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
        }),
      });
      const response = await resp2.json();
      // console.log("Server response", response);
      set_rows(response);
      await get_users();
    } catch (error) {
      console.log("Error in get_user in useEffect", error);
      toast.error('Fetch user failed', {
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

    }

  }, []);

  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    isDashboard: state.isDashboard,
    userFlag: state.userFlag,
  };

  const [openRemoveUserPop, setOpenRemoveUserPop] = useState(false);



  async function get_users() {

    try {
      var server_address = `${URL}/get_user`;

      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
        }),
      });

      const response = await resp2.json();
      // console.log("Server response", response);
      set_rows(response);
    } catch (error) {
      console.log("Error in get_user", error);
      toast.error('Get user failed', {
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

    }

  }
  async function add_user_on_click() {


    if (newUserEmail[0] === "@") {
      toast.error('Invalid email address format', {
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
      return;
    }
    if (newUserEmail.trim() === "") {
      toast.error('Email address cannot be empty', {
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
      return;
    }
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail)) {
      toast.error('Invalid email address format', {
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
      return;
    }
    if (newUserEmail.length > 320) { // Maximum email length according to RFC 5321
      toast.error('Email address is too long', {
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
      return;
    }


    // if (!newUserEmail.includes("iitrpr.ac.in")) {
    //   toast.error('Only IIT Ropar email addresses are allowed', {
    //     style: {
    //       borderRadius: '10px',
    //       padding: '16px',
    //       color: '#291d58',
    //     },
    //     iconTheme: {
    //       primary: '#e6e1f7',
    //       secondary: '#291d58',
    //     },
    //   });

    //   return;
    // }
    if (newUsername.trim() === "") {
      toast.error('Enter a name', {
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
      return;
    }
    if (newDepartment.trim() === "") {
      toast.error('Select a department', {
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
      return;
    }
    if (newUserRole === "") {
      toast.error('Select a Role', {
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
      return;
    }



    var index = newUserEmail.indexOf("@");
    var pre = newUserEmail.substring(0, index);
    var post = newUserEmail.substring(index);
    pre = pre.replace(".", "dot");
    var newEmail_id = pre + post;

    const userExists = rows.find(row => row.email_id === newUserEmail);
    if (userExists) {
      toast.error('Email already exists', {
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
      return;
    }

    try {
      var server_address = `${URL}/user`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          new_email_id: newEmail_id,
          email_id: newUserEmail,
          name: newUsername,
          admin: newUserRole,
          department: newDepartment
        }),
      });

      const response = await resp2.json();
      set_rows(response);
      setopenAddUserPopup(false);
      toast.success('User added successfully', {
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


    } catch (error) {
      console.log("Error in add_user_on_click", error);
      toast.error('Add user failed', {
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

    }


  }

  const handleSearchClick = () => {
    // Check if the search field is empty
    if (searchProject.trim() === "") {
      // If empty, set the error state to true
      setSearchError(true);
      get_users();
      return; // Exit the function
    }
    else {
      // Perform the search operation
      search_project();
    }
  };
  async function search_project() {

    try {
      var server_address = `${URL}/user_search`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          type: searchOption,
          email: searchProject,
          department: searchProject,
        }),
      });
      const json_response = await resp2.json();
      console.log(json_response);
      set_rows(json_response);
    } catch (error) {
      console.log("Error in search_project", error);
      toast.error('Search failed', {
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
    }



  }


  async function handleFileUpload() {

    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = (errorrrrr) => {
        const formData = new FormData();
        formData.append('file', errorrrrr.target.files[0]);

        fetch(`${URL}/upload_users_file`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
            toast.error('File upload failed', {
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
          });
      };
      fileInput.click();
      await get_users();
    } catch (error) {
      console.log("Error in handleFileUpload", error);
      toast.error('File upload failed', {
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
    }

  }

  function do_nothing() {
    return;
  }

  async function removeUser() {
    var index = currentUserEmail.indexOf("@");
    var pre = currentUserEmail.substring(0, index);
    var post = currentUserEmail.substring(index);
    pre = pre.replace(".", "dot");
    var newEmail_id = pre + post;


    try {
      var server_address = `${URL}/del_user`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          e_id: currentUserEmail,
          new_e_id: newEmail_id,
          admin: currentadmin
        }),
      });

      const response = await resp2.json();
      server_address = `${URL}/get_user`;
      const resp3 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
        }),
      });

      const response2 = await resp3.json();
      console.log("Server response", response2);
      set_rows(response2);
    } catch (error) {
      console.log("Error in removeUser", error);
      toast.error('Remove user failed', {
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

    }

  }
  function addUser() {
    //To DO; //Current user email and role is stored in newUserEmail,newUserRole handled by useState
  }
  async function add_user() {
    setnewUserRole("")
    setnewUserEmail("")
    setnewUsername("")
    setnewDepartment(" ")
    setopenAddUserPopup(true);

    return;
  }
  return (
    <div >
      <Toaster />
      <NavbarComp />
      <AppBar position="static">
        <Toolbar className="custom-toolbar">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Button variant="primary" size="small" onClick={async () => {
            await get_users();
            toast.success('Refreshed', {
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
          }} >
            Refresh Table{" "}
          </Button>
          <Button variant="primary" size="small" onClick={add_user} >
            Add New User{" "}
          </Button>
          <Button variant="primary" size="small" onClick={async () => {

            await handleFileUpload();
          }}


          >
            Import User{" "}
          </Button>
          {state.userFlag === 1 ? (//this ternery is useless
            <a href={ExampleDoc} download="Sample Import users" target='_blank'>
              <Button variant="primary"
                size="small"
              >
                Sample Import</Button>
            </a>
          ) : null}
        </Toolbar>
      </AppBar>


      <div className="searchDiv">
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={3}
          padding={4}

        >
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Search By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchOption}
              label="Age"
              onChange={(event) => {
                handleSearchOptionChange(event);
              }}
            >  <MenuItem value="">Search By</MenuItem>
              <MenuItem value={"2"}>Department</MenuItem>
              <MenuItem value={"1"}>Email Id</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <TextField
              id="standard-basic"
              label="Search"
              variant="standard"
              disabled={!isSearchEnabled} // Disable until option selected
              inputRef={searchFieldRef} // Assign the ref to the search field
              onChange={(event) => {
                setsearchProject(event.target.value);
              }}
            />
          </Box>
          <Button className="custom-button" variant="primary" size="small" onClick={handleSearchClick}>
            Search{" "}
          </Button>

        </Stack>
      </div>




      <AddUserPopup
        openAddUserPopup={openAddUserPopup}
        setopenAddUserPopup={setopenAddUserPopup}

      >
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": {
              m: 1,
              maxWidth: "500px", // Update width of text fields
            },
            textAlign: "center", // Center align the form
          }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor={'#E6E1F7'}
          border={1}
          borderRadius={5} // Add border radius
          padding={2} // Add padding

        >
          <div className="AddUser">
            <header className="header">
              <h3 className="header-title">Add New User</h3>
            </header>

            <IconButton
              className="CloseAddUserPopup" // Updated class name
              style={{ position: "absolute", top: "5px", right: "5px" }} // Adjusted positioning
              onClick={() => {
                setopenAddUserPopup(false);
              }}
            >
              <CloseIcon />
            </IconButton>



            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
              <TextField
                id="outlined-basic"
                label="Email Address"
                variant="outlined"
                value={newUserEmail}
                onChange={(event) => {
                  setnewUserEmail(event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}


              />
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                value={newUsername}
                onChange={(event) => {
                  setnewUsername(event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}

              />

              <FormControl >
                <InputLabel id="dep-select-label">Department</InputLabel>
                <Select
                  labelId="dep-select-label"
                  id="dep-select"
                  value={newDepartment}
                  label="Department"
                  onChange={(event) => {
                    setnewDepartment(event.target.value);

                  }}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    
                    borderRadius: '5px',
                    backgroundColor: '#ffffff',
                    height: '57px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    appearance: 'none', // Remove default arrow icon

                  }}
                >
                  <MenuItem disabled value="">
                    Select Department
                  </MenuItem>
                  <MenuItem value={'ADMIN'}>R&D Admin</MenuItem>
                  <MenuItem value={'AI'}>Artificial Intelligence</MenuItem>
                  <MenuItem value={'BIO'}>Biomedical Engineering</MenuItem>
                  <MenuItem value={'CHE'}>Checmical Engineering</MenuItem>
                  <MenuItem value={'CHEM'}>Chemistry</MenuItem>
                  <MenuItem value={'CIV'}>Civil Engineering</MenuItem>
                  <MenuItem value={'CSE'}>Computer Science and Engineering</MenuItem>
                  <MenuItem value={'EE'}>Electrical Engineering</MenuItem>
                  <MenuItem value={'HSS'}>Humanities & Social Sciences</MenuItem>
                  <MenuItem value={'MATH'}>Mathematics</MenuItem>
                  <MenuItem value={'MME'}>Metallurgical & Material Science</MenuItem>
                  <MenuItem value={'MECH'}>Mechanical Engineering</MenuItem>
                  <MenuItem value={'PHY'}>Physics</MenuItem>

                </Select>
              </FormControl>
            </div>



            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <FormControl >
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={newUserRole}
                  onChange={(event) => {
                    setnewUserRole(event.target.value);
                  }}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    width: '150px',
                    height: '57px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    appearance: 'none',
                  }}
                  label="Role (Admin/Professor/Fellow)"
                >
                  <MenuItem disabled value="">
                    Select Role
                  </MenuItem>
                  <MenuItem value={1}>Admin</MenuItem>
                  <MenuItem value={2}>Professor</MenuItem>
                  <MenuItem value={3}>Fellow</MenuItem>
                </Select>
              </FormControl>
            </div>




            <center>
              <Button
                className="custom-button"
                onClick={add_user_on_click}
              >
                Add user
              </Button>
            </center>
          </div>
        </Box>
      </AddUserPopup>
      <RemoveUserPop
        className="removeUserClass"
        openRemoveUserPop={openRemoveUserPop}
        setOpenRemoveUserPop={setOpenRemoveUserPop}
      >
        <div className="removeUserDiv">
          <span>
            <div> Are you sure you want to remove the user ? </div>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={4}
            >
              <Button className="custom-button"

                onClick={() => {
                  removeUser();
                  setOpenRemoveUserPop(false);
                }}
              >
                YES
              </Button>
              <Button
                className="custom-button"
                onClick={() => {
                  setOpenRemoveUserPop(false);
                }}
              >
                NO
              </Button>
            </Stack>
          </span>
        </div>
      </RemoveUserPop>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" className="custom-table">
            <TableHead >
              <TableRow >
                <StyledTableCell style={{ backgroundColor: '#1B1340', color: 'white' }} align="center">Name</StyledTableCell >
                <StyledTableCell style={{ backgroundColor: '#1B1340', color: 'white' }} align="center">Email</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#1B1340', color: 'white' }} align="center">Department</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#1B1340', color: 'white' }} align="center">Role</StyledTableCell>
                <StyledTableCell style={{ backgroundColor: '#1B1340', color: 'white' }} align="center">Remove</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.sort((a, b) => a.admin - b.admin).map((row) => (
                <StyledTableRow
                  key={row.email_id}

                >


                  <StyledTableCell align="center">{row.user_name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email_id}</StyledTableCell>
                  {row.department === null ? (<StyledTableCell align="center">{"--"}</StyledTableCell>) : (<StyledTableCell align="center">{row.department}</StyledTableCell>)}
                  {row.admin == 1 ? (
                    <StyledTableCell align="center">Admin</StyledTableCell>
                  ) : row.admin == 3 ? (
                    <StyledTableCell align="center">Fellow</StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">Professor</StyledTableCell>
                  )}
                  <StyledTableCell align="center">
                    {row.email_id === state.userEmail ? (null) : (<Button className="removeUserButton"
                      onClick={() => {
                        setOpenRemoveUserPop(true);
                        setcurrentUserEmail(row.email_id);
                        setcurrentadmin(row.admin);
                      }}

                    >
                      <BsFillTrashFill /> Remove
                    </Button>)}

                    {/* startIcon={<RemoveCircleOutlineIcon />} /> */}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <PermanentDrawerLeft {...obj}></PermanentDrawerLeft>
    </div>
  );
}
