import { Box, Button, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
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
}) => {
  const styles = makeStyles((theme: Theme) => ({
    Button: {
      "margin": "0px",
      "boxShadow": "none",
      "borderRadius": 100,
      "background": Colors.navy,
      "color": Colors.white,
      "fontFamily": "Sora",
      "paddingRight": theme.spacing(2.5),
      "paddingLeft": theme.spacing(2.5),
      "textTransform": "none",
      "&:hover": {
        background: Colors.navy,
      },
    },
  }));
  const classes = styles();
  return (
    <Box>
      <Button
        variant="contained"
        onClick={openDialog}
        id="AddEmployeePresenter-openDialog"
        className={classes.Button}
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
  ); };

export default AddEmployeePresenter;
