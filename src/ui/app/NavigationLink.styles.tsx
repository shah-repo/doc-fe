import { createStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      textDecoration: "none",
      flex: 1,
    },
    childLink: {
      paddingLeft: theme.spacing(3),
    },
    activeLink: {
      backgroundColor: "#29064C",
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
    },
    linkButton: {
      padding: 0,
    },
    itemIcon: {
      color: "#29064C",
    },
    itemText: {
      color: "#29064C",
      opacity: 1,
      letterSpacing: 0,
    },
  });
