import { createStyles, makeStyles } from "@material-ui/core";

export default makeStyles(() =>
  createStyles({
    outerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "15px 15px 15px 20px",
      position: "static",
      left: "0px",
      top: "44px",
      background: "#FFFFFF",
      boxShadow: "0px 1px 0px #ccd4d9",
      flex: "none",
      order: 1,
      alignSelf: "stretch",
      flexGrow: 0,
      margin: "1px 0px",
    },
  })
);
