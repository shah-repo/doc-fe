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
      "color": "white",
      "& .MuiInputBase-input": {
        fontSize: "3rem",
        textAlign: "center",
        fontFamily: "Open Sans, sans-serif",
        padding: "0",
        fontWeight: "400",
        paddingTop: theme.spacing(0.5),
      },
    },
    profilePhoto: {
        border: `8px solid ${"#76608D"}`,
        width: "213px",
        height: "213px",
        borderRadius: "50%",
        zIndex: 9999,
        backgroundColor: "white",
        marginTop: theme.spacing(3.5),
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
