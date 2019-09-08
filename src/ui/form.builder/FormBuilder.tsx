import { Box, Fab, TextField } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogHelper } from "./components/dialog/utils/hoc";
import { FBDialogProps } from "./components/dialog/utils/types";

const FormBuilder: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  return (
    <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      <FBDialog title="form.builder.create" {...props}  >
        <div>children</div>
      </FBDialog>
    </Box>
  );
};

export default withDialogHelper(FormBuilder);
