import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      width: "fit-content",
      marginLeft: 0,
    },
    labelTitle: {
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.almost_black,
    },
    labelSubTitle: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      color: Colors.almost_black,
    },
  }),
);
