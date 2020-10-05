import { MenuItem } from "@material-ui/core";
import { at, filter, isUndefined, map } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBContextMenuProps, FBContextMenuState } from ".";
import { FB } from "..";
import Text from "../../components/Text";

export const withFBContextMenu = <T extends FBContextMenuProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onContextMenu,
    onClose,
    onBlur,
    contextMenuState,
    anchorPosition,
    open = false,
    menuItems,
    menuEls,
    ...props
  }: T) => {

    contextMenuState = FB.useRef<FBContextMenuState>(FBContextMenuState);

    menuItems = filter(menuItems, (menuItem) => !menuItem.hidden);
    menuItems && (menuEls = map(menuItems, (menuItem, index) => {
      const [message, values, onClick] = at(menuItem, ["text", "textValues", "onClick"]);
      return (
        <MenuItem key={`fb-context-menu-item-${index}`} {...{ onClick }}>
          <Text {...{ message, values }} />
        </MenuItem>
      );
    }));

    onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      contextMenuState?.setPosition(
        event.clientY - 4,
        event.clientX - 2,
      );
    };

    onClose = () => contextMenuState?.setPosition();
    onBlur = onClose;

    useObserver(() => {
      anchorPosition = contextMenuState?.anchorPosition;
      open = !isUndefined(contextMenuState?.mouseY);
    });

    return Component({
      ...(props as T),
      onContextMenu,
      onClose,
      onBlur,
      anchorPosition,
      open,
      menuEls,
    });
  };

  return (props: T) => Comp(props);
};
