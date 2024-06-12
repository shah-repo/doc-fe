import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../layout/theme-next';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: '0 auto',
    maxWidth: 1066,
    marginTop: theme.spacing(7.5),
    gap: theme.spacing(3.75, 3.75),
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
  listContainer: {
    paddingTop: theme.spacing(2.5),
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryHighlight,
    marginBottom: theme.spacing(1.25),
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: theme.spacing(2),
  },
  removeIcon: {
    color: Colors.remove,
  },
  form: {
    width: '100%',
  },
  cell: {
    fontSize: 14,
    fontWeight: 400,
    padding: theme.spacing(0, 1),
    height: 30,
    display: 'flex',
    alignItems: 'center',
    color: Colors.textBlack,
  },
  errorCell: {
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
  informationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  actionsHeader: {
    display: 'flex',
    gap: theme.spacing(2.5, 2.5),
    position: 'absolute',
    right: 24,
    alignItems: 'center',
  },
  actionsContainer: {
    display: 'flex',
    marginTop: theme.spacing(6.25),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsFooterContainer: {
    display: 'flex',
    width: 'fit-content',
    gap: theme.spacing(2.5, 2.5),
  },
  button: {
    minWidth: 180,
    fontWeight: 700,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  actionContainer: {
    display: 'flex',
    width: '100%',
    margin: '0 auto',
    maxWidth: 1066,
    justifyContent: 'space-between',
  },
  needHelpContainer: {
    marginTop: theme.spacing(2.5),
    alignSelf: 'center',
  },
}));
