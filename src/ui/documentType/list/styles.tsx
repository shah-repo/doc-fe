import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const commonButtonStyles = {
  "margin": 0,
  "boxShadow": "none",
  "borderRadius": 100,
  "text-transform": "capitalize",
};
export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      padding: theme.spacing(4, 5),
    },
    item: {
      height: "77vh",
      width: "100%",
    },
    link: {
      textDecoration: "none",
    },
    createButton: {
      ...commonButtonStyles,
      "background": Colors.navy,
      "color": Colors.white,
      "paddingRight": theme.spacing(2.5),
      "paddingLeft": theme.spacing(2.5),
      "&:hover": {
        background: Colors.navy,
      },
    },
    clearButton: {
      margin: "0px 16px 0px 0px",
      backgroundColor: theme.palette.common.white,
    },
    exportListbutton: {
      ...commonButtonStyles,
      marginRight: theme.spacing(1.875),
      paddingRight: theme.spacing(2.5),
      paddingLeft: theme.spacing(2.5),
      border: `1px solid ${Colors.navy}`,
      backgroundColor: Colors.white,
      color: Colors.navy,
    },
  }),
);
