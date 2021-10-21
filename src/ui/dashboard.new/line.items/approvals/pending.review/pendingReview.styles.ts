
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    nested: {
      // paddingLeft: theme.spacing(4),
      marginLeft: "40px",
      borderLeft: "1px solid #7C4EFF",
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
    },
    icon: {
      width: "7px",
    },
    typography: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    timestampContainer: {
      fontSize: "12px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
  }
  ));
