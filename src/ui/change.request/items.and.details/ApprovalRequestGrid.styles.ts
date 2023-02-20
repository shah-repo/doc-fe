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
    tabContent: {
      width: "100%",
      position: "relative",
      marginBottom: theme.spacing(6),
      opacity: 1,
      transition: "opacity .2s ease-in",
    },
    tabContentInactive: {
      pointerEvents: "none",
    },
    titleHeading: {
      marginRight: theme.spacing(1.25),
      display: "inline-block",
    },
    loader: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: Colors.background_white,
      opacity: 0.7,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 600,
      zIndex: 1,
    },
    btnMargin: {
      margin: 0,
    },
    dividerStyle: {
      margin: theme.spacing(0, 0, 1.5, 0),
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
      "paddingRight": theme.spacing(1),
      "& > .MuiBox-root": {
        width: "100%",
      },
    },
    cellOther: {
      "width": "35%",
      "& .MuiOutlinedInput-multiline": {
        padding: theme.spacing(1.28, 1.75), // Need to be "10.5px 14px"
      },
    },
    hiddenLegend: {
      "& legend": {
        display: "none",
      },
    },
    itemLeftPadding: {
      paddingLeft: `calc(${theme.spacing(1.25)}px + 1px)`,
    },
    itemRightPadding: {
      paddingRight: theme.spacing(1),
    },
    enclosingDiv: {
      color: Colors.almost_black,
      position: "relative",
      flexWrap: "wrap",
    },
    enclosingDivEditItem: {
      border: `1px solid ${Colors.alice_blue}`,
    },
    enclosingDivViewItem: {
      "backgroundColor": Colors.white,
      "& .actionBtnClass": {
        display: "none",
      },
      "&:hover": {
        "backgroundColor": Colors.whitest_grey,
        "& .iconClass": {
          backgroundColor: Colors.white,
        },
        "& .actionBtnClass": {
          display: "flex",
          justifyContent: "center",
        },
      },
    },
    enclosingDivOpened: {
      "& .iconClass": {
        transform: "rotate(90deg)",
      },
    },
    itemRow: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "60px",
      padding: theme.spacing(1.5),
    },
    editItemRow: {
      "width": "100%",
      "border": `1px solid ${Colors.dodger_blue}`,
      "position": "relative",
      "flexWrap": "wrap",
      "& div div.MuiBox-root": {
        marginBottom: 0,
      },
    },
    actionButtonChildDiv: {
      width: "100px",
      backgroundColor: Colors.dodger_blue,
      position: "absolute",
      right: 0,
      borderRadius: theme.spacing(0, 0, .5, .5),
      zIndex: 100,
      display: "flex",
      justifyContent: "center",
    },
    actionButton: {
      backgroundColor: Colors.white,
      padding: theme.spacing(.5),
      minWidth: "auto",
      border: theme.spacing(1),
    },
    actionButtonDelete: {
      "& svg": {
        fill: Colors.latest_red_varient,
      },
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
      marginBottom: 0,
      paddingBottom: theme.spacing(1.75),
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
    sectionTitle: {
      color: Colors.almost_black,
    },
  })
);

