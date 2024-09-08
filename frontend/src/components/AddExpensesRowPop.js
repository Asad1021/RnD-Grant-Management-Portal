import React from "react";
import {
  Dialog,
  DialogContent,
} from "@material-ui/core";

export default function AddExpensesRowPopUp(props) {
  const {children, AddExpensesRowPop, setAddExpensesRowPop } = props;
  return (
    <Dialog open={AddExpensesRowPop}  fullWidth maxWidth="md">
      
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
