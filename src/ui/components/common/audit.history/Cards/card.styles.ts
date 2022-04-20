import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    outerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "15px 15px 15px 20px",
      position: "static",
      left: 0,
      top: "44px",
      background: Colors.white,
      boxShadow: `0px 1px 0px ${Colors.link_water}`,
      flex: "none",
      order: 1,
      alignSelf: "stretch",
      flexGrow: 0,
      margin: "1px 0",
    },
  })
);
