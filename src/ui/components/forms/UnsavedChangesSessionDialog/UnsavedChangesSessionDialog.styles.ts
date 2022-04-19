import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dialogContent: {
      paddingLeft: 50,
      paddingBottom: 40,
    },
    dialogActions: {
      backgroundColor: Colors.white_smoke,
      paddingRight: 20,
    },
    submitButton: {
      borderRadius: 200,
      fontSize: 12,
    },
    cancelButton: {
      borderRadius: 200,
      fontSize: 12,
      color: Colors.white,
    },
    iconButton: {
      borderRadius: 6,
    },
    title: {
      color: Colors.almost_black,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "Sora",
    },
    optionsTitle: {
      color: Colors.almost_black,
      fontSize: 12,
      fontWeight: 600,
      fontFamily: "Sora",
      marginBottom: 16,
    },
    content: {
      color: Colors.almost_black,
      fontSize: 12,
      fontWeight: 400,
      fontFamily: "Sora",
      marginTop: 20,
      marginBottom: 16,
    },
    radioOption: {
      color: Colors.almost_black,
      fontSize: 14,
      fontFamily: "Sora",
    },
  }),
);
