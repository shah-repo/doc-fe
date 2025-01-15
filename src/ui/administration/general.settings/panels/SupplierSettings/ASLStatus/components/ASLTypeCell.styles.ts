import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../../../layout/theme-next';

export const ASLStatusChipStyles = (theme: Theme) => createStyles({
  chip: {
    display: 'inline-flex',
    flexDirection: 'row',
    borderRadius: 3,
    border: `1px solid ${Colors.statusDraftBorder}`,
    background: Colors.statusDraftBg,
    fontWeight: 600,
    fontSize: 10,
    lineHeight: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.statusDraftBorder,
    cursor: 'pointer',
    marginRight: theme.spacing(0.5),
  },
  GREEN_STATUS: {
    background: Colors.successHighlight,
    color: Colors.approve,
    border: `1px solid ${Colors.success}`,
  },
  PENDING_STATUS: {
    background: Colors.warningHighlight,
    color: Colors.warning,
    border: `1px solid ${Colors.warningStatusBorder}`,
  },
  GRAY_STATUS: {
    background: Colors.gray,
    color: Colors.textGray,
    border: `1px solid ${Colors.textGray}`,
  },
  RED_STATUS: {
    background: Colors.errorHighlight,
    color: Colors.error,
    border: `1px solid ${Colors.error}`,
  },
});

export default makeStyles((theme) => ({
  ...ASLStatusChipStyles(theme),
}));
