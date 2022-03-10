import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      "marginTop": "12px",
      "marginBottom": "8px",
      "& .MuiListItemAvatar-root": {
        maxWidth: "35px",
        minWidth: "35px",
        marginRight: "8px",
      },
    },
    generalInfo: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.almost_black,
    },
    releaseDate: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.almost_black,
      marginTop: "4px",
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
    secondaryText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "12px",
      color: Colors.font_gray,
    },
    released: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
      lineHeight: "20px",
      color: Colors.almost_black,
      marginTop: "10px",
    },
    migrateForm: {
      "borderRadius": "100px",
      "width": "203px",
      "height": "36px",
      "backgroundColor": Colors.navy,
      "padding": "0px",
      "margin": "0px",
      "&:hover": {
        backgroundColor: Colors.navy,
      },
    },
    migrateFormText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "15.12px",
      color: Colors.white,
      textTransform: "capitalize",
    },
  }),
);
