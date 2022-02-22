import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme) =>
  createStyles({
    noPendingActions: {
      color: "red",
    },
    root: {
      overflow: "auto",
      height: "calc(100vh - 245px)",
    },
    grid: {
      marginTop: 5,
    },
    loadButton: {
      margin: theme.spacing(0, 2, 0, 0),
      backgroundColor: Colors.white,
      borderRadius: "100px",
      textTransform: "none",
      fontFamily: "Sora",
      fontSize: 12,
      fontWeight: 600,
      color: Colors.navy,
      border: `1px solid ${Colors.navy}`,
    },
  })
);
