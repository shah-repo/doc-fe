
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    nested: {
      marginLeft: "40px",
      borderLeft: "1px solid #CBD5E0",
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
    },
    icon: {
      width: "7px",
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
    typographyChildrenBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 700,
    },
    timestampContainer: {
      fontSize: "12px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
    gridContainer: {
      paddingLeft: "14px",
      maxWidth: "calc(100% - 14px)",
    },
  }
  ));
