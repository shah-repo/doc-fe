import React from 'react';
import { FB } from '../..';
import { FBPOApprovalMatrixFormActionsProps, POApprovalMatrixLevel } from '../FBPOApprovalMatrix.types';

export const withFBPOApprovalMatrixForm = <T extends FBPOApprovalMatrixFormActionsProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    handleAdd,
    handleCancel,
    ...props
  }: T) => {

    const { dialogState, formState, poamState } = FB.useStores();

    handleAdd = () => {
      const formValues = formState?.getValues();
      poamState?.addItem(formValues as POApprovalMatrixLevel);
      dialogState?.closeDialog();
    };
    handleCancel = () => dialogState?.closeDialog();

    return Component({
      ...(props as T),
      handleAdd,
      handleCancel,
    });
  };

  return (props: T) => Comp(props);
};
