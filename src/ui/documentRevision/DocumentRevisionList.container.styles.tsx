import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {

    },
    linkContainer: {
      borderBottom: `1px solid ${theme.palette.text.hint}`,
      padding: theme.spacing(2),
      width: theme.spacing(31.5),
      flexGrow: 1,
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
      background: Colors.background_blue,
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
