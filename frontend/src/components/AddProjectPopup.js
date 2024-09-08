import React from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";

export default function AddProjectPopup(props) {
  const {children, openAddProjectPopup, setOpenAddProjectPopup } = props;
  return (
    <Dialog open={openAddProjectPopup} fullWidth maxWidth="md">
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
