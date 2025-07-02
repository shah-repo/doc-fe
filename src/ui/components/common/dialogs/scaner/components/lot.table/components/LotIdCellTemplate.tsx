import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React, { ChangeEvent } from 'react';
import { translate } from '../../../../../../../../common/intl';
import { DocumentRevision } from '../../../../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../../../forms/fields-next';
import { OptionType } from '../../../../../../forms/fields/Autocomplete/types';
import { EMPTY_VALUE_PLACEHOLDER, Mode, MODE_FIELD } from '../../../../../../KendoDataGrid/constants';
import OverflowTooltip from '../../../../../../OverflowTooltip';
import { CustomTemplateProps, EditableScanLot } from '../types';
import useStyles from './styles';

interface CustomOptionType extends OptionType {
  docId: string
  documentId: string
}

interface Props extends CustomTemplateProps {
  lots: DocumentRevision[]
}

const Editor: React.FC<Props> = ({ field, dataItem, isLoading, lots }) => {
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableScanLot>();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<{}>, value?: CustomOptionType) => {
    console.log('{ id: value?.value, name: value?.docId, documentId: value?.documentId }', {
      id: value?.value,
      name: value?.docId,
      documentId: value?.documentId,
    });
    setFieldValue(field, { id: value?.value, name: value?.docId, documentId: value?.documentId });
  };

  const renderOptions = (): CustomOptionType[] => {
    if (!lots) {
      return [];
    }

    return lots.map((lot) => ({
      label: `${lot.document.docId} Rev ${lot?.displayRevision ?? ''} - ${lot?.name ?? ''}`.trim(),
      value: lot.id,
      docId: lot.document?.docId,
      documentId: lot.document?.id,
    }));
  };

  const value = renderOptions()?.find((option) => option.value === values[field]?.id);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(values) || isLoading ? 'disabled' : 'enabled'}
        classes={{ option: classes.option }}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={renderOptions()}
        data-cy="lot-id-field"
        value={value}
        disabled={isUpdateAction}
        getOptionLabel={(option) => option?.label ?? ''}
        onChange={handleChange}
        loading={isLoading}
        size="small"
      />
    </FormikField>
  );
};

export const LotIdCellTemplate: React.FC<Props> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const value = dataItem[field];
  const displayValue = value?.name || EMPTY_VALUE_PLACEHOLDER;
  const dataCy = `${kebabCase(field)}-cell`;

  return (
    <OverflowTooltip title={displayValue} placement="top" interactive arrow onClick={handleClick} data-cy={dataCy}>
      {displayValue}
    </OverflowTooltip>
  );
};
