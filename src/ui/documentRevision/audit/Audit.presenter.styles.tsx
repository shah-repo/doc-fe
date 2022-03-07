import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
    },
    noPaddingMargin: {
      margin: "0px",
      padding: "0px",
    },
    auditListItem: {
      margin: "0px",
      padding: "0px",
      marginBottom: "20px",
    },
    changeContainer: {
      borderBottom: "1px solid lightgray",
      padding: theme.spacing(2),
    },
    auditValue: {
      fontSize: "14px",
      fontFamily: "Sora",
      wordBreak: "break-word",
      color: Colors.almost_black,
    },
    owner: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    dateContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.hint,
    },
    revisionContainer: {
      background: Colors.background_blue,
      height: theme.spacing(5),
      paddingTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRadius: theme.spacing(0.4),
    },
    title: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(1),
    },
    avatar: {
      width: "35px",
      height: "35px",
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      fontFamily: "Sora",
      textTransform: "uppercase",
    },
    generalInfo: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.almost_black,
    },
    secondaryText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "12px",
      color: Colors.font_gray,
    },
  }),
);
