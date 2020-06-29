import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import BottomLogo from "../components/icons/BottomLogo.container";
import Logo from "../components/icons/Logo.container";
import { HOME_URL } from "../constants/urls";
import styles from "./Navigation.styles";
import NavigationLinkContainer, { LinkDefinition } from "./NavigationLink.container";

type NavigationProps = WithStyles<typeof styles> & RouteComponentProps;

const links: LinkDefinition[] = [
  {
    label: "Dashboard",
    type: "LINK",
    link: "/",
    icon: "dashboard",
  },
  {
    label: "Document List",
    type: "LINK",
    link: "/document_revision",
    icon: "document revision list",
  },
  {
    label: "Change Request List",
    type: "LINK",
    link: "/change_request",
    icon: "change request list",
  },
  {
    label: "Inventory",
    type: "MENU",
    menu: [
      {
        label: "Purchase Order",
        type: "LINK",
        link: "/document_by_type/d9d308e1-dc62-4201-94fe-effabbdf3e9e",
        icon: "suppliers",
      },
      {
        label: "Suppliers",
        type: "LINK",
        link: "/document_by_type/0ca7da27-f53a-429f-817b-20f9e935cd65",
        icon: "purchase order",
      },
    ],
  },
];

const Navigation: React.FunctionComponent<NavigationProps> = ({
  classes,
  location,
}) => (
  <Drawer
    PaperProps={{ id: "navigation" }}
    className={classes.drawer}
    variant="permanent"
    classes={{ paper: classes.drawerPaper }}
    anchor="left"
  >
    <Box flexGrow="1">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" className={classes.toolbarTitle}>
          <Link to={HOME_URL} className={classes.headerLink}>
            <Logo />
          </Link>
        </Typography>
      </Toolbar>
      <List>
        {
          links.map((link: LinkDefinition) => (
            <NavigationLinkContainer
              key={link.label}
              currentPath={location.pathname}
              {...link}
            />
          ))
        }
      </List>
    </Box>
    <Box paddingBottom="20px">
      <BottomLogo />
    </Box>
  </Drawer>
);

export default withRouter(withStyles(styles)(Navigation));
