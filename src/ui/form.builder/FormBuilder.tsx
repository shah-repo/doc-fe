import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogProps } from "./components/dialog/utils/types";
import FBTemplateInfo from "./FBTemplateInfo";

const FormBuilder: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => (
  <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
      <NavigationIcon />
      <Text message="form.builder" />
    </Fab>
    <FBDialog title="form.builder.create" {...props}>
      <Box pt={3}>
        <FBTemplateInfo />
      </Box>
    </FBDialog>
  </Box>
);

export default withDialogStates(FormBuilder);
