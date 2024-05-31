import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    margin: '0 auto',
    maxWidth: 1066,
    marginTop: 60,
    gap: '30px',
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
  listContainer: {
    paddingTop: 20,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.sky_blue,
    marginBottom: 10,
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: theme.spacing(2),
  },
  removeIcon: {
    color: Colors.opal_red,
  },
  form: {
    width: '100%',
  },
  cell: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: 'Sora',
    padding: '0 8px',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    color: Colors.almost_black,
  },
  errorCell: {
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
  informationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  actionsHeader: {
    display: 'flex',
    gap: '20px',
    position: 'absolute',
    right: 24,
    alignItems: 'center',
  },
  actionsContainer: {
    display: 'flex',
    marginTop: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsFooterContainer: {
    display: 'flex',
    width: 'fit-content',
    gap: '20px',
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
    marginTop: 20,
    alignSelf: 'center',
  },
}));
