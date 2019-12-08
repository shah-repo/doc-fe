import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: theme.palette.common.white,
    },
    paper: {
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2, 3, 3),
      boxShadow: "none",
      width: "500px",
    },
    logo: {
      margin: "10px 0 100px 0",
    },
    title: {
      width: "500px",
      lineHeight: 1.5,
    },
    boldTitle: {
      width: "500px",
      lineHeight: 1.5,
      fontWeight: "bolder",
      marginBottom: "30px",
    },
    navigationLink: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      marginTop: "80px",
      fontWeight: "bold",
    },
  }),
  );
