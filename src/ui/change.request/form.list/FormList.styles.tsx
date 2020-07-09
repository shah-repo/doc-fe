import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      background: Colors.medium_blue,
      color: Colors.white,
      boxShadow: "none",
      margin: 0,
    },
    cancelButton: {
      background: Colors.light_blue,
      color: Colors.medium_blue,
      boxShadow: "none",
      margin: 0,
    },
    dialogPaper: {
      overflowY: "unset",
      minWidth: "400px",
    },
    dialogContent: {
      overflowY: "unset",
    },
    createButton: {
      margin: "0px",
      boxShadow: "none",
    },
    templateRadioGroup: {
      maxHeight: "500px",
      overflowY: "auto",
      width: "100%",
      flexWrap: "unset",
      WebkitFlexWrap: "unset",
      marginBottom: "10px",
    },
  }),
);
