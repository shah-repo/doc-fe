import { Collapse, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { authSelectors } from "../../state/ducks/auth";
import { companyActions, companySelectors } from "../../state/ducks/company";
import { NavigationItem, NavigationItemType } from "../../state/ducks/company/types";
import { ApplicationState } from "../../state/reducers";
import { DOCUMENT_BY_CATEGORY_ROOT_URL } from "../constants/urls";
import NavigationLinkPresenter from "./NavigationLink.presenter";
import { updateNavigationItem } from "./NavigationLocalStorageHelpers";

interface NavigationLinkContainerProps extends NavigationItem {
  currentPath: string;
}

const checkIfItemIsActive = (
  type: NavigationItemType,
  currentPath: string,
  path?: string,
  category?: string,
  menu?: NavigationItem[],
): boolean => {
  switch (type) {
    case "LINK":
      return currentPath === path;
    case "CATEGORY":
      return currentPath === `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${category}`;
    case "MENU":
      return menu?.some((item) => checkIfItemIsActive(item.type, currentPath, item.path, item.category)) || false;
    default:
      return false;
  }
};

const NavigationLinkContainer: React.FunctionComponent<NavigationLinkContainerProps> = ({
  type,
  currentPath,
  menu,
  ...rest
}) => {
  const dispatch = useDispatch();
  const { label } = rest;

  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const isOpen = useSelector((state: ApplicationState) =>
    companySelectors.getNavigationItemStatus(state, label))?.isOpen;

  const [isOpenMenu, setIsOpenMenu] = useState(isOpen);

  const toggleChildren = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpenMenu(!isOpenMenu);
    updateNavigationItem(currentEmployeeId, { label, isOpen: !isOpenMenu });
    dispatch(companyActions.updateNavigationMenuItem(label, !isOpenMenu));
  };

  const actionIcon = isOpenMenu ? <ExpandLess onClick={toggleChildren} /> : <ExpandMore onClick={toggleChildren} />;

  const childrenList = menu?.length === 0 ? null : (
    <Collapse in={isOpenMenu} timeout="auto" unmountOnExit={true}>
      <List disablePadding>
        {menu?.map((ld) => (
          ld.type !== "MENU" &&
          <NavigationLinkPresenter
            {...ld}
            key={ld.path || ld.category}
            isChild={true}
            currentPath={currentPath}
            checkIfItemIsActive={checkIfItemIsActive}
          />
        ))}
      </List>
    </Collapse>
  );
  return (
    <React.Fragment>
      <NavigationLinkPresenter
        {...{ type }}
        {...rest}
        ActionIcon={menu?.length ? actionIcon : ""}
        toggleChildren={type === "MENU" ? toggleChildren : undefined}
        currentPath={currentPath}
        checkIfItemIsActive={checkIfItemIsActive}
      />
      {childrenList}
    </React.Fragment>
  );
};

export default NavigationLinkContainer;
