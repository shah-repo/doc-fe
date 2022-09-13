import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(3),
  },
  panel: {
    marginBottom: theme.spacing(1),
    border: `1px solid ${Colors.gray_goose}`,
    borderRadius: theme.spacing(.5),
  },
  panelSummary: {
    "flexDirection": "row-reverse",
    "alignItems": "center",
    "padding": 0,
    "&.Mui-expanded": {
      minHeight: 0,
      color: Colors.navy,
    },
  },
  panelSummaryIcon: {
    "color": Colors.almost_black,
    "&.Mui-expanded": {
      color: Colors.navy,
      transform: "rotate(90deg)",
    },
  },
  panelSummaryContent: {
    "justifyContent": "space-between",
    "alignItems": "center",
    "padding": theme.spacing(0, 2, 0, 1.25),
    "&.Mui-expanded": {
      margin: 0,
    },
  },
  panelSummaryTitle: {
    fontWeight: 600,
    fontSize: 16,
  },
  panelSummaryCount: {
    color: Colors.font_gray,
    fontSize: 13,
  },
  panelDetails: {
    padding: theme.spacing(0, 2, .5, 6),
    margin: theme.spacing(-2, 0, 0),
  },
  panelDetailsList: {
    width: "100%",
  },
  chip: {
    borderRadius: theme.spacing(.5),
    backgroundColor: Colors.whitest_grey,
    marginRight: 5,
    fontSize: 12,
    lineHeight: 1.25,
  },
  panelDetailsListItem: {
    padding: theme.spacing(.75, 0),
    display: "block",
  },
  diffSwitch: {
    marginBottom: theme.spacing(2),
  },
  switchLabel: {
    fontSize: 14,
    color: Colors.almost_black,
    margin: 0,
  },
  switchRoot: {
    width: theme.spacing(3),
    height: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(1),
  },
  switchBase: {
    "padding": 1,
    "&.Mui-checked": {
      "transform": `translateX(${theme.spacing(1)}px)`,
      "color": Colors.white,
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: Colors.navy,
        border: "none",
      },
    },
  },
  switchThumb: {
    width: theme.spacing(2) - 2,
    height: theme.spacing(2) - 2,
    boxShadow: "none",
  },
  switchTrack: {
    borderRadius: theme.spacing(1),
    opacity: 1,
    backgroundColor: Colors.dawn,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  switchChecked: {},
  expandButton: {
    "color": Colors.navy,
    "fontWeight": 400,
    "padding": 0,
    "margin": 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  navTitle: {
    fontSize: 12,
    fontWeight: 600,
    margin: theme.spacing(.25, 0),
  },
  navItem: {
    "borderRadius": theme.spacing(.5),
    "padding": theme.spacing(1, 1.25),
    "marginBottom": theme.spacing(.5),
    "color": Colors.navy,
    "fontSize": 12,
    "&.Mui-selected": {
      "backgroundColor": Colors.light_cream_blue,
      "&:hover": {
        backgroundColor: Colors.light_cream_blue,
      },
    },
    "&:hover": {
      backgroundColor: Colors.light_cream_blue,
    },
  },
}));

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    panelBorder: {
      marginBottom: 5,
      border: `1px solid ${Colors.gray_goose}`,
      borderRadius: "4px",
    },
    pannelHeader: {
      fontWeight: 600,
      fontSize: 16,
    },
    fontText: {
      fontWeight: 600,
      fontSize: 12,
      marginBottom: 20,
    },
    fontNormal: {
      fontWeight: 400,
      fontSize: 12,
    },
    fontNormal12: {
      fontWeight: 400,
      fontSize: 12,
      color: Colors.almost_black,
    },
    expanSionPannelPadding: {
      padding: "0rem 0.5rem 0.87rem 2.1rem",
      display: "block",
      marginTop: -15,
    },
    fontNormal14: {
      fontWeight: 400,
      fontSize: 14,
      color: Colors.almost_black,
    },
    chipStyle: {
      borderRadius: 4, backgroundColor: Colors.whitest_grey,
      marginRight: 5, fontSize: 12, lineHeight: 15.12,
      color: Colors.almost_black,
    },
    paraGraphMaterial: {
      height: 30, color: Colors.navy,
      marginBottom: 5,
      cursor: "pointer",
      fontSize: 12, fontWeight: 400,
    },
    paraGraphEq: {
      height: 30,
      cursor: "pointer",
      color: Colors.navy,
      marginTop: 5,
      fontSize: 12,
      fontWeight: 400,
    },
    expandIconStyle: {
      cursor: "pointer",
      transform: "rotate(180deg)",
    },
    tabCursor: {
      cursor: "pointer",
    },
    qunatityText: {
      float: "right",
      marginRight: "1rem",
      fontSize: 13,
      fontWeight: 400,
      color: Colors.font_gray,
    },
    meqListItem: {
      display: "block",
      paddingTop: 0,
      cursor: "pointer",
    },
    dividerMargin: {
      marginTop: 10,
    },
    gridHeadingPadding: {
      paddingLeft: "25px !important",
    },
    meqAccordianHeading: {
      color: Colors.navy,
      cursor: "pointer",
      fontWeight: 400,
      fontSize: 12,
    },
    meqMaterialTab: {
      paddingLeft: 28,
    },
    jumpToBolckpadding: {
      paddingTop: 22,
    },
    jumpToTextPadding: {
      paddingLeft: 10, paddingTop: 7,
    },
    jumpToTextMargin: {
      marginLeft: 8,
    },
    panelSummary: {
      "fontWeight": 600,
      "fontSize": 16,
      "flexDirection": "row-reverse",
      "padding": 0,
      "margin": 0,
      "height": "55px",
      "alignItems": "center",
      "zIndex": 2,
      "& .Mui-expanded": {
        height: "55px",
        alignItems: "center",
        cursor: "pointer",
      },
    },
  })
);
