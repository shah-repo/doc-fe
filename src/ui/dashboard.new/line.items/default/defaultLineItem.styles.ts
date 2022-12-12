import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    link: {
      color: Colors.black,
    },
    typography: {
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: 0,
    },
    buttoncursor: {
      cursor: "unset",
    },
    typographyBold: {
      fontSize: "14px",
      fontWeight: 600,
      letterSpacing: 0,
    },
    margin5: {
      marginRight: "5px",
    },
  })
);
