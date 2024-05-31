import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export default makeStyles(theme => ({
  container: {
    display: 'block',
    margin: '0 auto',
    maxWidth: 550,
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
    width: 42,
    height: 42,
    color: Colors.chinese_silver,
  },
  avatar: {
    marginRight: theme.spacing(2),
    width: 42,
    height: 42,
  },
  removeIcon: {
    color: Colors.opal_red,
  },
  select: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
  selectLabel: {
    marginBottom: 20,
    fontSize: 17,
    fontWeight: 400,
    fontFamily: 'Sora',
  },
}));
