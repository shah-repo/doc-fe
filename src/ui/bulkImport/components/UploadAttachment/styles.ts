import { makeStyles } from '@material-ui/core';
import { Colors as ColorsNext } from '../../../layout/theme-next';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: '0 auto',
    gap: '60px',
    maxWidth: 550,
    marginTop: 60,
  },
  titleContainer: {
    marginTop: 50,
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Sora',
    fontWeight: 600,
  },
  subTitle: {
    fontSize: 18,
    fontFamily: 'Sora',
    fontWeight: 400,
  },
  linkInput: {
    marginTop: '10px !important',
  },
  dropzoneLabel: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 10,
    marginBottom: 10,
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
    color: Colors.navy,
  },
  dropzopne: {
    height: 140,
  },
  guideRoot: {
    width: 430,
    backgroundColor: Colors.white_smoke,
  },
  guideTitleContainer: {
    padding: '15px 30px',
    borderBottom: `1px solid ${ColorsNext.tableStroke}`,
    backgroundColor: ColorsNext.tableHeader,
  },
  guideTitle: {
    fontWeight: 600,
    fontSize: 16,
  },
  guideList: {
    padding: '20px 30px',
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
    marginBottom: 30,
  },
  errorsList: {
    gap: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  errorCard: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'Sora',
    padding: '0 8px',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    color: Colors.almost_black,
    backgroundColor: Colors.errorHighlight,
    border: `1px solid ${Colors.latest_red_varient}`,
    borderRadius: 4,
  },
  warningIcon: {
    color: Colors.latest_red_varient,
    width: 16,
    height: 16,
    marginLeft: 'auto',
  },
  reUpload: {
    minWidth: 180,
    fontWeight: 700,
  },
  reUploadContainer: {
    marginTop: 50,
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
    paddingBottom: 10,
  },
  iconFolder: {
    width: 16,
    height: 16,
    color: Colors.raven,
  },
  iconFolderOpen: {
    width: 18,
    height: 16,
    color: Colors.raven,
  },
  folderTreeIcon: {
    color: Colors.navy,
    width: 18,
    height: 16,
    marginRight: 10,
  },
}));
