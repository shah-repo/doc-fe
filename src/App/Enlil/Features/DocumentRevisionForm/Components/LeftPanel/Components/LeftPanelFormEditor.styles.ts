import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    leftPanelEditorForm: {
      display: "flex",
      padding: "8px",
      width: "100%",
    },
    rootContainer: { height: "calc(100vh - 86px)", overflow: "auto" },
    grid: {
      height: "calc(100vh - 320px)",
      overflow: "auto",
      marginLeft: "14px",
    },
    gridItem: {
      width: "100%",
    },
  })
);
