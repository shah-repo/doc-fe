import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    remainderButton: {
      padding: theme.spacing(0, 1.5),
      margin: theme.spacing(0, 1),
      borderRadius: "10px",
      minWidth: "unset",
      fontSize: "0.65rem",
      color: Colors.white,
    },
    triangleDown: {
      "width": "0.65rem",
      "marginLeft": "2px",
      "&.expanded": {
        transform: "rotate(180deg)",
      },
    },
  }),
);
