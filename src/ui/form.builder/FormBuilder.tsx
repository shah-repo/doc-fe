import { Box, Button, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React from "react";
import Text from "../components/Text";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogAction, FBDialogProps } from "./components/dialog/utils/types";
import FBForm from "./components/form/FBForm";
import FBTextField from "./components/inputs/textfield/FBTextField";

const FormBuilder: React.FunctionComponent<FBDialogProps> = ({
  ...props
}) => {

  const onSubmit = (values: any) => {
    // tslint:disable-next-line: no-console
    console.log(values);
  };

  return (
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
          <FBForm >
            <FBTextField label="form.builder.title" name="fb_title" required={true} />
            <FBTextField label="form.builder.number" name="fb_number" required={true} />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
            >
              Create
            </Button>
          </FBForm>
        </Box>
      </FBDialog>
    </Box>
  );
};

export default withDialogStates(FormBuilder);
