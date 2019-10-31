import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";
import { WhiteLabelingColors } from "../../../state/ducks/company";
import { FBClasses } from "../../form.builder/defaults/layout";

const ThemeOverrides = (appTheme: Theme, customColors: WhiteLabelingColors): Overrides => ({
  MuiAppBar: {
    colorDefault: {
      background: appTheme.palette.common.white,
    },
    colorPrimary: {
      background: "transparent",
      backgroundColor: "transparent",
      color: appTheme.palette.text.primary,
    },
    root: {
      boxShadow: "none",
    },
  },
  MuiTypography: {
    root: {
      fontFamily: "Open Sans, sans-serif;",
    },
    body2: {
      color: "#8A9DAD",
      fontSize: "0.8rem",
      fontFamily: "Open Sans, sans-serif;",
    },
    subtitle1: {
      color: appTheme.palette.text.primary,
      fontSize: "0.885rem",
      fontFamily: "Open Sans, sans-serif;",
    },
    subtitle2: {
      color: appTheme.palette.text.primary,
      fontSize: "0.8rem",
      fontFamily: "Open Sans, sans-serif;",
    },
    h5: {
      color: appTheme.palette.text.primary,
      fontSize: "1rem",
      fontFamily: "Open Sans, sans-serif;",
    },
    h4: {
      color: appTheme.palette.text.primary,
      fontSize: "1.4rem",
    },
    h6: {
      fontSize: "1.1rem",
      fontWeight: "normal",
      fontFamily: "Open Sans, sans-serif;",
    },
  },
  MuiButton: {
    root: {
      fontSize: "0.75rem",
      borderRadius: 3,
      margin: appTheme.spacing(1),
      fontFamily: "Open Sans",
      fontWeight: "bold",
    },
  },
  MuiFab: {
    root: {
      fontSize: "0.75rem",
    },
    label: {
      lineHeight: "1rem",
    },
  },
  MuiLink: {
    root: {
      fontSize: "0.8rem",
      color: appTheme.palette.primary.main,
    },
  },
  MuiTableCell: {
    root: {
      fontSize: "0.8rem",
    },
    head: {
      fontSize: "0.81rem",
      background: appTheme.palette.background.default,
      color: appTheme.palette.common.white,
      fontFamily: "Open Sans",
      fontWeight: "bold",
      lineHeight: "0.9rem",
    },
  },
  MuiInputBase: {
    root: {
      fontSize: "0.8rem",
    },
    input: {
      fontSize: "0.8rem",
    },
  },
  MuiSelect: {
    root: {
      fontSize: "0.8rem",
      lineHeight: "1.2rem",
    },
    icon: {
      right: "10px",
    },
    select: {
      paddingLeft: appTheme.spacing(0.5),
    },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: "0.8rem",
      maxWidth: "350px",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      hyphens: "auto",
    },
  },
  MuiMenuItem: {
    root: {
      fontSize: "0.8rem",
    },
  },
  MuiListItemText: {
    primary: {
      fontSize: "0.9rem",
      color: appTheme.palette.text.primary,
    },
  },
  MuiExpansionPanel: {
    root: {
      boxShadow: "none",
    },
  },
  MuiExpansionPanelSummary: {
    root: {
      padding: appTheme.spacing(0, 1.9),
    },
  },
  MuiExpansionPanelDetails: {
    root: {
      padding: appTheme.spacing(1),
    },
  },
  MuiOutlinedInput: {
    root: {
      [`&.${FBClasses.inputDisabled}`]: {
        "& fieldset": {
          borderWidth: "0px!important",
        },
      },
    },
    notchedOutline: {
      borderRadius: 0,
    },
  },
  MuiDialogActions: {
    root: {
      padding: appTheme.spacing(1, 0),
      margin: appTheme.spacing(0, -1),
    },
  },
});

export default ThemeOverrides;
