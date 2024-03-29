import { Grid } from '@material-ui/core';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import { find, isEmpty, lowerCase } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FB, FBAutocompleteAsyncOption } from '../../..';
import { translate } from '../../../../../common/intl';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { CustomTemplateProps, EditableLHRSummaryItem, MPIDocument } from '../../types';
import AutocompleteAsync from './AutocompleteAsync';

type StepCellProps = {mpiDocuments: MPIDocument[]} & CustomTemplateProps;

export const StepCell: React.FC<StepCellProps> = ({ dataItem, field, mpiDocuments }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [stepOrMPI, setStepOrMPI] = useState('');
  const mpiId = dataItem?.stepOrMPI?.split('/')[1];

  useEffect(() => {
    const mpiDoc = find(mpiDocuments, { id: mpiId });
    if (isEmpty(mpiDoc) || !FB.isUUID(mpiId)) {
      setStepOrMPI(dataItem?.stepOrMPI);
      return;
    }
    const step = dataItem.stepOrMPI?.split('/')[0];
    const mpiDocId = mpiDoc?.docId ?? '';
    if (!isEmpty(mpiDocId)) {
      setStepOrMPI(`${step}/${mpiDocId}`);
    }
  }, [mpiDocuments, dataItem[MODE_FIELD], dataItem.stepOrMPI]);

  const filterOutOption = (docRev: DocumentRevision, inputValue: string) => {
    const filterValue = lowerCase(inputValue);

    return lowerCase(docRev.name).includes(filterValue)
      || lowerCase(docRev.document.docId).includes(filterValue);
  };

  if (isEditMode) {
    const stepField = 'step';
    const { getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();

    const handleChange = (event: ChangeEvent<unknown>, value) => {
      setFieldValue(field, value?.id);
    };

    const onInputChange = (event: React.FocusEvent<HTMLInputElement>, value: string, reason: string) => {
      if (reason === 'input') {
        setFieldValue(field, value);
      }
    };

    const handleFilter = (
      data: DocumentRevision[],
      state: FilterOptionsState,
    ) => {
      const { inputValue = '' } = state || {};

      const options = data?.filter((docRev) => (docRev.status === DocumentRevisionStatus.Draft
      || docRev.status === DocumentRevisionStatus.Released)
        && filterOutOption(docRev, inputValue));

      return options;
    };

    const filterOptions = (options, state) => handleFilter(options, state);

    return (<>
      <Grid container spacing={2}>
        <Grid item style={{ width: '30%' }}>
          <FormikField
            name={stepField}
          >
            <TextField
              {...getFieldProps(stepField)}
              defaultValue={undefined}
              fullWidth={false}
              placeholder={translate('lhr.summary.placeholder.enter')}
              type="text"
              size="small"
            />
          </FormikField>
        </Grid>
        <Grid item justify="center" alignItems="center" style={{ paddingTop: 10 }}>/</Grid>
        <Grid item style={{ width: '60%' }}>
          <FormikField
            name={field}
          >
            <AutocompleteAsync
              {...getFieldProps(field)}
              blurOnSelect
              freeSolo
              forcePopupIcon
              disableClearable
              optionId={FBAutocompleteAsyncOption.mpiDocuments}
              {...{ filterOptions }}
              onChange={handleChange}
              onInputChange={onInputChange}
              placeholder={translate('lhr.summary.placeholder.select.enter')}
              size="small"
            />
          </FormikField>
        </Grid>
      </Grid>
    </>
    );
  }

  return <>{stepOrMPI}</>;
};
