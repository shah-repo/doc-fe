import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    status: {
      marginTop: theme.spacing(3),
    },
    submit: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginLeft: 0,
      width: "inherit",
      borderRadius: "50px",
      height: "50px",
    },
    navigationText: {
      textAlign: "center",
    },
    navigationLink: {
      color: theme.palette.primary.main,
      marginLeft: theme.spacing(1),
      textDecoration: "none",
    },
    paper: {
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2, 3, 3),
      boxShadow: "none",
    },
    logo: {
      margin: "10px 0 100px 0",
    },
    title: {
      marginBottom: "50px",
      display: "flex",
      width: "500px",
    },
    formStyle: {
      width: "500px",
    },
    forgotPasswordLink: {
      position: "absolute",
      top: "10px",
      right: "4px",
      padding: 0,
      margin: 0,
      textTransform: "none",
      lineHeight: 1.33,
      letterSpacing: "0em",
      fontWeight: 500,
      fontSize: "inherit",
      zIndex: 1,
    },
    passwordContainer: {
      position: "relative",
      marginTop: "10px",
    },
    input: {
      marginTop: "5px !important",
    },
  });
