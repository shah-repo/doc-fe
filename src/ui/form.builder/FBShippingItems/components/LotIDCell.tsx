import { useFormikContext } from 'formik';
import { isEmpty, kebabCase } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../common/intl';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Autocomplete, FormikField } from '../../../components/forms/fields-next';
import { OptionType } from '../../../components/forms/fields/Autocomplete/types';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import { FB } from '../../helpers';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableShippingItem } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  loading: boolean
  options: DocumentRevision[]
  fetchLotsByPartId: (id?: string) => any
}

interface CustomOptionType extends OptionType {
  docId: string
  documentId: string
}

const Editor: React.FC<Props> = ({ field, dataItem, fetchLotsByPartId, options, loading }) => {
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableShippingItem>();
  const isUpdateAction = Mode.edit === dataItem[MODE_FIELD];
  const { part } = values ?? {};
  const classes = styles();

  useEffect(() => {
    if (!FB.isUUID(part?.id)) {
      return;
    }
    fetchLotsByPartId(part?.id);
  }, [part]);

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

  const value = renderOptions()?.find(option => option.value === values[field]?.id);

  return (
    <>
      <FormikField name={field}>
        <Autocomplete
          {...getFieldProps(field)}
          key={(isEmpty(values) || loading) ? 'disabled' : 'enabled'}
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
          loading={loading}
          size="small"
        />
      </FormikField>
    </>
  );
};

export const LotIDCell: React.FC<Props> = (props) => {
  const classes = styles();
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const value = dataItem[field] as EditableShippingItem['lot'];
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
