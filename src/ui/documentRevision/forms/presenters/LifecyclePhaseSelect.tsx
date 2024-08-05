import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, InputLabel, Tooltip, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import { companyActions } from '../../../../state/ducks/company';
import { LCPDocRevOptions } from '../../../administration/general.settings/panels/LCP/components/Grid/types';
import SelectField from '../../../components/forms/fields/Select';
import { toastError } from '../../../components/notifications';
import { styles as FBAutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { styles } from './LifecyclePhaseSelect.style';

interface Props {
  docTypeId?: string
  lifecyclePhaseId?: string
  isOptionDisabled?: boolean
}

const LifecyclePhaseSelect: React.FunctionComponent<Props> = ({
  docTypeId = '',
  lifecyclePhaseId,
  isOptionDisabled,
}) => {
  const classes = styles();
  const formik = useFormikContext();
  const [lifecyclePhaseOptions, setLifecyclePhaseOptions] = useState<Array<{value: string, text: string}>>([]);
  const fetchDocRevOptions = useActionCreator(companyActions.fetchDocRevOptionsByDocTypeId);

  const fetchLCPDocTypesAsync = useAsync({
    onSuccess: (data: LCPDocRevOptions[] = []) => {
      setLifecyclePhaseOptions(data.map((docType) => ({ value: docType.id, text: docType.displayLabel })));
    },
    onError: toastError,
  });

  const isDisabled = !lifecyclePhaseOptions.length && !fetchLCPDocTypesAsync.isLoading;

  useEffect(() => {
    fetchLCPDocTypesAsync.start(
      fetchDocRevOptions,
      docTypeId,
      lifecyclePhaseId ?? undefined,
      fetchLCPDocTypesAsync,
    );
  }, []);

  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string, value: unknown }>,
  ) => {
    const value = event.target.value as string;
    formik.setFieldValue('lifecyclePhaseId', value);
    formik.handleChange(event);
  };

  return (
    <>
      <InputLabel id="life-cycle-phases-label">
        <Box display="flex" alignItems="center">
          <Typography variant="body1" className={classes.labelStyle} >
            {translate('common.lifecycle.phase')}
          </Typography>
          <Tooltip
            arrow
            placement="top"
            title={translate('documentRevision.lcp.configuration.empty')}
            className={classes.labelStyle}
            hidden={!isDisabled}
          >
            <FontAwesomeIcon className={classes.infoIcon} icon={regular('circle-info')} />
          </Tooltip>
        </Box>
      </InputLabel>
      <SelectField
        name="lifecyclePhaseId"
        selectProps={{
          inputProps: {
            labelId: 'life-cycle-phases-label',
            disabled: isDisabled,
          },
          disabled: isDisabled,
          onChange: handleTypeChange,
        }}
        options={lifecyclePhaseOptions}
        includeEmpty={false}
        inputStyleProps={classes.input}
        labelProps={FBAutoCompleteStyles.labelStyle}
      />
    </>
  );
};

export default LifecyclePhaseSelect;
