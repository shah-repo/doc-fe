import { Box } from "@material-ui/core";
import React from "react";
import FBDialog from "../feedback/FBDialog";
import formBuilderStore from "../../stores/FBStore";
import { FBDialogProps } from "../../types/dialog";
import FBButton from "../inputs/FBButton";
import FBTextField from "../inputs/FBTextField";

const FBExportDialog: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {
  const exportSchema = () => {
    formBuilderStore.exportSchema();
    props.setDialogClose();
  };

  return (
    <React.Fragment>
      <FBDialog title={`form.builder.export`} {...props}>
        <FBTextField
          onChange={formBuilderStore.setName}
          name="export_field"
          label={"form.builder.filename"}
        />
        <Box display="flex" justifyContent="flex-end">
          <FBButton onClick={exportSchema} label={"common.export"} />
        </Box>
      </FBDialog>
    </React.Fragment>
  );
};

export default FBExportDialog;
