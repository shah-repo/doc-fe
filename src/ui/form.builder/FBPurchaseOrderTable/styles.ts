import { makeStyles } from '@material-ui/core';
import { Colors as NextColors } from '../../layout/theme-next';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  grid: {
    '& .k-grid-header': {
      position: 'sticky',
      borderBottom: `1px solid ${NextColors.tableStroke}`,
      zIndex: 3,
      top: -28,
    },
  },
  currencyCell: {
    textAlign: 'right !important' as 'right',

    '& .k-link': {
      justifyContent: 'flex-end',
    },
  },
  lotMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1, 1),
    fontSize: 12,
    marginBottom: theme.spacing(1.5),
  },
  actionCell: {
    padding: `${theme.spacing(0.5, 0.5)} !important`,
    textAlign: 'center !important' as 'center',
  },
  lotCell: {
    padding: `${theme.spacing(0.5, 1)} !important`,
  },
  nullValue: {
    color: NextColors.textDisabled,
  },
  activeGrid: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottom: 'none',
  },
  calculation: {
    backgroundColor: Colors.white,
    padding: theme.spacing(0.5, 1.5, 1.5),
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  calculationFields: {
    marginRight: theme.spacing(5),
  },
  calculationItem: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(2, 0),
    alignItems: 'center',
  },
  calculationLabel: {
    marginRight: theme.spacing(2),
    flexGrow: 1,
    fontWeight: 600,
  },
  calculationField: {
    width: 160,
  },
  calculationTotal: {
    fontWeight: 600,
    textAlign: 'right',
  },
  calculationInput: {
    padding: `${theme.spacing(0.5, 0.5)} !important`,
    textAlign: 'right',
  },
  calculationSelect: {
    '@supports (width: -moz-available)': {
      width: '-moz-available',
    },
    '@supports (width: -webkit-fill-available)': {
      width: '-webkit-fill-available',
    },
    padding: `${theme.spacing(0.5, 4, 0.5, 0.25)} !important`,
  },
  calculationTax: {
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing(0.5)}px`,
  },
  calculationExcange: {
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  calculationDivider: {
    margin: theme.spacing(2, 0),
  },
}));
