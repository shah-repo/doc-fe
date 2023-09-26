import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, FormHelperText, Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import LockIcon from '@material-ui/icons/Lock';
import { includes, isEmpty } from 'lodash';
import { Observer } from 'mobx-react';
import React from 'react';
import { FBFieldName, FBInputProps, FBInputState, FBLabel, FBNotes, FBTextField, FBTooltip } from '..';
import Text from '../../components/Text';
import { CHANGE_CONTROL_OPTIONS_TOOLTIP_MAPPING, SUBSTITUTING_SUPERSEDED_KEY } from '../../document.revision/utils/helpers';
import { Colors } from '../../layout/theme-next';
import { withFBInput } from './FBInput.wrap';
import styles from './styles';

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
  isChangeControlConfigTooltipsEnabled,
  lockOwnerName,
  labelProps,
  index,
}) => {
  const classes = styles();
  const getChangeContolConfigTooltip = () => {
    return (
      name !== SUBSTITUTING_SUPERSEDED_KEY && (
        <Box className={classes.tooltipContainer}>
          <Tooltip
            title={CHANGE_CONTROL_OPTIONS_TOOLTIP_MAPPING[name ?? '']}
            placement="right"
            arrow
          >
            <FontAwesomeIcon
              data-cy={`${name}-tooltip`}
              color={Colors.primary}
              icon={solid('circle-exclamation')}
            />
          </Tooltip>
        </Box>
      )
    );
  };

  return (
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
              {isChangeControlConfigTooltipsEnabled && getChangeContolConfigTooltip()}
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
              {isChangeControlConfigTooltipsEnabled && getChangeContolConfigTooltip()}
            </Box>
          )}

        </Box>
      )}
    </>
  );
};

export default withFBInput(FBInput);
