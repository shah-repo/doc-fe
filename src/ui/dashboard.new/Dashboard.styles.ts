import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      overflow: "hidden",
      boxShadow:
        "0px 0px 25px rgba(41, 41, 41, 0.2)",
      background: Colors.white,
      marginRight: 50,
      marginLeft: 50,
      zIndex: 1,
      position: "relative",
    },
    root: {
      width: "100%",
      margin: "auto",
      flex: 1,
      overflowX: "hidden",
      overflowY: "auto",
      height: "calc(100vh - 124px)",
    },
    item: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
    },
    trainingStats: {
      flexGrow: 1,
      paddingTop: "65px",
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
    },
  })
);
