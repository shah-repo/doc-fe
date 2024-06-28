import { MenuItem } from '@material-ui/core';
import { at, filter, isUndefined, map } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBContextMenuProps, FBContextMenuState } from '..';
import Text from '../../components/Text';

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
    menuId,
    ...props
  }: T) => {
    contextMenuState = FB.useRef<FBContextMenuState>(FBContextMenuState);

    menuItems = filter(menuItems, (menuItem) => !menuItem.hidden);
    menuItems && (menuEls = map(menuItems, (menuItem, index) => {
      const [message, values, onClick] = at(menuItem, ['text', 'textValues', 'onClick']);
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <MenuItem key={`fb-context-menu-item-${menuId}-${index}`} {...{ onClick }}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
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
