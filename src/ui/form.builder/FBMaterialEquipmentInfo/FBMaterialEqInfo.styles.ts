import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    // expandCollapseText: {
    //   color: "red",
    // },
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
      padding: "0rem 0.5rem  2.1rem 2.1rem",
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
      paddingLeft: "28px !important",
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
