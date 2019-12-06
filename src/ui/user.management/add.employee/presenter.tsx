import { Box, Button } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import AddEmployeeDialogPresenter from "./dialog.presenter";

interface Props {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const AddEmployeePresenter: React.FunctionComponent<Props> = ({
  isOpen,
  openDialog,
  closeDialog,
}) => {
  return (
    <Box>
      <Button
        color="primary"
        variant="contained"
        onClick={openDialog}
      >
        <Text message="user.management.add.employee" />
      </Button>
      <AddEmployeeDialogPresenter
        isOpen={isOpen}
        closeDialog={closeDialog}
      />
    </Box>
  );
};

export default AddEmployeePresenter;
