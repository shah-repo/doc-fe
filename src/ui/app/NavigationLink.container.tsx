import {
  Collapse,
  List, Menu, MenuItem, MenuProps, withStyles,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { authSelectors } from '../../state/ducks/auth';
import { companyActions, companySelectors } from '../../state/ducks/company';
import {
  NavigationItem, NavigationItems, NavigationItemType,
} from '../../state/ducks/company/types';
import { ApplicationState } from '../../state/reducers';
import { DOCUMENT_BY_CATEGORY_ROOT_URL } from '../constants/urls';
import NavigationLinkPresenter from './NavigationLink.presenter';
import styles from './NavigationLink.styles';
import { updateNavigationItem } from './NavigationLocalStorageHelpers';

interface NavigationLinkContainerProps extends NavigationItem {
  currentPath: string
  open: boolean
}

interface CustomMenuProps extends MenuProps {
  isParent?: boolean
}

const isMenuType = (type: NavigationItemType): boolean => {
  return type === NavigationItems.MENU;
};

const checkIfItemIsActive = (
  type: NavigationItemType,
  currentPath: string,
  path?: string,
  category?: string,
  menu?: NavigationItem[],
): boolean => {
  switch (type) {
    case NavigationItems.LINK:
      return currentPath === path;
    case NavigationItems.CATEGORY:
      return currentPath === `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${category}`;
    case NavigationItems.MENU:
      return (
        menu?.some((item) =>
          checkIfItemIsActive(item.type, currentPath, item.path, item.category, menu),
        ) || false
      );
    default:
      return false;
  }
};

const StyledMenu = withStyles({
  paper: {
    fontSize: 13,
    fontWeight: 400,
    boxShadow: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  list: {
    padding: 0,
  },
})((props: CustomMenuProps) => (
  <Menu
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: props.isParent ? 'top' : 'bottom',
      horizontal: 55,
    }}
    transformOrigin={{
      vertical: props.isParent ? 5 : -10,
      horizontal: 0,
    }}
    {...props}
    style={{
      zIndex: 1200,
    }}
  />
));

const NavigationLinkContainer: React.FunctionComponent<
NavigationLinkContainerProps
> = ({ type, currentPath, menu, open, ...rest }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { label } = rest;

  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const isOpen = useSelector((state: ApplicationState) =>
    companySelectors.getNavigationItemStatus(state, label),
  )?.isOpen;
  const [isOpenMenu, setIsOpenMenu] = useState(isOpen);
  const onMouseEnter = (event: React.MouseEvent) => {
    handleClick(event);
  };
  const onMouseLeave = (event: React.MouseEvent) => {
    setAnchorEl(null);
  };
  const onMenuMouseEnter = (event: React.MouseEvent) => {
    setAnchorEl(prevAnchorEl);
  };

  const toggleChildren = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!open) {
      handleClick(event);
    }
    setIsOpenMenu(!isOpenMenu);
    updateNavigationItem(currentEmployeeId, { label, isOpen: !isOpenMenu });
    dispatch(companyActions.updateNavigationMenuItem(label, !isOpenMenu));
  };

  const actionIcon = isOpenMenu ? (
    <ExpandLess onClick={toggleChildren} />
  ) : (
    <ExpandMore onClick={toggleChildren} />
  );

  const childrenList
    = menu?.length === 0 ? null : (
      <Collapse in={isOpenMenu} timeout="auto" unmountOnExit={true}>
        <List disablePadding>
          {menu?.map(
            (ld) =>
              !isMenuType(ld.type) && (
                <NavigationLinkPresenter
                  {...ld}
                  key={ld.path || ld.category}
                  isChild={true}
                  currentPath={currentPath}
                  checkIfItemIsActive={checkIfItemIsActive}
                  open={open}
                />
              ),
          )}
        </List>
      </Collapse>
    );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [prevAnchorEl, setPrevAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const handleClick = (event) => {
    if (anchorEl !== event?.currentTarget) {
      setAnchorEl(event?.currentTarget);
      setPrevAnchorEl(event?.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPrevAnchorEl(null);
  };
  const menuClick = (ld) => {
    handleClose();
    history.push(
      ld.type === NavigationItems.CATEGORY
        ? `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${ld.category}`
        : ld.path,
    );
  };
  const classes = styles({ iconLink: '', open: open, isParent: false });

  const MenuList = menu?.length === 0 ? null : (<div
    onMouseEnter={onMenuMouseEnter}
    onMouseLeave={handleClose}>
    <StyledMenu
      id="parent-navigation-menu"
      anchorEl={anchorEl}
      open={openMenu}
      onClose={handleClose}
      PopoverClasses={{ root: classes.popoverContent, paper: classes.popover }}
      isParent
    >
      <MenuItem
        className={classes.parentMenuItem}
        data-cy={`navigation.${camelCase(label)}`}
        key="parent-navigation-menu-item"
        onClick={() => menuClick({ type, category: rest?.category, path: rest?.path ?? currentPath })}
      >
        {label}
      </MenuItem>
      {menu?.length && <div className={classes.menuDivSeparator} />}
      {menu?.map(
        (ld, index) =>
          !isMenuType(ld.type) && (
            <MenuItem
              onClick={() => menuClick(ld)}
              key={index}
              data-cy={`navigation.${camelCase(ld.label)}`}
              className={classNames(classes.childMenuItems, {
                [classes.otherChildMenus]: !checkIfItemIsActive(
                  ld.type,
                  currentPath,
                  ld.path,
                  ld.category,
                ),
                [classes.childMenuActive]: checkIfItemIsActive(
                  ld.type,
                  currentPath,
                  ld.path,
                  ld.category,
                ),
                [classes.firstChildMenuItem]: index === 0,
                [classes.lastChildMenuItem]: index === menu.length - 1,
              })}
            >
              <span className={classes.childMenuLabel}> {ld.label}</span>
            </MenuItem>
          ),
      )}
    </StyledMenu>
  </div>
  );
  return (
    <React.Fragment>
      <NavigationLinkPresenter
        {...{ type }}
        {...rest}
        menu={menu}
        ActionIcon={menu?.length ? actionIcon : ''}
        toggleChildren={isMenuType(type) ? toggleChildren : undefined}
        currentPath={currentPath}
        checkIfItemIsActive={checkIfItemIsActive}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        open={open}
      />
      {open ? childrenList : MenuList}
    </React.Fragment>
  );
};

export default NavigationLinkContainer;
