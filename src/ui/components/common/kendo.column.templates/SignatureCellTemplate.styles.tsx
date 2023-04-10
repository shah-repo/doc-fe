import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: "16px 0",
    },
    chip: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      borderRadius: 2,
      background: Colors.light_blue2,
      alignItems: "center",
      justifyContent: "center",
      color: Colors.almost_black,
      cursor: "pointer",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      margin: "4px",
    },
    chipContainer: {
      maxWidth: "-webkit-fill-available",
    },
  }),
);
