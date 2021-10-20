
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
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
