import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    remainderButton: {
      padding: theme.spacing(0, 1.5),
      margin: theme.spacing(0, 1),
      borderRadius: 24,
      minWidth: "unset",
      fontSize: ".65rem",
      color: Colors.white,
      minHeight: 24,
    },
    triangleDown: {
      "width": ".65rem",
      "marginLeft": theme.spacing(.25),
      "&.expanded": {
        transform: "rotate(180deg)",
      },
    },
  }),
);
