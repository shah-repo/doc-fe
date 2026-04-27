import { Box, Button, Dialog, DialogContent, DialogContentText, LinearProgress, TextField, Typography } from '@material-ui/core';
import cx from 'classnames';
import { ExportToCsv } from 'export-to-csv';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
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
import { SearchContext } from '../../../components/KeywordSearch/types';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
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
  const [limit, saveLimit] = useState(DEFAULT_RECORD_DOWNLOAD_LIMIT);
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

  const handleFileName = (ev: React.ChangeEvent<any>) => {
    saveFileName(ev.target.value);
  };

  const handleLimit = (ev: ChangeEvent<HTMLInputElement>) => {
    saveLimit(ev.target.value as unknown as number);
  };

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

  const downloadCSVFile = () => {
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
        <Dialog open={dialog.isOpen} onClose={dialog.close} maxWidth="sm" PaperProps={{ id: 'exportListDialog' }}>
          <DialogContent>
            <Box textAlign="center" marginBottom="20px" whiteSpace="pre-line">
              <Box textAlign="center">
                <span className={classes.iconContainer}>
                  <ExportIcon style={{ marginLeft: 6, marginTop: 7 }} />
                </span>
                <Typography variant="h6" className={classes.title}>
                  <Text translation="document.revision.export.list" />
                </Typography>
              </Box>
              <DialogContentText>
                <Box className={classes.dialogContent}>
                  <Typography variant="subtitle1" className={classes.subtitle}>
                    <Text translation="document.revision.enter.file.name" />
                  </Typography>
                  <TextField
                    error={fileName === ''}
                    variant="outlined"
                    id="ExportListDialog-fileName"
                    className={classes.field}
                    onChange={handleFileName}
                  />
                </Box>
                {isMultiplePagesDownloadAllowed && (
                  <Box className={classes.dialogContent}>
                    <Typography variant="subtitle1" className={classes.subtitle}>
                      <Text translation="document.revision.enter.file.limit" />
                    </Typography>
                    <TextField
                      variant="outlined"
                      type="number"
                      inputProps={{ min: DEFAULT_RECORD_DOWNLOAD_LIMIT }}
                      value={limit}
                      data-cy="export-list-dialog-limit"
                      className={classes.field}
                      onChange={handleLimit}
                    />
                  </Box>
                )}
              </DialogContentText>
            </Box>
          </DialogContent>
          <Box className={classes.dialogAction}>
            <Button
              variant="contained"
              className={classes.cancelButton}
              onClick={dialog.close}
              id="ExportListDialog-cancelButton"
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              id="ExportListDialog-downloadButton"
              data-cy="ExportListDialog-downloadButton"
              onClick={downloadCSVFile}
            >
              <Text translation="common.download" />
            </Button>
          </Box>
          {async.isLoading && <LinearProgress className={cx(classes.loading, classes.loadingAtTop)} />}
        </Dialog>
      )}
    </>
  );
};

export default withThemeNext(ExportListDialog);
