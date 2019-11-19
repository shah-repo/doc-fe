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
      width: "auto",
      backgroundColor: theme.palette.common.white,
    },
    container: {
      width: "400px",
    },
    title: {
      fontSize: "26px",
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: 300,
    },
    companyRows: {
      marginTop: "40px",
    },
    avatar: {
      width: "60px",
      height: "60px",
      marginRight: "16px",
      borderRadius: "50%",
    },
    companyButton: {
      background: "none",
      color: "inherit",
      border: "none",
      padding: 0,
      font: "inherit",
      cursor: "pointer",
      outline: "inherit",
      fontSize: "18px",
      width: "400px",
      height: "100px",
      textAlign: "justify",
      borderBottom: "1px solid lightgrey",
    },
    company:  {
      display: "flex",
    },
    companyName: {
      margin: "18px 0",
    },
  }),
  );
