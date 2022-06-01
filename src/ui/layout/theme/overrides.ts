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
    body2: {
      color: "#8A9DAD",
      fontSize: "0.8rem",
    },
    subtitle1: {
      color: appTheme.palette.text.primary,
      fontSize: "0.885rem",
    },
    subtitle2: {
      color: appTheme.palette.text.primary,
      fontSize: "0.8rem",
    },
    h5: {
      color: appTheme.palette.text.primary,
      fontSize: "1rem",
    },
    h4: {
      color: appTheme.palette.text.primary,
      fontSize: "1.4rem",
    },
    h6: {
      color: Colors.dark_gray,
      fontSize: "1rem",
      fontWeight: "bold",
    },
  },
  MuiButton: {
    root: {
      fontSize: "0.75rem",
      borderRadius: 3,
      margin: appTheme.spacing(1),
      fontWeight: "bold",
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
    },
  },
  MuiTableCell: {
    root: {
      fontSize: "0.8rem",
      padding: 0,
    },
    head: {
      fontSize: "0.81rem",
      background: appTheme.palette.background.default,
      color: appTheme.palette.common.white,
      fontWeight: "bold",
      lineHeight: "0.9rem",
    },
  },
  MuiInputBase: {
    root: {
      fontSize: "0.8rem",
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
      backgroundColor: Colors.white,
    },
    notchedOutline: {
      borderRadius: 4,
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
          backgroundColor: Colors.light_gray,
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
});

export default ThemeOverrides;
