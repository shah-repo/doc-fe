import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
// import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableASN } from '../../types';
import { styles as useStyles } from './styles';

interface Props extends CustomTemplateProps {
  isLoading: boolean
  options: DocumentRevision[]
}

interface CustomOptionType extends OptionType {
  docId: string
  documentId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, options, isLoading }) => {
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableASN>();
  const classes = useStyles();

  const handleChange = (event: ChangeEvent<{}>, value?: CustomOptionType) => {
    setFieldValue(field, { id: value?.value, name: value?.docId, documentId: value?.documentId });
  };

  const renderOptions = (): CustomOptionType[] => {
    return options.map((lot) => ({
      label: `${lot.document.docId} Rev ${lot?.displayRevision ?? ''} - ${lot?.name ?? ''}`.trim(),
      value: lot.id,
      docId: lot.document?.docId,
      documentId: lot.document?.id,
    }));
  };

  const value = renderOptions()?.find(option => option.value === values[field]);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={(isEmpty(values) || isLoading) ? 'disabled' : 'enabled'}
        classes={{ option: classes.option }}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={renderOptions()}
        data-cy="lot-id-field"
        value={value}
        getOptionLabel={(option) => option?.label ?? ''}
        onChange={handleChange}
        loading={isLoading}
        size="small"
      />
    </FormikField>
  );
};

export const LotIDCell: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const value = dataItem[field];
  const displayValue = value?.name || EMPTY_VALUE_PLACEHOLDER;
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
      {linkPath ? <Link target="_blank" to={linkPath} onClick={(e) => e.stopPropagation()} className={classes.link}>{displayValue}</Link> : displayValue}
    </OverflowTooltip>
  );
};
