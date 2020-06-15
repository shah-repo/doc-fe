import { Collapse, List } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";
import React, { ComponentType, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import NavigationLinkPresenter from "./NavigationLink.presenter";

export interface LinkDefinition {
  url: string;
  text: string;
  Icon?: ComponentType<SvgIconProps>;
}

export interface NavigationLinkContainerProps extends LinkDefinition {
  childrenUrls?: LinkDefinition[];
  currentPath: string;
}

const NavigationLinkContainer: React.FunctionComponent<NavigationLinkContainerProps> =
  ({ url, text, Icon, childrenUrls = [], currentPath, ...otherProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      const isChildActive = _.includes(childrenUrls.map((link) => link.url), currentPath);
      setIsOpen(isChildActive);
    }, [currentPath, childrenUrls]);

    const toggleChildren = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(!isOpen);
    };

    const actionIcon = isOpen ? <ExpandLess onClick={toggleChildren} /> : <ExpandMore onClick={toggleChildren} />;

    const childrenList = childrenUrls.length === 0 ? null : (
      <Collapse in={isOpen} timeout="auto" unmountOnExit={true}>
        <List>
          {childrenUrls.map((ld) => <NavigationLinkPresenter {...ld} key={ld.url} isChild={true} />)}
        </List>
      </Collapse>
    );

    return (
      <React.Fragment>
        <NavigationLinkPresenter url={url} text={text} Icon={Icon} ActionIcon={childrenUrls.length ? actionIcon : ""} {...otherProps}/>
        {childrenList}
      </React.Fragment>
    );
  };

export default NavigationLinkContainer;
