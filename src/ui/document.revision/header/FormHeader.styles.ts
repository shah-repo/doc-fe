import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    lastEdited: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 12,
      lineHeight: 1.25,
      color: Colors.white,
    },
    cloudIcon: {
      marginRight: 10,
    },
    linearProgress: {
      position: "absolute",
      left: 10,
      right: 10,
      bottom: 10,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  })
);
