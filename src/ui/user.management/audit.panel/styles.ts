import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    titleOuterContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
    },
    titleContainer: {
      fontWeight: 600,
      fontSize: "12px",
      color: Colors.almost_black,
      margin: "0 2px",
    },
    iconContainer: {
      display: "flex",
      height: "23px",
      flex: "none",
      margin: "0 2px",
    },
    externalContainer: {
      padding: "10px 5px 10px 20px",
      boxShadow: `0 1px 0 ${Colors.link_water}`,
      margin: "1px 0px",
    },
    listItemContainer: {
      maxHeight: "calc(100vh - 80px)",
      overflow: "auto",
      paddingBottom: "30px",
    },
  })
);
