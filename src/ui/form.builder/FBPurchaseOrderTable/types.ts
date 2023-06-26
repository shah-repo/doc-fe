import { FBCurrency, FBInputProps, FBPurchaseOrderCalculation, FBPurchaseOrderItem, FBPurchaseOrderProps } from '..';
import { DialogHandler } from '../../hooks/useDialog';

export type FBPurchaseOrderTableProps =
  & Pick<FBInputProps, 'name' | 'disabled'>
  & Pick<FBPurchaseOrderProps, 'handleItem' | 'handleLot' | 'disabled' | 'mode'>
  & {
    handleShippingCostChange?: (ev: React.ChangeEvent<any>) => any
    handleTaxChange?: (ev: React.ChangeEvent<any>) => void
    handleTaxRateChange?: (ev: React.ChangeEvent<any>) => void
    handleCurrencyChange?: (ev, value) => void
    handleDelete?: (index: number) => (e: any) => void
    reCalculateValueOnBlur?: () => void
    onAlertNotificationCancel?: (e: React.MouseEvent<HTMLElement>) => void
    onAlertNotificationConfirm?: () => void
    onAddLineItemClick?: () => void
    items?: FBPurchaseOrderItem[]
    calculation?: FBPurchaseOrderCalculation
    loading?: boolean
    isReceivable?: boolean
    isPOAddAction?: boolean
    isPORemoveAction?: boolean
    dialog?: DialogHandler
    isDocumentReleased?: boolean
    isPOEditState?: boolean
  };

export type FBPurchaseOrderTableTotalProps = Pick<FBPurchaseOrderTableProps,
| 'handleShippingCostChange'
| 'handleTaxChange'
| 'handleTaxRateChange'
| 'handleCurrencyChange'
| 'reCalculateValueOnBlur'
| 'calculation'
| 'disabled'
| 'name'
>;

export interface FBCurrencyOption {
  text: string
  value: FBCurrency
}
