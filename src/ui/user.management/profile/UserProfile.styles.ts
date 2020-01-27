import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#29064C",
      height: "330px",
    },
    iconButton: {
      color: "white",

    },
    userProfile: {
        color: "white",
        fontsize: "1.3rem",
    },
    userName: {
      color: "white",
      fontsize: "1.9rem",
      marginTop: theme.spacing(1),
      fontFamily: "Open Sans, sans-serif",
    },
    userNameEdit: {
      "& .MuiInputBase-input": {
        color: theme.palette.common.white,
        fontSize: "3rem",
        textAlign: "center",
        fontFamily: "Open Sans, sans-serif",
        padding: theme.spacing(0.5, 0, 0.5, 0),
      },
      "& .MuiInput-underline": {
        "&:before": {
          borderBottom: `1px solid ${theme.palette.common.white}`,
          transition: "none",
        },
        "&:after": {
          borderBottom: `1px solid ${theme.palette.common.white}`,
          transition: "none",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: `1px solid ${theme.palette.common.white}`,
        },
        "&.Mui-error:after": {
          borderBottom: `1px solid ${"#c40000"}`,
        },
      },
    },
    activeStatusButton: {
      width: "auto",
      color: "#6E09EA",
      borderColor: "#6E09EA",
    },
    integrations: {
      marginTop: "50px",
      fontSize: "1.1rem",
      fontWeight: "normal",
      lineHeight: "1.6",
      letterSpacing: "0.0075em",
    },
    slack: {
      height: "40px",
      width: "139px",
      marginTop: "15px",
      marginBottom: "15px",
    },
    addButton: {
      display: "flex",
      margin: 0,
    },
  }),
);
