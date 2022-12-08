import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

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
    },
    partsGrid: {
      paddingLeft: theme.spacing(1.5),
      marginBottom: theme.spacing(1.5),
    },
    btnMargin: {
      margin: 0,
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
    iconButton: {
      "fontSize": "16px",
      "fill": "#000",
      "&:hover": {
        color: Colors.blue,
      },
    },
    viewIcon: {
      fill: Colors.cerulean,
      marginTop: theme.spacing(.5),
      fontSize: "1.2rem",
      cursor: "pointer",
    },
    header: {
      height: "40px",
      display: "flex",
      alignItems: "center",

      backgroundColor: Colors.alice_blue,
      color: Colors.almost_black,
      textTransform: "uppercase",
      fontSize: "12px",

      padding: theme.spacing(1.5),

      fontWeight: 600,

      borderRadius: theme.spacing(.5, .5, 0, 0),
    },
    cellOne: {
      "width": "30%",
      "display": "flex",
      "alignItems": "center",
      "columnGap": theme.spacing(1.25),
      "& > .MuiBox-root": {
        width: "100%",
      },
    },
    cellTwo: {
      width: "35%",
    },
    cellThree: {
      width: "35%",
    },
    itemLeftPadding: {
      paddingLeft: `calc(${theme.spacing(1.25)}px + 1px)`,
    },
    itemRightPadding: {
      paddingRight: theme.spacing(1),
    },
    enclosingDiv: {
      border: `1px solid ${Colors.alice_blue}`,
      color: Colors.almost_black,
    },
    enclosingDivColor: {
      "backgroundColor": Colors.white,
      "&:hover": {
        "backgroundColor": Colors.whitest_grey,
        "& .iconClass": {
          backgroundColor: Colors.white,
        },
      },
    },
    enclosingDivOpened: {
      "& svg": {
        transform: "rotate(90deg)",
      },
    },
    itemRow: {
      display: "flex",
      alignItems: "center",
      minHeight: "60px",
      padding: theme.spacing(1.5),
    },
    editItemRow: {
      "border": `1px solid ${Colors.dodger_blue}`,
      "position": "relative",
      "flexWrap": "wrap",
      "& div div.MuiBox-root": {
        marginBottom: 0,
      },
    },
    actionButtonParentDiv: {
      width: "100%",
      position: "relative",
    },
    actionButtonChildDiv: {
      width: "100px",
      backgroundColor: Colors.dodger_blue,
      position: "absolute",
      right: `calc(${theme.spacing(-1.5)}px - 1px)`,
      bottom: `calc(${theme.spacing(-6.5)}px - 1px)`,
      borderRadius: theme.spacing(0, 0, .5, .5),
      display: "flex",
      justifyContent: "center",
    },
    actionButton: {
      backgroundColor: Colors.white,
      padding: theme.spacing(.5),
      minWidth: "auto",
      border: theme.spacing(1),
    },
    moreDetails: {
      padding: theme.spacing(0, 1.5, 0, 5.5),
    },
    separator: {
      height: "1px",
      backgroundColor: Colors.gray_goose,
      border: "none",
      marginTop: 0,
    },
    moreDetailsHeader: {
      color: Colors.font_gray,
      fontSize: "12px",
      fontWeight: 500,
    },
    iconClass: {
      width: "1.4rem",
      height: "1.4rem",
      border: `1px solid ${Colors.whitest_grey}`,
      backgroundColor: Colors.whitest_grey,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    showMoreIcon: {
      fill: Colors.font_gray,
      transform: "rotate(0)",
      transition: "transform 0.2s",
    },
    docList: {
      listStyle: "none",
      paddingLeft: 0,
    },
    docListItem: {
      padding: theme.spacing(.75, 0),
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
      "width": "100%",
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
    option: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      display: "block",
    },
  })
);

