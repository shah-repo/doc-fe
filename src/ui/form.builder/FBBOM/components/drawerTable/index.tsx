import React from 'react';
import NoDataFound from '../../../../components/common/kendo/NoDataFound';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { AlternateParts, FBBOMDrawerTableProps } from '../treelist/interface';
import { columns as schema } from './constants';
import alternateParts from './data';

const FBBOMDrawerTable: React.FunctionComponent<FBBOMDrawerTableProps> = () => {
  return (
    <div>
      <KendoDataGrid<AlternateParts>
        fullWidth={false}
        filterable={false}
        hasBoxScrollbars
        schema={schema}
        data={alternateParts}
        fallback={<NoDataFound />}
      />
    </div>
  );
};

export default FBBOMDrawerTable;
