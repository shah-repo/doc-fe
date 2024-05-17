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

type PlannedIDCellProps = {equipmentDocs: DocumentRevision[], partDocs: DocumentRevision[]} & CustomTemplateProps;

export const PlannedIDCell: React.FC<PlannedIDCellProps> = ({
  dataItem,
  field,
  partDocs,
  equipmentDocs,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const docType = dataItem.type;
  const isMaterial = docType === DocType.material;
  const [documentRevision, setDocumentRevision] = useState<DocumentRevision>();
  const defaultValue = dataItem[field];
  const classes = styles();

  useEffect(() => {
    if (!FB.isUUID(defaultValue)) {
      return;
    }
    // TODO:: Fetch materials/ Equipments based on MPI selection
    //     /api/v1/document_revisions/cccd050d-0057-46f4-a8eb-cf32cccc34b7/materials_and_equipment
    //     /api/v1/document_revisions/${mpiDocRevId}/materials_and_equipment

    let value;
    if (isMaterial) {
      value = partDocs.find((option) => option.id === defaultValue);
    } else {
      value = equipmentDocs.find((option) => option.id === defaultValue);
    }

    setDocumentRevision(value);
  }, [equipmentDocs, partDocs, dataItem[field]]);

  if (isEditMode) {
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

    const handleChange = (event: ChangeEvent<unknown>, value?) => {
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
