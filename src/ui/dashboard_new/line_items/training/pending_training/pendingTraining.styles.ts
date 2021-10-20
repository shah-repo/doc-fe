
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    typographyDueInfewDays: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
      color: Colors.latest_yellow_varient,
    },
    typography: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    typographyOverdue: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
      color: Colors.red,
    },
    timestampContainer: {
      fontSize: "12px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
  }
  ));
