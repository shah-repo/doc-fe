import { FormControl, FormHelperText } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import LockIcon from '@material-ui/icons/Lock';
import { includes, isEmpty } from 'lodash';
import { Observer } from 'mobx-react';
import React from 'react';
import { FBFieldName, FBInputProps, FBInputState, FBLabel, FBNotes, FBTextField, FBTooltip } from '..';
import Text from '../../components/Text';
import { withFBInput } from './FBInput.wrap';

const FBInput: React.FunctionComponent<FBInputProps> = ({
  formState,
  inputState,
  label,
  error,
  gutter = true,
  showErrorMsg = true,
  children,
  helperText = '',
  disabled,
  includeContext,
  boxProps,
  loading,
  type,
  hidden,
  name,
  includeNotes,
  isOutput,
  lockOwnerName,
  labelProps,
  index,
}) => (
  <>
    {!hidden && (
      <Box mb={gutter ? 1.875 : 0} {...boxProps} data-cy={`${type}-${index}`}>
        <Observer>
          {() => (
            <>{inputState?.includeNotes && <FBNotes {...{ name }} />}</>
          )}
        </Observer>

        <FormControl fullWidth {...{ error }} >
          <Box display="flex" flexDirection="row">
            <Observer>
              {() => (
                <>
                  {formState?.locked.get(name || '')?.locked && (
                    <FBTooltip title={lockOwnerName}>
                      <Box mt={-0.5} pr={0.5}>
                        <LockIcon fontSize="small" color="error" style={{ float: 'right' }} />
                      </Box>
                    </FBTooltip>
                  )}
                </>
              )}
            </Observer>
            {!includes(FBInputState.omitLabel, type) && label && (
              <FBLabel {...{ error, label, loading, labelProps }} />
            )}
          </Box>

          {children}
        </FormControl>

        {!isEmpty(helperText) && showErrorMsg && !disabled && (
          <FormHelperText {...{ error }}>
            <Text message={helperText as string} />
          </FormHelperText>
        )}
        {Boolean(includeContext) && (
          <Box mt={type === 'select' ? 3 : 0.5}>
            <FBTextField
              label="form.builder.note"
              {...{ disabled }}
              name={`${FBFieldName.Context}-${name}`}
              autosave
            />
          </Box>
        )}

      </Box>
    )}
  </>
);

export default withFBInput(FBInput);
