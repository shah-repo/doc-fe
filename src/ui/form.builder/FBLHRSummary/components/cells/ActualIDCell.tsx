import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import {
  FormikField,
} from '../../../../components/forms/fields-next';
import {
  Mode, MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { DocType, EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { filterOutOption } from '../../utils';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

type ActualIDCellProps = {equipmentDocs: DocumentRevision[], partDocs: DocumentRevision[]} & CustomTemplateProps;

export const ActualIDCell: React.FC<ActualIDCellProps> = ({ dataItem, field, equipmentDocs, partDocs, dataIndex }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const docType = dataItem.type;
  const isMaterial = docType === DocType.material;
  const [documentRevision, setDocumentRevision] = useState<DocumentRevision>();
  const classes = styles();

  const defaultValue = dataItem[field];

  useEffect(() => {
    if (!FB.isUUID(defaultValue)) {
      return;
    }

    let value;
    if (isMaterial) {
      value = partDocs.find((option) => option.id === defaultValue);
    } else {
      value = equipmentDocs.find((option) => option.id === defaultValue);
    }

    setDocumentRevision(value);
  }, [equipmentDocs, partDocs, dataItem[field]]);

  if (isEditMode) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
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

      const options = data?.filter((docRev) => (isMaterial ? docRev.status === DocumentRevisionStatus.Released : true)
        && filterOutOption(docRev, inputValue));

      return options;
    };

    const filterOptions = (options, state) => handleFilter(options, state);

    return (
      <FormikField name={field}>
        <AutocompleteAsync
          {...getFieldProps(field)}
          key={docType}
          blurOnSelect
          freeSolo
          forcePopupIcon
          disableClearable
          optionId={getOptionId()}
          {...{ filterOptions }}
          onChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }

  return (<>
    {!isEmpty(documentRevision) ? <Link
      to={documentVersionPath(documentRevision?.id as string, documentRevision?.document?.id as string)}
      target="_blank"
      id="PartOrEqDocLink-linkButton"
      className={classes.link}
    >{documentRevision?.document.docId } </Link>
      : defaultValue ?? EMPTY_PLACEHOLDER}
  </>);
};
