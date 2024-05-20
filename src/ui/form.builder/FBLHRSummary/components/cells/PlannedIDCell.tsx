import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../common/intl';
import { documentRevisionsActions } from '../../../../../state/ducks/documentRevisions';
import {
  DocumentRevision,
  DocumentRevisionStatus,
  MeqResponse,
} from '../../../../../state/ducks/documentRevisions/types';
import {
  Autocomplete,
  FormikField,
} from '../../../../components/forms/fields-next';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { DocType, EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { filterOutOption } from '../../utils';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps & { options: any[], docType: DocType }> = ({
  field,
  options = [],
  docType,
  dataItem,
}) => {
  const { values, setFieldValue, getFieldProps }
    = useFormikContext<EditableLHRSummaryItem>();

  const handleChange = (event: ChangeEvent<unknown>, value?: OptionType) => {
    setFieldValue(field, value?.value);
  };

  const renderOptions = () => {
    return options.map((option) => ({
      label: translate('wo.displayRevision', {
        docId: option.docId,
        displayRevision: option?.revision,
        name: option.title,
      }),
      value: option.docRevId,
    }));
  };

  const defaultValue = values[field] ?? dataItem[field];
  const value = renderOptions().find((option) => option.value === defaultValue);

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={docType}
        blurOnSelect
        disableClearable
        freeSolo
        forcePopupIcon
        options={renderOptions()}
        value={value}
        getOptionLabel={(option: OptionType) => option.label}
        onChange={handleChange}
        placeholder={translate('lhr.summary.placeholder.select.enter')}
        size="small"
      />
    </FormikField>
  );
};

export const PlannedIDCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  ...props
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = styles();

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue }
      = useFormikContext<EditableLHRSummaryItem>();
    const fetchMEQByMPI = useActionCreator(
      documentRevisionsActions.fetchMaterialsOrEquipmentsBySelectedMPI,
    );
    const [meqs, setMeqs] = React.useState<MeqResponse>({
      materials: [],
      equipment: [],
    });
    const fetchMeqsAsync = useAsync({
      onSuccess: (data?: MeqResponse) => {
        data && setMeqs(data);
      },
    });
    const docType = values.type;
    const isMaterial = docType === DocType.material;
    const selectedMPI = values.mpiId;

    useEffect(() => {
      if (selectedMPI) {
        fetchMeqsAsync.start(fetchMEQByMPI, selectedMPI, fetchMeqsAsync);
      }
    }, [values.mpiId]);

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

      const options = data?.filter(
        (docRev) =>
          (isMaterial
            ? docRev.status === DocumentRevisionStatus.Released
            : true) && filterOutOption(docRev, inputValue),
      );

      return options;
    };

    const filterOptions = (options, state) => handleFilter(options, state);

    if (selectedMPI && (meqs?.materials?.length || meqs?.equipment?.length)) {
      return (
        <Editor
          {...props}
          {...{
            dataItem,
            field,
            docType,
            options: isMaterial ? meqs.materials : meqs.equipment,
          }}
        />
      );
    }

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

  const plannedDocId = dataItem.plannedDocId;
  const plannedRevId = dataItem.plannedId;
  const plannedDocumentId = dataItem.plannedDocumentId;

  return (
    <>
      {plannedRevId && plannedDocumentId ? (
        <Link
          to={documentVersionPath(
            plannedRevId,
            plannedDocumentId,
          )}
          target="_blank"
          id="PartOrEqDocLink-linkButton"
          className={classes.link}
        >
          {plannedDocId}
        </Link>
      ) : (
        plannedDocId ?? EMPTY_PLACEHOLDER
      )}
    </>
  );
};
