import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      float: "right",
      clear: "right",
    },
    cancelButton: {
      float: "right",
      marginRight: theme.spacing(1),
    },
    dialogPaper: {
      overflowY: "unset",
      minWidth: "600px",
      padding: theme.spacing(1.5),
    },
    dialogContent: {
      overflowY: "unset",
    },
    iconContainer: {
      "&:before": {
        content: "''",
        height: 40,
        width: 45,
        position: "absolute",
        backgroundColor: Colors.medium_blue,
        color: Colors.red,
        opacity: 0.1,
        transform: "translate(-10px, -6px)",
        borderRadius: 11,
      },
    },
    icon: {
      color: Colors.medium_blue,
    },
    containerWrap: {
      padding: theme.spacing(2, 2, 0, 2),
    },
    gridWrap: {
      display: "flex",
      alignSelf: "center",
    },
  }),
);
