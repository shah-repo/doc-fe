import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      "background": Colors.medium_blue,
      "color": Colors.white,
      "boxShadow": "none",
      "margin": theme.spacing(0, 2, 0, 1),
      "flexGrow": 1,
      "&:hover": {
        background: Colors.medium_blue,
      },
    },
    cancelButton: {
      "background": Colors.light_blue,
      "color": Colors.medium_blue,
      "boxShadow": "none",
      "margin": theme.spacing(0, 1, 0, 2),
      "flexGrow": 0.6,
      "&:hover": {
        background: Colors.light_blue,
      },
    },
    dialogAction: {
      display: "flex",
      marginBottom: 10,
    },
    dialogContent: {
      color: Colors.dark_gray,
      opacity: 0.6,
    },
    iconContainer: {
      "&:before": {
        content: "''",
        height: 40,
        width: 45,
        position: "absolute",
        backgroundColor: Colors.gray,
        opacity: 0.1,
        transform: "translate(-10px, -6px)",
        borderRadius: 11,
      },
    },
    title: {
      marginTop: 20,
      marginBottom: 5,
    },
    subtitle: {
      marginTop: 20,
      marginBottom: 5,
      textAlign: "start",
    },
  }),
);
