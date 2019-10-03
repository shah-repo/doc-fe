import { Box } from "@material-ui/core";
import React from "react";
import FBDialog from "../../components/feedback/FBDialog";
import FBEditor from "../../main/editor/FBEditor";
import { FBDialogProps } from "../../types/dialog";

const FBEditorDialog: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  return (
    <FBDialog {...props}>
      <Box display="block" p={2}>
        <FBEditor />
      </Box>
    </FBDialog>
  );
};

export default FBEditorDialog;
