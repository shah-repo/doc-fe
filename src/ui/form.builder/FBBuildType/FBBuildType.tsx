import { Box, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { isUndefined } from 'lodash';
import React from 'react';
import { FBInput } from '..';
import { SMText } from '../../../App';
import Dialog from '../../components/dialogs';
import { Autocomplete } from '../../components/forms/fields-next';
import { FBFontStyle } from '../styles/FBFont.styles';
import { FBBuildTypeProps } from './FBBuildType.types';
import { withFBBuildType } from './FBBuildType.wrap';

const FBBuildType: React.FunctionComponent<FBBuildTypeProps> = ({
  selectedValue,
  defaultValue,
  options = [],
  isDialogOpen = false,
  onChange,
  onDialogActionClick,
  refresh,
  isDisabled,
  name,
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
    </>
  );
};

export default withFBBuildType(FBBuildType);
