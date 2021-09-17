import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    dialogAction: {
      display: "flex",
      alignSelf: "flex-end",
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
        backgroundColor: Colors.red,
        opacity: 0.1,
        color: Colors.light_red,
        transform: "translate(-10px, -6px)",
        borderRadius: 11,
      },
    },
  }),
);
