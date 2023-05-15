import { makeStyles } from '@material-ui/core';
import { Colors as NextColors } from '../../layout/theme-next';
import Colors from '../../layout/theme/utils/colors';

const FBPurchaseOrderClasses = makeStyles({
  root: {
    width: '100%',
    tableLayout: 'fixed',
    '& th': {
      padding: '14px 5px 14px 15px',
      whiteSpace: 'nowrap',
      background: Colors.water,
      boxShadow: `{0 1px 0 ${Colors.chinese_silver}}`,
      borderRadius: '3px 0 0 0',
    },
    '& .FBTotal-root': {
      padding: '10px 8px',
      borderBottom: 0,
    },
    '& .FBIcon-root': {
      color: '#c1c1c1',
      marginTop: '5px',
      '&:hover': {
        color: '#888888',
      },
    },
  },
  table: {
    '& th': {
      whiteSpace: 'nowrap',
      backgroundColor: Colors.athens_gray,
      cursor: 'default',
    },
    '& tr': {
      cursor: 'pointer',
      height: '47px',
      border: `1px solid ${Colors.chinese_silver}`,
    },
    '& td': {
      padding: '0px 8px',
      whiteSpace: 'nowrap',
    },
  },
  button: {
    borderRadius: 0,
    borderStyle: 'dashed',
    borderColor: Colors.dodger_blue,
    height: '40px',
  },
  list: {
    borderBottom: 'none',
  },
  sum: {
    verticalAlign: 'baseline',
    borderBottom: 'none',
    '& tr': {
      borderLeft: 0,
      background: Colors.white,
    },
  },
});

export const useStyles = makeStyles((theme) => ({
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

export default FBPurchaseOrderClasses;
