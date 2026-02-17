import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip, createStyles, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import axios, { AxiosError } from 'axios';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../../../common/intl';
import authSelectors from '../../../../state/ducks/auth/selectors';
import { Dialog } from '../../../components/dialogs';
import { Autocomplete, Button, DropzoneField } from '../../../components/forms/fields-next';
import { FileWithPreview } from '../../../components/forms/fields-next/Dropzone/Dropzone.types';
import { Colors, withThemeNext } from '../../../layout/theme-next';

interface ImportDialogProps {
  partName?: string
  partDescription?: string
  isOpen: boolean
  onConfirm: (serials: string[]) => Promise<void>
  onClose: () => void
}

interface ExtractResponse {
  part_name: string
  serials: string[]
  serialsToImport: string[]
  status: 'extracted' | 'importing' | 'imported' | 'error'
  accuracy_score: number
}

interface ImportState {
  status: 'idle' | 'processing' | 'success' | 'error'
  extracts?: ExtractResponse[]
  error?: string
}

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2, 2),
  },
  dropzone: {
    width: '100%',
    maxWidth: 'none',
    border: 'none',
    position: 'relative',
    padding: 0,
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  dropzoneText: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.textBlack,
  },
  dropzoneTextProcessing: {
    opacity: 0,
  },
  processing: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    paddingBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    maxWidth: 580,
    backgroundColor: Colors.white,
  },
  processingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
    width: '100%',
    maxWidth: 400,
  },
  processingIcon: {
    fontSize: 64,
    color: Colors.primaryLight,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  processingText: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.textBlack,
  },
  processingSteps: {
    fontSize: 14,
    color: Colors.textDisabled,
    textAlign: 'center',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: theme.spacing(2, 2),
    color: Colors.error,
    minHeight: 250,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 48,
  },
  chip: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5, 1.5),
    width: 580,
    paddingBottom: 16,
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1, 1),
    backgroundColor: Colors.successHighlight,
    padding: theme.spacing(1, 1),
    borderRadius: 10,
    color: Colors.success,
    width: '100%',
  },
  successBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
  },
  accordionSummaryContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
    justifyContent: 'space-between',
    width: '100%',
  },
  accordionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
  },
  chevronIcon: {
    width: 16,
  },
  importedStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
    color: Colors.success,
  },
  footer: {
    backgroundColor: Colors.white,
    fontSize: '0.75rem',
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingBottom: theme.spacing(1.5),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  startOverButton: {
    alignSelf: 'flex-start',
    whiteSpace: 'nowrap',
  },
}));

