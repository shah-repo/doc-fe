import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import Text from "../components/Text";
import { LinkDefinition } from "./NavigationLink.container";

import styles from "./NavigationLink.styles";

interface NavigationLinkPresenterProps extends LinkDefinition, WithStyles<typeof styles> {
  ActionIcon?: ReactNode;
  isChild?: boolean;
}

const NavigationLinkPresenter: React.FunctionComponent<NavigationLinkPresenterProps> =
  ({ classes, url, text, Icon, ActionIcon, isChild }) => (
    <ListItem button={true} className={classes.linkButton}>
      <NavLink
        to={url}
        exact={true}
        className={classNames(classes.link, { [classes.childLink]: isChild })}
        activeClassName={classes.activeLink}
      >
        {Icon && <ListItemIcon><Icon fontSize={isChild ? "small" : "default"} /></ListItemIcon>}
        <ListItemText
          primaryTypographyProps={{ variant: isChild ? "caption" : "subtitle1" }}
          primary={<Text translation={text} />}
          className={classes.item}
        />
        {ActionIcon}
      </NavLink>
    </ListItem >
  );

export default withStyles(styles)(NavigationLinkPresenter);
