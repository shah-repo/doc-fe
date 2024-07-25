import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, InputLabel, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import { companyActions } from '../../../../state/ducks/company';
import { TooltipLabelConfig } from '../../../../state/ducks/documentRevisions/documentType/types';
import { LCPDocRevOptions } from '../../../administration/general.settings/panels/LCP/components/Grid/types';
import SelectField from '../../../components/forms/fields/Select';
import { toastError } from '../../../components/notifications';
import { styles as FBAutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { styles } from './styles/DocIdInput.styles';

interface Props {
  isDocRevStatusDraft: boolean
  isDisabled: boolean
  label?: string
  docTypeId?: string
  lifecyclePhaseId?: string
  tooltipConfig?: TooltipLabelConfig
}

// const LifecyclePhaseOptions = [
//   { value: 'Concept', text: 'Concept' },
//   { value: 'Design', text: 'Design' },
//   { value: 'Development', text: 'Development' },
//   { value: 'Production', text: 'Production' },
//   { value: 'Support & Service', text: 'Support & Service' },
//   { value: 'Retirement', text: 'Retirement' },
// ];

const LifecyclePhaseSelect: React.FunctionComponent<Props> = ({
  isDocRevStatusDraft,
  isDisabled = false,
  docTypeId = '',
  lifecyclePhaseId,
  label = 'common.lifecycle.phase',
  tooltipConfig = {},
}) => {
  const classes = styles();
  const formik = useFormikContext();
  const [lifecyclePhaseOptions, setLifecyclePhaseOptions] = useState<Array<{value: string, text: string}>>([]);
  const fetchDocRevOptions = useActionCreator(companyActions.fetchDocRevOptionsByDocTypeId);

  const fetchLCPDocTypesAsync = useAsync({
    onSuccess: (data?: LCPDocRevOptions[]) => {
      setLifecyclePhaseOptions(data?.map((docType) => { return { value: docType.id, text: docType.displayLabel }; }) ?? []);
    },
    onError: toastError,
  });

  useEffect(() => {
    console.log('docTypeId :', docTypeId);
    console.log('lifecyclePhaseId :', lifecyclePhaseId);
    console.log('values,', formik?.values);
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
    console.log({ value }, formik?.values);
    formik.setFieldValue('lifecyclePhaseId', value);
    formik.handleChange(event);
  };

  const CustomLabel = () => {
    return (
      <Box display="flex" alignItems="center">
        <Typography variant="body1" style={{ marginRight: 4 }} >
          {translate(label)}
        </Typography>
        <FontAwesomeIcon icon={regular('circle-info')} />
      </Box>
    );
  };

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <InputLabel id="custom-select-label">{CustomLabel()}</InputLabel>
      <SelectField
        name="lifecyclePhaseId"
        selectProps={{
          inputProps: { labelId: 'custom-select-label', disabled: !lifecyclePhaseOptions.length },
          disabled: !lifecyclePhaseOptions.length,
          onChange: handleTypeChange,
        }}
        options={lifecyclePhaseOptions}
        includeEmpty={false}
        inputStyleProps={classes.input}
        labelProps={FBAutoCompleteStyles.labelStyle}
      />
    </CustomLabelTooltip>
  );
};

export default LifecyclePhaseSelect;
