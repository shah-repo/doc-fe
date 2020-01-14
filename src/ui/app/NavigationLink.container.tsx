import { Collapse, List } from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { css } from "glamor";
import _ from "lodash";
import React, { ComponentType, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IotService } from "../../common/utils/iot/mqttClient";
import { Translation } from "../translations/types";
import NavigationLinkPresenter from "./NavigationLink.presenter";
import ToastMessage from "./ToastMessage";

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

    const notify = (msg: string) => {
      const message = JSON.parse(msg).data.message;
      toast(<ToastMessage message={message} />, {
        className: css({
          background: "#eee !important",
          color: "#333 !important",
          borderRadius: "10px !important",
          boxShadow: "0 1px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 15px 0 rgba(0, 0, 0, 0.2) !important",
        }),
      },
      );
    };

    const manageSubscriptionsOnNavigation = () => {
      const iotService = IotService.getInstance();
      switch (currentPath) {
        case "/":
          iotService.unsubscribeAll();
          iotService.subscribeToTopic(`+/training_records/+/created`, notify);
          iotService.subscribeToTopic(`+/training_records/+/updated`, notify);
          iotService.subscribeToTopic(`+/implementation_plan_task/+/created`, notify);
          iotService.subscribeToTopic(`+/implementation_plan_task/+/updated`, notify);
          return;
        case "/document_revision":
          iotService.unsubscribeAll();
          return;
        case "/change_request":
          iotService.unsubscribeAll();
          iotService.subscribeToTopic(`+/change_requests/+/created`, notify);
          return;
      }
    };
    useEffect(() => {
      manageSubscriptionsOnNavigation();
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
