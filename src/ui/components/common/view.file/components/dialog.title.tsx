import MuiDialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { styles } from "../utils/styles";

const ViewFileTitle: React.FunctionComponent<{}> = ({
}) => {
  const classes = styles();
  return (
    <MuiDialogTitle disableTypography={true} className={classes.title}>
      Title
    </MuiDialogTitle>
  );
};

export default ViewFileTitle;
