import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    textautosizer: {
      width: "-webkit-fill-available",
      borderRadius: theme.spacing(0.5),
      borderColor: Colors.hint_gray,
      fontFamily: "inherit",
    },
    label: {
      margin: theme.spacing(4, 0, 2, 0),
      fontWeight: "bold",
      color: Colors.dark_gray,
    },
    gridWrapper: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(2, 0),
    },
  })
);
