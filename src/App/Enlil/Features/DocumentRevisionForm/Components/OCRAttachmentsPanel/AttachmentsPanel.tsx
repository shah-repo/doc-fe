import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Slide, Typography } from '@material-ui/core';
import axios from 'axios';
import { reaction } from 'mobx';
import { Observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { SM, SMBox } from '../../../../..';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { TabTypeOptions } from '../../../../../../state/ducks/documentRevisions/documentType/types';
import { store } from '../../../../../../state/store';
import { Button } from '../../../../../../ui/components/forms/fields-next';
import { toastError, toastSuccess } from '../../../../../../ui/components/notifications';
import Text from '../../../../../../ui/components/Text';
import { FBAttachment } from '../../../../../../ui/form.builder';
import useActionCreator from '../../../../../../ui/hooks/useActionCreator';
import useAsync from '../../../../../../ui/hooks/useAsync';
import useDialog from '../../../../../../ui/hooks/useDialog';
import useStyles from './AttachmentsPanel.styles';
import ListPanel from './Components/ListPanel';
import OCRFilePresenter from './Components/OCRFilePresenter';

const OCR_API_URL = 'https://3jnnotdcy8.execute-api.us-west-1.amazonaws.com/processLotHistoryRecord';
const OCR_API_TOKEN = 'bearer K-ZImFHfgu!=yo49=6AmSc770!nH?cv!Ckf/b0BqZIZLtuImCDfHG4?A?6P0cNfh';

const AttachmentsPanel = () => {
  const { _documentRevisionFormState, _tabsState } = SM.useStores();
  const docRevId = _documentRevisionFormState?.documentRevision?.id;
  const classes = useStyles();
  const [file, setFile] = useState<FBAttachment>();
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);
  const [attachments, setAttachments] = useState<FBAttachment[]>([]);
  const docPreview = useDialog();

  const showDocPreview = (file: FBAttachment) => {
    setFile(file);
    docPreview.open();
  };

  const onSelectionChange = (indices: number[]) => {
    setSelectedIndices(indices);
  };

  const handleClick = async () => {
    const { employeeId, sessionId } = store.getState().auth.user;
    const headers = { authorization: OCR_API_TOKEN, employeeId, sessionId };

    if (!docRevId) {
      toastError('Document revision ID not found!');
      return;
    }

    let processedCount = 0;

    const uploadAttachment = async (index) => {
      const attachment = attachments[index];
      if (!attachment?.url) {
        console.log(`****** No presigned URL for attachment at index=${index} ******`);
        return;
      }

      const data = {
        lhrDocRevId: docRevId,
        url: attachment.url,
        attachmentId: attachment.id,
      };

      await axios.post(OCR_API_URL, data, { headers });
      processedCount++;
    };

    try {
      await Promise.all(selectedIndices.map(uploadAttachment));
      toastSuccess(`Processing ${processedCount} files...`);
    } catch (error) {
      console.error(error);
      toastError('Error processing files');
    }
  };

  const attachmentsAsync = useAsync<any>({
    onSuccess: (attachments) => {
      setAttachments(attachments);
      // TODO: We may need to filter some type of attachments
    },
    onError: () => {
      toastError('Failed to load attachments');
    },
  });

  const fetchAttachments = useActionCreator(
    documentRevisionsActions.getAttachmentsByDocRevId,
  );

  useEffect(() => reaction(
    () => _tabsState?.activeTabId,
    () => {
      if (docRevId && _tabsState?.isTabActive(TabTypeOptions.SUMMARY)) {
        attachmentsAsync.start(fetchAttachments, docRevId, attachmentsAsync);
      }
    },
  ));

  return (
    <Observer>
      {() => (
        <>
          {_tabsState?.isTabActive(TabTypeOptions.SUMMARY) && (
            <Box className={classes.root}>
              <Box className={classes.pannel}>
                <Box pl={3.125} mt={1.25} height={45} alignItems="center">
                  <Typography variant="h6" className={classes.titleText}>
                    <Text translation="form.builder.attachments" />
                  </Typography>
                  <Typography variant="h6" className={classes.titleDescText}>
                    <Text translation="ocr.sub.title.msg" />
                  </Typography>
                </Box>
                <SMBox>
                  <ListPanel
                    {...{ showDocPreview, attachments, onSelectionChange }}
                  />
                  <Box paddingX={1.875} pt={2.5}>
                    <Button
                      onClick={handleClick}
                      variant="contained"
                      color="primary"
                      disabled={selectedIndices.length <= 0}
                      fullWidth
                      data-cy="ocr-extract-data"
                    >
                      <Text translation="ocr.submit.button" />
                    </Button>
                  </Box>
                </SMBox>
              </Box>
              {docPreview.isOpen && (
                <Slide
                  direction="right"
                  in={docPreview.isOpen}
                  mountOnEnter
                  unmountOnExit
                >
                  <Box className={classes.docPreview}>
                    <Box
                      height={40}
                      paddingX={1.875}
                      paddingY={1.5}
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" className={classes.titleText}>
                        <Text translation="ocr.document.preview.title" />
                      </Typography>
                      <Button
                        variant="text"
                        startIcon={
                          <FontAwesomeIcon icon={solid('arrow-left')} />
                        }
                        className={classes.hidePreviewButton}
                        onClick={docPreview.close}
                      >
                        <Text translation="ocr.hide.preview.button" />
                      </Button>
                    </Box>
                    <Box className={classes.previewContainer}>
                      <OCRFilePresenter
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
