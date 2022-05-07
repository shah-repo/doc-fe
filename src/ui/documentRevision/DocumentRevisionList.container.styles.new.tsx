import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {

    },
    linkContainer: {
      boxShadow: `0px 1px 0px ${Colors.gray_goose}`,
      padding: theme.spacing(1.875),
      width: theme.spacing(29.125),
      flexGrow: 1,
    },
    linkTitle: {
      color: Colors.navy,
      textDecoration: "none",
      fontWeight: 600,
      fontFamily: "Sora",
      fontSize: "14px",
      lineHeight: "24px",
    },
    activeLinkBox: {
      color: Colors.navy,
      textDecoration: "none",
      fontWeight: 600,
      fontFamily: "Sora",
      fontSize: "14px",
      lineHeight: "24px",
    },
    inActiveLinkBox: {
      color: Colors.font_gray,
      textDecoration: "none",
      fontWeight: 600,
      fontFamily: "Sora",
      fontSize: "14px",
      lineHeight: "24px",
    },
    activeLinkTitle: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
    linkBody: {
      textDecoration: "none",
      color: theme.palette.text.primary,
      fontFamily: "Sora",
      fontSize: "14px",
      lineHeight: "24px",
    },
    activeLinkBody: {
      textDecoration: "none",
      color: Colors.almost_black,
      fontFamily: "Sora",
      fontSize: "14px",
      lineHeight: "24px",
    },
    inActiveLinkBody: {
      textDecoration: "none",
      color: Colors.font_gray,
      fontFamily: "Sora",
      fontSize: "14px",
      lineHeight: "24px",
    },
    selected: {
      background: Colors.background_white,
    },
    details: {
      "&.MuiExpansionPanelDetails-root": {
        display: "block",
      },
    },
    displayStatus: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
      fontWeight: "normal",
    },
  }),
);
