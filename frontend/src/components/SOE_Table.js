import React, { useState, useEffect } from "react";
import data from "./data.json"
import soeData from "./soeData.json";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import RemoveUserPop from "./RemoveUserPop";
import Buttons from 'react-bootstrap/Button';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Toolbar } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import AddCommentPopup from "./AddCommentPopup";
import EditPopup from "./EditPopup";
import ViewCommentPopup from "./ViewCommentPopup";
import CommentViewData from "./CommentViewData.json";
import CommitPopup from "./CommitPopup";
import AddExpensesRowPopUp from "./AddExpensesRowPop";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddFundsPopUp from "./AddFundsPopup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./SOE_Table.css";
import ImportExcelPop from "./ImportExcelPop";
import { toast, Toaster } from 'react-hot-toast';
import * as XLSX from "xlsx";
import { URL } from "../App";
import { blueGrey, grey } from '@mui/material/colors';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: grey[700],
    color: theme.palette.common.white,

    '&:hover': {
      boxShadow: `0 0 10px ${blueGrey[300]}`, // Change the glow color on hover to secondary color #1B1340

    },
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    fontWeight: 'semi-bold'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // "&:last-child td, &:last-child th": {
  //   border: 0,ct
  // },
}));

export default function SOE_Table(props) {
  useEffect(() => {
    // Update the document title using the browser API
    set_rows(props.table_data);
    setsummaryrows(props.summary_table_data);
  }, [props.table_data, props.summary_table_data]);

  const [rows, set_rows] = useState(props.table_data);
  const [is_run, setIsRun] = useState(0);
  const [summaryrows, setsummaryrows] = useState(props.summary_table_data);
  console.log("Project id = " + props.projId);
  console.log(rows);
  const [openRemoveUserPop, setOpenRemoveUserPop] = useState(false);
  const [currentUserEmail, setcurrentUserEmail] = useState("");
  const [frows, set_frows] = useState(data);
  const [urows, set_urows] = useState(data);
  const [comment, setComment] = useState("");
  const [openAddCommentPopup, setOpenAddCommentPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [Edit, setEdit] = useState("");
  const [newUserEmail, setnewUserEmail] = useState();
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [openAddFundsPopUp, setOpenAddFundsPopUp] = useState(false);
  const [openCommitPopup, setOpenCommitPopup] = useState(false);
  const [rowId, setrowId] = useState(0);
  const [NewExpense, setNewExpense] = useState("");
  const [rowIdView, setrowIdView] = useState(0);
  const [commentJsonData, setcommentJsonData] = useState(CommentViewData);
  const [AddExpensesRowPop, setAddExpensesRowPop] = useState(false);
  const [new_sr, set_new_sr] = useState("");
  const [new_particulars, set_new_particulars] = useState("");
  const [new_remarks, set_new_remarks] = useState("");
  const [new_vouchno, set_new_vouchno] = useState("");
  const [new_rec, set_new_rec] = useState("");
  const [new_pay, set_new_pay] = useState("");
  const [new_balance, set_new_balance] = useState("");
  const [new_heads, set_new_heads] = useState("");
  const [new_heads2, set_new_heads2] = useState("");
  const [newManpower, setnewManpower] = useState("");
  const [newConsumables, setnewConsumables] = useState("");
  const [newTravel, setnewTravel] = useState("");
  const [newDemo, setnewDemo] = useState("");
  const [newOverheads, setnewOverheads] = useState("");
  const [newUnforeseenExpenses, setnewUnforeseenExpenses] = useState("");
  const [newEquipment, setnewEquipment] = useState("");
  const [newConstruction, setnewConstruction] = useState("");
  const [newFabrication, setnewFabrication] = useState("");
  const [whichTable, setwhichTable] = useState(0);
  const [newRecurring, setnewRecurring] = useState("");
  const [newNonRecurring, setnewNonRecurring] = useState("");
  const [currUpdateheads, setcurrUpdateheads] = useState("");
  const [committedOrNot, setcommittedOrNot] = useState("");
  const [oldPay, setoldPay] = useState("");
  const [openImportExcelPop, setOpenImportExcelPop] = useState(false);
  const [rec1, setrec1] = useState("")
  const [rec2, setrec2] = useState("")
  const [rec3, setrec3] = useState("")
  const [nonrec1, setnonrec1] = useState("")
  const [nonrec2, setnonrec2] = useState("")
  const [nonrec3, setnonrec3] = useState("")
  const [excelData, setexcelData] = useState([]);
  const [yearCtr, setyearCtr] = useState(1);



  const handleFile = async (errorrrrr) => {
    console.log(errorrrrr.target.files[0]);
    const file = errorrrrr.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    setexcelData(jsonData);

  };


  const processExcel = async () => {
    var arr = [];
    Object.keys(excelData).forEach(function (key) {
      console.log(excelData[key]);
      arr.push(excelData[key]);
    });
    console.log(arr.length);
    for (var i = 0; i < arr.length; i++) {

      if (arr[i]['Heads'] == 'Grant') {

        if (yearCtr == 1) {

          try {
            var server_address = `${URL}/updated_add_fund`;
            const resp2 = await fetch(server_address, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                particulars: arr[i]['Particulars'],
                remarks: arr[i]['Remarks'],
                vouchno: arr[i]['Voucher No. & Date'],
                recur: rec1,
                non_recur: nonrec1,
                project_id: props.projId,

              }),
            });

            const json_response = await resp2.json();
            // console.log("RESPONSEEE->" + json_response);

            var server_address3 = `${URL}/get_main_table`;
            const resp3 = await fetch(server_address3, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response3 = await resp3.json();
            set_rows(json_response3);

            // update summary table
            var server_address4 = `${URL}/get_summary_table`;
            const resp4 = await fetch(server_address4, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response4 = await resp4.json();
            setsummaryrows(json_response4);
            set_new_particulars("");
            set_new_remarks("");
            set_new_vouchno("");
            set_new_rec("");
            set_new_pay("");
          } catch (error) {
            console.error("Error:", error);
            // Handle error if necessary
            toast.error('', {
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
        else if (yearCtr == 2) {
          try {
            var server_address = `${URL}/updated_add_fund`;
            const resp2 = await fetch(server_address, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                particulars: arr[i]['Particulars'],
                remarks: arr[i]['Remarks'],
                vouchno: arr[i]['Voucher No. & Date'],
                recur: rec2,
                non_recur: nonrec2,
                project_id: props.projId,

              }),
            });

            const json_response = await resp2.json();
            // console.log("RESPONSEEE->" + json_response);

            var server_address3 = `${URL}/get_main_table`;
            const resp3 = await fetch(server_address3, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response3 = await resp3.json();
            set_rows(json_response3);

            // update summary table
            var server_address4 = `${URL}/get_summary_table`;
            const resp4 = await fetch(server_address4, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response4 = await resp4.json();
            setsummaryrows(json_response4);
            set_new_particulars("");
            set_new_remarks("");
            set_new_vouchno("");
            set_new_rec("");
            set_new_pay("");
          } catch (error) {
            console.error("Error:", error);
            toast.error('Error in import', {
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
        } else {
          try {
            var server_address = `${URL}/updated_add_fund`;
            const resp2 = await fetch(server_address, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                particulars: arr[i]['Particulars'],
                remarks: arr[i]['Remarks'],
                vouchno: arr[i]['Voucher No. & Date'],
                recur: rec3,
                non_recur: nonrec3,
                project_id: props.projId,

              }),
            });

            const json_response = await resp2.json();
            console.log("RESPONSEEE->" + json_response);

            var server_address3 = `${URL}/get_main_table`;
            const resp3 = await fetch(server_address3, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response3 = await resp3.json();
            set_rows(json_response3);

            // update summary table
            var server_address4 = `${URL}/get_summary_table`;
            const resp4 = await fetch(server_address4, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "jwt-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response4 = await resp4.json();
            setsummaryrows(json_response4);
            set_new_particulars("");
            set_new_remarks("");
            set_new_vouchno("");
            set_new_rec("");
            set_new_pay("");
          } catch (error) {
            console.error("Error:", error);
            toast.error('Error in import', {
              style: {
                style: {
                  borderRadius: '10px',
                  padding: '16px',
                  color: '#291d58',
                },
                iconTheme: {
                  primary: '#e6e1f7',
                  secondary: '#291d58',
                },
              }
            });

          }
        }
        setyearCtr(yearCtr + 1);

      } else {
        if (arr[i]['Heads'] == "Equipments" || arr[i]['Heads'] == "Fabrication") {
          var x = "Non-Rec.";
        }
        else {
          x = "Rec.";
        }

        try {
          var server_address = `${URL}/insert_main_table`;
          const resp2 = await fetch(server_address, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "jwt-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              particulars: arr[i]['Particulars'],
              remarks: arr[i]['Remarks'],
              vouchno: arr[i]['Voucher No. & Date'],
              // rec: new_rec,
              pay: Number(arr[i]['Payment']),
              // balance: new_balance,
              actual: 0,
              heads: x,
              heads2: arr[i]['Heads'],
              project_id: props.projId,
            }),
          });

          const json_response = await resp2.json();
          // console.log("RESPONSEEE->" + json_response);

          if (json_response == -1) {
            toast.error('Import Failed', {
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
            // alert("Expenditure exceeds Sanctioned Amount, Request Denied!!");
            return;
          }

          var server_address3 = `${URL}/get_main_table`;
          const resp3 = await fetch(server_address3, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "jwt-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response3 = await resp3.json();
          set_rows(json_response3);

          // update summary table
          var server_address4 = `${URL}/get_summary_table`;
          const resp4 = await fetch(server_address4, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "jwt-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response4 = await resp4.json();
          setsummaryrows(json_response4);
          set_new_particulars("");
          set_new_remarks("");
          set_new_vouchno("");
          set_new_rec("");
          set_new_pay("");
        } catch (error) {

          console.error("Error:", error);
          toast.error('Error in import', {
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
      console.log(arr[i]['Particulars']);

    }
    setOpenImportExcelPop(false);
  }

  useEffect(async () => {
    // console.log("is_running", props.is_run)
    // console.log("proj-id", props.projId)
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
      // console.log("Server response u", response);
      set_urows(response);
      refreshTable();
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error if necessary
      toast.error('Error in fetching user data', {
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

  useEffect(async () => {

    try {
      var server_address = `${URL}/get_fellow`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          project_id: props.projId
        }),
      });

      const response = await resp2.json();
      console.log("Server response", response);
      set_frows(response);
      refreshTable();
    } catch (error) {

      console.error("Error fetching fellow data:", error);
      // Handle error if necessary
      toast.error('Error in fetching fellow data', {
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


  async function removeFellow() {
    try {
      var server_address = `${URL}/del_fellow`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          project_id: props.projId,
          e_id: currentUserEmail
        }),
      });
      const responsee2 = await resp2.json();
      console.log("Server response f", responsee2);
      set_frows(responsee2);

      server_address = `${URL}/get_fellow`;
      const resp3 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          project_id: props.projId
        }),
      });
      const response2 = await resp3.json();
      console.log("Server response f", response2);
      set_frows(response2);
    } catch (error) {
      console.error("Error removing fellow:", error);
      toast.error('Error in removing fellow', {
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
      // Handle error if necessary
    }
  }

  async function add_fellow_on_click() {

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


    const userExists = urows.find(row => (row.email_id === newUserEmail & row.admin == 3));
    if (!userExists) {
      toast.error('Invalid Fellow', {
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
      var server_address = `${URL}/fellow`;

      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          email_id: newUserEmail,
          project_id: props.projId,
        }),
      });

      const response = await resp2.json();
      // console.log("Server response f", response);
      set_frows(response);
    } catch (error) {
      console.error("Error adding fellow:", error);
      toast.error('Error in adding fellow', {
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
      // Handle error if necessary
    }
    // console.log("THis is frows ->" + rows);
  }


  const handleSubmit = async () => {
    // console.log(comment);
    // console.log(rowId);
    // console.log("Table", whichTable);
    var server_address;
    if (whichTable === 1) server_address = `${URL}/comment`;
    if (whichTable === 2) server_address = `${URL}/summary_comment`;

    try {
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          project_id: props.projId,
          row_no: rowId,
          comment_body: comment,
          prof_email: props.userEmail,
          prof_name: props.userName,
          is_admin: props.userFlag,
        }),
      });

      const json_response = await resp2.json();
      // console.log(json_response);
      var server_address4 = `${URL}/get_summary_table`;
      const resp4 = await fetch(server_address4, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response4 = await resp4.json();
      setsummaryrows(json_response4);

      var server_address3 = `${URL}/get_main_table`;
      const resp3 = await fetch(server_address3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response3 = await resp3.json();
      set_rows(json_response3);

    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error('Error in adding comment', {
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
      // Handle error if necessary


    }
    setOpenAddCommentPopup(false);
  };

  const sendmail = async () => {
    // console.log(comment);
    // console.log(rowId);
    try {

      var server_address = `${URL}/sendMail`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          project_id: props.projId,
          row_no: rowId,
          comment_body: comment,
          prof_email: props.userEmail,
          prof_name: props.userName,
        }),
      });

      const json_response = await resp2.json();
    } catch (error) {
      console.error("Error sending mail:", error);
      toast.error('Error in sending mail', {
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
      // Handle error if necessary
    }
    // console.log(json_response);

    setOpenAddCommentPopup(false);
  };

  const addNewExpensesRecord = async () => {


    if (
      new_particulars.trim() === "" ||
      new_remarks.trim() === "" ||
      new_vouchno.trim() === "" ||
      new_pay.trim() === "" ||
      new_heads.trim() === "" ||
      new_heads2.trim() === "" ||
      committedOrNot.trim() === ""
    ) {
      // Display error message
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
      return;
    }
    try {

      var server_address2 = `${URL}/user/` + props.userEmail;
      const resp = await fetch(server_address2, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
      });
      const response = await resp.json();
      // console.log("Server response", response);

      if (response != 1) {
        toast.error('You are not Admin', {
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

      var server_address = `${URL}/insert_main_table`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          particulars: new_particulars,
          remarks: new_remarks,
          vouchno: new_vouchno,
          // rec: new_rec,
          pay: Number(new_pay),
          // balance: new_balance,
          actual: committedOrNot,
          heads: new_heads,
          heads2: new_heads2,
          project_id: props.projId,
        }),
      });

      const json_response = await resp2.json();
      // console.log("RESPONSEEE->" + json_response);

      if (json_response == -1) {
        toast.error('Expenditure exceeds sanctioned amount, request denied', {
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

      var server_address3 = `${URL}/get_main_table`;
      const resp3 = await fetch(server_address3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response3 = await resp3.json();
      set_rows(json_response3);

      // update summary table
      var server_address4 = `${URL}/get_summary_table`;
      const resp4 = await fetch(server_address4, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response4 = await resp4.json();
      setsummaryrows(json_response4);
      set_new_particulars("");
      set_new_remarks("");
      set_new_vouchno("");
      set_new_rec("");
      set_new_pay("");
      toast.success('Expenses added successfully', {
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
      setAddExpensesRowPop(false);
    } catch (error) {
      console.error("Error adding new expenses record:", error);
      toast.error('Error in adding new expense record', {
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
      // Handle error if necessary

    }
  };


  const addNewFunds = async () => {


    if (
      new_particulars.trim() === "" ||
      new_remarks.trim() === "" ||
      new_vouchno.trim() === "" ||
      newRecurring.trim() === "" ||
      newNonRecurring.trim() === ""
    ) {
      // Display error message
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
      return;
    }
    try {
      var server_address2 = `${URL}/user/` + props.userEmail;
      const resp = await fetch(server_address2, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
      });
      const response = await resp.json();
      console.log("Server response", response);

      if (response != 1) {
        toast.error('You are not the Admin', {
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

      var server_address = `${URL}/updated_add_fund`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          particulars: new_particulars,
          remarks: new_remarks,
          vouchno: new_vouchno,
          // rec:new_rec,
          recur: newRecurring,
          non_recur: newNonRecurring,
          project_id: props.projId,
          // manpower: newManpower,
          // consumables: newConsumables,
          // project_id: props.projId,
          // travel: newTravel,
          // field: newDemo,
          // overheads: newOverheads,
          // unforseen: newUnforeseenExpenses,
          // equipments: newEquipment,
          // construction: newConstruction,
          // fabrication: newFabrication,
        }),
      });

      const json_response = await resp2.json();
      // console.log("RESPONSEEE->" + json_response);

      var server_address3 = `${URL}/get_main_table`;
      const resp3 = await fetch(server_address3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response3 = await resp3.json();
      set_rows(json_response3);

      // update summary table
      var server_address4 = `${URL}/get_summary_table`;
      const resp4 = await fetch(server_address4, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response4 = await resp4.json();
      setsummaryrows(json_response4);
      set_new_particulars("");
      set_new_remarks("");
      set_new_vouchno("");
      set_new_rec("");
      set_new_pay("");
      toast.success('Funds added successfully', {
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
      setOpenAddFundsPopUp(false);
    } catch (error) {
      console.error("Error adding new funds:", error);
      toast.error('Error in adding new funds', {
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
      // Handle error if necessary
    }
  };

  useEffect(() => {
    if (rowIdView > 0) {
      // console.log(rowIdView);
      setOpenViewCommentPopup(true);
      //Todo: Set the Json data according to "rowIdView"
    } else {
      setOpenViewCommentPopup(false);
    }
  }, [rowIdView]);

  function rowSelector(flag) {
    // console.log("GG")

    if (flag === 1) return "green";
    else return "";
  }

  async function refreshTable() {

    try {
      var server_address = `${URL}/get_main_table`;
      const resp2 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response = await resp2.json();
      set_rows(json_response);

      // update summary table
      server_address = `${URL}/get_summary_table`;
      const resp3 = await fetch(server_address, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "jwt-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ project_id: props.projId }),
      });

      const json_response2 = await resp3.json();
      setsummaryrows(json_response2);

    } catch (error) {
      console.error("Error refreshing table:", error);
      toast.error('Error in refreshing table', {
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
      // Handle error if necessary

    }
  }

  return (
    <>
      {/* <Toolbar className="custom-toolbar"> */}
      <div className="soeTable">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '50px', fontWeight: 'bold', color: '#1B1340', margin: '20px 0', marginRight: '4px' }}>Statement of Expenditure
          </h2>
        </div>
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={3}
          padding={1}
        >
          {props.userFlag == 1 ? (
            <>
              <Buttons
                className="custom-button"

                onClick={async () => {
                  var server_address2 =
                    `${URL}/user/` + props.userEmail;
                  const resp = await fetch(server_address2, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "jwt-token": localStorage.getItem("token"),
                    },
                  });
                  const response = await resp.json();
                  console.log("Server response", response);

                  if (response != 1) {
                    toast.error('You are not the Admin', {
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
                    // alert("YOU ARE NOT THE ADMIN");
                    return;
                  }
                  setAddExpensesRowPop(true);
                }}
              >
                Add Expense
              </Buttons>


              <Buttons
                className="custom-button"
                onClick={() => {
                  setOpenAddFundsPopUp(true);
                }}
              >
                Add Fund
              </Buttons>

              { /*can be uncommented and used, it's fully functional */}
              {/* <Buttons
                className="custom-button"
                onClick={() => {
                  setOpenImportExcelPop(true);
                }}
              >
                Import Excel
              </Buttons> */}


              
              
            </>
          ) : (
            <></>
          )}

          <Buttons className="custom-button"

            onClick={() => {
              refreshTable();
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
            Refresh Table
          </Buttons>
        </Stack>

        {props.userFlag === 1 || props.userFlag === 2 ? (
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="custom-button"
            // className="download-table-xls-button btn btn-primary mb-3"
            table="tbl1"
            filename={
              "StatementOfExpenses_" + props.projId.toString().substring(0)
            }
            sheet="Sheet1"
            buttonText="Export Expense Table to Excel Sheet"
          />
        ) : null}
        {props.userFlag === 1 || props.userFlag === 2 ? (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 70 }}
              aria-label="customized table"
              className="table custom-table"
              id="tbl1"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell colspan={11} align="center">
                    Project ID: {props.projId.toString().substring(0)}, Project
                    Title: {props.project_title}, PI Name: {props.projProfName},
                    Total Cost: INR {props.project_grant}

                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell align="center">Sr. No.</StyledTableCell>
                  <StyledTableCell align="center">Particulars</StyledTableCell>
                  <StyledTableCell align="center">Remarks</StyledTableCell>
                  <StyledTableCell align="center">
                    Voucher No. & Date
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">Receipt</StyledTableCell> */}
                  <StyledTableCell align="center">Payment</StyledTableCell>
                  <StyledTableCell align="center">Balance</StyledTableCell>
                  <StyledTableCell align="center">Heads</StyledTableCell>
                  <StyledTableCell align="center">Comment</StyledTableCell>
                  <StyledTableCell align="left">Actual Expense</StyledTableCell>
                  {props.userFlag === 1 ? (
                    <StyledTableCell align="center">Delete</StyledTableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow
                    key={row.sr}
                    className={rowSelector(row.comm_flag)}
                  >
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.sr}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.particulars}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.remarks}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.vouchno}
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                      {row.rec != null ? "₹" + row.rec : null}
                    </StyledTableCell> */}
                    <StyledTableCell align="center">
                      {row.payment != null ? "₹" + row.payment : null}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.balance != null ? "₹" + row.balance : null}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.heads}</StyledTableCell>
                    <StyledTableCell align="right">
                      {/* <Stack  direction="row"  spacing={-5}> */}
                      <Button
                        startIcon={<RemoveRedEyeIcon />}
                        onClick={async () => {
                          setrowIdView(row.sr);
                          var server_address =
                            `${URL}/get_comment`;
                          const resp2 = await fetch(server_address, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "jwt-token": localStorage.getItem("token"),
                            },
                            body: JSON.stringify({
                              row_no: row.sr,
                              project_id: props.projId,
                              is_admin: props.userFlag,
                            }),
                          });

                          const json_response = await resp2.json();
                          console.log(json_response);
                          setcommentJsonData(json_response);
                          // ViewComments(row.sr)
                        }}
                      />
                      <Button
                        style={{ width: "60px" }}
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setOpenAddCommentPopup(true);
                          setrowId(row.sr);
                          setwhichTable(1);
                        }}
                      />
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.heads === "Grant" ? null : (
                        <div>
                          <FormControl>
                            {/* <FormLabel id="demo-controlled-radio-buttons-group">
                        Gender
                      </FormLabel> */}
                            <RadioGroup
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"

                              onChange={() => {
                                if (props.userFlag === 2) {
                                  toast.error('You are not the Admin', {
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
                                  // alert("You don't have admin access");
                                } else {
                                  setOpenCommitPopup(true);
                                  setoldPay(row.payment);
                                  setrowId(row.sr);
                                  set_new_heads(row.heads);
                                }
                              }}
                            >
                              <FormControlLabel
                                value="Actual"
                                checked={row.actual_flag == 0}
                                control={<Radio />}
                                label=""
                              />
                            </RadioGroup>
                          </FormControl>
                        </div>
                      )}
                    </StyledTableCell>

                    {props.userFlag === 1 ? (
                      <StyledTableCell>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={async () => {
                            if (row.heads == "Grant") {
                              toast.error('You cannot delete Grant row', {
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
                              // alert("You cannot delete Grant row");
                            } else if (
                              window.confirm("Are you sure, you want to delete")
                            ) {
                              var server_address =
                                `${URL}/del_row`;
                              const resp2 = await fetch(server_address, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "jwt-token": localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  sr: row.sr,
                                  project_id: props.projId,
                                  heads: row.heads,
                                }),
                              });

                              const json_response = await resp2.json();
                              console.log(json_response);
                              if (resp2.status === 200) {
                                // alert("Cannot delete this row");
                                // alert(json_response.message)
                              }



                              var server_address3 =
                                `${URL}/get_main_table`;
                              const resp3 = await fetch(server_address3, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "jwt-token": localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  project_id: props.projId,
                                }),
                              });

                              const json_response3 = await resp3.json();
                              set_rows(json_response3);

                              // update summary table
                              var server_address4 =
                                `${URL}/get_summary_table`;
                              const resp4 = await fetch(server_address4, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  "jwt-token": localStorage.getItem("token"),
                                },
                                body: JSON.stringify({
                                  project_id: props.projId,
                                }),
                              });

                              const json_response4 = await resp4.json();
                              setsummaryrows(json_response4);
                            }
                          }}
                        />
                      </StyledTableCell>
                    ) : null}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}

        <br />
        <ReactHTMLTableToExcel
          id="test-table-xls-button2"
          className="custom-button"
          // className="download-table-xls-button btn btn-primary mb-3"
          table="table-to-xls2"
          filename={"Summary_" + props.projId.toString().substring(0)}
          sheet="Sheet1"
          buttonText="Export Non Reccuring Summary Table"
        />
        {props.userFlag === 1 || props.userFlag === 2 ? (
          <center>
            <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '32px', color: '#333', marginTop: "2px", marginBottom: "15px" }}>
              Summary Table-Non Recurring
            </h2>

          </center>
        ) : null}

        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          className="table custom-table"
          id="table-to-xls2"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell colspan={12} align="center">
                Project ID: {props.projId.toString().substring(0)}, Project
                Title: {props.project_title}, PI Name: {props.projProfName},
                Total Cost: INR {props.project_grant}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Sr. No.</StyledTableCell>
              <StyledTableCell align="left">Heads</StyledTableCell>
              <StyledTableCell align="left">Sanctioned Amount</StyledTableCell>
              <StyledTableCell align="left">Funds 1YR</StyledTableCell>
              <StyledTableCell align="left">Funds 2YR</StyledTableCell>
              <StyledTableCell align="left">Funds 3YR</StyledTableCell>
              {/* <StyledTableCell align="left">Funds 4YR</StyledTableCell>
              <StyledTableCell align="left">Funds 5YR</StyledTableCell> */}
              <StyledTableCell align="left">Expenditure</StyledTableCell>
              <StyledTableCell align="left">Balance</StyledTableCell>
              <StyledTableCell align="left">Comment</StyledTableCell>
              {props.userFlag === 1 ? (
                <StyledTableCell align="left">Update Amount</StyledTableCell>
              ) : null}
              {props.userFlag === 1 ? (
                <StyledTableCell align="left">Mark resolved</StyledTableCell>
              ) : null}
            </TableRow>
          </TableHead>


          <TableBody>
            {summaryrows
              .filter(row => /(Non-Rec\.|\(Non-Recurring\)|Misc\s+Non\s+Rec)/.test(row.heads))
              .map((row, index) => (
                <StyledTableRow
                  key={row.sr}
                  className={rowSelector(row.comm_flag)}
                >
                  <StyledTableCell component="th" scope="row">
                    {index === 0 ? <span style={{ fontSize: '2.5em' }}>&bull;</span> : index}
                    {/* {row.sr} */}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {row.heads}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.heads === "Misc Rec." ||
                      row.heads === "Misc Non Rec." ? (
                      <span
                        style={
                          row.heads === "Rec." || row.heads === "Non-Rec."
                            ? { fontWeight: "bold" }
                            : { fontWeight: "" }
                        }
                      >
                        0
                      </span>
                    ) : (
                      <span
                        style={
                          row.heads === "Rec." || row.heads === "Non-Rec."
                            ? { fontWeight: "bold" }
                            : { fontWeight: "" }
                        }
                      >
                        {"₹" + row.sanctioned_amount}
                      </span>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.year_1_funds}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.year_2_funds}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.year_3_funds}
                    </span>
                  </StyledTableCell>
                  {/* <StyledTableCell align="left"> */}
                  {/* <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span> */}
                  {/* </StyledTableCell> */}
                  {/* <StyledTableCell align="left"> */}
                  {/* <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span> */}
                  {/* </StyledTableCell> */}
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.expenditure}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.balance}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {/* <Stack  direction="row"  spacing={-5}> */}
                    <Button
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={async () => {
                        setrowIdView(row.sr);
                        var server_address =
                          `${URL}/get_summary_comment`;
                        const resp2 = await fetch(server_address, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "jwt-token": localStorage.getItem("token"),
                          },
                          body: JSON.stringify({
                            row_no: row.sr,
                            project_id: props.projId,
                            is_admin: props.userFlag,
                          }),
                        });

                        const json_response = await resp2.json();
                        console.log(json_response);
                        setcommentJsonData(json_response);
                        // ViewComments(row.sr)
                      }}
                    />
                    <Button
                      style={{ width: "60px" }}
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAddCommentPopup(true);
                        setrowId(row.sr);
                        setwhichTable(2);
                      }}
                    />
                  </StyledTableCell>

                  {props.userFlag === 1 ? (
                    <StyledTableCell align="left">
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setcurrUpdateheads(row.heads);
                          setOpenEditPopup(true);
                          setrowId(row.sr);
                        }}
                      />
                    </StyledTableCell>
                  ) : null}


                  {
                    props.userFlag === 1 ? (
                      <StyledTableCell align="left">
                        <Button
                          startIcon={<CheckCircleIcon />}
                          onClick={async () => {
                            if (
                              window.confirm("Are you sure, you want to mark as resolved..")
                            )
                              setrowIdView(-1);

                            var server_address =
                              `${URL}/markread`;
                            const resp2 = await fetch(server_address, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({
                                row_no: row.sr,
                                project_id: props.projId,
                                is_admin: props.userFlag,
                              }),
                            });

                            const json_response = await resp2.json();


                            server_address = `${URL}/get_summary_table`;
                            const resp3 = await fetch(server_address, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({ project_id: props.projId }),
                            });

                            const json_response2 = await resp3.json();
                            setsummaryrows(json_response2);
                          }}
                        // ViewComments(row.sr)

                        />
                      </StyledTableCell>
                    ) : null
                  }

                </StyledTableRow>
              ))}
          </TableBody>
        </Table>



        {/* HERE CHANGED */}

        <br />
        <ReactHTMLTableToExcel
          id="test-table-xls-button3"
          className="custom-button"
          // className="download-table-xls-button btn btn-primary mb-3"
          table="table-to-xls3"
          filename={"Summary_" + props.projId.toString().substring(0)}
          sheet="Sheet2"
          buttonText="Export Reccuring Summary Table "
        />
        {props.userFlag === 1 || props.userFlag === 2 ? (
          <center>
            <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '32px', color: '#333', marginTop: "2px", marginBottom: "15px" }}>
              Summary Table-Recurring
            </h2>
          </center>
        ) : null}

        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          className="table custom-table"
          id="table-to-xls3"
        >
          <TableHead>

            <TableRow>
              <StyledTableCell colspan={12} align="center">
                Project ID: {props.projId.toString().substring(0)}, Project
                Title: {props.project_title}, PI Name: {props.projProfName},
                Total Cost: INR {props.project_grant}
              </StyledTableCell>
            </TableRow>

            <TableRow>
              <StyledTableCell>Sr. No.</StyledTableCell>
              <StyledTableCell align="left">Heads</StyledTableCell>
              <StyledTableCell align="left">Sanctioned Amount</StyledTableCell>
              <StyledTableCell align="left">Funds 1YR</StyledTableCell>
              <StyledTableCell align="left">Funds 2YR</StyledTableCell>
              <StyledTableCell align="left">Funds 3YR</StyledTableCell>
              <StyledTableCell align="left">Expenditure</StyledTableCell>
              <StyledTableCell align="left">Balance</StyledTableCell>
              <StyledTableCell align="left">Comment</StyledTableCell>
              {props.userFlag === 1 ? (
                <StyledTableCell align="left">Update Amount</StyledTableCell>
              ) : null}
              {props.userFlag === 1 ? (
                <StyledTableCell align="left">Mark resolved</StyledTableCell>
              ) : null}
            </TableRow>

          </TableHead>

          <TableBody>
            {summaryrows
              .filter(row => !(/Non-Rec\.|Non-Recurring|Total|Misc\s+Non\s+Rec/.test(row.heads)))

              .map((row, index) => (
                <StyledTableRow
                  key={row.sr}
                  className={rowSelector(row.comm_flag)}
                >
                  <StyledTableCell component="th" scope="row">
                    {index === 0 ? <span style={{ fontSize: '2.5em' }}>&bull;</span> : index}
                    {/* {row.sr} */}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {row.heads}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.heads === "Misc Rec." ||
                      row.heads === "Misc Non Rec." ? (
                      <span
                        style={
                          row.heads === "Rec." || row.heads === "Non-Rec."
                            ? { fontWeight: "bold" }
                            : { fontWeight: "" }
                        }
                      >
                        0
                      </span>
                    ) : (
                      <span
                        style={
                          row.heads === "Rec." || row.heads === "Non-Rec."
                            ? { fontWeight: "bold" }
                            : { fontWeight: "" }
                        }
                      >
                        {"₹" + row.sanctioned_amount}
                      </span>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.year_1_funds}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.year_2_funds}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.year_3_funds}
                    </span>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.expenditure}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <span
                      style={
                        row.heads === "Rec." || row.heads === "Non-Rec."
                          ? { fontWeight: "bold" }
                          : { fontWeight: "" }
                      }
                    >
                      {"₹" + row.balance}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {/* <Stack  direction="row"  spacing={-5}> */}
                    <Button
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={async () => {
                        setrowIdView(row.sr);
                        var server_address =
                          `${URL}/get_summary_comment`;
                        const resp2 = await fetch(server_address, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "jwt-token": localStorage.getItem("token"),
                          },
                          body: JSON.stringify({
                            row_no: row.sr,
                            project_id: props.projId,
                            is_admin: props.userFlag,
                          }),
                        });

                        const json_response = await resp2.json();
                        console.log(json_response);
                        setcommentJsonData(json_response);
                        // ViewComments(row.sr)
                      }}
                    />
                    <Button
                      style={{ width: "60px" }}
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAddCommentPopup(true);
                        setrowId(row.sr);
                        setwhichTable(2);
                      }}
                    />
                  </StyledTableCell>

                  {props.userFlag === 1 ? (
                    <StyledTableCell align="left">
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setcurrUpdateheads(row.heads);
                          setOpenEditPopup(true);
                          setrowId(row.sr);
                        }}
                      />
                    </StyledTableCell>
                  ) : null}


                  {
                    props.userFlag === 1 ? (
                      <StyledTableCell align="left">
                        <Button
                          startIcon={<CheckCircleIcon />}
                          onClick={async () => {
                            if (
                              window.confirm("Are you sure, you want to mark as resolved..")
                            )
                              setrowIdView(-1);
                            console.log("golu    mmm");
                            var server_address =
                              `${URL}/markread`;
                            const resp2 = await fetch(server_address, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({
                                row_no: row.sr,
                                project_id: props.projId,
                                is_admin: props.userFlag,
                              }),
                            });

                            const json_response = await resp2.json();


                            server_address = `${URL}/get_summary_table`;
                            const resp3 = await fetch(server_address, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "jwt-token": localStorage.getItem("token"),
                              },
                              body: JSON.stringify({ project_id: props.projId }),
                            });

                            const json_response2 = await resp3.json();
                            setsummaryrows(json_response2);
                          }}
                        // ViewComments(row.sr)

                        />
                      </StyledTableCell>
                    ) : null
                  }

                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        {/* UNTIL HERE */}

        {(props.userFlag === 1 || props.userFlag === 2) ? (<center>
          <h2>Add new Fellows</h2>{" "}
        </center>) : (null)}
        {(props.userFlag === 1 || props.userFlag === 2) ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            direction="row"
            spacing={3}
            padding={4}
          >
            <TextField
              id="standard-basic"
              label="Email Address"
              variant="standard"
              onChange={(event) => {
                setnewUserEmail(event.target.value);
              }}
            />
            <Buttons className="custom-button" onClick={add_fellow_on_click}>
              Add new fellow
            </Buttons>

          </Stack>) : (null)}

        <center>
          <h2>Fellow Table</h2>{" "}
        </center>
        {/* <div className="tableContainer"> */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" className="table custom-table">
            <TableHead>
              <TableRow>

                <StyledTableCell align="center">Email</StyledTableCell>
                {(props.userFlag === 1 || props.userFlag === 2) ? (<StyledTableCell align="center">Remove</StyledTableCell>) : (null)}
              </TableRow>
            </TableHead>

            <TableBody>

              {frows && frows.length > 0 && frows.map((row) => (
                <StyledTableRow key={row.email_id}>
                  <StyledTableCell align="center">{row.email_id}</StyledTableCell>
                  {(props.userFlag === 1 || props.userFlag === 2) ? (
                    <StyledTableCell align="center">
                      <Button
                        onClick={() => {
                          setOpenRemoveUserPop(true);
                          setcurrentUserEmail(row.email_id);
                        }}
                        startIcon={<RemoveCircleOutlineIcon />}
                      />
                    </StyledTableCell>
                  ) : null}
                </StyledTableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
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
                <Buttons className="custom-button"
                  style={{
                    height: "30px",
                    paddingTop: "8px",
                    paddingBottom: "30px",
                  }}
                  onClick={() => {
                    removeFellow();
                    setOpenRemoveUserPop(false);
                  }}
                >
                  YES
                </Buttons>
                <Buttons
                  className="custom-button"
                  style={{
                    height: "30px",
                    paddingTop: "8px",
                    paddingBottom: "30px",
                  }}

                  onClick={() => {
                    setOpenRemoveUserPop(false);
                  }}
                >
                  NO
                </Buttons>
              </Stack>
            </span>
          </div>
        </RemoveUserPop>
      </div>
      <AddCommentPopup
        openAddCommentPopup={openAddCommentPopup}
        setOpenAddCommentPopup={setOpenAddCommentPopup}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "500px" } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="AddComment">
            <span>
              <Button
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => setOpenAddCommentPopup(false)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Comment"
                multiline
                rows={4}
                defaultValue=""
                bgcolor="white"
                sx={{ zIndex: "tooltip" }}
                onChange={(event) => {
                  setComment(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={() => {
                    handleSubmit();
                    sendmail();
                  }}
                >
                  Send
                </Button>
              </center>
            </span>
          </div>
        </Box>
      </AddCommentPopup>

      <ViewCommentPopup
        openViewCommentPopup={openViewCommentPopup}
        setOpenViewCommentPopup={setOpenViewCommentPopup}
      >
        <div className="viewCommentDiv">
          <span>
            <Button
              startIcon={<CloseIcon />}
              style={{ float: "right" }}
              onClick={async () => {
                var server_address3 = `${URL}/get_main_table`;
                const resp3 = await fetch(server_address3, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "jwt-token": localStorage.getItem("token"),
                  },
                  body: JSON.stringify({ project_id: props.projId }),
                });

                const json_response3 = await resp3.json();
                set_rows(json_response3);

                // update summary table
                var server_address4 = `${URL}/get_summary_table`;
                const resp4 = await fetch(server_address4, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "jwt-token": localStorage.getItem("token"),
                  },
                  body: JSON.stringify({ project_id: props.projId }),
                });

                const json_response4 = await resp4.json();
                setsummaryrows(json_response4);
                setOpenViewCommentPopup(false);
                setrowIdView(0);
              }}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 100 }} aria-label="customized table" className="table custom-table" id="tbl1">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Author</StyledTableCell>
                    <StyledTableCell align="right">Comment</StyledTableCell>
                    <StyledTableCell align="right">
                      Comment Date/Time
                    </StyledTableCell>
                    {/* <StyledTableCell align="right">Resolved</StyledTableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commentJsonData.map((row) => (
                    <StyledTableRow key={row.comment_time}>
                      <StyledTableCell component="th" scope="row">
                        {row.person}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.comment}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.comment_time}
                      </StyledTableCell>
                      {/* <StyledTableCell align="right">
                        {row.resolved}
                      </StyledTableCell> */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </span>
        </div>
      </ViewCommentPopup>
      <CommitPopup
        openCommitPopup={openCommitPopup}
        setOpenCommitPopup={setOpenCommitPopup}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "500px" } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="AddComment">
            <span>
              <Button
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => setOpenCommitPopup(false)}
              />
              <TextField
                type="number"
                id="outlined-basic"
                label="New Expense"
                variant="outlined"
                onChange={(event) => {
                  setNewExpense(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={async () => {
                    var server_address = `${URL}/to_actual`;
                    const resp2 = await fetch(server_address, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "jwt-token": localStorage.getItem("token"),
                      },
                      body: JSON.stringify({
                        sr: rowId,
                        p_id: props.projId,
                        new_pay: Number(NewExpense),
                        old_pay: oldPay,
                        heads: new_heads,
                      }),
                    });

                    const json_response = await resp2.json();
                    console.log(json_response);
                    var server_address4 =
                      `${URL}/get_summary_table`;
                    const resp4 = await fetch(server_address4, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "jwt-token": localStorage.getItem("token"),
                      },
                      body: JSON.stringify({ project_id: props.projId }),
                    });

                    const json_response4 = await resp4.json();
                    setsummaryrows(json_response4);

                    var server_address3 =
                      `${URL}/get_main_table`;
                    const resp3 = await fetch(server_address3, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "jwt-token": localStorage.getItem("token"),
                      },
                      body: JSON.stringify({ project_id: props.projId }),
                    });

                    const json_response3 = await resp3.json();
                    set_rows(json_response3);
                    setOpenCommitPopup(false);
                  }}
                >
                  Update
                </Button>
              </center>
            </span>
          </div>
        </Box>
      </CommitPopup>
      <EditPopup
        openEditPopup={openEditPopup}
        setOpenEditPopup={setOpenEditPopup}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "500px" } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="Edit">
            <span>
              <Button
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => setOpenEditPopup(false)}
              />
              <TextField
                type="number"
                id="outlined-basic"
                label="New Sanctioned Amount"
                variant="outlined"
                onChange={(event) => {
                  setEdit(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={async () => {
                    var server_address =
                      `${URL}/edit_sanctioned`;
                    const resp2 = await fetch(server_address, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "jwt-token": localStorage.getItem("token"),
                      },
                      body: JSON.stringify({
                        project_id: props.projId,
                        sanc: Edit,
                        heads: currUpdateheads,
                      }),
                    });

                    const json_response = await resp2.json();
                    console.log(json_response);
                    setOpenEditPopup(false);

                    var server_address4 =
                      `${URL}/get_summary_table`;
                    const resp4 = await fetch(server_address4, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "jwt-token": localStorage.getItem("token"),
                      },
                      body: JSON.stringify({ project_id: props.projId }),
                    });

                    const json_response4 = await resp4.json();
                    setsummaryrows(json_response4);
                  }}
                >
                  Update
                </Button>
              </center>
            </span>
          </div>
        </Box>
      </EditPopup>
      <AddExpensesRowPopUp
        AddExpensesRowPop={AddExpensesRowPop}
        setAddExpensesRowPop={setAddExpensesRowPop}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { width: "500px" } }}

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
          <div className="addExpenses">

            <Stack
              justifyContent="right"
              alignItems="right"
              direction="row"
              spacing={3}
              padding={1}
            >
              <Button
                className="CloseAddProjectPopup"
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => {
                  set_new_heads("Heads");
                  setAddExpensesRowPop(false);
                }}
              />
            </Stack>


            <header className="header">
              <h3 className="header-title">Add New Expense</h3>
            </header>

            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Particulars"
                variant="outlined"
                onChange={(event) => {
                  set_new_particulars(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Remarks"
                variant="outlined"
                onChange={(event) => {
                  set_new_remarks(event.target.value);
                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 700 }}
                id="outlined-basic"
                label="Voucher No. and Date"
                variant="outlined"
                onChange={(event) => {
                  set_new_vouchno(event.target.value);
                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Payment"
                variant="outlined"
                onChange={(event) => {
                  set_new_pay(event.target.value);
                }}
              />


              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={new_heads}
                  label="Age"
                  onChange={(event) => {
                    set_new_heads(event.target.value);
                  }}
                >
                  <MenuItem value={"Rec."}>Recurring</MenuItem>
                  <MenuItem value={"Non-Rec."}>Non-Recurring</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              {new_heads === "Rec." ? (
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="demo-simple-select-label2">Heads</InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select2"
                    value={new_heads2}
                    label="Age"
                    onChange={(event) => {
                      set_new_heads2(event.target.value);
                    }}
                  >
                    <MenuItem value={"Manpower(Recurring)"}>Manpower</MenuItem>
                    <MenuItem value={"Consumables(Recurring)"}>Consumables</MenuItem>
                    <MenuItem value={"Travel(Recurring)"}>Travel</MenuItem>
                    <MenuItem value={"Field Testing/Demo/Tranings(Recurring)"}>
                      Field Testing/Demo/Tranings
                    </MenuItem>
                    <MenuItem value={"Overheads(Recurring)"}>Overheads</MenuItem>
                    <MenuItem value={"Unforseen Expenses(Recurring)"}>
                      Unforseen Expenses
                    </MenuItem>
                    <MenuItem value={"Fabrication(Recurring)"}>Fabrication</MenuItem>
                    <MenuItem value={"Misc Rec."}>
                      Miscellaneous(Recurring)
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="demo-simple-select-label2">Heads</InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select2"
                    value={new_heads2}
                    label="Age"
                    onChange={(event) => {
                      set_new_heads2(event.target.value);
                    }}
                  >
                    <MenuItem value={"Equipments(Non-Recurring)"}>Equipment</MenuItem>
                    <MenuItem value={"Construction(Non-Recurring)"}>Construction</MenuItem>

                    <MenuItem value={"Misc Non Rec."}>
                      Miscellaneous(Non-Recurring)
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Commit Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  OpenAddFundsPopUp
                  value={committedOrNot}
                  label="Age"
                  onChange={(event) => {
                    setcommittedOrNot(event.target.value);
                  }}
                >
                  <MenuItem value={"1"}>Committed</MenuItem>
                  <MenuItem value={"0"}>Actual</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <center>
              <Buttons
                onClick={() => {
                  addNewExpensesRecord();
                  // setAddExpensesRowPop(false);
                }}
                className="custom-button"
              // style={{ backgroundColor: '#1b1340', color: '#ffffff', '&:hover': { backgroundColor: '#fdfdff' } }}
              >
                Add Expense
              </Buttons>
            </center>
          </div>
        </Box>
      </AddExpensesRowPopUp>

      <AddFundsPopUp
        openAddFundsPopUp={openAddFundsPopUp}
        setOpenAddFundsPopUp={setOpenAddFundsPopUp}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { width: "500px" } }}

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
          <div className="addFunds">
            <Stack
              justifyContent="right"
              alignItems="right"
              direction="row"
              spacing={3}
              padding={1}
            >

              <Button
                className="CloseAddProjectPopup"
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => {
                  setOpenAddFundsPopUp(false);
                }}
              />

            </Stack>
            <header className="header" style={{ marginLeft: '-2px', marginTop: '-40px' }}>
              <h3 className="header-title">Add New Funds</h3>
            </header>


            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >

              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Particulars"
                variant="outlined"
                onChange={(event) => {
                  set_new_particulars(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Remarks"
                variant="outlined"
                onChange={(event) => {
                  set_new_remarks(event.target.value);
                }}
              />
            </Stack>

            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 800 }}
                id="outlined-basic"
                label="Voucher No. and Date"
                variant="outlined"
                onChange={(event) => {
                  set_new_vouchno(event.target.value);
                }}
              />
              {/* <TextField
                type="number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Receipt (Total Funds to be Added)"
                variant="outlined"
                onChange={(event) => {
                  set_new_rec(event.target.value);
                }}
              /> */}
            </Stack>
            <center className="paddingFix">
              <header className="header">
                <h3 className="header-title" style={{ fontSize: '1.5rem' }}>Enter the Amount under the following categories/Heads :</h3>
              </header>
            </center>

            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <TextField

                id="outlined-basic"
                label="Recurring"
                variant="outlined"
                style={{ width: 500, marginBottom: '10px' }} // Added marginBottom for spacing
                onChange={(event) => {
                  setnewRecurring(event.target.value);
                }}
              />
              <TextField

                id="outlined-basic"
                label="Non-recurring"
                variant="outlined"
                style={{ width: 500, marginBottom: '10px' }} // Added marginBottom for spacing
                onChange={(event) => {
                  setnewNonRecurring(event.target.value);
                }}
              />
            </div>


            <br></br>
            <br></br>

            <center>
              <Buttons
                onClick={() => {
                  addNewFunds();

                  // setOpenAddFundsPopUp(false);

                }}
                className="custom-button"
              >
                Add Fund
              </Buttons>
            </center>
          </div>
        </Box>
      </AddFundsPopUp>

      {/* /Excel Import compoment   */}

      <ImportExcelPop
        openImportExcelPop={openImportExcelPop}
        setOpenImportExcelPop={setOpenImportExcelPop}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { width: "600px" } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="addFunds">
            <Stack
              justifyContent="right"
              alignItems="right"
              direction="row"
              spacing={3}
              padding={1}
            >
              <Button
                className="CloseAddProjectPopup"
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => {
                  setOpenImportExcelPop(false);
                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Rec 1st Year"
                variant="outlined"
                onChange={(event) => {
                  setrec1(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Non-Rec. 1st Year"
                variant="outlined"
                onChange={(event) => {
                  setnonrec1(event.target.value);

                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Rec 2nd Year"
                variant="outlined"
                onChange={(event) => {
                  setrec2(event.target.value);

                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Non-Rec 2nd Year"
                variant="outlined"
                onChange={(event) => {
                  setnonrec2(event.target.value);

                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Rec 3rd Year"
                variant="outlined"
                onChange={(event) => {
                  setrec3(event.target.value);

                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Non-Rec 3rd Year"
                variant="outlined"
                onChange={(event) => {
                  setnonrec3(event.target.value);

                }}
              />
            </Stack>

            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <input
                type="file"
                onChange={(errorrrrr) => {
                  handleFile(errorrrrr)

                }}
              />
            </Stack>

            <center>
              <Button
                onClick={() => {
                  processExcel();
                }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Import
              </Button>
            </center>
          </div>
        </Box>
      </ImportExcelPop>
      {/* </Toolbar> */}
    </>
  );
}
