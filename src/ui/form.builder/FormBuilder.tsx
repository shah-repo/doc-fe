import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogAction, FBDialogProps } from "./components/dialog/utils/types";
import FBTextField from "./components/inputs/textfield/FBTextField";

const FormBuilder: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  const onActionClick = (action: FBDialogAction) => props.setDialogClose();

  return (
    <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      <FBDialog
        title="form.builder.create"
        actions={["create"]}
        onActionClick={onActionClick}
        {...props}
      >
        <Box pt={3} >
          <FBTextField label="form.builder.title" />
          <FBTextField label="form.builder.number" />
        </Box>
      </FBDialog>
    </Box>
  );
};

export default withDialogStates(FormBuilder);
