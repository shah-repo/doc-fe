import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Slide, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { SM, SMBox } from '../../../../..';
import { Button } from '../../../../../../ui/components/forms/fields-next';
import Text from '../../../../../../ui/components/Text';
import { FBAttachment } from '../../../../../../ui/form.builder';
import useDialog from '../../../../../../ui/hooks/useDialog';
import useStyles from './AttachmentsPanel.styles';
import ListPanel from './Components/ListPanel';
import OCRFilePresenter from './Components/OCRFilePresenter';
import axios from 'axios';
import useAsync from '../../../../../../ui/hooks/useAsync';
import useActionCreator from '../../../../../../ui/hooks/useActionCreator';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import { store } from '../../../../../../state/store';
import { toastError, toastSuccess } from '../../../../../../ui/components/notifications';

const OCR_API_URL = 'https://3jnnotdcy8.execute-api.us-west-1.amazonaws.com/processLotHistoryRecord';
const OCR_API_TOKEN = 'bearer K-ZImFHfgu!=yo49=6AmSc770!nH?cv!Ckf/b0BqZIZLtuImCDfHG4?A?6P0cNfh';

const AttachmentsPanel = () => {
  const { _documentRevisionFormState } = SM.useStores();
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
    const headers = { authorization: OCR_API_TOKEN, employeeId, sessionId};
    try {
      if (!docRevId) {
        toastError('Document revision ID not found!');
        return;
      }
      let counter = 0;
      for (const index of selectedIndices) {
        if (attachments[index]?.url) {
          const data = {
            lhrDocRevId: docRevId,
            url: attachments[index].url,
            attachmentId: attachments[index].id,
          };

          await axios.post(OCR_API_URL, data, { headers });
          counter++;
        } else {
          // TODO: remove when we move to using s3 links instead of presigned urls
          console.log(`****** There is no presigned url for attachment at index=${index} ****************`);
        }
      }
      toastSuccess(`Processing ${counter} files...`);
    }
    catch (err) {
      toastError('Error');
    }
  };

  const attachmentsAsync = useAsync<any>({
    onSuccess: (attachments) => {
      setAttachments(attachments);
      // We may need to filter some type of attachments
      // setAttachments(attachments?.filter(attachment => attachment.type === PDF));
    },
    onError: () => {
      toastError('Failed to load attachments');
    },
  });

  const fetchAttachments = useActionCreator(
    documentRevisionsActions.getAttachmentsByDocRevId,
  );

  useEffect(() => {
    if (docRevId) {
      attachmentsAsync.start(fetchAttachments, docRevId, attachmentsAsync);
    }
  }, [docRevId]);

  return (
    <Box className={classes.root}>
      <Box className={classes.pannel}>
        <Box
          pl={3.125}
          mt={1.25}
          height={45}
          alignItems="center"
        >
          <Typography variant="h6" className={classes.titleText}>
            <Text translation="form.builder.attachments" />
          </Typography>
          <Typography variant="h6" className={classes.titleDescText}>
            <Text translation="ocr.sub.title.msg" />
          </Typography>
        </Box>
        <SMBox>
          <ListPanel {...{ showDocPreview, attachments, onSelectionChange }} />
          <Box paddingX={1.875} pt={2.5}>
            <Button
              onClick={handleClick}
              variant="contained"
              color="primary"
              disabled={selectedIndices.length <= 0}
              fullWidth >

              <Text translation="ocr.submit.button" />
            </Button>
          </Box>
        </SMBox>
      </Box>
      {docPreview.isOpen && <Slide direction="right" in={docPreview.isOpen} mountOnEnter unmountOnExit >
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
            <Button variant="text"
              startIcon={<FontAwesomeIcon icon={solid('arrow-left')} />}
              className={classes.hidePreviewButton}
              onClick={docPreview.close}
            >
              <Text translation="ocr.hide.preview.button" />
            </Button>
          </Box>
          <Box className={classes.previewContainer}>
            <OCRFilePresenter file={file as FBAttachment} setFile={setFile} />
          </Box>
        </Box>
      </Slide>}
    </Box>
  );
};

export default AttachmentsPanel;
