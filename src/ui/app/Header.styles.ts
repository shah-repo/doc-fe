import { createStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: Colors.white,
      marginLeft: DRAWER_WIDTH,
      fontSize: "1rem",
    },
    welcomeText: {
      color: Colors.dark_gray,
    },
    name: {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
    toolbar: {
      marginLeft: DRAWER_WIDTH,
      borderBottom: `1px solid ${Colors.medium_gray}`,
      minHeight: "40px",
    },
    headerButton: {
      "boxShadow": "none",
      "textTransform": "none",
      "padding": 0,
      "margin": 0,
      "&:hover": {
        background: "none",
        boxShadow: "none",
      },
    },
    wrapContainer: {
      marginLeft: theme.spacing(2),
    },
  });
