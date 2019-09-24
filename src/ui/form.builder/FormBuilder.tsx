import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import { withStates } from "./components/common/utils/hoc";
import { FBStateProps } from "./components/common/utils/types";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogAction, FBDialogProps } from "./components/dialog/utils/types";
import FBTextField from "./components/inputs/textfield/FBTextField";
import { createStore } from "./store/store";
import { FBStoreProps } from "./store/types";

const FormBuilder: React.FunctionComponent<FBDialogProps & FBStateProps & FBStoreProps> = ({
  setState,
  ...props
}) => {

  const onActionClick = (action: FBDialogAction) => setState("initial", false);

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
        fullScreen={!props.initial}
        {...props}
      >
        {props.initial && (
          <Box pt={3} >
            <FBTextField label="form.builder.title" />
            <FBTextField label="form.builder.number" />
          </Box>
        )}

        {!props.initial && <div>drugi render</div>}
      </FBDialog>
    </Box>
  );
};

export default withDialogStates(withStates(createStore(FormBuilder)));
