import { Collapse, List } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import _ from "lodash";
import React, { ComponentType, useEffect, useState } from "react";
import { Translation } from "../translations/types";
import { IotService } from "../../common/utils/iot/mqttClient";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationLinkPresenter from "./NavigationLink.presenter";

export interface LinkDefinition {
  url: string;
  text: Translation;
  Icon?: ComponentType<SvgIconProps>;
}

export interface NavigationLinkContainerProps extends LinkDefinition {
  childrenUrls?: LinkDefinition[];
  currentPath: string;
}

const NavigationLinkContainer: React.FunctionComponent<NavigationLinkContainerProps> =
  ({ url, text, Icon, childrenUrls = [], currentPath }) => {
    const isChildActive = () => _.includes(childrenUrls.map((link) => link.url), currentPath);
    const [isOpen, setIsOpen] = useState(isChildActive());

    toast.configure({
      autoClose: false,
    });

    const notify = (msg:string) => {
      const message = JSON.parse(msg).data.message;
      toast(message);
    }

    const manageSubscriptionsOnNavigation = () => {
      const iotService = new IotService();
      switch (currentPath) {
        case "/":
          iotService.unsubscribeAll();
          return;
        case "/document_revision":
          iotService.unsubscribeAll();
          return;
        case "/change_request":
          iotService.unsubscribeAll();
          iotService.subscribeToTopic(`change_requests/created`, notify);
          return;
      }
    }
    manageSubscriptionsOnNavigation();
    useEffect(() => {
      if (isChildActive()) {
        setIsOpen(true);
      }
    }, [currentPath]);

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
        <NavigationLinkPresenter url={url} text={text} Icon={Icon} ActionIcon={childrenUrls.length ? actionIcon : ""} />
        {childrenList}
      </React.Fragment>
    );
  };

export default NavigationLinkContainer;
