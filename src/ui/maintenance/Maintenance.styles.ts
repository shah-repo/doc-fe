import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    base: {
      width: "fit-content",
      margin: "50px auto 0",
    },
    title: {
      marginBottom: 8,
      fontSize: 27,
      fontWeight: "bold",
      textAlign: "center",
      letterSpacing: "-0.41px",
      color: "#1d1d1d",
    },
    body: {
      fontSize: "18px",
      fontWeight: 400,
      marginBottom: "30.69px",
      textAlign: "center",
      letterSpacing: "-0.18px",
      color: "#474747",
    },
    linkContainer: {
      width: "fit-content",
      margin: "0 auto",
    },
    link: {
      color: "#0066ff",
      fontSize: 14,
      fontWeight: 400,
      cursor: "pointer",
      textDecoration: "none",
    },
    image: {
      maxWidth: "100vw",
    },
  },
  ));
