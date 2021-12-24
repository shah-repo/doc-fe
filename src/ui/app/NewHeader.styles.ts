import { createStyles, Theme } from "@material-ui/core";
import EnlilLogo from "../../assets/images/enlil_logo.svg";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    appBar: {
      background:
        "linear-gradient(262.45deg, #01A6C7 0.28%, #4C69FF 16.91%, #011FBB 85.48%)",
      fontSize: "1rem",
      height: "20%",
      zIndex: 0,
      color: Colors.white,
    },
    logo: {
      position: "absolute",
      bottom: "-33px",
      right: "20.42%",
      top: "0px",
      left: "61%",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${EnlilLogo})`,
    },
    toolbarTitle: {
      position: "relative",
      left: "3%",
      top: "17%",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "27px",
      lineHeight: "34px",
      fontWeight: 300,
      color: Colors.white,
    },
    toolbarTitleName: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "27px",
      lineHeight: "34px",
      color: Colors.white,
    },
    welcomeText: {
      color: Colors.white,
    },
    name: {
      fontWeight: 600,
      color: Colors.white,
    },
    toolbar: {
      marginLeft: 30 + DRAWER_WIDTH,
      paddingTop: 20,
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
  });
