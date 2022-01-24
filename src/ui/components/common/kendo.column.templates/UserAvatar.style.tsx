import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: "25px",
      height: "25px",
      marginRight: 4,
      fontFamily: "Sora",
      fontSize: 12,
      fontWeight: 600,
      color: Colors.white,
      backgroundColor: Colors.grey_cloud,
    },
    avatar: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      margin: "auto",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      lineHeight: "18px",
      alignItems: "center",
      color: Colors.almost_black,
    },
  }),
);
