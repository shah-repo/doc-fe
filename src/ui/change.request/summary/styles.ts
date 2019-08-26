import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    box: {
      "&.MuiGrid-item.MuiGrid-grid-xs-12": {
        padding: theme.spacing(0, 2, 4),
      },
    },
    previewBox: {
      borderLeft: "1px solid #ccc",
      borderRight: "1px solid #ccc",
      padding: theme.spacing(0, 5),
    },
    assessments: {
      padding: theme.spacing(4, 3),
    },
    submitBox: {
      textAlign: "center",
    },
    whiteContainer: {
      background: "#fff",
      padding: theme.spacing(3, 0),
    },
    headerContainer: {
      padding: "10px 0 60px",
    },
    status: {
      color: "#fff",
      background: theme.palette.text.hint,
      padding: "20px 25px",
      borderRadius: "60px",
    },
    crId: {
      color: theme.palette.text.hint,
    },
    summaryContainer: {
      padding: theme.spacing(0, 4),
    },
    taskContainer: {
      padding: theme.spacing(2),
      borderBottom: "1px solid" + theme.palette.text.hint,
    },
    taskBasicInformation: {},
    taskDescription: {
      margin: theme.spacing(1, 0, 3),
      "&.ql-container.ql-snow": {
        border: 0,
        "& .ql-editor": {
          padding: 0,
          fontFamily: "Open Sans, sans-serif",
          color: "#474747 !important",
        },
      },
    },
  });
