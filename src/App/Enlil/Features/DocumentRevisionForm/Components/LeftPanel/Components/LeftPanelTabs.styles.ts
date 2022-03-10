import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    outerContainer: {
      width: "270px",
      height: "52px",
      background: "#EBEDF2",
      borderRadius: "100px",
    },
    leftPanelTab: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "18px",
      position: "absolute",
      height: "42px",
      textTransform: "none",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "12px 24px",
    },
    fieldConfig: {
      left: "13px",
      top: "5px",
    },
    setRule: {
      left: "150px",
      top: "5px",
    },
    activeTab: {
      background: "#FFFFFF",
      boxShadow: "0px 2px 5px rgba(204, 212, 217, 0.8)",
      borderRadius: "100px",
      color: "#011FBB",
    },
    inActiveTab: {
      border: 0,
      color: "#767B87",
    },
  })
);
