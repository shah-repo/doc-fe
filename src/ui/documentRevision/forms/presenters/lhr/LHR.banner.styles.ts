import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    container: {
      margin: "0px 30px",
      fontWeight: 600,
      fontSize: "19px",
      lineHeight: "24px",
      color: Colors.black,
    },
    blackDot: {
      width: "4px",
      height: "4px",
      marginLeft: "5px",
      marginRight: "5px",
      position: "relative",
      background: Colors.black,
    },
    partLabel: {
      "&:hover": {
        textDecoration: "underline",
        cursor: "pointer",
      },
    },
  },
  ));
