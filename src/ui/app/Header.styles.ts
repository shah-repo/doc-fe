import { createStyles, Theme } from "@material-ui/core";
import EnlilLogo from "../../assets/images/enlil_logo.svg";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    appBar: {
      background: "linear-gradient(262.45deg, #01A6C7 0.28%, #4C69FF 16.91%, #011FBB 85.48%)",
      marginLeft: DRAWER_WIDTH,
      fontSize: "1rem",
      color: Colors.white,
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
      minHeight: "40px",
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
      bottom: "-33px",
      right: "20.42%",
      top: "0px",
      left: "61%",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${EnlilLogo})`,
    },
  });
