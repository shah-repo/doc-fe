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
        marginBottom: theme.spacing(2),
    },
    userName: {
      color: "white",
      fontsize: "1.9rem",
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
  }),
);
