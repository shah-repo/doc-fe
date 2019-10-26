import { Box } from "@material-ui/core";
import Text from "../../../components/Text";

import React from "react";
import FBDialog from "../feedback/FBDialog";
import formBuilderStore from "../../stores/FBStore";
import { FBDialogProps } from "../../types/dialog";
import FBButton from "../inputs/FBButton";
import FBTextField from "../inputs/FBTextField";

const FBExportDialog: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {
  const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formBuilderStore.setName(event.currentTarget.value);
  };

  return (
    <React.Fragment>
      <FBDialog title={`form.builder.export`} {...props}>
        <FBTextField
          onChange={handleOnchange}
          label={"form.builder.filename"}
        />
        <Box display="flex" justifyContent="flex-end">
          <FBButton
            onClick={formBuilderStore.exportSchema}
            label={"common.export"}
          />
        </Box>
      </FBDialog>
    </React.Fragment>
  );
};

export default FBExportDialog;
