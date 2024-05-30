import { Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../../../../components/KendoDataGrid/constants';
import { FormikField } from '../../../../../../components/forms/fields-next';
import { OptionType } from '../../../../../../components/forms/fields/Autocomplete/types';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import { FBAutocompleteAsyncOption } from '../../../../../../form.builder';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps, EditableMDItem } from '../../types';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { setFieldValue, getFieldProps } = useFormikContext<EditableMDItem>();
  const classes = styles();

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
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
      <AutocompleteAsync
        {...getFieldProps(field)}
        blurOnSelect
        freeSolo
        forcePopupIcon
        disableClearable
        optionId={FBAutocompleteAsyncOption.allDocuments}
        onInputChange={onInputChange}
        classes={{
          paper: classes.paper,
        }}
        renderOption={(option) => {
          const label = translate('wo.displayRevision', { docId: option.document.docId, displayRevision: option?.displayRevision, name: option?.name });
          return <div className={classes.optionWrap}>{label}</div>;
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
