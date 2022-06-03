import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: "25px",
      height: "25px",
      marginRight: 4,
      fontSize: 12,
      fontWeight: 600,
      color: Colors.white,
    },
    avatar: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
      margin: "auto",
      fontWeight: "normal",
      lineHeight: "18px",
      alignItems: "center",
      color: Colors.almost_black,
    },
  }),
);
