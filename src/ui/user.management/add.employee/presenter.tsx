import { Box, Button, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import AuditItemsContainer from "../audit.panel/container";
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
    historyButton: {
      margin: "0 10px",
      boxShadow: "none",
      width: "86px",
      height: "36px",
      borderRadius: 100,
      background: Colors.light_blue,
      color: Colors.navy,
      fontFamily: "Sora",
      fontSize: "12px",
      padding: "20px",
      justifyContent: "center",
      alignItems: "center",
      // "paddingRight": theme.spacing(2.5),
      // "paddingLeft": theme.spacing(2.5),
      marginRight: theme.spacing(1.25),
      textTransform: "none",
      // "&:hover": {
      //   background: Colors.light_blue,
      // },
    },
  }));
  const classes = styles();
  // load history panel
  const [openHistoryPanel, setHistoryPanel] = React.useState<boolean>(false);

  const onHistoryPanelClick = () => {
    setHistoryPanel(!openHistoryPanel);
  };
  return (
    <Box>
      <Button
        variant="contained"
        onClick={onHistoryPanelClick}
        id="um-audit"
        className={classes.historyButton}
      >
        <Text message="user.management.audit" />
      </Button>

      <Button
        variant="contained"
        onClick={openDialog}
        id="AddEmployeePresenter-openDialog"
        className={classes.Button}
      >
        <Text message="user.management.add.employee" />
      </Button>
      {openHistoryPanel &&
        <AuditItemsContainer
          openHistoryPanel={openHistoryPanel}
          closeHistoryPanel={onHistoryPanelClick}
        />
      }
      <AddEmployeeDialogPresenter isOpen={isOpen} closeDialog={closeDialog}>
        <AddEmployeeFormContainer />
      </AddEmployeeDialogPresenter>
    </Box>
  ); };

export default AddEmployeePresenter;
