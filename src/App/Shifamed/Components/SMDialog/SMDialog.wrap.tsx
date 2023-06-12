import React, { useContext } from 'react';
import { SMDialogAction, SMDialogProps } from '../../..';
import { SMDialogContext } from './SMDialog.hoc';

export const withSMDialogWrap = <T extends SMDialogProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    toggle,
    ...props
  }: T) => {

    // MARK: @config
    const { dialogState } = useContext(SMDialogContext) || {};

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers
    function onDialogActionClick(action: SMDialogAction) {
      props.onDialogActionClick?.(action);
      dialogState?.setOpen?.(false);
    }

    // MARK: @methods
    toggle = () => dialogState?.setOpen?.(!dialogState?.isOpen);

    return (
      <Component
        {...props as T}
        {...{ onDialogActionClick, toggle, dialogState }}
      />
    );
  };

  Comp.displayName = 'withSMDialogWrap';
  return Comp;
};
