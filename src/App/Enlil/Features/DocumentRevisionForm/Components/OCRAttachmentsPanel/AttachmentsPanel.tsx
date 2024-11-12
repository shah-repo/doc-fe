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

/* const attachments = [
  {
    createdAt: '2024-08-30T03:50:29.486Z',
    updatedAt: '2024-08-30T03:50:29.486Z',
    id: '2331fde5-73c0-4026-a792-79b16cc9669a',
    name: 'Enlil',
    description: null,
    type: 'pdf',
    lineType: 'CLEAN_COPY',
    version: null,
    s3link: 'a295d4f4-5854-4faa-9a50-eba1a2819612/2024-08-30T03:50:29.487Z/Enlil.pdf',
    s3linkCleanCopy: null,
    billIds: [],
    importMetadataJson: {},
    cleanCopyStatus: 'NOT_REQUIRED',
    companyId: 'a295d4f4-5854-4faa-9a50-eba1a2819612',
    fileSizeS3Link: 495782,
    fileSizeS3LinkCleanCopy: null,
    documentRevisions: [],
    owner: {
      createdAt: '2024-08-29T16:31:46.731Z',
      updatedAt: '2024-08-29T16:31:46.731Z',
      id: '531416f0-8f93-4758-ab1c-1f9bf584a8b0',
      companyId: 'a295d4f4-5854-4faa-9a50-eba1a2819612',
      active: true,
      slackUserId: null,
    },
    isComplete: true,
  },
  { name: 'Inspection Instructions.docx', type: 'docx' },
  { name: 'Inspection results spreadsheet.xlsx', type: 'xlsx' },
]; */

const AttachmentsPanel = () => {
  const { _documentRevisionFormState } = SM.useStores();
  const docRevId = _documentRevisionFormState?.documentRevision?.id;
  console.log(`declaration docRevId:${docRevId}`);
  const classes = useStyles();
  const [file, setFile] = useState<FBAttachment>();
  const [selectedIndices, setSelectedIndices] = React.useState<any>([]);
  const [attachments, setAttachments] = useState<any>([]);
  const docPreview = useDialog();

  const showDocPreview = (file: FBAttachment) => {
    console.log('SHOW DOC PREVIEW');
    console.log(file);
    setFile(file);
    docPreview.open();
  };

  console.log('*************** selectedIndices ***************');
  console.log(selectedIndices);
  console.log('token:');
  console.log(`bearer ${store.getState().auth.user.employeeId}:${store.getState().auth.user.sessionId}`);
  const onSelectionChange = (indices: number) => {
    setSelectedIndices(indices);
  };

  const handleClick = async () => {
    const headers = {
      authorization: 'bearer K-ZImFHfgu!=yo49=6AmSc770!nH?cv!Ckf/b0BqZIZLtuImCDfHG4?A?6P0cNfh',
      employeeId: store.getState().auth.user.employeeId,
      sessionId: store.getState().auth.user.sessionId,
    };
    try {
      console.log(`docRevId:${docRevId}`);
      if (!docRevId) {
        toastError('Document revision ID not found!');
        return;
      }
      let counter = 0;
      for (const index of selectedIndices) {
        if (attachments[index]?.url) {
          console.log(`Processing attachment at index=${index}`);
          console.log(attachments[index]);
          const data = {
            lhrDocRevId: docRevId,
            url: attachments[index].url,
            attachmentId: attachments[index].id,
          };
          const apiUrl = 'https://3jnnotdcy8.execute-api.us-west-1.amazonaws.com/processLotHistoryRecord';
          const response = await axios.post(apiUrl, data, { headers });
          console.log(`****** Processed Attachment with index=${index} ****************`);
          console.log(response.data);
          counter++;
        } else {
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
      console.log(attachments);
      setAttachments(attachments);
      // We may need to filter some type of attachments
      // setAttachments(attachments?.filter(attachment => attachment.type === PDF));
    },
    onError: () => {
      console.log('Error');
    },
  });

  const fetchAttachments = useActionCreator(
    documentRevisionsActions.getAttachmentsByDocRevId,
  );

  useEffect(() => {
    try {
      console.log(`useEffect docRevId:${docRevId}`);
      if (docRevId) {
        attachmentsAsync.start(fetchAttachments, docRevId, attachmentsAsync);
      }
    } catch (error) {
      console.error('Failed to load attachments', error);
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
              onClick={() => {
                handleClick();
              }}
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
