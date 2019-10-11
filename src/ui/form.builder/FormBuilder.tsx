import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import { withStates } from "./components/common/utils/hoc";
import { FBStateProps } from "./components/common/utils/types";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogProps } from "./components/dialog/utils/types";
import FBTemplateInfo from "./FBTemplateInfo";
import { createStore } from "./store/store";
import { FBStoreProps } from "./store/types";

const FormBuilder: React.FunctionComponent<FBDialogProps & FBStateProps & FBStoreProps> = ({
  setState,
  ...props
}) => (
  <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
      <NavigationIcon />
      <Text message="form.builder" />
    </Fab>
    <FBDialog
      title="form.builder.create"
      {...props}
    >
      <Box pt={3}>
        <FBTemplateInfo />
      </Box>
    </FBDialog>
  </Box>
);

export default withDialogStates(withStates(createStore(FormBuilder)));
