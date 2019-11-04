import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Text from "../components/Text";
import { LinkDefinition } from "./NavigationLink.container";
import { ReactComponent as DashboardIcon } from "../components/icons/dashboard_icon.svg";
import { ReactComponent as DocumentListICon } from "../components/icons/document_list_icon.svg";
import { ReactComponent as ChangeRequestListIcon } from "../components/icons/change_request_list_icon.svg";

import { ListItemIcon } from "@material-ui/core";
import styles from "./NavigationLink.styles";

interface NavigationLinkPresenterProps
  extends LinkDefinition,
    WithStyles<typeof styles> {
  ActionIcon?: ReactNode;
  isChild?: boolean;
}

interface IconObject {
  [key: string]: JSX.Element;
}

const iconMapping: IconObject = {
  "/": <DashboardIcon />,
  "/document_revision": <DocumentListICon />,
  "/change_request": <ChangeRequestListIcon />,
};

const NavigationLinkPresenter: React.FunctionComponent<
  NavigationLinkPresenterProps
> = ({ classes, url, text, Icon, ActionIcon, isChild }) => (
  <NavLink
    to={url}
    exact={true}
    className={classNames(classes.link, { [classes.childLink]: isChild })}
    activeClassName={classes.activeLink}
  >
    <ListItem
      button={true}
      className={classes.itemButton}
    >
      <ListItemIcon
        className={classes.itemIcon}
      >
        {iconMapping[url]}
      </ListItemIcon>
      <ListItemText
        primary={<Text translation={text} />}
        classes={{
          primary: classes.itemText,
        }}
      />
    </ListItem>
    {ActionIcon}
  </NavLink>
);

export default withStyles(styles)(NavigationLinkPresenter);