const ImportDialog: React.FC<ImportDialogProps> = ({
  partName = '',
  partDescription = '',
  isOpen,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const accessToken = useSelector(authSelectors.getAccessToken);

  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);

  const toggleExpanded = (panel: string, isExpanded: boolean) => {
    setExpandedPanels(isExpanded ? [...expandedPanels, panel] : expandedPanels.filter(p => p !== panel));
  };

  const [importState, setImportState] = useState<ImportState>({
    status: 'idle',
  });

  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (importState.status === 'processing') {
      setProgress(0);
      startTimeRef.current = Date.now();

      // Animate progress over 10 seconds (up to 95%, leaving 5% for actual completion)
      const duration = 10000; // 10 seconds
      const targetProgress = 95;
      const intervalDuration = 50; // Update every 50ms for smooth animation
      const steps = duration / intervalDuration;
      const increment = targetProgress / steps;

      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + increment;
          return newProgress >= targetProgress ? targetProgress : newProgress;
        });
      }, intervalDuration);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (importState.status === 'success' || importState.status === 'error') {
        // Complete the progress bar when done
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      } else {
        setProgress(0);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [importState.status]);

  const getProcessingStep = () => {
    if (progress < 20) return 'Uploading document...';
    if (progress < 40) return 'Analyzing document structure...';
    if (progress < 60) return 'Extracting serial numbers...';
    if (progress < 80) return 'Validating extracted data...';
    return 'Finalizing results...';
  };

  const getProcessingIcon = () => {
    if (progress < 20) return solid('cloud-upload-alt');
    if (progress < 40) return solid('file-alt');
    if (progress < 60) return solid('search');
    if (progress < 80) return solid('check-circle');
    return solid('check-double');
  };

  const processSerials = (files: FileWithPreview[]) => {
    setImportState({ status: 'processing' });
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('part_name', partName);
    formData.append('part_description', partDescription);
    axios.post<{ results: ExtractResponse[] }>(
      'http://127.0.0.1:3003/extract',
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ).then(response => {
      setProgress(100);
      setTimeout(() => {
        setImportState({
          status: 'success',
          extracts: response.data.results.map(result => ({
            ...result,
            status: 'extracted',
            serialsToImport: result.serials,
          })),
        });
      }, 300);
    }).catch((error: AxiosError<{ message: string }>) => {
      setProgress(100);
      setTimeout(() => {
        setImportState({ status: 'error', error: error.response?.data?.message ?? error.message });
      }, 300);
    });
  };

  const handleStartOver = () => {
    setImportState({ status: 'idle' });
    setExpandedPanels([]);
  };

  const handleClose = () => {
    handleStartOver();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={translate('form.builder.serials.import')}
      disableBackdropClick
      maxWidth="md"
    >
      <div className={classes.contentContainer}>
        {importState.status === 'success' && (
          <>
            <div className={classes.successBanner}>
              <div className={classes.successBannerContent}>
                <FontAwesomeIcon icon={solid('check')} />
                <Typography variant="h5">
                  We successfully extracted these serial numbers for: <br /> <b>{partName}</b>
                </Typography>
              </div>
              <Button
                kind="white"
                onClick={handleStartOver}
                size="small"
                startIcon={<FontAwesomeIcon icon={regular('rotate-right')} />}
                className={classes.startOverButton}
              >
                Start Over
              </Button>
            </div>
            <div>
              {importState.extracts?.map(extract => (
                <Accordion expanded={expandedPanels.includes(extract.part_name)} onChange={(event, isExpanded) => toggleExpanded(extract.part_name, isExpanded)} key={extract.part_name}>
                  <AccordionSummary>
                    <div className={classes.accordionSummaryContent}>
                      <Typography variant="h5" className={classes.accordionTitle}>
                        <div className={classes.chevronIcon}>
                          <FontAwesomeIcon icon={ expandedPanels.includes(extract.part_name) ? regular('chevron-down') : regular('chevron-right') } />
                        </div>
                        {extract.part_name}
                        <Chip label={`${extract.serialsToImport.length} serials`} size="small" />
                      </Typography>
                      {extract.status === 'imported' ? (
                        <span className={classes.importedStatus}>
                          <FontAwesomeIcon icon={solid('check')} />
                          Imported
                        </span>
                      ) : (
                        <Button
                          kind="outlined"
                          size="small"
                          disabled={extract.status === 'importing'}
                          startIcon={(
                            <FontAwesomeIcon
                              spin={extract.status === 'importing'}
                              icon={ extract.status === 'importing' ? solid('spinner') : regular('arrow-down-to-bracket') }
                            />
                          )}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImportState({ ...importState, extracts: importState.extracts?.map(e => e.part_name === extract.part_name ? { ...e, status: 'importing' } : e) });
                            await onConfirm(extract.serials);
                            setImportState({ ...importState, extracts: importState.extracts?.map(e => e.part_name === extract.part_name ? { ...e, status: 'imported' } : e) });
                          }}
                        >
                          Import
                        </Button>
                      )}

                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Autocomplete
                      multiple
                      disableClearable
                      filterSelectedOptions
                      size="small"
                      freeSolo
                      disabled={extract.status === 'importing' || extract.status === 'imported'}
                      options={extract.serials}
                      value={extract.serialsToImport}
                      onChange={(_, value: string[]) => {
                        setImportState({
                          ...importState,
                          extracts: importState.extracts?.map(e => e.part_name === extract.part_name ? { ...e, serialsToImport: value } : e),
                        });
                      }}
                      classes={{
                        tag: classes.chip,
                        input: classes.chip,
                      }}
                      ChipProps={{
                        disabled: extract.status === 'importing' || extract.status === 'imported',
                        variant: extract.status === 'importing' || extract.status === 'imported' ? 'outlined' : 'default',
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </>
        )}
        {importState.status === 'error' && (
          <div className={classes.error}>
            <FontAwesomeIcon className={classes.errorIcon} icon={solid('exclamation-triangle')} />
            <div>
              <Typography variant="h5">Failed to extract serial numbers</Typography>
              <div>{importState.error}</div>
            </div>
          </div>
        )}
        {(importState.status === 'idle' || importState.status === 'processing') && (
          <DropzoneField name="serials" onDropCallback={processSerials} className={classes.dropzone} isMultiple={false}>
            <div className={cx(classes.dropzoneText, { [classes.dropzoneTextProcessing]: importState.status === 'processing' })}>Add document containing serial numbers for <br /> <b>{partName}</b></div>
            {importState.status === 'processing' && (
              <div className={classes.processing}>
                <div className={classes.processingContent}>
                  <FontAwesomeIcon
                    icon={getProcessingIcon()}
                    className={classes.processingIcon}
                  />
                  <div className={classes.processingText}>Processing your document</div>
                  <div className={classes.processingSteps}>{getProcessingStep()}</div>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    className={classes.progressBar}
                    color="primary"
                  />
                  <Typography variant="caption" style={{ color: Colors.textDisabled }}>
                    {Math.round(progress)}% complete
                  </Typography>
                </div>
              </div>
            )}
          </DropzoneField>
        )}
      </div>
      <div className={classes.footer}>
        <FontAwesomeIcon icon={regular('robot')} />&nbsp;
        <span>AI can make mistakes, please check the results carefully</span>
      </div>
    </Dialog>
  );
};

export default withThemeNext(ImportDialog);
