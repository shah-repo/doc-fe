import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../../../ui/layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    released: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "20px",
      color: Colors.almost_black,
      marginTop: "10px",
      display: "flex",
      flexWrap: "wrap",
    },
    releaseDate: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.almost_black,
    },
  })
);
