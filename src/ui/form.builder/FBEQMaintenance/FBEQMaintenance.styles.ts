import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme-next/colors";

export default makeStyles(() =>
  createStyles({
    EQButton: {
      margin: 0,
      color: `${Colors.textGray} !important`,
      backgroundColor: "transparent !important",
    },
  })
);
