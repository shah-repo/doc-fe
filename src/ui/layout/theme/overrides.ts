import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";
import { WhiteLabelingColors } from "../../../state/ducks/company/types";
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
      fontFamily: "Sora, sans-serif;",
    },
    body1: {
      fontFamily: "Sora, sans-serif;",
    },
    body2: {
      color: "#8A9DAD",
      fontSize: "0.8rem",
      fontFamily: "Sora, sans-serif;",
    },
    subtitle1: {
      color: appTheme.palette.text.primary,
      fontSize: "0.885rem",
      fontFamily: "Sora, sans-serif;",
    },
    subtitle2: {
      color: appTheme.palette.text.primary,
      fontSize: "0.8rem",
    },
    h5: {
      color: appTheme.palette.text.primary,
      fontSize: "1rem",
      fontFamily: "Sora, sans-serif;",
    },
    h4: {
      color: appTheme.palette.text.primary,
      fontSize: "1.4rem",
    },
    h6: {
      color: Colors.dark_gray,
      fontSize: "1rem",
      fontFamily: "Sora, sans-serif;",
      fontWeight: 600,
    },
  },
  MuiButton: {
    root: {
      fontSize: "0.75rem",
      borderRadius: 3,
      margin: appTheme.spacing(1),
      fontFamily: "Sora, sans-serif;",
      textTransform: "capitalize",
      fontWeight: 600,
    },
    contained: {
      boxShadow: "none",
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
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiTableCell: {
    root: {
      fontSize: "0.8rem",
      fontFamily: "Sora, sans-serif;",
      padding: 0,
    },
    head: {
      fontSize: "0.81rem",
      background: appTheme.palette.background.default,
      color: appTheme.palette.common.white,
      fontFamily: "Sora",
      fontWeight: "bold",
      lineHeight: "0.9rem",
    },
  },
  MuiInputBase: {
    root: {
      fontSize: "0.8rem",
      fontFamily: "Sora, sans-serif",
      borderRadius: "4px",
      transition: appTheme.transitions.create("all"),
    },
  },
  MuiOutlinedInput: {
    root: {
      "backgroundColor": Colors.white,
      "border": `1px solid ${Colors.mild_wind_blue}`,
      "&:not($focused):not($disabled):hover": {
        backgroundColor: Colors.background_white,
      },
      "&$focused": {
        borderColor: Colors.dodger_blue,
      },
      "&$disabled": {
        backgroundColor: Colors.whitest_grey,
      },
      "& fieldset": {
        border: "none",
      },
    },
    notchedOutline: {
      borderRadius: 4,
    },
  },
  MuiSelect: {
    icon: {
      right: "10px",
    },
    select: {
      paddingLeft: appTheme.spacing(0.5),
      borderRadius: "4px",
    },
  },
  MuiRadio: {
    root: {
      "&:hover": {
        background: "none !important",
      },
      "&:not($checked):not($disabled):hover circle": {
        fill: Colors.background_white,
      },
    },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: "0.8rem",
      maxWidth: "350px",
      overflowWrap: "break-word",
      wordWrap: "break-word",
      hyphens: "auto",
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiMenuItem: {
    root: {
      fontSize: "0.8rem",
      fontFamily: "Sora, sans-serif;",
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
  MuiDialogActions: {
    root: {
      padding: appTheme.spacing(1, 0),
      // margin: appTheme.spacing(0, -1),
    },
  },
  MuiFormControl: {
    root: {
      fontFamily: "Sora, sans-serif;",
      [`& .${FBClasses.hoverVisibility}`]: {
        "&:hover": {
          "& .MuiButton-root": {
            visibility: "visible",
          },
        },
        "& .MuiButton-root": {
          visibility: "hidden",
        },
      },
      [`& .${FBClasses.nonOwner}`]: {
        [`& .Mui-disabled`]: {
          backgroundColor: Colors.light_gray,
        },
      },
      [`& .${FBClasses.inputPreview}`]: {
        [`& .Mui-disabled`]: {
          color: `${appTheme.palette.text.primary} !important`,
          backgroundColor: "unset",
          paddingLeft: "2px",
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.33,
        },
        "& fieldset": {
          borderWidth: "0px!important",
        },
        "& input": {
          padding: "0px!important",
        },
        "&[data-cy='password'] fieldset": {
          borderWidth: "1px!important",
        },
      },
    },
  },
  MuiChip: {
    root: {
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiGrid: {
    root: {
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiTab: {
    root: {
      "fontFamily": "Sora, sans-serif;",
      "lineHeight": "15px",
      "paddingLeft": "0px",
      "paddingTop": "5px",
      "fontStyle": "normal",
      "fontWeight": 600,
      "&.Mui-selected": {
        color: Colors.navy,
      },
    },
  },
  MuiFormHelperText: {
    root: {
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiFormLabel: {
    root: {
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiAvatar: {
    root: {
      fontFamily: "Sora, sans-serif;",
    },
  },
  MuiButtonBase: {
    root: {
      fontFamily: "Sora, sans-serif;",
    },
  },
});

export default ThemeOverrides;
