import { ListItemIcon, Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  NavigationItem,
  NavigationItems,
  NavigationItemType,
} from '../../state/ducks/company/types';
import NewBadge from '../administration/premium.settings/components/NewBadge';
import { DOCUMENT_BY_CATEGORY_ROOT_URL } from '../constants/urls';
import { SIDE_BAR_TAB_INDEX } from '../documentRevision/Sidebar/constants';
import styles from './NavigationLink.styles';

interface NavigationLinkPresenterProps extends NavigationItem {
  ActionIcon?: ReactNode
  isChild?: boolean
  toggleChildren?: (event: React.MouseEvent) => void
  onMouseEnter?: (event: React.MouseEvent) => void
  onMouseLeave?: (event: React.MouseEvent) => void
  currentPath: string
  open: boolean
  menu?: NavigationItem[]
  showLabelNew?: boolean
  checkIfItemIsActive: (
    type: NavigationItemType,
    currentPath: string,
    path?: string,
    category?: string,
    menu?: NavigationItem[]
  ) => boolean
}

const NavigationLinkPresenter: React.FunctionComponent<
NavigationLinkPresenterProps
> = ({
  path,
  category,
  label,
  type,
  icon,
  ActionIcon,
  isChild,
  menu,
  toggleChildren,
  onMouseEnter,
  onMouseLeave,
  currentPath,
  open,
  checkIfItemIsActive,
  showLabelNew,
}) => {
  const isMenu = type === NavigationItems.MENU;
  const classes = styles({
    iconLink: icon,
    open: open,
    isParent: menu?.length !== 0,
  });
  const isItemActive = checkIfItemIsActive(
    type,
    currentPath,
    path,
    category,
    menu,
  );
  return (
    <ListItem
      component={path || category ? NavLink : null}
      button
      className={classNames(classes.link, {
        [classes.childLink]: isChild,
        [classes.menu]: isMenu,
        [classes.activeLink]: isItemActive,
      })}
      to={
        type === NavigationItems.CATEGORY
          ? `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${category}`
          : path
      }
      onClick={() => localStorage.setItem(SIDE_BAR_TAB_INDEX, '0')}
      onMouseLeave={onMouseLeave}
      data-cy={`navigation.${camelCase(label)}`}
    >
      {!isChild && (
        <ListItemIcon
          className={classes.itemIcon}
          onClick={toggleChildren}
          onMouseEnter={onMouseEnter}
        >
          <div
            className={classNames(classes.icon, {
              [classes.iconActive]: !isMenu && isItemActive,
              [classes.collapsedIcon]: !open,
            })}
          />
        </ListItemIcon>
      )}
      {open && (
        <ListItemText
          primary={
            <>
              <Typography
                component="span"
                className={classNames(classes.itemText, {
                  [classes.childTextItem]: isChild && open,
                })}
              >
                {label}
              </Typography>
              {showLabelNew && <NewBadge />}
            </>
          }
          onClick={toggleChildren}
        />
      )}
      {open ? ActionIcon : null}
    </ListItem>
  );
};

export default NavigationLinkPresenter;
