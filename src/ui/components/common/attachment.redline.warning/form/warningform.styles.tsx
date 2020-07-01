import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    form: {
      minWidth: 400,
    },
    submitButton: {
      float: "right",
      clear: "right",
    },
    cancelButton: {
      float: "left",
      marginRight: theme.spacing(1),
    },
    Box: {
      minWidth: 150,
      paddingBottom: 25,
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    Box2: {
      display: "flex",
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    h4: {
      margin: 5,
    },
    icon: {

    },
  });
