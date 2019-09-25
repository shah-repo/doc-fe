import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogProps } from "./components/dialog/utils/types";
import FBTemplateForm from "./main/template/FBTemplateForm";
import FBTemplateInfo from "./main/template/FBTemplateInfo";
import { templateStore, view } from "./stores/templateStore";

const FormBuilder: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  const isInfo = (templateStore.name === null);

  return (
    <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      <FBDialog
        title={`${templateStore.name}` || "form.builder.create"}
        fullScreen={!isInfo}
        {...props}
      >
        <Box pt={3}>
          {isInfo && <FBTemplateInfo />}
          {!isInfo && <FBTemplateForm />}
        </Box>
      </FBDialog>
    </Box>
  );
};

export default withDialogStates(view(FormBuilder));
