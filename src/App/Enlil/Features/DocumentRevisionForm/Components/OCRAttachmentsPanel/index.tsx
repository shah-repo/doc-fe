import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, CircularProgress, Slide, Typography } from '@material-ui/core';
import axios from 'axios';
import cx from 'classnames';
import { reaction } from 'mobx';
import { Observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { SM, SMBox } from '../../../../..';
import { translate } from '../../../../../../common/intl';
import Config from '../../../../../../config';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import {
  DOC_TYPE_GROUP,
  TabTypeOptions,
} from '../../../../../../state/ducks/documentRevisions/documentType/types';
import { store } from '../../../../../../state/store';
import { Button } from '../../../../../../ui/components/forms/fields-next';
import {
  toastError,
  toastSuccess,
} from '../../../../../../ui/components/notifications';
import Text from '../../../../../../ui/components/Text';
import { FBAttachment } from '../../../../../../ui/form.builder';
import useActionCreator from '../../../../../../ui/hooks/useActionCreator';
import useAsync from '../../../../../../ui/hooks/useAsync';
import useDialog from '../../../../../../ui/hooks/useDialog';
import ListPanel from './Components/ListPanel';
import OCRFilePresenter from './Components/OCRFilePresenter';
import useStyles from './styles';

const OCR_API_URL = `${Config.ApiOCREndpoint}/aocr`;

const AttachmentsPanel: React.FC = () => {
  const { _documentRevisionFormState, _tabsState } = SM.useStores();
  const docRevId = _documentRevisionFormState?.documentRevision?.id;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FBAttachment>();
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
  const [attachments, setAttachments] = useState<FBAttachment[]>([]);
  const docPreview = useDialog();
  const [hideAttachmentsPanel, setHideAttachmentsPanel] = React.useState<boolean>(false);

  const showDocPreview = (file: FBAttachment) => {
    setFile(file);
    docPreview.open();
  };

  const onSelectionChange = (indices: number[]) => {
    setSelectedIndices(indices);
  };

  const toggleAttachmentsPanelView = () => {
    setHideAttachmentsPanel(!hideAttachmentsPanel);
  };

  const onHideDocPreview = () => {
    hideAttachmentsPanel && toggleAttachmentsPanelView();
    docPreview.close();
  };

  const handleClick = async () => {
    const { employeeId, sessionId } = store.getState().auth.user;
    const headers = { authorization: `bearer ${employeeId}:${sessionId}` };

    if (!docRevId) {
      toastError(translate('ocr.doc.rev.empty.error.message'));
      return;
    }

    let processedFilesCount = 0;
    const uploadAttachment = async (index: number) => {
      const attachment = attachments[index];
      const data = {
        DocumentType: DOC_TYPE_GROUP.LHR,
        // Sending now dummy values for FormID and Revision since we are currently supporting one Form/Revision per company
        FormID: 'FormID',
        Revision: 'Revision',
        AttachmentUSID: attachment.id,
        DocumentRevisionUSID: docRevId,
        IsLHRSummaryInsertEnabled: true,
      };

      await axios.post(OCR_API_URL, data, { headers });
      processedFilesCount++;
    };

    try {
      setLoading(true);
      await Promise.all(selectedIndices.map(uploadAttachment));
      toastSuccess(translate('ocr.process.alert.message', { count: processedFilesCount }));
    } catch (error) {
      console.error(error);
      toastError(translate('ocr.process.alert.error.message'));
    } finally {
      setLoading(false);
    }
  };

  const attachmentsAsync = useAsync({
    onSuccess: (attachments?: FBAttachment[]) => {
      setAttachments(attachments ?? []);
    },
    onError: () => {
      toastError(translate('ocr.submit.error.message'));
    },
  });

  const fetchAttachments = useActionCreator(
    documentRevisionsActions.getAttachmentsByDocRevId,
  );

  useEffect(() =>
    reaction(
      () => _tabsState?.activeTabId,
      () => {
        if (docRevId && _tabsState?.isTabActive(TabTypeOptions.SUMMARY)) {
          attachmentsAsync.start(fetchAttachments, docRevId, attachmentsAsync);
        }
      },
    ),
  );

  return (
    <Observer>
      {() => (
        <>
          {_tabsState?.isTabActive(TabTypeOptions.SUMMARY) && (
            <Box className={classes.root}>
              {!hideAttachmentsPanel && <Box className={classes.panel}>
                <Box className={classes.panelTitle} data-cy="attachments">
                  <Typography variant="h6" className={classes.titleText}>
                    <Text translation="form.builder.attachments" />
                  </Typography>
                  <Typography variant="h6" className={classes.titleDescText}>
                    <Text translation="ocr.sub.title.msg" />
                  </Typography>
                </Box>
                <SMBox>
                  <ListPanel
                    {...{
                      showDocPreview,
                      attachments,
                      onSelectionChange,
                      selectedIndices,
                    }}
                  />
                  <Box className={classes.panelButton}>
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      color="primary"
                      disabled={selectedIndices.length <= 0 || loading}
                      fullWidth
                      startIcon={
                        loading && (
                          <CircularProgress size={16} color="inherit" />
                        )
                      }
                      data-cy="ocr-extract-data"
                    >
                      <Text translation="ocr.submit.button" />
                    </Button>
                  </Box>
                </SMBox>
              </Box>}
              {docPreview.isOpen && (
                <Slide
                  direction="right"
                  in={docPreview.isOpen}
                  mountOnEnter
                  unmountOnExit
                >
                  <Box className={cx({ [classes.docPreview]: !hideAttachmentsPanel, [classes.docPreviewExtended]: hideAttachmentsPanel })}>
                    <Box className={classes.panelPreview}>
                      <Box
                        display="flex"
                        alignItems="center"
                        style={{ gap: '8px' }}
                      >
                        <FontAwesomeIcon
                          onClick={toggleAttachmentsPanelView}
                          className={classes.iconButtonNew}
                          icon={hideAttachmentsPanel ? solid('arrow-right-to-line') : solid('arrow-left-to-line')}
                        />
                        <Typography variant="h6" className={classes.titleText}>
                          <Text translation="ocr.document.preview.title" />
                        </Typography>
                      </Box>

                      <Button
                        variant="text"
                        startIcon={
                          <FontAwesomeIcon icon={solid('arrow-left')} />
                        }
                        className={classes.hidePreviewButton}
                        onClick={onHideDocPreview}
                      >
                        <Text translation="ocr.hide.preview.button" />
                      </Button>
                    </Box>
                    <Box className={classes.previewContainer}>
                      <OCRFilePresenter
                        key={file?.id}
                        file={file as FBAttachment}
                        setFile={setFile}
                      />
                    </Box>
                  </Box>
                </Slide>
              )}
            </Box>
          )}
        </>
      )}
    </Observer>
  );
};

export default AttachmentsPanel;
