import { MutableRefObject } from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { SupplierScanResultRevision } from '../../interface';

export interface FormInputComparisonProps {
  dataItem: SupplierScanResultRevision
}
export type BooleanRef = MutableRefObject<boolean> | null;
export interface CustomTemplateProps extends CellTemplateProps<SupplierScanResultRevision> {}
