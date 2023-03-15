import { Theme } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import { Overrides } from "@material-ui/core/styles/overrides";
import { MuiPickersOverrides } from "@material-ui/pickers/typings/overrides";
import Colors from "./colors";
import { GRADIENT, TRANSITON_BOUNCE } from "./consts";

const overrides = (theme: Theme): Overrides & MuiPickersOverrides => ({
  MuiIconButton: {
    root: {
      "padding": theme.spacing(.5),
      "fontSize": "1rem",
      "&:hover": {
        backgroundColor: "none",
      },
    },
  },
  MuiButton: {
    root: {
      "minHeight": 36,
      "borderRadius": 72,
      "padding": theme.spacing(1.25, 2.5),
      "&:hover": {
        backgroundColor: "none",
      },
    },
    startIcon: {
      marginLeft: 0,
      marginRight: theme.spacing(1),
    },
    endIcon: {
      marginLeft: theme.spacing(1),
      marginRight: 0,
    },
    iconSizeMedium: {
      "& *:first-child": {
        fontSize: 16,
      },
    },
    contained: {
      boxShadow: "none",
    },
    containedPrimary: {
      "backgroundColor": Colors.primary,
      "color": Colors.white,
      "&:hover": {
        backgroundColor: Colors.primaryDark,
      },
      "&$disabled": {
        backgroundColor: Colors.buttonDisabled,
        color: Colors.white,
      },
    },
    containedSecondary: {
      "backgroundColor": Colors.primaryBg,
      "color": Colors.primary,
      "&:hover": {
        backgroundColor: Colors.secondaryLight,
      },
      "&$disabled": {
        backgroundColor: Colors.buttonDisabled,
        color: Colors.white,
      },
    },
    outlined: {
      "backgroundColor": Colors.white,
      "padding": theme.spacing(1.25, 2.5),
      "&$disabled": {
        border: "none",
      },
    },
    outlinedPrimary: {
      "color": Colors.primary,
      "borderColor": Colors.primary,
      "&:hover": {
        backgroundColor: Colors.primaryHighlight,
      },
      "&$disabled": {
        backgroundColor: Colors.buttonDisabled,
        color: Colors.white,
      },
    },
    outlinedSecondary: {
      "color": Colors.primaryLight,
      "backgroundColor": Colors.white,
      "borderColor": Colors.primaryLight,
      "borderStyle": "dashed",
      "borderRadius": theme.shape.borderRadius / 2,
      "textTransform": "uppercase",
      "&:hover": {
        backgroundColor: Colors.primaryHighlight,
        borderColor: Colors.primaryLight,
        borderStyle: "dashed",
      },
      "&$disabled": {
        color: Colors.textDisabled,
        borderColor: Colors.buttonDisabled,
        borderStyle: "dashed",
      },
    },
    text: {
      "backgroundColor": "transparent",
      "padding": theme.spacing(1.25, 2.5),
      "&:hover": {
        backgroundColor: "none",
      },
    },
    textPrimary: {
      "color": Colors.primary,
      "&:hover": {
        color: Colors.primaryDark,
        backgroundColor: "transparent",
      },
      "&$disabled": {
        color: Colors.textDisabled,
      },
    },
    textSecondary: {
      "backgroundColor": Colors.white,
      "color": Colors.primary,
      "&:hover": {
        backgroundColor: Colors.primaryHighlight,
      },
      "&$disabled": {
        color: Colors.textDisabled,
      },
    },
  },
  MuiButtonGroup: {
    root: {
      boxShadow: "none",
    },
    contained: {
      boxShadow: "none",
    },
    grouped: {
      "minWidth": 36,
      "&:not(:first-child)": {
        borderLeft: "none",
        marginLeft: 0,
      },
    },
    groupedContainedPrimary: {
      "&:not(:last-child)": {
        borderRightColor: Colors.whiteDimmed,
      },
    },
    groupedContainedSecondary: {
      "&:not(:last-child)": {
        borderRightColor: Colors.stroke,
      },
    },
    groupedTextPrimary: {
      "&:not(:last-child)": {
        borderRightColor: "transparent",
      },
    },
    groupedTextSecondary: {
      "&:not(:last-child)": {
        borderRightColor: Colors.stroke,
      },
    },
    groupedOutlined: {
      "&:not(:first-child)": {
        marginLeft: 0,
      },
    },
    groupedOutlinedPrimary: {
      "&:not(:last-child)": {
        borderRightColor: Colors.primary,
      },
    },
  },
  MuiMenu: {
    paper: {
      outlineWidth: 1,
      outlineStyle: "solid",
      outlineColor: Colors.stroke,
      borderRadius: theme.shape.borderRadius / 2,
      margin: theme.spacing(.5, 0),
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
      "paddingTop": theme.spacing(1),
      "paddingBottom": theme.spacing(1),
      "minHeight": 48,
      "&:last-child": {
        borderBottom: "none",
      },
      [theme.breakpoints.up("sm")]: {
        minHeight: 48,
      },
    },
    gutters: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(3),
    },
    dense: {
      paddingTop: theme.spacing(.25),
      paddingBottom: theme.spacing(.25),
      minHeight: 0,
    },
  },
  MuiListItemIcon: {
    root: {
      minWidth: 20,
      fontSize: 16,
      marginRight: theme.spacing(1.75),
      justifyContent: "center",
    },
  },
  MuiDialogTitle: {
    root: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(1.75, 2.5),
      minHeight: 58,
    },
  },
  MuiDialogContent: {
    root: {
      padding: theme.spacing(3.25, 2.5),
    },
  },
  MuiDialogActions: {
    root: {
      padding: theme.spacing(2.5),
      backgroundColor: Colors.gray,
    },
  },
  MuiFormControl: {
    marginNormal: {
      marginTop: 0,
      marginBottom: theme.spacing(3),
    },
    marginDense: {
      marginTop: 0,
      marginBottom: theme.spacing(1.5),
    },
  },
  MuiInputLabel: {
    root: {
      ...theme.typography.button,
      "color": Colors.textBlack,
      "&$disabled": {
        color: Colors.textBlack,
      },
      "&$error": {
        color: Colors.textBlack,
      },
      "&$focused": {
        color: Colors.textBlack,
      },
    },
    formControl: {
      transform: "none",
      position: "relative",
    },
    asterisk: {
      color: Colors.error,
    },
    shrink: {
      transform: "none",
    },
  },
  MuiFormHelperText: {
    root: {
      ...theme.typography.subtitle2,
    },
  },
  MuiInputBase: {
    root: {
      "position": "relative",
      "borderWidth": 1,
      "borderStyle": "solid",
      "borderColor": Colors.stroke,
      "borderRadius": theme.shape.borderRadius / 2,
      "backgroundColor": "white",
      "&:hover": {
        backgroundColor: Colors.gray,
      },
      "&:has(input:-webkit-autofill)": {
        "backgroundColor": Colors.primaryHighlight,
        "&:hover": {
          backgroundColor: Colors.hover,
        },
      },
      "&$focused": {
        "borderColor": Colors.primaryLight,
        "backgroundColor": Colors.white,
        "&:hover": {
          backgroundColor: Colors.white,
        },
      },
      "&$disabled": {
        "backgroundColor": Colors.fieldDisabled,
        "&:hover": {
          backgroundColor: Colors.fieldDisabled,
        },
      },
      "&$error": {
        borderColor: Colors.error,
      },
    },
    input: {
      "borderRadius": theme.shape.borderRadius / 2,
      "backgroundColor": "transparent",
      "height": 20,
      "padding": theme.spacing(1.25, 2),
      "fontSize": ".875rem",
      "lineHeight": 1.5,
      "color": Colors.textBlack,
      "&::placeholder": {
        color: Colors.textDisabled,
        opacity: 1,
      },
      "&:focus::placeholder": {
        color: Colors.textDisabled,
      },
      // Hack to disable higlighting of autofilled inputs
      "&:-webkit-autofill": {
        transition: theme.transitions.create("background-color", { duration: "3600s", delay: "3600s" }),
      },
      "&:-webkit-autofill:hover": {
        transition: theme.transitions.create("background-color", { duration: "3600s", delay: "3600s" }),
      },
      "&:-webkit-autofill:focus": {
        transition: theme.transitions.create("background-color", { duration: "3600s", delay: "3600s" }),
      },
      "&:-webkit-autofill:active": {
        transition: theme.transitions.create("background-color", { duration: "3600s", delay: "3600s" }),
      },
      "&$disabled": {
        color: Colors.textGray,
      },
    },
    multiline: {
      height: "auto",
      minHeight: 20,
      padding: theme.spacing(1.25, 2),
    },
    inputAdornedEnd: {
      paddingRight: 0,
    },
    inputAdornedStart: {
      paddingLeft: 0,
    },
    formControl: {
      "&::placeholder": {
        color: Colors.textDisabled,
        opacity: 1,
      },
      "&:focus::placeholder": {
        color: Colors.textDisabled,
      },
    },
  },
  MuiInputAdornment: {
    root: {
      "color": Colors.textGray,
      "fontSize": 14,
      "gap": theme.spacing(1),
      "padding": theme.spacing(0, 1.5),
      "& > svg": {
        fontSize: 16,
      },
    },
    positionStart: {
      marginRight: 0,
      marginLeft: 0,
    },
    positionEnd: {
      marginRight: 0,
      marginLeft: 0,
    },
  },
  MuiLinearProgress: {
    barColorPrimary: {
      backgroundColor: "transparent",
      background: GRADIENT,
    },
  },
  MuiChip: {
    root: {
      ...theme.typography.subtitle1,
      "backgroundColor": Colors.primaryBg,
      "padding": theme.spacing(.75),
      "height": 30,
      "color": Colors.textBlack,
      "position": "relative",
      "overflow": "hidden",
      "borderRadius": theme.shape.borderRadius / 2,

      "&:focus": {
        backgroundColor: Colors.primaryBg,
      },

      "& .chip-delete": {
        position: "absolute",
        padding: theme.spacing(0, .75, 0, 2),
        top: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        cursor: "pointer",
        transition: theme.transitions.create("opacity"),
        background: `linear-gradient(to right, ${fade(Colors.primaryBg, 0)}, ${Colors.primaryBg} 30%)`,
      },
      "& .chip-delete-icon": {
        transform: "translate(150%, 0)",
        transition: theme.transitions.create("transform", { easing: TRANSITON_BOUNCE }),
      },
      "&:hover .chip-delete": {
        opacity: 1,
      },
      "&:hover .chip-delete-icon": {
        transform: "translate(0, 0)",
      },
      "&$disabled": {
        opacity: 1,
        color: Colors.textDisabled,
      },
    },
    sizeSmall: {
      ...theme.typography.subtitle2,
      "height": 28,

      "&:hover": {
        paddingRight: theme.spacing(.75),
      },

      "& .chip-delete": {
        left: 0,
        padding: 0,
        background: Colors.errorHighlight,
      },
      "& .chip-delete-icon": {
        transform: "translate(0, 150%)",
      },
    },
    deletable: {
      "&:focus": {
        backgroundColor: Colors.primaryBg,
      },
    },
    label: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    labelSmall: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    deleteIcon: {
      "margin": 0,
      "width": "auto",
      "height": "1em",
      "fontSize": 14,
      "color": Colors.error,

      "&:hover": {
        color: Colors.error,
      },
    },
    deleteIconSmall: {
      width: "auto",
      height: "1em",
      marginLeft: 0,
      marginRight: 0,
    },
  },
  MuiPickersDay: {
    day: {
      "borderRadius": theme.shape.borderRadius,
      "color": Colors.textBlack,
      "fontSize": ".875rem",

      "&:hover": {
        backgroundColor: Colors.hover,
      },
    },
    dayDisabled: {
      color: Colors.textDisabled,
    },
    daySelected: {
      "backgroundColor": Colors.primaryLight,
      "color": Colors.white,

      "&:hover": {
        backgroundColor: Colors.primaryLight,
      },
    },
    current: {
      backgroundColor: Colors.primaryHighlight,
      color: Colors.textBlack,
    },
  },
  MuiPickersCalendarHeader: {
    switchHeader: {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(0, 1, 1),
    },
    dayLabel: {
      fontWeight: 400,
      fontSize: ".75rem",
      color: Colors.textGray,
    },
    iconButton: {
      "color": Colors.textGray,
      "padding": theme.spacing(1),
      "&$disabled": {
        color: Colors.textDisabled,
      },
      "&:hover": {
        color: Colors.textBlack,
      },
    },
  },
});

export default overrides;
