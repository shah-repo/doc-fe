import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    root: {
      overflow: "auto",
      height: "calc(100vh - 130px)",
    },
    error: {
      color: Colors.red,
    },
    grid: {
      marginTop: "4px",
    },
  })
);
