import React from 'react';
import { CellTemplateProps } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { CompanyLocation, LotTransfer } from '../types';

interface Props extends CellTemplateProps<LotTransfer> {
  locations: CompanyLocation[]
}
export const LocationCellTemplate: React.FC<Props> = ({ dataItem, field, locations }) => {
  const location = locations.find((loc) => loc.id === dataItem[field]);
  return <>{location ? location.name : '-'}</>;
};
