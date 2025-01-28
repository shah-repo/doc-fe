import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableShippingItem, PartOption } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  loading: boolean
  options: PartOption[]
}

interface CustomOptionType extends OptionType {
  revision: string
  docId: string
  documentId: string
}

const Editor: React.FC<Props> = ({ dataItem, field, options, loading }) => {
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableShippingItem>();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];

  const onChange = (event: React.ChangeEvent<{}>, value: CustomOptionType) => {
    setFieldValue(field, { id: value?.value, name: `${value?.docId}.${value.revision}`, documentId: value?.documentId });
  };

  const renderOptions = (): CustomOptionType[] => {
    return options.map((item) => ({
      label: `${item.document?.docId} Rev ${item?.displayRevision ?? ''} - ${item?.name ?? ''}`.trim(),
      docId: item.document?.docId,
      revision: item?.displayRevision,
      value: item.id,
      documentId: item.document?.id,
    }));
  };

  const value = renderOptions()?.find(option => option.value === values[field]?.id);

  return (
    <FormikField name={field}>
      <Autocomplete
        blurOnSelect
        {...getFieldProps(field)}
        key={isEmpty(values) ? 'disabled' : 'enabled'}
        options={renderOptions()}
        disableClearable
        placeholder={translate('common.select')}
        disabled={isUpdateAction}
        onChange={onChange}
        value={value}
        data-cy="item-id-field"
        getOptionLabel={(option: OptionType) => option.label ?? ''}
        size="small"
        loading={loading}
      />
    </FormikField>
  );
};

export const ItemIDcell: React.FC<Props> = (props) => {
  const classes = styles();
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const value = dataItem[field] as EditableShippingItem['part'];
  const displayValue = value?.name ?? EMPTY_VALUE_PLACEHOLDER;
  const linkPath = (!isEmpty(value) && value?.documentId) ? documentVersionPath(value?.id, value?.documentId) : undefined;
  const dataCy = `${kebabCase(field)}-cell`;

  return (
    <OverflowTooltip
      title={displayValue}
      placement="top"
      interactive
      arrow
      onClick={handleClick}
      data-cy={dataCy}
    >
      {linkPath ? <Link target="_blank" to={linkPath} onClick={(e: MouseEvent) => e.stopPropagation()} className={classes.link} >{displayValue}</Link> : displayValue}
    </OverflowTooltip>
  );
};
