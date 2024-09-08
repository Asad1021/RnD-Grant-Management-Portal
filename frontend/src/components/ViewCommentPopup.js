import React from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";

export default function ViewCommentPopup(props) {
  const {children, openViewCommentPopup, setOpenViewCommentPopup } = props;
  return (
    <Dialog open={openViewCommentPopup}  fullWidth maxWidth="md">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
