import { Collapse, List } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import NavigationLinkPresenter from "./NavigationLink.presenter";

export type LinkType = "LINK" | "MENU";
export interface LinkDefinition {
  label: string;
  type: LinkType;
  link?: string;
  menu?: LinkDefinition[];
  icon?: string;
}

export interface NavigationLinkContainerProps extends LinkDefinition {
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
    const isChildActive = _.includes(menu?.map((link) => link.link), currentPath);
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
          <NavigationLinkPresenter {...ld} key={ld.link} isChild={true} />
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
      />
      {childrenList}
    </React.Fragment>
  );
};

export default NavigationLinkContainer;
