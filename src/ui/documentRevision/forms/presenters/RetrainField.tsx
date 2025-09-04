import { Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { translate } from '../../../../common/intl';
import { RevisionChangeType } from '../../../../state/ducks/documentRevisions/types';
import CheckboxField from '../../../components/forms/fields/Checkbox';
import { useTraining } from '../../../hooks/docCustomization/useCustomization';

interface Props {
  revisionChangeType?: RevisionChangeType
  documentTypeId?: string
  isDisabled?: boolean
  isRecord?: boolean
}

const RetrainField: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  revisionChangeType,
  isDisabled = false,
  isRecord,
}) => {
  const { isVisible } = useTraining(documentTypeId);
  const formik = useFormikContext();
  useEffect(() => {
    if (revisionChangeType === RevisionChangeType.AdministrativeChange) {
      formik.setFieldValue('retrain', false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionChangeType]);

  if (!isVisible || isRecord) {
    return null;
  }

  const isAdminChange = revisionChangeType === RevisionChangeType.AdministrativeChange;
  const disabled = isAdminChange || isDisabled;

  const checkbox = (
    <CheckboxField
      name="retrain"
      label="document.revision.trainingRequired"
      checkboxProps={{ disabled }}
    />
  );

  if(isAdminChange) {
    return (
      <Tooltip title={translate('training.required.tooltip.message')} placement="bottom-start">
        <span>{checkbox}</span>
      </Tooltip>
    );
  }

  return checkbox;
};

export default React.memo(RetrainField);
