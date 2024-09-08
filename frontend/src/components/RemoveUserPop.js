import React from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";

export default function RemoveUserPop(props) {
  const {children, openRemoveUserPop, setopenRemoveUserPop } = props;
  return (
    <Dialog open={openRemoveUserPop}  fullWidth maxWidth="xs">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
