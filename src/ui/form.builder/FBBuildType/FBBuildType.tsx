import { Box, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { isUndefined } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FBButton, FBDialog, FBInput, FBProvider } from '..';
import { translate } from '../../../common/intl';
import Dialog from '../../components/dialogs';
import { Autocomplete } from '../../components/forms/fields-next';
import FBBuildTypeChangeApproval from '../FBBuildTypeChangeApproval/FBBuildTypeChangeApproval';
import { StyledCancelFBButton } from '../FBButton/StyledCancelFBButton';
import { FBFontStyle } from '../styles/FBFont.styles';
import useStyles from './FBBuildType.styles';
import { FBBuildTypeProps } from './FBBuildType.types';
import { withFBBuildType } from './FBBuildType.wrap';

const FBBuildType: React.FunctionComponent<FBBuildTypeProps> = ({
  selectedValue,
  defaultValue,
  options = [],
  isDialogOpen = false,
  isApprovalDialogOpen = false,
  onChange,
  onDialogActionClick,
  onApprovalDialogActionClick,
  refresh,
  isDisabled,
  name,
  documentStatus,
  approvalTransition,
  showApprovalButtons = false,
  onApprovalAction,
  dialogState,
  prevValue,
  allowedBuildTypeChange,
  lhrBuildTypeSwitchConfigApproval,
  submitApproversRef,
  validateApproversRef,
  ...props
}) => {
  const classes = useStyles();
  return (
    <FBProvider {...{ dialogState }}>
      <FBDialog />
      <FBInput
        {...props}
        {...{ defaultValue, showErrorMsg: isUndefined(defaultValue) }}
        type="autocomplete"
        name={name}
        disabled={isDisabled}
        labelProps={FBFontStyle.labelProps}
      >
        <Autocomplete
          key={refresh ? 'enable' : 'disable'}
          error={false}
          blurOnSelect
          disableClearable
          options={options}
          onInputChange={onChange}
          onChange={onChange}
          getOptionDisabled={(option) => {
            if ((lhrBuildTypeSwitchConfigApproval && lhrBuildTypeSwitchConfigApproval?.length === 0) || (!defaultValue && !allowedBuildTypeChange?.includes(option.id)) || allowedBuildTypeChange?.includes(option.id)) {
              return false;
            }
            return true;
          }}
          data-cy={`${name}-field`}
          value={defaultValue ?? null}
          getOptionLabel={option => option.displayLabel}
        />
      </FBInput>
      {showApprovalButtons && (
        <Box className={classes.approvalButtonsContainer}>
          <StyledCancelFBButton
            label="form.builder.reject.change"
            size="medium"
            onClick={() => onApprovalAction?.('reject')}
            data-cy="build-type-reject-change-button"
          />
          <FBButton
            label="form.builder.accept.change"
            size="medium"
            onClick={() => onApprovalAction?.('accept')}
            data-cy="build-type-accept-change-button"
          />
        </Box>
      )}
      <Dialog
        hideCloseButton
        open={isDialogOpen}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onCancel={() => onDialogActionClick?.('cancel')}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onConfirm={() => onDialogActionClick?.('confirm')}
        cancelLabel="common.no.go.back"
        confirmLabel="common.yes.continue"
      >
        <Box className={classes.warningContainer}>
          <Box className={classes.warningIconContainer}>
            <ErrorOutlineIcon className={classes.warningIcon} />
          </Box>
          <Box className={classes.messageContainer}>
            <Typography variant="h4" className={classes.warningText}>
              {translate('common.warning')}
            </Typography>
            <Typography variant="body2" className={classes.messageText}>
              <FormattedMessage
                id="form.builder.build.type.header.msg"
                values={{
                  buildTypeOld: <strong>{defaultValue?.displayLabel ?? ''}</strong>,
                  buildTypeNew: <strong>{selectedValue?.displayLabel ?? ''}</strong>,
                }}
              />
            </Typography>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        hideCloseButton
        title="form.builder.add.approvers"
        open={isApprovalDialogOpen}
        maxWidth="md"
        fullWidth
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onCancel={() => onApprovalDialogActionClick?.('cancel')}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onConfirm={() => onApprovalDialogActionClick?.('confirm')}
        cancelLabel="common.cancel"
        confirmLabel="form.builder.send.for.approval"
      >
        <Box className={classes.buildTypeSwitchHeader}>
          <Typography variant="h6" className={classes.buildTypeSwitchTitle}>
            Build Type Switch
          </Typography>
          <Box className={classes.buildTypeSwitchValues}>
            <Typography variant="body1">{defaultValue?.displayLabel}</Typography>
            <Box className={classes.buildTypeArrow}>
              <ArrowRightAltIcon />
            </Box>
            <Typography variant="body1">{selectedValue?.displayLabel}</Typography>
          </Box>
        </Box>
        <FBBuildTypeChangeApproval
          name="buildTypeApprovals"
          label="form.builder.approvers"
          documentStatus={documentStatus}
          approvalTransition={approvalTransition}
          selectedValue={selectedValue}
          prevValue={prevValue}
          submitRef={submitApproversRef}
          validateRef={validateApproversRef}
        />
      </Dialog>
    </FBProvider>
  );
};

export default withFBBuildType(FBBuildType);
