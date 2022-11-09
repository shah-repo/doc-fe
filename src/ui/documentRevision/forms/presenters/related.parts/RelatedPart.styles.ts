import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export default makeStyles((theme) =>
  createStyles({
    mainDiv: {
      marginBottom: "2rem",
    },
    title: {
      display: "flex",
      padding: theme.spacing(.5),
      paddingLeft: theme.spacing(2),
      alignItems: "center",
    },
    formControlPad: {
      paddingLeft: theme.spacing(2),
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
      "borderRadius": "0 0 5px 5px",
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
      marginRight: "10px",
      display: "inline-block",
    },
    partsGrid: {
      paddingLeft: "12px",
      marginBottom: "1rem",
    },
    btnMargin: {
      marginRight: 0,
    },
    dividerStyle: {
      margin: theme.spacing(0, 0, 1.5, 0),
    },
    editRowParentDiv: {
      display: "flex",
      width: "100%",
      alignItems: "flex-start",
      borderRadius: theme.spacing(0, 0, .5, .5),
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
      columnGap: "4px",
    },
    editRowChildDivTwo: {
      width: "50%",
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      justifyContent: "space-evenly",
      padding: theme.spacing(0, 1.5),
      alignItems: "center",
    },

    actionButtonParentDiv: {
      width: "100%",
      position: "relative",
      marginBottom: "20px",
    },
    actionButtonChildDiv: {
      width: "100px",
      backgroundColor: Colors.cerulean,
      position: "absolute",
      right: 0,
      borderRadius: theme.spacing(0, 0, .5, .5),
      display: "flex",
      justifyContent: "center",
    },
    actionButton: {
      backgroundColor: Colors.white,
      padding: theme.spacing(.5),
      minWidth: "auto",
      border: "8px",
    },
    iconButton: {
      "fontSize": "16px",
      "fill": "#000",
      "&:hover": {
        color: Colors.blue,
      },
    },
    viewIcon: {
      fill: Colors.cerulean,
      marginTop: "5px",
      fontSize: "1.2rem",
      cursor: "pointer",
    },
    tableHeadHeight: {
      height: "40px",
    },
    tableCell: {
      backgroundColor: "#e2e8f0",
      color: "rgb(8, 11, 17)",
    },
    tableCellOne: {
      width: "30%",
      borderRadius: "5px 0 0 0",
      paddingLeft: "15px",
    },
    tableCellTwo: {
      width: "45%",
    },
    tableCellThree: {
      width: "15%",
    },
    tableCellFour: {
      width: "10%",
      borderRadius: "0 5px 0 0",
    },
    verticalDivider: {
      borderLeft: "2px solid white",
      paddingLeft: "10px",
    },
    successMessage: {
      width: "380",
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
  })
);

