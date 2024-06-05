import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from '../../../../../state/ducks/documentRevisions/types';
import { FormikField } from '../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { DocType, EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { filterOutOption } from '../../utils';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

export const ActualIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = styles();

  const actualDocId = dataItem.actualDocId;
  const actualRevId = dataItem.actualId;
  const actualDocumentId = dataItem.actualDocumentId;

  if (isEditMode) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();
    const docType = values.type;
    const isMaterial = docType === DocType.material;

    const getOptionId = () => {
      if (isMaterial) {
        return FBAutocompleteAsyncOption.releasedParts;
      } else {
        return FBAutocompleteAsyncOption.equipment;
      }
    };

    const handleChange = (event: ChangeEvent<unknown>, value) => {
      // {id: 'enter value', revId: selectedValue, isNew: false}
      setFieldValue(field, value?.id);
    };

    const handleFilter = (
      data: DocumentRevision[],
      state: FilterOptionsState,
    ) => {
      const { inputValue = '' } = state || {};

      const options = data?.filter(
        (docRev) =>
          (isMaterial
            ? docRev.status === DocumentRevisionStatus.Released
            : true) && filterOutOption(docRev, inputValue),
      );

      return options;
    };

    const filterOptions = (options, state) => handleFilter(options, state);

    const onInputChange = (
      event: React.FocusEvent<HTMLInputElement>,
      value: string,
      reason: string,
    ) => {
      console.log('reson', value, reason);
      if (reason === 'input') {
        setFieldValue(field, value);
      }
    };

    return (
      <FormikField name={field}>
        <AutocompleteAsync
          {...getFieldProps(field)}
          key={docType}
          blurOnSelect
          freeSolo
          forcePopupIcon
          disableClearable
          disabled={Mode.edit === dataItem[MODE_FIELD]}
          optionId={getOptionId()}
          onInputChange={onInputChange}
          {...{ filterOptions }}
          onChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }

  return (
    <>
      {actualDocumentId ? (
        <Link
          to={documentVersionPath(actualRevId, actualDocumentId)}
          target="_blank"
          id="PartOrEqDocLink-linkButton"
          className={classes.link}
        >
          {actualDocId}
        </Link>
      ) : (
        actualRevId ?? EMPTY_PLACEHOLDER
      )}
    </>
  );
};
