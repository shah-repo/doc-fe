import React from 'react';
import { FB, FBApprovalPasswordFormActions, FBFormState, FBInlineApprovalTransition } from '..';
import { FBApprovalPasswordFormProps } from './FBApprovalPasswordForm.types';

export const withFBApprovalPasswordForm = (
  Component: React.FunctionComponent<FBApprovalPasswordFormProps>,
) => {
  const Comp = ({
    approvalTransition,
    approvalId,
    transition = 'approve' as FBInlineApprovalTransition,
    ...props
  }) => {
    const { dialogState } = FB.useStores();
    const formState = FB.useRef(FBFormState, {});

    const onDialogClose = () => {
      dialogState?.closeDialog();
      formState?.setFieldValue('password', null);
    };

    const onDialogApprove = () => {
      const password = formState?.getFieldValue('password');
      approvalTransition?.(transition, approvalId, password, null, true);
      onDialogClose();
    };

    const onDialogReject = () => {
      const comment = formState?.getFieldValue('comment');
      approvalTransition?.(transition, approvalId, null, comment, true);
      onDialogClose();
    };

    const objectToPass: any = { onDialogClose };
    if (transition === 'approve') {
      objectToPass.onDialogApprove = onDialogApprove;
    } else if (transition === 'reject') {
      objectToPass.onDialogReject = onDialogReject;
    }

    React.useEffect(() => {
      dialogState?.setActions(
        <FBApprovalPasswordFormActions {...objectToPass} />,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return Component({
      ...(props),
      formState,
      transition,
    });
  };
  Comp.displayName = 'withFBApprovalPasswordForm';
  return Comp;
};
