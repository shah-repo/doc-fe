import { createStyles, makeStyles } from "@material-ui/core";

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
        background: `linear-gradient(262.45deg, #01A6C7 0.28%, #4C69FF 16.91%, #011FBB 85.48%)`,
      },
    },
    disableRipple: {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    fullLengthButton: {
      "borderStyle": "dashed",
      "borderColor": "blue",
      "width": "100%",
      "margin": 0,
      "borderRadius": "0 0 5px 5px",
      "color": "#011FBB",
      "&:hover": {
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderColor: "blue",
        color: "#011FBB",
      },
    },
    customTooltip: {
      backgroundColor: "black",
    },
    customArrow: {
      color: "black",
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
      border: "1px solid #01A6C7",
    },
    editRowParentError: {
      border: "1px solid red",
    },
    labelError: {
      color: "red",
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
      backgroundColor: "#01A6C7",
      position: "absolute",
      right: 0,
      borderRadius: theme.spacing(0, 0, .5, .5),
      display: "flex",
      justifyContent: "center",
    },
    actionButton: {
      backgroundColor: "white",
      padding: theme.spacing(.5),
      minWidth: "auto",
      border: "8px",
    },
    iconButton: {
      "fontSize": "16px",
      "fill": "#000",
      "&:hover": {
        color: "blue",
      },
    },
    viewIcon: {
      fill: "#01A6C7",
      marginTop: "5px",
      fontSize: "1.2rem",
      cursor: "pointer",
    },
    tableHeadHeight: {
      height: "40px",
    },
    tabelCell: {
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
        // width: "150px",
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

