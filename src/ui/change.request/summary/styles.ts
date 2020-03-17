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
      padding: theme.spacing(0, 3),
      margin: 0,
      width: "100%",
    },
    assessments: {
      padding: theme.spacing(4, 3),
      width: "100%",
    },
    assessmentItem: {
      marginBottom: theme.spacing(4),
      borderBottom: "1px solid " + theme.palette.text.hint,
      paddingBottom: theme.spacing(2),
    },
    submitBox: {
      textAlign: "right",
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
      padding: theme.spacing(2.2, 0.2),
      minWidth: "110px",
      borderRadius: "60px",
      textAlign: "center",
      fontSize: "0.7rem",
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
      "margin": theme.spacing(1, 0, 3),
      "&.ql-container.ql-snow": {
        "border": 0,
        "& .ql-editor": {
          padding: 0,
          fontFamily: "Open Sans, sans-serif",
          color: "#474747 !important",
        },
      },
    },
    sidebar: {
      "&.MuiGrid-item.MuiGrid-grid-xs-2": {
        paddingTop: theme.spacing(12),
      },
      "&.MuiGrid-item.MuiGrid-grid-xs-3": {
        paddingTop: theme.spacing(14),
      },
    },
  });
