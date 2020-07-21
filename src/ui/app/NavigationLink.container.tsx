import { Collapse, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { NavigationItem } from "../../state/ducks/company";
import { DOCUMENT_BY_CATEGORY_ROOT_URL } from "../constants/urls";
import NavigationLinkPresenter from "./NavigationLink.presenter";

export interface NavigationLinkContainerProps extends NavigationItem {
  currentPath: string;
}

const NavigationLinkContainer: React.FunctionComponent<NavigationLinkContainerProps> = ({
  type,
  currentPath,
  menu,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isChildActive = _.includes(menu?.map((link) => link.path), currentPath);
    setIsOpen(isChildActive);
  }, [currentPath, menu]);

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
          ld.type === "LINK" &&
          <NavigationLinkPresenter {...ld} key={ld.path} isChild={true} isActive={currentPath === ld.path} />
        ))}
      </List>
    </Collapse>
  );

  const isLinkActive = (type === "LINK" && currentPath === rest.path)
  || (type === "CATEGORY" && currentPath === `${DOCUMENT_BY_CATEGORY_ROOT_URL}/${rest.category}`);

  return (
    <React.Fragment>
      <NavigationLinkPresenter
        {...{ type }}
        {...rest}
        ActionIcon={menu?.length ? actionIcon : ""}
        toggleChildren={type === "MENU" ? toggleChildren : undefined}
        isActive={isLinkActive}
      />
      {childrenList}
    </React.Fragment>
  );
};

export default NavigationLinkContainer;
