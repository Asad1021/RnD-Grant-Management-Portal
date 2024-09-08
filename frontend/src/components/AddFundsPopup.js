import React from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";

export default function AddFundsPopUp(props) {
    const {children, openAddFundsPopUp, setOpenAddFundsPopUp} = props;
    return (
      <Dialog open={openAddFundsPopUp} fullWidth maxWidth="md">
        
        <DialogContent dividers>{children}</DialogContent>
      </Dialog>
    );
  }
