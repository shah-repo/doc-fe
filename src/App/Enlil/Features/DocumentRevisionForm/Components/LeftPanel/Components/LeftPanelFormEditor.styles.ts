import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    leftPanelEditorForm: {
      width: "100%",
    },
    headerItem: {
      width: "300px",
    },
    rootContainer: {
      height: "calc(100vh - 86px)",
      overflow: "auto",
      padding: "15px 0px",
    },
    grid: {
      "height": "calc(100vh - 320px)",
      "overflow": "auto",
      "padding": "15px",
      "& .MuiFormHelperText-root": {
        lineHeight: "20px",
        paddingLeft: "30px",
      },
    },
    gridItem: {
      width: "100%",
    },
  })
);
