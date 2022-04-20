import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    title: {
      color: Colors.almost_black,
      fontSize: "12px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    radioButton: {
      "& .MuiTypography-root": {
        fontSize: "14px",
        fontFamily: "Sora",
        fontWeight: 400,
      },
    },
  }),
);
