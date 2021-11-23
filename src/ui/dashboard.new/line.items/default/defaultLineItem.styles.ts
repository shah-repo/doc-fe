import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    link: {
      color: Colors.black,
    },
    typography: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
    typographyBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    margin5: {
      marginRight: "5px",
    },
  })
);
