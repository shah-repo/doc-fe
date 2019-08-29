import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import TrackChangesOutlinedIcon from '@material-ui/icons/TrackChangesOutlined';
import classNames from "classnames";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Text from "../components/Text";
import { LinkDefinition } from "./NavigationLink.container";

import { Box, ListItemIcon } from "@material-ui/core";
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
  "/": <DashboardOutlinedIcon />,
  "/document_revision": <FolderOutlinedIcon />,
  "/change_request": <TrackChangesOutlinedIcon />,
}

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
      button
      className={classes.itemButton}
    >
      <ListItemIcon
        className={classes.itemIcon}
      >
        {iconMapping[url]}
      </ListItemIcon>
      <ListItemText
        primary={<Text translation={text} />}
        className={classes.itemText}
      />
    </ListItem>
    {ActionIcon}
  </NavLink>
);

export default withStyles(styles)(NavigationLinkPresenter);
