import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export default makeStyles((theme) =>
  createStyles({
    mainDiv: {
      marginBottom: theme.spacing(2),
    },
    title: {
      display: "flex",
      padding: theme.spacing(.5),
      alignItems: "center",
    },
    fullWidth: {
      width: "100%",
    },
    btn: {
      "&:hover": {
        background: `linear-gradient(262.45deg, ${Colors.cerulean} 0.28%, ${Colors.ultramarine_blue} 16.91%, ${Colors.navy} 85.48%)`,
      },
    },
    disableRipple: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    fullLengthButton: {
      "borderStyle": "dashed",
      "borderColor": Colors.blue,
      "width": "100%",
      "margin": 0,
      "borderRadius": theme.spacing(0, 0, .5, .5),
      "color": Colors.navy,
      "&:hover": {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderColor: Colors.blue,
        color: Colors.navy,
      },
    },
    customTooltip: {
      backgroundColor: Colors.black,
    },
    customArrow: {
      color: Colors.black,
    },
    titleHeading: {
      marginRight: theme.spacing(1.25),
      display: "inline-block",
      fontWeight: 600,
      color: Colors.almost_black,
    },
    partsGrid: {
      marginBottom: theme.spacing(1.5),
      marginTop: theme.spacing(1),
    },
    btnMargin: {
      marginRight: 0,
    },
    OBS: {
      fontWeight: 600,
      fontSize: "14px",
      textTransform: "capitalize",
      color: Colors.latest_red_varient,
    },
    buttonGroup: {
      display: "flex",
      alignItems: "center",
      textAlign: "right",
      fontSize: "12px",
      cursor: "pointer",
    },
    filterOptions: {
      fontSize: "14px",
      marginLeft: theme.spacing(1.5),
    },
    dividerStyle: {
      margin: theme.spacing(0, 0, 1.5, 0),
    },
    editRowParentDiv: {
      display: "flex",
      width: "100%",
      alignItems: "flex-start",
    },
    editRowParentNormal: {
      border: "1px solid",
      borderColor: Colors.cerulean,
    },
    editRowParentError: {
      border: "1px solid",
      borderColor: Colors.red,
    },
    labelError: {
      color: Colors.red,
    },
    editRowChildDivOne: {
      width: "30%",
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      justifyContent: "space-evenly",
      padding: theme.spacing(0, 1.5),
      alignItems: "center",
      columnGap: theme.spacing(.5),
    },
    editRowChildDivTwo: {
      width: "50%",
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      justifyContent: "space-evenly",
      padding: theme.spacing(0, 1.5),
      alignItems: "center",
    },
    gridCenterAlign: {
      justifyContent: "space-between",
      alignItems: "center",
    },
    normalFontWeight: {
      fontWeight: "normal",
    },
    boldFontWeight: {
      fontWeight: 600,
    },
    actionButtonParentDiv: {
      width: "100%",
      position: "relative",
      marginBottom: theme.spacing(.25),
    },
    actionButtonChildDiv: {
      backgroundColor: Colors.dodger_blue,
      position: "absolute",
      right: 0,
      borderRadius: theme.spacing(0, 0, .5, .5),
      display: "flex",
      justifyContent: "center",
      zIndex: 21,
    },
    actionButton: {
      backgroundColor: Colors.white,
      padding: theme.spacing(.5),
      minWidth: "auto",
      border: theme.spacing(1),
    },
    iconButton: {
      "fontSize": "16px",
      "fill": "#000",
      "&:hover": {
        fill: Colors.white,
      },
    },
    deleteIconButton: {
      "fontSize": "16px",
      "&:hover": {
        fill: Colors.white,
      },
    },
    viewIcon: {
      fill: Colors.cerulean,
      marginTop: theme.spacing(.5),
      fontSize: "1.2rem",
      cursor: "pointer",
    },
    tableHead: {
      height: "40px",

      display: "flex",
      alignItems: "center",

      backgroundColor: Colors.alice_blue,
      color: Colors.almost_black,

      fontSize: "12px",
      fontWeight: "bold",
    },
    tableCellOne: {
      width: "30%",
      borderRadius: theme.spacing(.5, 0, 0, 0),
      paddingLeft: theme.spacing(2),
    },
    tableCellTwo: {
      width: "45%",
    },
    tableCellThree: {
      width: "15%",
      position: "relative",
      textAlign: "center",
    },
    tableCellFour: {
      width: "10%",
      borderRadius: theme.spacing(0, .5, 0, 0),
    },
    verticalDivider: {
      borderLeft: "2px solid white",
      paddingLeft: theme.spacing(1.25),
    },
    successMessage: {
      width: "380px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textField: {
      "padding": theme.spacing(1, .75),
      "& .MuiInputBase-root": {
        marginTop: 0,
        padding: 0,
      },
      "& .MuiOutlinedInput-input": {
        padding: theme.spacing(1.25),
        fontSize: 14,
        fontWeight: "bold",
      },
      "& .MuiFormHelperText-root": {
        lineHeight: "1.15rem",
        margin: theme.spacing(1, 0, 0, .5),
      },
    },
    smallText: {
      fontSize: "12px",
    },
    relatedPartViewRowTitleCell: {
      "display": "-webkit-box",
      "-webkit-line-clamp": 1,
      "-webkit-box-orient": "vertical",
      "overflow": "hidden",
    },
    itemRow: {
      "display": "flex",
      "alignItems": "center",
      "width": "100%",
      "minHeight": "48px",

      "borderBottom": `1px solid ${Colors.platinum_grey}`,
      "&:last-child": {
        borderBottom: "1px solid transparent",
      },

      "cursor": "pointer",

      "backgroundColor": Colors.white,
      "&:hover": {
        backgroundColor: Colors.lightest_grey,
      },
    },
    relatedPartViewRowCell: {
      paddingLeft: theme.spacing(1.25),
    },
    relatedPartEyeRowCell: {
      textAlign: "right",
      paddingRight: theme.spacing(1.25),
    },
    voidedBackground: {
      backgroundColor: Colors.light_red,
    },
  })
);

