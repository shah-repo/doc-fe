import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";

const overrides = (theme: Theme): Overrides => ({
  MuiMenu: {
    paper: {
      outlineWidth: 1,
      outlineStyle: "solid",
      outlineColor: theme.palette.divider,
    },
  },
  MuiDivider: {
    middle: {
      marginTop: theme.spacing(.75),
      marginBottom: theme.spacing(.75),
      marginLeft: theme.spacing(1.25),
      marginRight: theme.spacing(1.25),
    },
  },
  MuiMenuItem: {
    root: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    gutters: {
      paddingLeft: theme.spacing(1.25),
      paddingRight: theme.spacing(1.25),
    },
    dense: {
      paddingTop: theme.spacing(.25),
      paddingBottom: theme.spacing(.25),
    },
  },
  MuiListItemIcon: {
    root: {
      minWidth: 0,
      marginRight: theme.spacing(.75),
    },
  },
  MuiDialog: {
    paper: {
      borderRadius: theme.spacing(.75),
    },
  },
  MuiDialogTitle: {
    root: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(1.75, 2.5),
    },
  },
  MuiDialogContent: {
    root: {
      padding: theme.spacing(2.5),
    },
  },
  MuiDialogActions: {
    root: {
      padding: theme.spacing(2.5),
      backgroundColor: theme.palette.grey[50],
    },
  },
});

export default overrides;
