import MuiDialogContent from "@material-ui/core/DialogContent";
import React from "react";
import AsyncGate from "../../../AsyncGate";
import { styles } from "../utils/styles";
import { ViewFileContentProps } from "../utils/types";

const ViewFileContent: React.FunctionComponent<ViewFileContentProps> = ({
  asyncState,
  url,
}) => {
  const classes = styles();
  url = "https://ec.europa.eu/transport/sites/transport/files/themes/passengers/air/doc/complain_form/eu_complaint_form_en.pdf";

  return (
    <MuiDialogContent className={classes.content}>
      <AsyncGate asyncState={asyncState}>
        <object width="100%" height="100%" type="application/pdf" data={url}>
          <p>Insert your error message here, if the PDF cannot be displayed.</p>
        </object>
      </AsyncGate>
    </MuiDialogContent>
  );
};

export default ViewFileContent;
