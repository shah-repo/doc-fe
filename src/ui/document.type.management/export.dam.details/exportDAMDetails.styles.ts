import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    dialogAction: {
      display: "flex",
      marginBottom: 10,
      alignSelf: "flex-end",
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
