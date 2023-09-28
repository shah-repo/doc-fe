import { makeStyles } from '@material-ui/core';
import { Colors as ThemeColors } from '../../layout/theme-next';
import Colors from '../../layout/theme/utils/colors';
export const labelStyle = {
  labelProps: {
    marginTop: '20px',
    lineHeight: '15px',
    fontWeight: 600,
    fontSize: '12px',
    color: Colors.almost_black,
  },
  printingTitle: {
    paddingLeft: '10px',
    lineHeight: '20px',
    fontWeight: '600',
    color: Colors.navy,
},
  printingSubTitle: {
    marginTop: '20px',
    fontWeight: 600,
    color: Colors.almost_black,
  },
};

export const styles = makeStyles({
  collapseContainer: {
    border: '2px lightgrey solid',
    padding: '20px',
    borderRadius: '4px',
  },
  expandIcon: {
    color: Colors.navy,
  },
  saveButton: {
    display: 'flex',
    justifyContent: 'end',
  },
  divider: {
    margin: '0px 32px 0px 28px',
  },
  printingTab: {
    backgroundColor: ThemeColors.primaryBg,
    textTransform: 'none',
  },
});
