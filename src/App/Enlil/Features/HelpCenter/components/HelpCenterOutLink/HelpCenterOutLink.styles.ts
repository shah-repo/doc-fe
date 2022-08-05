import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../../ui/layout/theme/utils/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      color: Colors.blue,
      fontSize: "0.75rem",
    },
    icon: {
      marginLeft: theme.spacing(0.5),
    },
  })
);

export default useStyles;
