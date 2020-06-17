import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    box: {
      "&.MuiGrid-item.MuiGrid-grid-xs-12": {
        padding: theme.spacing(0, 2, 4),
      },
    },
    previewBox: {
      margin: 0,
      width: "100%",
      paddingLeft: theme.spacing(3),
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
    whiteContainer: {
      marginTop: theme.spacing(5),
      margin: 0,
      height: "100%",
      transition: theme.transitions.create("all", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    backColor: {
      background: Colors.light_gray,
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
  }));
