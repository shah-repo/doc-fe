import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
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
    console.log({ value });
    formik.setFieldValue('lifecyclePhaseId', []);
    formik.handleChange(event);
  };

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <SelectField
        name="lifecyclePhaseId"
        label={label}
        selectProps={{
          inputProps: { id: 'lifecyclePhaseId', disabled: !lifecyclePhaseOptions.length },
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
