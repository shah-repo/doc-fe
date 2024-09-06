import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Slide, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { SMBox } from '../../../../..';
import { Button } from '../../../../../../ui/components/forms/fields-next';
import Text from '../../../../../../ui/components/Text';
import { FBAttachment } from '../../../../../../ui/form.builder';
import useDialog from '../../../../../../ui/hooks/useDialog';
import useStyles from './AttachmentsPanel.styles';
import ListPanel from './Components/ListPanel';
import OCRFilePresenter from './Components/OCRFilePresenter';

const attachments = [
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
];

const AttachmentsPanel = () => {
  const classes = useStyles();
  const [file, setFile] = useState<FBAttachment>();
  const docPreview = useDialog();

  const showDocPreview = (file: FBAttachment) => {
    setFile(file);
    docPreview.open();
  };

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
          <ListPanel {...{ showDocPreview, attachments }} />
          <Box paddingX={1.875} pt={2.5}>
            <Button variant="contained" color="primary" fullWidth >
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
