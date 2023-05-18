import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import {
  ChangeRequestTransition,
} from '../../../state/ducks/changeRequest/types';
import { AsyncState } from '../../../state/types';
import {
  EffectiveDateFormValues, PasswordFormValues,
} from '../../change.request/form/types';
import TransitionDialog from '../../dashboard.new/line.items/dialogs/transitionDialog/TransitionDialog';
import { DialogHandler } from '../../hooks/useDialog';

interface Props {
  transition: ChangeRequestTransition;
  buttonProps?: ButtonProps;
  asyncState: AsyncState;
  arId?: string;
  title?: string;
  label: string;
  transitionDialog: DialogHandler;
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues ) => void;
  onSuccess?: () => void;
}
const ApproveDialogueContainer: React.FunctionComponent<Props> = ({
  arId,
  title,
  transition,
  buttonProps,
  label,
  transitionDialog,
  onSubmit,
  onSuccess,
  asyncState,
}) => (
  <TransitionDialog
    onSubmit={onSubmit}
    asyncState={asyncState}
    buttonProps={buttonProps}
    transition={transition}
    arId={arId}
    title={title}
    label={label}
    hideLabel={true}
    {...{
      transitionDialog,
    }}
  />
);

export default ApproveDialogueContainer;
