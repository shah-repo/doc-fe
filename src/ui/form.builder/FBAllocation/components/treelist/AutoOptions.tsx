import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { AlertDialog } from '../../../../components/dialogs';
import useDialog from '../../../../hooks/useDialog';
import useHover from '../../../../hooks/useHover';
import Colors from '../../../../layout/theme/utils/colors';
import { FB } from '../../../helpers';
import { AllocationCheckBoxOptions } from './constants';

const styles = makeStyles((theme) => ({
  checkbox: {
    color: Colors.font_gray,
    padding: theme.spacing(0.8),
    '&$checked': {
      color: Colors.navy,
    },
  },
  checked: {
    color: Colors.navy,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontWeight: 400,
    fontSize: 14,
    color: Colors.almost_black,
  },
  icon: {
    height: 17,
    width: 17,
    marginLeft: theme.spacing(0.88),
  },
}));

interface AutoOptionsProps {
  onAutoAssign: (isAutoAssign: boolean) => void
  isDisabled: boolean
  documentRevision: DocumentRevision
}

const AutoOptions: React.FC<AutoOptionsProps> = ({
  onAutoAssign,
  isDisabled,
  documentRevision,
}) => {
  const { formState, workspaceState } = FB.useStores();
  const classes = styles();
  const confirmationDialog = useDialog();
  const [autoAssign, setAutoAssign] = useState<boolean>(
    workspaceState?.formInput?.autoAssign ?? documentRevision?.formInput?.autoAssign ?? false,
  );
  const [tansactIconRef, isHovered] = useHover<HTMLButtonElement>();
  const [autoTransact, setAutoTransact] = useState<boolean>(
    workspaceState?.formInput?.autoTransact ?? documentRevision?.formInput?.autoTransact ?? false,
  );

  const onAutoAssignChange = (value: boolean) => {
    setAutoAssign(value);
    formState?.setFieldValue(AllocationCheckBoxOptions.AUTO_ASSIGN, value);
    onAutoAssign?.(value);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      autoAssign: value,
    });
  };

  const onAutoTransactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoTransact(event.target.checked);
    formState?.setFieldValue(AllocationCheckBoxOptions.AUTO_TRANSACT, event.target.checked);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      autoTransact: event.target.checked,
    });
  };

  const onAutoAssignConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      confirmationDialog.open();
    } else {
      onAutoAssignChange(event.target.checked);
    }
  };

  const onConfirmAlertDialog = () => {
    onAutoAssignChange(true);
    confirmationDialog.close();
  };

  return (
    <>
      <FormControlLabel
        className={classes.checkbox}
        control={
          <Checkbox
            checked={autoAssign}
            classes={{
              root: classes.checkbox,
              checked: classes.checked,
              disabled: classes.disabled,
            }}
            disabled={isDisabled}
            disableRipple
            onChange={onAutoAssignConfirm}
            name="autoAssign"
          />
        }
        label={
          <Typography variant="body2" className={classes.label}>
            {translate('allocation.checkbox.group.option.autoAssign.label')}
          </Typography>
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={autoTransact}
            classes={{
              root: classes.checkbox,
              checked: classes.checked,
              disabled: classes.disabled,
            }}
            disabled={isDisabled}
            disableRipple
            onChange={onAutoTransactChange}
            name="autoTransact"
          />
        }
        label={
          <Typography variant="body2" className={classes.label}>
            {translate('allocation.checkbox.group.option.autoTransact.label')}
            <Tooltip title={translate(
              'allocation.checkbox.group.option.autoTransact.title.message',
            )} placement="right" arrow>
              <span ref={tansactIconRef}>
                <FontAwesomeIcon
                  data-cy="auto-transact-icon"
                  className={classes.icon}
                  color={Colors.navy}
                  icon={isHovered ? solid('circle-exclamation') : regular('circle-exclamation')}
                />
              </span>
            </Tooltip>
          </Typography>
        }
      />
      {confirmationDialog.isOpen && (
        <AlertDialog
          handler={confirmationDialog}
          onConfirm={onConfirmAlertDialog}
          onCancel={confirmationDialog.close}
          title="common.warning"
          confirmLabel="common.yes.continue"
          cancelLabel="common.no.go.back"
          warning
        >
          {translate('allocation.checkbox.group.option.autoAssign.enable.popup.message')}
        </AlertDialog>
      )}
    </>
  );
};
export default AutoOptions;
