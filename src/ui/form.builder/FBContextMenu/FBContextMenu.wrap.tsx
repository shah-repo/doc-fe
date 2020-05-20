import { MenuItem } from "@material-ui/core";
import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBContextMenuProps, FBContextMenuState } from ".";
import { FB } from "..";
import Text from "../../components/Text";

export const withFBContextMenu = <T extends FBContextMenuProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    contextMenuState,
    open = false,
    anchorPosition,
    onContextMenu,
    onClose,
    menuItems,
    menuEls,
    ...props
  }: T) => {

    contextMenuState = FB.useRef<FBContextMenuState>(FBContextMenuState);
    open = !_.isUndefined(contextMenuState.mouseY);

    menuItems = _.filter(menuItems, (menuItem) => !menuItem.hidden);
    menuItems && (menuEls = _.map(menuItems, (menuItem, index) => {
      const [message, values, onClick] = _.at(menuItem, ["text", "textValues", "onClick"]);
      return (
        <MenuItem key={`fb-context-menu-item-${index}`} {...{ onClick }}>
          <Text {...{ message, values }} />
        </MenuItem>
      );
    }));

    onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      contextMenuState?.setPosition(
        event.clientY - 4,
        event.clientX - 2,
      );
    };

    onClose = () => contextMenuState?.setPosition();

    return useObserver(() => Component({
      ...(props as T),
      open,
      onContextMenu,
      onClose,
      anchorPosition: contextMenuState?.anchorPosition,
      menuEls,
    }));
  };

  return (props: T) => Comp(props);
};
