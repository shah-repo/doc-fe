import { createStyles, Theme } from "@material-ui/core";
import EnlilLogo from "../../assets/images/enlil_logo.svg";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    newAppBar: {
      background: `linear-gradient(262.45deg, ${Colors.cerulean} 0.28%, ${Colors.ultramarine_blue} 16.91%, #011FBB 85.48%)`,
      color: Colors.white,
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
    },
    appBar: {
      background: `linear-gradient(262.45deg, ${Colors.cerulean} 0.28%, ${Colors.ultramarine_blue} 16.91%, #011FBB 85.48%)`,
      marginLeft: DRAWER_WIDTH,
      fontSize: "1rem",
      color: Colors.white,
    },
    newLogo: {
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${EnlilLogo})`,
      left: "53%",
      right: "20%",
      position: "absolute",
      paddingTop: "48px",
    },
    topScrollBarBox: {
      color: Colors.white,
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "12px",
      display: "flex",
      textTransform: "uppercase",
    },
    welcomeText: {
      color: Colors.dark_gray,
    },
    name: {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
    toolbar: {
      marginLeft: DRAWER_WIDTH,
      borderBottom: `1px solid ${Colors.medium_gray}`,
      minHeight: "48px",
    },
    headerButton: {
      "boxShadow": "none",
      "textTransform": "none",
      "padding": 0,
      "margin": 0,
      "&:hover": {
        background: "none",
        boxShadow: "none",
      },
    },
    wrapContainer: {
      marginLeft: theme.spacing(2),
    },
    logo: {
      position: "absolute",
      paddingTop: "40px",
      right: "20.42%",
      left: "61%",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${EnlilLogo})`,
    },
  });
