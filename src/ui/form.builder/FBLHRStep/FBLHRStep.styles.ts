import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBLHRStepStyles = makeStyles(() =>
  createStyles({
    button: {
      "backgroundColor": Colors.navy,
      "borderRadius": "100px",
      "height": 36,
      "minWidth": 180,
      "marginTop": 0,
      "fontFamily": "Sora",
      "fontSize": 12,
      "fontWeight": 600,
      "color": Colors.white,
      "border": `1px solid ${Colors.navy}`,
      "&.Mui-disabled": {
        border: "none",
        backgroundColor: Colors.gains_boro,
        color: Colors.spanish_gray,
      },
      "&:hover": {
        backgroundColor: Colors.navy,
      },
      "padding": "12px 25px",
    },
    expansionPanelHedding: {
      Colors: Colors.navy,
    },
    panelSummary: {
      "flexDirection": "row-reverse",
      "padding": 0,
      "margin": 0,
      "height": "55px",
      "alignItems": "center",
      "& .Mui-expanded": {
        transform: "rotate(0deg)",
        height: "55px",
        alignItems: "center",
      },
    },
    panelDetails: {
      marginLeft: "22px",
      marginRight: "22px",
      display: "block",
    },
    panelBorder: {
      marginBottom: 5,
      border: `1px solid ${Colors.gray_goose}`,
      borderRadius: "4px",
    },
    fontTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: Colors.almost_black,
    },
    subTitle: {
      fontSize: 14,
      fontWeight: 400,
      color: Colors.almost_black,
      marginTop: 10,
    },
    listItem: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    operatorTitle: {
      fontWeight: 700,
      fontSize: 14,
      color: Colors.almost_black,
    },
    operatorStatus: {
      marginRight: 2,
      fontSize: 14,
      fontWeight: 400,
      color: Colors.almost_black,
      marginTop: 10,
    },
    borderColorIcon: {
      color: Colors.red,
    },
  })
);
