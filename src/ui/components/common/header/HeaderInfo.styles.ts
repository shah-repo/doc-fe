import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    statusDefault: {
      color: Colors.white,
      background: Colors.dark_gray,
      padding: "15px 5px",
      borderRadius: "3px",
      fontWeight: "bold",
      marginRight: theme.spacing(2),
    },
    statusIconDefault: {
      background: Colors.gray,
      borderRadius: "50%",
      width: "8px",
      height: "8px",
    },
    statusIconReleased: {
      background: Colors.light_green,
    },
    statusIconCanceled: {
      background: Colors.medium_red,
    },
    id: {
      fontWeight: "bold",
      marginRight: theme.spacing(2),
    },
    itemWrap: {
      alignSelf: "center",
    },
  },
  ));
