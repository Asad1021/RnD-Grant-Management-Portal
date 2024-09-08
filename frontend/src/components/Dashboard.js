
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ProjectTable from "./ProjectsTable";
import NavbarComp from "./NavbarComp";
import { AppBar, Toolbar, Typography } from "@mui/material";
import data from "./data.json";
import PermanentDrawerLeft from "./sidebar";
import Button from 'react-bootstrap/Button';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import AddProjectPopup from "./AddProjectPopup";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { URL } from "../App";
import ExampleDoc from './import_prj.xlsx'
import "./Dashboard.css";
import { toast, Toaster } from 'react-hot-toast';

import { saveAs } from 'file-saver';

export default function Dashboard() {

  const { state } = useLocation();
  const [rows, set_rows] = useState(data);
  const [tableShow, setTableShow] = useState(false);
  const [all_projects, setall_projects] = useState(null);
  const [openAddProjectPopup, setopenAddProjectPopup] = useState(false);
  const [newProjectId, setnewProjectId] = useState("")
  const [newProjectIdError, setnewProjectIdError] = useState("false")
  const [newProjectTitle, setnewProjectTitle] = useState("")
  const [newProjectTitleError, setnewProjectTitleError] = useState("false")
  const [newProfessor, setnewProfessor] = useState("")
  const [newProfessorError, setnewProfessorError] = useState("false")
  const [newGrant, setnewGrant] = useState("")
  const [newGrantError, setnewGrantError] = useState("false")
  const [newManpower, setnewManpower] = useState("")

  const [newConsumables, setnewConsumables] = useState("")

  const [newTravel, setnewTravel] = useState("")

  const [newDemo, setnewDemo] = useState("")

  const [newOverheads, setnewOverheads] = useState("")

  const [newUnforeseenExpenses, setnewUnforeseenExpenses] = useState("")

  const [newEquipment, setnewEquipment] = useState("")

  const [newConstruction, setnewConstruction] = useState("")

  const [newFabrication, setnewFabrication] = useState("")

  const [newRecurring, setnewRecurring] = useState("")
  const [newRecurringError, setnewRecurringError] = useState("false")

  const [newNonRecurring, setnewNonRecurring] = useState("")
  const [newNonRecurringError, setnewNonRecurringError] = useState("false")
  const [searchOption, setsearchOption] = useState("")

  const [newPI, setnewPI] = useState("")
  const [newPIError, setnewPIError] = useState("false")
  const [newCOPI, setnewCOPI] = useState("")
  const [newCOPIError, setnewCOPIError] = useState("false")

  const [newDepartment, setnewDepartment] = useState("")
  const [newDepartmentError, setnewDepartmentError] = useState("false")

  const [newAgency, setnewAgency] = useState("")
  const [newAgencyError, setnewAgencyError] = useState("false")
  const [newSanctionedNumber, setnewSanctionedNumber] = useState("")
  const [newSanctionedNumberError, setnewSanctionedNumberError] = useState("false")
  const [newSanctionedDate, setnewSanctionedDate] = useState("")
  const [newSanctionedDateError, setnewSanctionedDateError] = useState("false")
  const [newDOC, setnewDOC] = useState("")
  const [newDOCError, setnewDOCError] = useState("false")
  const [newDOS, setnewDOS] = useState("")
  const [newDOSError, setnewDOSError] = useState("false")
  const [newYear, setnewYear] = useState("")
  const [newYearError, setnewYearError] = useState("false")

  const [newDuration, setnewDuration] = useState("")
  const [newLink, setnewLink] = useState("")
  const [newDurationError, setnewDurationError] = useState("false")


  //for making the search bar robust
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




  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setnewDOS(selectedDate);
    setnewDOSError(false);

    // Extract the year from the selected date
    const year = new Date(selectedDate).getFullYear();
    setnewYear(year.toString()); // Convert to string and set as Start Year
    setnewYearError(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        var server_address = `${URL}/get_user`;
        const resp2 = await fetch(server_address, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "jwt-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({}),
        });

        if (!resp2.ok) {
          throw new Error("Failed to fetch data");
        }

        const response = await resp2.json();
        console.log("Server response", response);
        set_rows(response);
        fetch_proj_on_click();

      } catch (error) {
        console.error("Error fetching data:", error);

        toast.error('Error fetching data', {
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
        // Handle the error here, such as showing a message to the user or logging it
      }
    };

    fetchData();
  }, []);


  const SubmitAddProject = async () => {

    // console.log(all_projects)
    var id_check = false;

    if (all_projects)
      id_check = all_projects.find(row => (row.project_id === newProjectId));

    if (id_check) {
      toast.error('Project with same ID is already present', {
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
      // alert("Project with same ID is already present");
      // console.log(id_check)
      return;
    }
    if (!newProjectId) {
      // If the Project Id field is empty, show an error message or perform other validation logic
      toast.error('Project ID is required', {
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
    if (!newProfessor) {
      // If the Email-id of collaborators field is empty, show an error message or perform other validation logic
      toast.error('Email ID of Professor is required', {
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
      // alert("Email-id of Professor is required");
      return;
    }
    const userExists = rows.find(row => (row.email_id === newProfessor & row.admin === 2));
    if (!userExists) {
      toast.error("Email doesn't exists as professor", {
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
      // alert("Email doesn't exists as professor");
      return;
    }

    if ((new Date(newDOS).getTime()) > (new Date(newDOC).getTime())) {
      toast.error('Start Date is later than Completion Date', {
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
      // alert("Start Date is later than Completion Date");
      return;
    }
    else if ((new Date(newDOS).getFullYear()) !== newYear) {

      toast.error('Year in Start Date does not match with Start year entered', {
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

      // alert("Year in Start Date does not match with Start year entered");
      return;
    }
    // console.log(new Date(newDOS).getTime());
    try {
      var server_address = `${URL}/create_project`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          project_id: newProjectId,
          project_title: newProjectTitle,
          professors: newProfessor,
          grant: newGrant,
          pi: newPI,
          co_pi: newCOPI,
          dept: newDepartment,
          fund_agency: newAgency,
          sanc_order_no: newSanctionedNumber,
          sanctioned_date: newSanctionedDate,
          duration: newDuration,
          dos: newDOS,
          doc: newDOC,
          start_year: newYear,
          rec_sanctioned_amount: newRecurring,
          nonrec_sanctioned_amount: newNonRecurring,
          man_sanc: newManpower,
          cons_sanc: newConsumables,
          travel_sanc: newTravel,
          testing_sanc: newDemo,
          overhead_sanc: newOverheads,
          unforseen_sanc: newUnforeseenExpenses,
          equip_sanc: newEquipment,
          const_sanc: newConstruction,
          fab_sanc: newFabrication,
          flag: state.userFlag,
          link: newLink

        }),
      });



      const json_response = await resp2.json();
      if (json_response === -1) {
        toast.error('Total project cost is not equal to the sum of recurring and non recurring', {
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
        // alert("Total project cost is not equal to the sum of recurring and non recurring");
        return;
      }
      else if (json_response ===-2) {
        toast.error('Either recurring or non recurring total is less than sum of corresponding subheads', {
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
        // alert("Either recurring or non recurring total is less than sum of corresponding subheads");
        return;
      }
      // console.log("RESPONSEEE->" + json_response);
      // console.log(newProjectTitle);
      setopenAddProjectPopup(false);
      fetch_proj_on_click();      // Refresh the table after adding a new project
    } catch (error) {
      console.error("Error adding project: ", error);
      toast.error('Error adding project', {
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

      // Handle the error here, such as showing a message to the user or logging it
    }
  };


  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    isDashboard: state.isDashboard,
    allProjectData: all_projects,
    userFlag: state.userFlag,
  };

  async function add_proj_on_click() {
    setnewProjectId("")
    setnewProjectIdError("")
    setnewProjectTitle("")
    setnewProjectTitleError("")
    setnewProfessor("")
    setnewProfessorError("")
    setnewGrant("")
    setnewGrantError("")
    setnewManpower("")
    setnewConsumables("")
    setnewTravel("")
    setnewDemo("")
    setnewOverheads("")
    setnewUnforeseenExpenses("")
    setnewEquipment("")

    setnewConstruction("")
    setnewFabrication("")
    setnewRecurring("")
    setnewRecurringError("")
    setnewNonRecurring("")
    setnewNonRecurringError("")
    setsearchOption("")
    setnewPI("")
    setnewPIError("")
    setnewCOPI("")
    setnewCOPIError("")
    setnewDepartment("")
    setnewDepartmentError("")
    setnewAgency("")
    setnewAgencyError("")
    setnewSanctionedNumber("")
    setnewSanctionedNumberError("")
    setnewSanctionedDate("")
    setnewSanctionedDateError("")
    setnewDOC("")
    setnewDOCError("")
    setnewDOS("")
    setnewDOSError("")
    setnewYear("")
    setnewYearError("")
    setnewDuration("")
    setnewDurationError("")
    setnewLink("")

    // var server_address = "http://localhost:5000/user/" + obj.userEmail;
    // const resp = await fetch(server_address, {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // });
    // const response = await resp.json();
    // console.log("Server response", response);

    // if(response!=1){
    //   alert("YOU ARE NOT THE ADMIN")
    //   return
    // }

    setopenAddProjectPopup(true);

    return;
  }


  async function fetch_proj_on_click() {
    try {


      var server_address = `${URL}/user/` + obj.userEmail;
      const resp = await fetch(server_address, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
      });

      const response = await resp.json();

      // console.log("Server response", response);

      if (response === 2 || response === 3) {


        var server_address2 = `${URL}/project_prof/` + obj.userEmail;
        const resp2 = await fetch(server_address2, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "jwt-token": localStorage.getItem("token"),
          },
        });
        const response2 = await resp2.json();
        // console.log("Server response", response2);

        setall_projects(response2);
        setTableShow(true);

        return;
      }


      var server_address3 = `${URL}/project/`;

      const resp3 = await fetch(server_address3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ sort: 1 }),
      });



      const json_response = await resp3.json();

      setall_projects(json_response);
      setTableShow(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('Fetch Failed', {
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
      // Handle the error here, such as showing a message to the user or logging it
    }
  }



  async function search_project() {

    try {
      var server_address = `${URL}/project_search`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          admin: state.userFlag,
          type: searchOption,
          title: searchProject,
          id: searchProject,
          pi: searchProject,
          dept: searchProject,
          year: searchProject,
          fund_agency: searchProject,
          email_id: state.userEmail,
        }),
      });

      const json_response = await resp2.json();
      setall_projects(json_response);
      setTableShow(true);
    } catch (error) {
      toast.error('Search Failed', {
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

    return;
    //TODO
    //We will use the setall_project state to update the JSON file with new data
  }


  const [searchProject, setsearchProject] = useState("");
  const [submitted, setSubmitted] = useState(false);


  const handleSubmit = (errorrrrr) => {
    errorrrrr.preventDefault();
    if (newProjectId === "") {
      setnewProjectIdError(true);
    }
    if (newProfessor === "") {
      setnewProfessorError(true);
    }
    if (newPI === "") {
      setnewPIError(true);
    }
    if (newCOPI === "") {
      setnewCOPIError(true);
    }
    if (newDepartment === "") {
      setnewDepartmentError(true);
    }
    if (newAgency === "") {
      setnewAgencyError(true);
    }
    if (newProjectTitle === "") {
      setnewProjectTitleError(true);
    }
    if (newSanctionedNumber === "") {
      setnewSanctionedNumberError(true);
    }
    if (newSanctionedDate === "") {
      setnewSanctionedDateError(true);
    }
    if (newGrant === "") {
      setnewGrantError(true);
    }
    if (newDuration === "") {
      setnewDurationError(true);
    }
    if (newYear === "") {
      setnewYearError(true);
    }

    //if (name !== "" && email !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword) {

    setSubmitted(true);
    if (newProjectId === "" || newAgency === "" || newCOPI === "" || newPI === "" || newProfessor === "" || newProjectTitle === "" || newDepartment === "" || newSanctionedDate === "" || newSanctionedNumber === "" || newYear === "" || newDuration === "" || newGrant === "") {
      toast.error('Fill all details', {
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
  };

  // Function to handle search button click
  const handleSearchClick = () => {
    // Check if the search field is empty
    if (searchProject.trim() === "") {
      // If empty, set the error state to true
      setSearchError(true);
      fetch_proj_on_click();
      return; // Exit the function
    }
    else {
      // Perform the search operation
      search_project();
    }
  };

  function downloadErrorFile(error) {
    // Create a blob with the error message
    const blob = new Blob([error.message], { type: 'text/plain' });

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'error.txt'; // Set the file name

    // Trigger a click event on the anchor element
    document.body.appendChild(a);
    a.click();
    // Remove the anchor element
    document.body.removeChild(a);
  }
  function downloadErrorDump(response) {
    
    response["Project IDs where CoPI's mail is invalid"] = response.WrongCOPI
    response["Project IDs where Sum of rec and non-rec is not equals to Sanctioned amount"] = response.WrongSumToGrant
    response["Project IDs where PI's mail is invalid"] = response.WrongPI
    response["Project IDs where Project ID is duplicated"] = response.WrongProjectId
    response["Project IDs where Sum of Recurring is not equals to Sum of Subheads"] = response.WrongSumRec
    response["Project IDs where Sum of Non-Recurring is not equals to Sum of Subheads"] = response.WrongSumNonRec
    response["Project IDs where Start Date is later than Completion Date"] = response.WrongDate
    response["Project IDs where Professor's mail is invalid"] = response.WrongProfname
    response["Project IDs where Department is invalid"] = response.WrongDept
    
    delete response.WrongCOPI
    delete response.WrongSumToGrant
    delete response.WrongPI
    delete response.WrongProjectId
    delete response.WrongSumRec
    delete response.WrongSumNonRec
    delete response.WrongDate
    delete response.WrongProfname
    delete response.WrongDept
    // Add explanatory text
    let formattedData = "Error Dump:\n\n";
  
    // Loop through each error category and add its details
    Object.keys(response).forEach(category => {
        if (response[category].length > 0) {
            formattedData += `${category}:\n`;
            response[category].forEach(item => {
                formattedData += `- ${item}\n`;
            });
            formattedData += "\n"; // Add a line break after each category
        }
    });
  
    // Create a Blob object from the formatted data
    const blob = new Blob([formattedData], { type: 'text/plain' });
  
    // Use FileSaver.js to save the blob as a file
    saveAs(blob, 'error_dump.txt');
  }
 function handleFileUpload() {
  // Create a new input element of type file.
  const fileInput = document.createElement('input');
  fileInput.type = 'file'; // Set the input type to file.

  // Define an onchange event handler for the file input.
  fileInput.onchange = (e) => {
    // When a file is selected, create a new FormData object to store the file data.
    const formData = new FormData();
    formData.append('file', e.target.files[0]); // Append the selected file to the FormData object.
    formData.append('flag', state.userFlag);
    
    // Send a POST request to the server to upload the file.
    let resp ;
    fetch(`${URL}/upload_file`, {
      method: 'POST', // Use the POST method.
      body: formData, // Send the FormData object containing the file data.
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 500) {
            // console.log('resffsdh', response);
            resp = await response.json()
            console.log(resp);
            await downloadErrorDump(resp)
            throw new Error("Import Failed, see the downloaded file for details"); // Throw an error with the error message received from the server.
          } else {
            throw new Error('File upload failed. Please try again');
          }
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response data to the console.
        fetch_proj_on_click(); // Refresh table after file upload
      })
      .catch((error) => {
        // Handle any errors that occur during the upload process.
        console.error(error); // Log the error to the console.
        // Display the error message using a toast notification
          toast.error(error.message || 'An unexpected error occurred.', {
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
  fetch_proj_on_click();
}


  return (
    <div style={{ width: '100%', padding: '0 0px' }}>
      <Toaster />
      <NavbarComp />
      <AppBar position="static">
        <Toolbar className="custom-toolbar">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>


          <Button className="custom-button" onClick={async () => {
            await fetch_proj_on_click();
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
          }}
          >
            Refresh Table{" "}
          </Button>

          {state.userFlag === 1 ? (
            <Button className="custom-button" onClick={add_proj_on_click}>
              Add new project{" "}
            </Button>)
            :
            state.userFlag === 2 ? (<Button className="custom-button" onClick={add_proj_on_click} >
              Req new project{" "}
            </Button>)
              :
              (null)}
          {state.userFlag === 1 ? (
            //if the user is an admin, then only show the import button
            <Button
              className="custom-button"
              onClick={() => {
                handleFileUpload();

              }}

            >
              Import Projects{" "}
            </Button>
          ) : null}


          {state.userFlag === 2 ? (
            <Button className="custom-button" onClick={() => { handleFileUpload(); setopenAddProjectPopup(false); }}>Import Project</Button>
          ) : null}


          {state.userFlag === 1 || 2 ? (
            //if the user is an admin, then only show the import button
            <a href={ExampleDoc} download="Sample Import Projects" target='_blank'>
              <Button
                className="custom-button"
                variant="primary"
                size="small"
                sx={{ padding: "8px", height: "30px" }}
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
            >
              <MenuItem value="">Search By</MenuItem>
              <MenuItem value={"1"}>Title</MenuItem>
              <MenuItem value={"2"}>ID</MenuItem>
              <MenuItem value={"3"}>Name of PI</MenuItem>
              <MenuItem value={"4"}>Department</MenuItem>
              <MenuItem value={"5"}>Year</MenuItem>
              <MenuItem value={"6"}>Funding Agency</MenuItem>
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
      {tableShow ? <ProjectTable {...obj} /> : null}



      <AddProjectPopup
        openAddProjectPopup={openAddProjectPopup}
        setopenAddProjectPopup={setopenAddProjectPopup}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "400px" } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onSubmit={handleSubmit}
          bgcolor={'#E6E1F7'}
          border={1}
          borderRadius={5} // Add border radius
        >
          <div className="AddProject">

            <IconButton
              className="CloseAddProjectPopup"
              style={{ float: "right" }}
              onClick={() => {
                setopenAddProjectPopup(false);
              }}
            >
              <CloseIcon />
            </IconButton>

            <center><header className="header" >
              <h3 className="header-title">Add New Project</h3>
            </header>
              <TextField
                id="outlined-basic"
                label="Project Id"
                variant="outlined"
                onChange={(event) => {
                  setnewProjectId(event.target.value);
                  setnewProjectIdError(false);
                }}
                required
                error={submitted && newProjectIdError}
                helperText={
                  submitted && newProjectIdError ? "Required" : ""
                }
              />


              <TextField
                id="outlined-basic"
                label="Email-id of Professor"
                variant="outlined"
                onChange={(event) => {
                  setnewProfessor(event.target.value);
                  setnewProfessorError(false);
                }}
                required
                error={submitted && newProfessorError}
                helperText={
                  submitted && newProfessorError ? "required" : ""
                }

              />


              <FormControl >
                <InputLabel id="demo-simple-select-label">Department</InputLabel>
                <Select
                  labelId="dep-select-label"
                  id="dep-select"
                  value={newDepartment}
                  label="Department"
                  onChange={(event) => {
                    setnewDepartment(event.target.value);
                    setnewDepartmentError(false)
                  }}
                  style={{
                    padding: '10px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    backgroundColor: '#ffffff',
                    width: '400px',
                    height: '57px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    appearance: 'none', // Remove default arrow icon

                  }}
                >
                  <MenuItem disabled value="">
                    Select Department
                  </MenuItem>
                  <MenuItem value={'CIV'}>Civil Engineering</MenuItem>
                  <MenuItem value={'CSE'}>Computer Science and Engineering</MenuItem>
                  <MenuItem value={'AI'}>Artificial Intelligence</MenuItem>
                  <MenuItem value={'CHEM'}>Chemistry</MenuItem>
                  <MenuItem value={'CHE'}>Checmical Engineering</MenuItem>
                  <MenuItem value={'EE'}>Electrical Engineering</MenuItem>
                  <MenuItem value={'MECH'}>Mechanical Engineering</MenuItem>
                  <MenuItem value={'BIO'}>Biomedical Engineering</MenuItem>
                  <MenuItem value={'PHY'}>Physics</MenuItem>
                  <MenuItem value={'MATH'}>Mathematics</MenuItem>
                  <MenuItem value={'HSS'}>HSS</MenuItem>
                  <MenuItem value={'MME'}>MME</MenuItem>
                </Select>
              </FormControl>


              <TextField
                id="outlined-basic"
                label=" PI"
                variant="outlined"
                onChange={(event) => {
                  setnewPI(event.target.value);
                  setnewPIError(false);
                }}
                required
                error={submitted && newPIError}
                helperText={
                  submitted && newPIError ? "Required" : ""
                }

              />


              <TextField
                id="outlined-basic"
                label="Name of Co-PI"
                variant="outlined"
                onChange={(event) => {
                  setnewCOPI(event.target.value);
                  setnewCOPIError(false)
                }}
                required
                error={submitted && newCOPIError}
                helperText={
                  submitted && newCOPIError ? "Required" : ""
                }
              />


              <TextField
                id="outlined-basic"
                label="Funding Agency"
                variant="outlined"
                onChange={(event) => {
                  setnewAgency(event.target.value);
                  setnewAgencyError(false);
                }}
                required
                error={submitted && newAgencyError}
                helperText={
                  submitted && newAgencyError ? "Required" : ""
                }
              />

              <TextField
                id="outlined-basic"
                label="Project Title"
                variant="outlined"
                onChange={(event) => {
                  setnewProjectTitle(event.target.value);
                  setnewProjectTitleError(false);
                }}
                required
                error={submitted && newProjectTitleError}
                helperText={
                  submitted && newProjectTitleError ? "Required" : ""
                }
              />

              <TextField
                id="outlined-basic"
                label="Sanctioned order number"
                variant="outlined"
                onChange={(event) => {
                  setnewSanctionedNumber(event.target.value);
                  setnewSanctionedNumberError(false);
                }}
                required
                error={submitted && newSanctionedNumberError}
                helperText={
                  submitted && newSanctionedNumberError ? "Required" : ""
                }

              />
              <TextField
                type="date"
                id="outlined-basic"
                label="Sanctioned Date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {
                  setnewSanctionedDate(event.target.value);
                  setnewSanctionedDateError(false);
                }}
                required
                error={submitted && newSanctionedDateError}
                helperText={
                  submitted && newSanctionedDateError ? "Required" : ""
                }
              />

              <TextField
                type="currency"
                id="outlined-basic"
                label="Total Project Cost"
                variant="outlined"
                onChange={(event) => {
                  setnewGrant(event.target.value);
                  setnewGrantError(false);

                }}
                required
                error={submitted && newGrantError}
                helperText={
                  submitted && newGrantError ? "Required" : ""
                }

              />

              <TextField
                id="outlined-basic"
                label="Duration"
                variant="outlined"

                onChange={(event) => {
                  setnewDuration(event.target.value);
                  setnewDurationError(false);
                }}
                required
                error={submitted && newDurationError}
                helperText={
                  submitted && newDurationError ? "Required" : ""
                }
              />
              <TextField
                type="date"
                id="outlined-basic"
                label="Date of Start"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newDOS}
                onChange={handleDateChange}
                required
                error={submitted && newDOSError}
                helperText={submitted && newDOSError ? "Required" : ""}
              />

              <TextField
                id="outlined-basic"
                label="Start Year"
                variant="outlined"
                value={newYear}
                onChange={(event) => {
                  setnewYear(event.target.value);
                  setnewYearError(false);
                }}
                required
                error={submitted && newYearError}
                helperText={submitted && newYearError ? "Required" : ""}
              />




              <TextField
                type="date"
                id="outlined-basic"
                label="Date of Completion"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {
                  setnewDOC(event.target.value);
                  setnewDOCError(false);
                }}
                required
                error={submitted && newDOCError}
                helperText={
                  submitted && newDOCError ? "Required" : ""
                }
              />
            </center>


            <center> <header className="header" style={{ marginLeft: '-2px' }}>
              <h3 className="header-title" style={{ fontSize: '1.5rem' }}>Enter Category-Wise Sanctioned Amount:</h3>
            </header>
              <TextField
                type="currency"
                id="outlined-basic"
                label="Total Recurring Cost"
                style={{ border: "solid 4px #e6e1f7", borderRadius: "5px" }}
                variant="outlined"
                onChange={(event) => {
                  setnewRecurring(event.target.value);
                  setnewRecurringError(false);
                }}
                required
                error={submitted && newRecurringError}
                helperText={
                  submitted && newRecurringError ? "Required" : ""
                }
              />

              <Stack justifyContent="center" alignItems="center" direction="row" >
                <TextField type="currency" style={{ width: 500 }} id="outlined-basic" label="Manpower (Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewManpower(event.target.value);
                  }}
                />
                <TextField type="currency" style={{ width: 500 }} id="outlined-basic" label="Consumables (Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewConsumables(event.target.value);
                  }}
                />
              </Stack>

              <Stack justifyContent="center" alignItems="center" direction="row">
                <TextField type="currency" id="outlined-basic" label="Travel (Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewTravel(event.target.value);
                  }}
                />
                <TextField type="currency" id="outlined-basic" label="Field Testing/Demo/Tranings (Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewDemo(event.target.value);
                  }}
                />
              </Stack>
              <Stack justifyContent="center" alignItems="center" direction="row">
                <TextField type="currency" id="outlined-basic" label="Overhead (Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewOverheads(event.target.value);
                  }}
                />
                <TextField type="currency" id="outlined-basic" label="Unforseen Expenses (Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewUnforeseenExpenses(event.target.value);
                  }}
                />
              </Stack>
              <TextField type="currency" id="outlined-basic" label="Fabrication (Recurring)" variant="outlined"
                onChange={(event) => {
                  setnewFabrication(event.target.value);
                }}
              />
            <hr />
              <TextField
                type="currency"
                id="outlined-basic"
                label="Total Non-recurring Cost"
                variant="outlined"
                style={{ border: "solid 4px #e6e1f7", borderRadius: "5px" }}

                onChange={(event) => {
                  setnewNonRecurring(event.target.value);
                  setnewNonRecurringError(false);
                }}
                required
                error={submitted && newNonRecurringError}
                helperText={
                  submitted && newNonRecurringError ? "Required" : ""
                }
              />
              <Stack justifyContent="center" alignItems="center" direction="row">
                <TextField type="currency" id="outlined-basic" label="Equipment (Non-Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewEquipment(event.target.value);
                  }}
                />
                <TextField type="currency" id="outlined-basic" label="Construction (Non-Recurring)" variant="outlined"
                  onChange={(event) => {
                    setnewConstruction(event.target.value);
                  }}
                />
              </Stack>
              <TextField type="text" id="outlined-basic" label="Drive Link" variant="outlined"
                onChange={(event) => {
                  setnewLink(event.target.value);
                }}
              />
            </center>

            <center>
              <Button
                className="custom-button"
                variant="primary"
                endIcon={<SendIcon />}
                type="submit"
                onClick={SubmitAddProject}
              >
                Add Project
              </Button>
            </center>
          </div>

        </Box>
      </AddProjectPopup>

      <PermanentDrawerLeft {...obj}></PermanentDrawerLeft>
    </div>
  );
}