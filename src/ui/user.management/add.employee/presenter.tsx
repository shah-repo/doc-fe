import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import AddEmployeeDialogPresenter from "./dialog.presenter";
import AddEmployeeFormContainer from "./form.container";

interface Props {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const AddEmployeePresenter: React.FunctionComponent<Props> = ({
  isOpen,
  openDialog,
  closeDialog,
}) => (
  <Box>
    <Button
      color="primary"
      variant="contained"
      onClick={openDialog}
      id="AddEmployeePresenter-openDialog"
      style={{ margin: 0 }}
    >
      <Text message="user.management.add.employee" />
    </Button>
    <AddEmployeeDialogPresenter
      isOpen={isOpen}
      closeDialog={closeDialog}
    >
      <AddEmployeeFormContainer />
    </AddEmployeeDialogPresenter>
  </Box>
);

export default AddEmployeePresenter;
