import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import FBDialog from "./components/feedback/FBDialog";
import { withDialogState } from "./hocs/withDialogState";
import FBInfo from "./main/workspace/FBInfo";
import { FBDialogProps } from "./types/dialog";

const FormBuilder: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  return (
    <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      <FBDialog
        title={"form.builder.create"}
        // fullScreen={!isInfo}
        {...props}
      >
        <Box pt={3}>
          <FBInfo />
          {/* {isInfo && <FBInfo />}
          {!isInfo && <FBWorkspace />} */}
        </Box>
      </FBDialog>
    </Box>
  );
};

export default withDialogState(FormBuilder);
