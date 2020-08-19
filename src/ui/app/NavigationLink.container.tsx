import { Collapse, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { NavigationItem, NavigationItemType } from "../../state/ducks/company";
import { DOCUMENT_BY_CATEGORY_ROOT_URL } from "../constants/urls";
import NavigationLinkPresenter from "./NavigationLink.presenter";

export interface NavigationLinkContainerProps extends NavigationItem {
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

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isItemActive = checkIfItemIsActive(type, currentPath, rest.path, rest.category, menu);
    setIsOpen(isItemActive);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const toggleChildren = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const actionIcon = isOpen ? <ExpandLess onClick={toggleChildren} /> : <ExpandMore onClick={toggleChildren} />;

  const childrenList = menu?.length === 0 ? null : (
    <Collapse in={isOpen} timeout="auto" unmountOnExit={true}>
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
