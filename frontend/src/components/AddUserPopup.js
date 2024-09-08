import React from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";

export default function AddUserPopup(props) {
  const {children, openAddUserPopup, setOpenAddUserPopup } = props;
  return (
    <Dialog open={openAddUserPopup} fullWidth maxWidth="md">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}