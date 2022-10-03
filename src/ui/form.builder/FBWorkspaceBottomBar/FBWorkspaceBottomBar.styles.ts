import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    formOptionsBox: {
      width: "260px",
      height: "46px",
      background: Colors.almost_black,
      borderRadius: "10px",
      padding: "0 15px",
      textAlign: "center",
    },
    formOptionsText: {
      fontFamily: "Sora",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.white,
    },
    formOptionsIcons: {
      paddingTop: "5px",
    },
    previewIcon: {
      paddingTop: 0,
    },
    exportIcon: {
      margin: "0 10px",
    },
  })
);
