import { ListItemIcon } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import classNames from "classnames";
import { camelCase } from "lodash";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { NavigationItem, NavigationItemType } from "../../state/ducks/company";
import Text from "../components/Text";
import { DOCUMENT_BY_CATEGORY_ROOT_URL } from "../constants/urls";
import styles from "./NavigationLink.styles";

interface NavigationLinkPresenterProps extends
  NavigationItem {
  ActionIcon?: ReactNode;
  isChild?: boolean;
  toggleChildren?: (event: React.MouseEvent) => void;
  currentPath: string;
  checkIfItemIsActive: (
    type: NavigationItemType,
    currentPath: string,
    path?: string,
    category?: string,
    menu?: NavigationItem[],
  ) => boolean;
}

const NavigationLinkPresenter: React.FunctionComponent<NavigationLinkPresenterProps> = ({
  path,
  category,
  label,
  type,
  icon,
  ActionIcon,
  isChild,
  toggleChildren,
  currentPath,
  checkIfItemIsActive,
}) => {
  const classes = styles({ iconLink: icon });
  return (
    <>
      <ListItem
        component={path || category ? NavLink : null}
        button
        exact
        className={
          classNames(classes.link, {
            [classes.childLink]: isChild,
            [classes.menu]: type === "MENU",
          })}
        activeClassName={classes.activeLink}
        data-cy={`navigation.${camelCase(label)}`}
        to={type === "CATEGORY" ? `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${category}` : path}
      >
        <ListItemIcon className={classes.itemIcon} onClick={toggleChildren}>
          <div
            className={classNames(
              classes.icon, {
                [classes.iconActive]: type !== "MENU" && checkIfItemIsActive(type, currentPath, path, category),
              }
            )}
          />
        </ListItemIcon>
        <ListItemText
          primary={<Text message={label} />}
          classes={{
            primary: classes.itemText,
          }}
          onClick={toggleChildren}
        />
        {ActionIcon}
      </ListItem>
    </>
  );
};

export default NavigationLinkPresenter;
