import { Grid } from '@material-ui/core';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import { find, isEmpty } from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FB, FBAutocompleteAsyncOption } from '../../..';
import { translate } from '../../../../../common/intl';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { filterOutOption } from '../../utils';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

type StepCellProps = {mpiDocuments: DocumentRevision[]} & CustomTemplateProps;

interface StepOrMPIInfo {mpiDoc: DocumentRevision| undefined, step: string, stepOrMPI: string}

export const StepCell: React.FC<StepCellProps> = ({ dataItem, field, mpiDocuments }) => {
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [stepOrMPIInfo, setStepOrMPI] = useState<StepOrMPIInfo>({ mpiDoc: undefined, step: '', stepOrMPI: '' });
  const mpiId = dataItem?.stepOrMPI?.split('/')[1];

  useEffect(() => {
    const mpiDoc = find(mpiDocuments, { id: mpiId });
    if (isEmpty(mpiDoc) || !FB.isUUID(mpiId)) {
      setStepOrMPI(prev => ({ ...prev, stepOrMPI: dataItem?.stepOrMPI }));
      return;
    }

    const step = dataItem.stepOrMPI?.split('/')[0];
    setStepOrMPI(prev => ({ ...prev, step, mpiDoc }));
  }, [mpiDocuments, dataItem[MODE_FIELD], dataItem.stepOrMPI]);

  if (isEditMode) {
    const stepField = 'step';
    const { getFieldProps, setFieldValue, values } = useFormikContext<EditableLHRSummaryItem>();

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
            required
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
            required
          >
            <AutocompleteAsync
              {...getFieldProps(field)}
              key={isEmpty(values) ? 'disabled' : 'enabled'}
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

  const mpiDoc = stepOrMPIInfo.mpiDoc;
  const step = stepOrMPIInfo.step;

  return <>{isEmpty(mpiDoc) ? stepOrMPIInfo.stepOrMPI
    : <span>
      <span>{step}</span> / <Link
        to={documentVersionPath(mpiDoc?.id as string, mpiDoc?.document?.id as string)}
        target="_blank"
        id="MPIDocLink-linkButton"
        className={classes.link}
      >{mpiDoc?.document.docId} </Link>
    </span>}</>;
};
