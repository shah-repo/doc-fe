import { Collapse, List } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";
import React, { ComponentType, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import NavigationLinkPresenter from "./NavigationLink.presenter";

export type LinkType = "LINK" | "MENU";
export interface LinkDefinition {
  Icon?: ComponentType<SvgIconProps>;
  label: string;
  type: LinkType;
  link?: string;
  menu?: LinkDefinition[];
}

export interface NavigationLinkContainerProps extends LinkDefinition {
  currentPath: string;
}

const NavigationLinkContainer: React.FunctionComponent<NavigationLinkContainerProps> = ({
  link,
  label,
  type,
  Icon,
  currentPath,
  menu,
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
      <List>
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
        {...{ link, label, type, Icon }}
        ActionIcon={menu?.length ? actionIcon : ""}
        toggleChildren={type === "MENU" ? toggleChildren : undefined}
      />
      {childrenList}
    </React.Fragment>
  );
};

export default NavigationLinkContainer;
