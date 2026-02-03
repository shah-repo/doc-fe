import { Box, Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import WarningIcon from '@material-ui/icons/Warning';
import { isUndefined } from 'lodash';
import React from 'react';
import { FBInput } from '..';
import { SMText } from '../../../App';
import Dialog from '../../components/dialogs';
import { Autocomplete } from '../../components/forms/fields-next';
import FBBuildTypeChangeApproval from '../FBBuildTypeChangeApproval/FBBuildTypeChangeApproval';
import { FBFontStyle } from '../styles/FBFont.styles';
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
  ...props
}) => {
  return (
    <>
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
          data-cy={`${name}-field`}
          value={defaultValue ?? null}
          getOptionLabel={option => option.displayLabel}
        />
      </FBInput>
      <Dialog
        hideCloseButton
        title="form.builder.build.title"
        open={isDialogOpen}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onCancel={() => onDialogActionClick?.('cancel')}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        onConfirm={() => onDialogActionClick?.('confirm')}
        cancelLabel="common.no.go.back"
        confirmLabel="common.yes.continue"
      >
        <Box display="flex" alignItems="flex-start">
          <Box flexShrink={0} pt={0.5} mr={2}>
            <WarningIcon style={{ width: 24, height: 24 }} />
          </Box>
          <Box flex={1}>
            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
              {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
              <SMText
                label={{
                  locale: 'form.builder.build.production.msg',
                  values: {
                    prod: (defaultValue?.displayLabel ?? ''),
                    rd: (selectedValue?.displayLabel ?? ''),
                  },
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
        <Box mb={3}>
          <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>
            Build Type Switch
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body1">{defaultValue?.displayLabel}</Typography>
            <Box mx={1}>
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
        />
      </Dialog>
    </>
  );
};

export default withFBBuildType(FBBuildType);
