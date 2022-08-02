import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
      marginLeft: "15px",
    },
    changeContainer: {
      borderBottom: "1px solid lightgray",
      padding: theme.spacing(1),
      background: Colors.white,
    },
    auditValue: {
      color: theme.palette.primary.main,
      fontWeight: 500,
      wordBreak: "break-word",
    },
    owner: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    dateContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.hint,
    },
    selectContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 16,
      marginBottom: 16,
      padding: 5,
      background: Colors.light_blue,
      borderRadius: 2,
    },
    accessButton: {
      "padding": 0,
      "margin": 0,
      "border": 0,
      "backgroundColor": "transparent",
      "cursor": "pointer",
      "li.active > a": {
        borderBottom: `1px solid ${theme.palette.common.white}`,
        transition: "none",
      },
    },
    hideBorder: {
      "&.MuiExpansionPanel-root:before": {
        display: "none",
      },
    },
    itemTitle: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "21px",
      color: Colors.almost_black,
    },
    marginLeft7: {
      marginLeft: "7px",
    },
    userName: {
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": "normal",
      "fontSize": "14px",
      "lineHeight": "18px",
      "color": Colors.almost_black,
      "&.marginLeft7": {
        marginLeft: "7px",
      },
    },
    avatar: {
      width: "30px",
      height: "30px",
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      fontFamily: "Sora",
      textTransform: "uppercase",
    },
    avatarSection: {
      display: "flex",
      alignItems: "center",
      maxWidth: "167px",
    },
    deleteIcon: {
      display: "flex",
      alignItems: "center",
      visibility: "hidden",
      paddingLeft: "5px",
    },
    listItem: {
      paddingLeft: "15px",
      marginTop: "15px",
      paddingTop: "0px",
      width: "233px",
    },
    collapseListItem: {
      padding: "0px 15px 0px 15px",
    },
    selectedUsersGrid: {
      "marginTop": "10px",
      "padding": "5px 5px 5px 10px",
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
  }),
);
