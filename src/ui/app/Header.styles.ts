import { createStyles, Theme } from "@material-ui/core";

import { DRAWER_WIDTH } from "./Navigation.styles";
export default (theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "white",
      boxShadow: "none",
      paddingLeft: DRAWER_WIDTH,
      color: "rgba(0, 0, 0, 0.87)",
    },
    welcomeText: {
      color: "#29064C",
      fontSize: "0.8rem",
    },
    name: {
      margin: theme.spacing(0),
      padding: theme.spacing(0),
      textTransform: "none",
    },
  });
