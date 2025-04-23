import { MutableRefObject } from 'react';
import { CellTemplateProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { ISupplierScanResultRev } from '../../interface';

export interface FormInputComparisonProps {
  dataItem: ISupplierScanResultRev
}

export type BooleanRef = MutableRefObject<boolean> | null;

export interface CustomTemplateProps extends CellTemplateProps<ISupplierScanResultRev> {}
