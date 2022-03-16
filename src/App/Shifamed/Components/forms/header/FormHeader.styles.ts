import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../ui/layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    lastEdited: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.white,
    },
  },
  ));
