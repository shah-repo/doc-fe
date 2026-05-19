import { Box, Grid, LinearProgress } from '@material-ui/core';
import cx from 'classnames';
import { ExportToCsv } from 'export-to-csv';
import { FormikProvider, useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { ReactComponent as ExportIcon } from '../../../../assets/images/icon_export_data.svg';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import {
  DocumentCategory,
  DocumentRevisionStatusDisplay,
  HeaderTableType,
  POStatusLabelMapping,
  POStatusType,
} from '../../../../state/ducks/documentRevisions/types';
import { Dialog } from '../../../components/dialogs';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { requiredNumber, validator, validNumber } from '../../../components/forms/fields/validators';
import { SearchContext } from '../../../components/KeywordSearch/types';
import { toastError } from '../../../components/notifications';
import { DocTypeTableContext } from '../../../documentType/grid/interfaces';
import { FB } from '../../../form.builder';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { DialogHandler } from '../../../hooks/useDialog';
import { withThemeNext } from '../../../layout/theme-next';
import { styles } from './ExportListDialog.styles';

interface Props {
  dialog: DialogHandler
  headers?: HeaderTableType[]
  data: any[]
  useKeysAsHeaders?: boolean
  customFileName: string
  categoryName?: string
  isMultiplePagesDownloadAllowed?: boolean
  isTrainingRecord?: boolean
}

const DEFAULT_RECORD_DOWNLOAD_LIMIT = 25;

interface ExportList {
  fileName: string
  limit?: number
}

const INITIAL_VALUES = {
  fileName: '',
  limit: DEFAULT_RECORD_DOWNLOAD_LIMIT,
};

const ExportListDialog: React.FunctionComponent<Props> = ({
  dialog,
  headers,
  data,
  useKeysAsHeaders = false,
  customFileName,
  categoryName,
  isMultiplePagesDownloadAllowed = false,
  isTrainingRecord = false,
}) => {
  const classes = styles();
  const [fileName, saveFileName] = useState('');
  const docTypeTableContext = useContext(DocTypeTableContext);
  const { tableSearchQueryPayload } = useContext(SearchContext);

  const action = isTrainingRecord
    ? documentRevisionsActions.downloadTrainingRecordCsvData
    : documentRevisionsActions.downloadCsvData;
  const loadAction = useActionCreator(action);

  const options = {
    showLabels: true,
    headers: headers?.map((e) => e.label),
    filename: fileName === '' ? customFileName : fileName,
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders,
  };

  const csvExporter = new ExportToCsv(options);

  useEffect(() => {
    if (dialog.isOpen) {
      saveFileName('');
    }
  }, [dialog.isOpen]);

  if (categoryName === DocumentCategory.PurchaseOrder) {
    data = data.map((item) => ({
      ...item,
      ...(item.poStatus === POStatusType.OPENED && { poStatus: POStatusLabelMapping.OPENED }),
      ...(item.displayStatus === DocumentRevisionStatusDisplay.Released && {
        displayStatus: DocumentRevisionStatusDisplay.Approved,
      }),
    }));
  }

  if (categoryName === DocumentCategory.Supplier && (docTypeTableContext?.aslStatuses?.length ?? 0) > 0) {
    const aslMap = new Map(docTypeTableContext?.aslStatuses?.map(({ id, displayLabel }) => [id, displayLabel]));

    data = data.map((record) => {
      const status = record['precalc.supplierStatus'];

      if (status && FB.isUUID(status)) {
        const label = aslMap.get(status);
        if (label) {
          return {
            ...record,
            'precalc.supplierStatus': label,
          };
        }
      }

      return record;
    });
  }

  const formik = useFormik<ExportList>({
    initialValues: INITIAL_VALUES,
    onSubmit: (values) => {
      const { fileName = '', limit = 0 } = values;
      saveFileName(fileName);
      downloadCSVFile(limit);
    },
  });

  const { getFieldProps, submitForm } = formik;

  const downloadCsvFromString = (csvString?: string) => {
    try {
      const blob = new Blob([csvString ?? ''], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName === '' ? customFileName : fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toastError(translate('document.revision.csv.download.failed.error.message'));
    }
  };

  const async = useAsync<string>({
    onSuccess: (csvData) => {
      downloadCsvFromString(csvData);
      dialog.close();
    },
    onError: toastError,
  });

  const downloadCSVFile = (limit: number) => {
    if (isMultiplePagesDownloadAllowed) {
      async.start(loadAction, { ...(tableSearchQueryPayload ?? {}), ...{ limit: Number(limit), offset: 0 } }, async);
    } else {
      csvExporter.generateCsv(data);
      dialog.close();
    }
  };

  return (
    <>
      {dialog.isOpen && (
        <FormikProvider value={formik}>
          <Dialog
            title="document.revision.export.list"
            confirmProps={{
              id: 'ExportListDialog-downloadButton',
              'data-cy': 'ExportListDialog-downloadButton',
            }}
            cancelProps={{
              id: 'ExportListDialog-cancelButton',
              'data-cy': 'ExportListDialog-cancelButton',
            }}
            confirmLabel="common.download"
            cancelLabel="common.cancel"
            open={dialog.isOpen}
            onClose={dialog.close}
            onCancel={dialog.close}
            onConfirm={submitForm}
            maxWidth="sm" PaperProps={{ id: 'exportListDialog' }}>
            <Grid
              container
              alignItems="flex-start"
              spacing={2}
            >
              <Box width="100%" display="flex" flex={1} justifyContent="center" marginBottom={1.5}>
                <span className={classes.iconContainer}>
                  <ExportIcon style={{ marginLeft: 6, marginTop: 7 }} />
                </span>
              </Box>
              <Grid item xs={12}>
                <FormikField
                  required
                  name="fileName"
                  label="document.revision.enter.file.name"
                >
                  <TextField {...getFieldProps('fileName')} id="ExportListDialog-fileName" />
                </FormikField>
              </Grid>
              {isMultiplePagesDownloadAllowed && (
                <Grid item xs={12}>
                  <FormikField
                    required
                    validate={validator(requiredNumber, validNumber)}
                    name="limit"
                    label="document.revision.enter.file.limit"
                  >
                    <TextField type="number" {...getFieldProps('limit')} data-cy="export-list-dialog-limit" />
                  </FormikField>
                </Grid>
              )}
            </Grid>
            {async.isLoading && <LinearProgress className={cx(classes.loading, classes.loadingAtTop)} />}
          </Dialog>
        </FormikProvider>
      )}
    </>
  );
};

export default withThemeNext(ExportListDialog);
