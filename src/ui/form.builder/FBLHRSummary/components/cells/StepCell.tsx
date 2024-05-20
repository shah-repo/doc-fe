import { Grid } from '@material-ui/core';
import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FBAutocompleteAsyncOption } from '../../..';
import { translate } from '../../../../../common/intl';
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from '../../../../../state/ducks/documentRevisions/types';
import {
  FormikField,
  TextField,
} from '../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import { filterOutOption } from '../../utils';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

export const StepCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
}) => {
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    const stepField = 'step';
    const { getFieldProps, setFieldValue, values }
      = useFormikContext<EditableLHRSummaryItem>();

    const handleChange = (event: ChangeEvent<unknown>, value) => {
      setFieldValue(field, value?.id);
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

    const handleFilter = (
      data: DocumentRevision[],
      state: FilterOptionsState,
    ) => {
      const { inputValue = '' } = state || {};

      const options = data?.filter(
        (docRev) =>
          (docRev.status === DocumentRevisionStatus.Draft
            || docRev.status === DocumentRevisionStatus.Released)
          && filterOutOption(docRev, inputValue),
      );

      return options;
    };

    const filterOptions = (options, state) => handleFilter(options, state);

    return (
      <>
        <Grid container spacing={2}>
          <Grid item style={{ width: '30%' }}>
            <FormikField name={stepField}>
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
          <Grid
            item
            justify="center"
            alignItems="center"
            style={{ paddingTop: 10 }}
          >
            /
          </Grid>
          <Grid item style={{ width: '60%' }}>
            <FormikField name={field}>
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

  const step = dataItem.step;
  const mpiDocId = dataItem.stepOrMpiDocId;
  const mpiRevId = dataItem.stepOrMPI?.split('/')[1];
  const mpiDocumentId = dataItem.stepOrMpiDocumentId;

  return (
    <>
      {mpiRevId && mpiDocumentId ? (
        <span>
          <span>{step}</span> /{' '}
          <Link
            to={documentVersionPath(mpiRevId, mpiDocumentId)}
            target="_blank"
            id="MPIDocLink-linkButton"
            className={classes.link}
          >
            {mpiDocId}{' '}
          </Link>
        </span>
      ) : (
        mpiDocId
      )}
    </>
  );
};
