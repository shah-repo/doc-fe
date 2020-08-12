import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { getCurrentUserTags } from "../../common/utils/selectors";
import { GroupTag } from "../../state/ducks/auth/types";
import { companyActions, companySelectors, NavigationItem } from "../../state/ducks/company";
import BottomLogo from "../components/icons/BottomLogo.container";
import Logo from "../components/icons/Logo.container";
import { HOME_URL } from "../constants/urls";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";
import styles from "./Navigation.styles";
import NavigationLinkContainer from "./NavigationLink.container";

type NavigationProps = WithStyles<typeof styles> & RouteComponentProps;

function  itemAllowedForUser(item: NavigationItem, userTags: GroupTag[]): boolean {
  return !item.restrictedToUsersWithTags?.length ||
        item.restrictedToUsersWithTags.some((tag) => userTags.includes(tag));
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  classes,
  location,
}) => {
  const userTags = useSelector(getCurrentUserTags());
  const async = useAsync({
    onSuccess: () => {
      setIsLoading(false);
    },
  });
  const getCompanyMine = useActionCreator(companyActions.getCompanyMine);

  const navigationItems = useSelector(companySelectors.getNavigationItems)
    .reduce<NavigationItem[]>((acc, item) => {
      if (itemAllowedForUser(item, userTags)) {
        if (item.type === "MENU") {
          item.menu = (item.menu || []).filter((menuItem) => itemAllowedForUser(menuItem, userTags));
        }
        acc.push(item);
      }
      return acc;
    }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async.start(getCompanyMine, async);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        {
          isLoading
            ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress size={20} />
              </Box>
            )
            : (
              <List>
                {
                  navigationItems.map((link: NavigationItem) => (
                    <NavigationLinkContainer
                      key={link.label}
                      currentPath={location.pathname}
                      {...link}
                    />
                  ))
                }
              </List>
            )
        }
      </Box>
      <Box paddingBottom="20px">
        <BottomLogo />
      </Box>
    </Drawer>
  );
};

export default withRouter(withStyles(styles)(Navigation));
