import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop4: {
      marginTop: "4px",
    },
    margin12: {
      marginBottom: "12px",
    },
    listItem: {
      marginTop: "12px",
      marginBottom: "8px",
    },
    generalInfo: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.almost_black,
    },
    releaseDate: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.almost_black,
      marginTop: "4px",
    },
    avatar: {
      width: "35px",
      height: "35px",
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      fontFamily: "Sora",
      textTransform: "uppercase",
    },
    released: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "20px",
      color: Colors.almost_black,
      marginTop: "10px",
    },
  }),
);
