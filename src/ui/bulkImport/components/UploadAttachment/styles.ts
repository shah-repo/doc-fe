import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: '0 auto',
    gap: theme.spacing(7.5, 7.5),
    maxWidth: 550,
    marginTop: theme.spacing(7.5),
  },
  titleContainer: {
    marginTop: theme.spacing(6.25),
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 400,
  },
  linkInput: {
    marginTop: `${theme.spacing(1.25)} !important`,
  },
  dropzoneLabel: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(1.25),
    color: 'black',
  },
  textDropZone: {
    '& span': {
      fontWeight: '400',
      fontSize: 14,
      fontFamily: 'Sora',
    },
  },
  browseText: {
    color: Colors.primary,
  },
  dropzopne: {
    height: 140,
  },
  guideRoot: {
    width: 430,
    backgroundColor: Colors.gray,
  },
  guideTitleContainer: {
    padding: theme.spacing(1.875, 3.75),
    borderBottom: `1px solid ${Colors.tableStroke}`,
    backgroundColor: Colors.tableHeader,
  },
  guideTitle: {
    fontWeight: 600,
    fontSize: 16,
  },
  guideList: {
    padding: theme.spacing(2.5, 3.75),
  },
  rootTree: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
  contentRoot: {
    '&:before': {
      display: 'none',
    },
  },
  formContainer: {
    width: 550,
  },
  formContainerError: {
    width: 340,
  },
  errorsContainer: {

  },
  errorsTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: theme.spacing(3.75),
  },
  errorsList: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    flexDirection: 'column',
  },
  errorCard: {
    fontSize: 14,
    fontWeight: 400,
    padding: theme.spacing(0, 1),
    height: 30,
    display: 'flex',
    alignItems: 'center',
    color: Colors.textBlack,
    backgroundColor: Colors.errorHighlight,
    border: `1px solid ${Colors.error}`,
    borderRadius: 4,
  },
  warningIcon: {
    color: Colors.error,
    width: 16,
    height: 16,
    marginLeft: 'auto',
  },
  reUpload: {
    minWidth: 180,
    fontWeight: 700,
  },
  reUploadContainer: {
    marginTop: theme.spacing(6.25),
    textAlign: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  sampleTemplate: {
    maxHeight: 36,
    display: 'flex',
  },
  titleContainer2: {
    paddingBottom: theme.spacing(1.25),
  },
  iconFolder: {
    width: 16,
    height: 16,
    color: Colors.textGray,
  },
  iconFolderOpen: {
    width: 18,
    height: 16,
    color: Colors.textGray,
  },
  folderTreeIcon: {
    color: Colors.primary,
    width: 18,
    height: 16,
    marginRight: theme.spacing(1.25),
  },
  or: {
    padding: theme.spacing(0, 1.05),
    backgroundColor: Colors.background,
    fontWeight: 600,
    fontSize: 12,
  },
}));
