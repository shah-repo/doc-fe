import React from 'react';
import { FB, FBControlPicker, FBStarterProps } from '..';
import SM from '../../../App/Shifamed/Utils/SM/SM';

export const withFBStarter = <T extends FBStarterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    ...props
  }: T) => {

    const { dialogState, leftPanelState } = FB.useStores();
    const { _documentRevisionFormState, _tabsState } = SM.useStores();
    const isNewLayout = SM.isNewLayout;

    onClick = (index?: number) => {
      if (!_documentRevisionFormState?.leftPanelOpen) { _documentRevisionFormState?.setLeftPanelOpen(); }
      _documentRevisionFormState?.setTabIdForSchemaAddition(_tabsState?.activeTabId || '');
      if (leftPanelState) {
        leftPanelState.setIndex(index || 0);
        leftPanelState.config({
          open: true,
          showLeftPanelEditor: false,
          maxWidth: 'sm',
          content: <FBControlPicker {...{ index }} />,
        });
      } else {
      dialogState?.config({
        open: true,
        maxWidth: 'sm',
        content: <FBControlPicker {...{ index }} />,
      });
      }
    };

    return Component({
      ...(props as T),
      isNewLayout,
      onClick,
    });

  };

  return (props: T) => Comp(props);
};
