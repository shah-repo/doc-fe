import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      "borderRadius": "4px",
      "display": "flex",
      "flexDirection": "row",
      "alignItems": "center",
      "padding": "11px 0px 11px 10px",
      "background": Colors.sky_blue,
      "&:hover": {
        cursor: "pointer",
      },
      "height": "100%",
      "marginBottom": "10px",
      "& .MuiChip-label": {
        padding: "0px",
      },
    },
    label: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "18px",
      color: Colors.navy,
      padding: "0px",
    },
    link: {
      textDecoration: "none",
      color: Colors.navy,
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "17.64px",
    },
    header: {
      fontSize: "12px",
      color: Colors.almost_black,
      fontWeight: 600,
      lineHeight: "15.12px",
      marginBottom: "10px",
    },
    noHeader: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
      color: Colors.almost_black,
    },
    avatarSection: {
      display: "flex",
      alignItems: "center",
      marginRight: "10px",
    },
    selectedUsersGrid: {
      "borderRadius": "4px",
      "background": Colors.sky_blue,
      "marginTop": "5px",
      "marginBottom": "10px",
      "padding": "5px 5px 5px 10px",
      "flexWrap": "nowrap",
      "width": "203px",
      "&:hover": {
        "background": Colors.bright_gray,
        "borderRadius": "4px",
        "& $deleteIcon": {
          visibility: "visible",
        },
      },
      "&.groupsGrid": {
        padding: "11px 5px 10px 10px",
      },
    },
    deleteIcon: {
      display: "flex",
      alignItems: "center",
      visibility: "hidden",
    },
  }));
