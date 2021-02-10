import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";
import { WhiteLabelingColors } from "../../../state/ducks/company";
import { FBClasses } from "../../form.builder/defaults/layout";
import Colors from "./utils/colors";

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
    caption: {
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
      fontFamily: "Open Sans, sans-serif;",
    },
    h6: {
      color: Colors.dark_gray,
      fontSize: "1rem",
      fontFamily: "Open Sans, sans-serif;",
      fontWeight: "bold",
    },
  },
  MuiButton: {
    root: {
      fontSize: "0.75rem",
      borderRadius: 3,
      margin: appTheme.spacing(1),
      fontWeight: "bold",
      fontFamily: "Open Sans, sans-serif;",
    },
    contained: {
      boxShadow: "none",
    },
  },
  MuiFab: {
    root: {
      fontSize: "0.75rem",
      fontFamily: "Open Sans, sans-serif;",
    },
    label: {
      lineHeight: "1rem",
    },
  },
  MuiLink: {
    root: {
      fontSize: "0.8rem",
      color: appTheme.palette.primary.main,
      fontFamily: "Open Sans, sans-serif;",
    },
  },
  MuiTableCell: {
    root: {
      fontSize: "0.8rem",
      fontFamily: "Open Sans, sans-serif;",
      padding: 0,
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
      fontFamily: "Open Sans, sans-serif;",
    },
    input: {
      "fontSize": "0.8rem",
      "borderRadius": "4px",
      "&.Mui-disabled": {
        backgroundColor: Colors.white,
      },
    },
  },
  MuiSelect: {
    root: {
      fontSize: "0.8rem",
      lineHeight: "1.2rem",
      fontFamily: "Open Sans, sans-serif;",
    },
    icon: {
      right: "10px",
    },
    select: {
      paddingLeft: appTheme.spacing(0.5),
      borderRadius: "4px",
    },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: "0.8rem",
      maxWidth: "350px",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      hyphens: "auto",
      fontFamily: "Open Sans, sans-serif;",
    },
  },
  MuiMenuItem: {
    root: {
      fontSize: "0.8rem",
      fontFamily: "Open Sans, sans-serif;",
    },
  },
  MuiListItemText: {
    primary: {
      fontSize: "0.9rem",
      color: appTheme.palette.text.primary,
      fontFamily: "Open Sans, sans-serif;",
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
      backgroundColor: Colors.white,
    },
    notchedOutline: {
      borderRadius: 4,
    },
  },
  MuiDialogActions: {
    root: {
      padding: appTheme.spacing(1, 0),
      margin: appTheme.spacing(0, -1),
    },
  },
  MuiFormControl: {
    root: {
      fontFamily: "Open Sans, sans-serif;",
      [`& .${FBClasses.nonOwner}`]: {
        [`& .Mui-disabled`]: {
          backgroundColor: Colors.light_gray,
        },
      },
      [`& .${FBClasses.inputPreview}`]: {
        [`& .Mui-disabled`]: {
          color: `${appTheme.palette.text.primary} !important`,
          backgroundColor: Colors.light_gray,
          paddingLeft: "2px",
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.33,
        },
        "& fieldset": {
          borderWidth: "0px!important",
        },
        "&[data-cy='password'] fieldset": {
          borderWidth: "1px!important",
        },
      },
    },
  },
  MuiChip: {
    root: {
      fontFamily: "Open Sans, sans-serif;",
    },
  },
  MuiGrid: {
    root: {
      fontFamily: "Open Sans, sans-serif;",
    },
  },
  MuiFormHelperText: {
    root: {
      fontFamily: "Open Sans, sans-serif;",
    },
  },
});

export default ThemeOverrides;
