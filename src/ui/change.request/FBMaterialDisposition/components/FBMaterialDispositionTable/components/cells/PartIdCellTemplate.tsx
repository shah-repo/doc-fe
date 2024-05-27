import { Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../../../state/ducks/documentRevisions/types';
import { MODE_FIELD, Mode } from '../../../../../../components/KendoDataGrid/constants';
import { Autocomplete, FormikField } from '../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import useActionCreator from '../../../../../../hooks/useActionCreator';
import useAsync from '../../../../../../hooks/useAsync';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps, EditableMDItem } from '../../types';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { setFieldValue, getFieldProps } = useFormikContext<EditableMDItem>();
  const [parts, setParts] = React.useState<DocumentRevision[]>([]);
  const [value, setValue] = useState<OptionType>({ label: '', value: '' });
  const classes = styles();

  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

  useEffect(() => {
    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  }, [dataItem[MODE_FIELD]]);

  useEffect(() => {
    const value = renderOptions().find((option) => option.value === dataItem.partDocRevId);

    if (value && field) {
      setFieldValue(field, value);
      setValue(value);
    }
  }, [parts]);

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const renderOptions = () => {
    return parts.filter(docRev => docRev.status === DocumentRevisionStatus.Released).map((part) => ({
      label: translate('wo.displayRevision', { docId: part.document.docId, displayRevision: part?.displayRevision, name: part?.name }),
      value: part.id,
    }));
  };

  const onInputChange = (
    event: React.FocusEvent<HTMLInputElement>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
      setFieldValue(field, value);
    }
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(parts) ? 'disabled' : 'enabled'}
        blurOnSelect
        disableClearable
        freeSolo
        forcePopupIcon
        options={renderOptions()}
        onInputChange={onInputChange}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        classes={{
          paper: classes.paper,
        }}
        renderOption={(option) => {
          return <div className={classes.optionWrap}>{option.label}</div>;
        }}
        onChange={handleChange}
        placeholder={translate('common.select.or.enter.placeholder')}
        size="small"
      />
    </FormikField>
  );
};

export const PartIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { partDocId, partDocRevId } = dataItem;
  const fieldValue = dataItem[field];
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      {fieldValue && <Tooltip title={fieldValue} placement="top-start" arrow>
        <Link
          to={documentPreviewPath(partDocRevId, partDocId)}
          target="_blank"
          className={classes.link}
        >
          {fieldValue}
        </Link>
      </Tooltip>}
    </OverflowingContent>
  );
};
