import { makeStyles } from '@material-ui/core';
import Colors from '../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  uploadAttachmentField: {
    padding: theme.spacing(0.625, 1.25),
    marginBottom: theme.spacing(1.25),
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  uploadAttachmentFieldIcon: {
    transform: 'rotate(45deg)',
    height: '0.7em',
    width: '0.7em',
  },
  uploadAttachmentFieldLabel: {
    fontSize: 12,
    fontWeight: 400,
    marginLeft: theme.spacing(0.75),
  },
  attachmentsContainer: {
    color: Colors.navy,
    fontSize: 12,
    marginBottom: theme.spacing(1.25),
    overflow: 'auto',
    maxHeight: 105,
    width: 'fit-content',
    '&:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  attachmentName: {
    display: 'flex',
    '& svg:first-child': {
      transform: 'rotate(45deg)',
      height: '0.7em',
      width: '0.7em',
    },
    '& svg:last-child': {
      height: '1em',
      width: '1em',
    },
  },
}));
