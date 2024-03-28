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
import { MPI_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, MPIDocument } from '../../types';
import AutocompleteAsync from './AutocompleteAsync';

type StepCellProps = {mpiDocuments: MPIDocument[]} & CustomTemplateProps;

export const StepCell: React.FC<StepCellProps> = ({ dataItem, field, mpiDocuments }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [stepOrMPI, setStepOrMPI] = useState('');
  const handleChange = (event: ChangeEvent<unknown>, value) => {
    setFieldValue(field, value?.id);
  };

  useEffect(() => {
    setStepOrMPI(dataItem.stepOrMPI);
  }, [dataItem.stepOrMPI]);

  const mpiId = stepOrMPI?.split('/')[1];

  useEffect(() => {
    const mpiDoc = find(mpiDocuments, { id: mpiId });
    console.log('StepCell useEffect', { mpiDoc });
    if (isEmpty(mpiDoc) || !FB.isUUID(mpiId)) {
      return;
    }
    const step = stepOrMPI?.split('/')[0];
    const mpiDocId = mpiDoc?.docId ?? '';
    if (!isEmpty(mpiDocId)) {
      setStepOrMPI(`${step}/${mpiDocId}`);
    }
  }, [mpiDocuments]);

  const filterOutOption = (docRev: DocumentRevision, inputValue: string) => {
    const filterValue = lowerCase(inputValue);

    return lowerCase(docRev.name).includes(filterValue)
      || lowerCase(docRev.document.docId).includes(filterValue);
  };

  function handleFilter (
    data: DocumentRevision[],
    state: FilterOptionsState,
  ) {
    const { inputValue = '' } = state || {};

    const options = data?.filter((docRev) => (docRev.status === DocumentRevisionStatus.Draft
      || docRev.status === DocumentRevisionStatus.Released)
        && filterOutOption(docRev, inputValue));

    return options;
  }

  const filterOptions = (options, state) => handleFilter(options, state);

  const onInputChange = (event, value: string, reason: string) => {
    if (reason === 'input') {
      setFieldValue(field, value);
    }
  };

  if (isEditMode && !isEmpty(values)) {
    const stepField = 'step';
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
              options={MPI_OPTIONS}
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
