import { Box } from '@material-ui/core';
import React from 'react';
import KendoDataGrid from '../../../../../components/KendoDataGrid/KendoDataGrid';
import { Mode } from '../../../../FBApprovalMatrixRoles/constants';
import { SUPPLIER_FIELD, SUPPLIER_STATUS_FIELD } from '../../../../FBPartVendors/constants';
import { buildSchema } from '../../../../FBPartVendors/schema';
import { EditableVendor } from '../../../../FBPartVendors/types';
import { useOptions } from '../../../../FBPartVendors/utils';
import { MODE_FIELD } from '../../../constants';
import { VendorTableProps } from './interface';
import useStyles from './styles';

const PartVendorsTable: React.FC<VendorTableProps> = ({
  vendors = [],
}) => {
  const classes = useStyles();

  const { suppliers, units, statuses } = useOptions();

  const schema = buildSchema({
    units,
    statuses,
    suppliers,
    isActive: false,
    isInEditMode: false,
  });

  const vendorsList = vendors.reduce((list, item) => {
    const supplier = suppliers.find((vendor) => vendor.id === item.vendor.id);
    const supplierName = supplier?.name ?? item.vendor?.name;
    const supplierStatus = supplier?.displayStatus ?? '';

    return [
      ...list,
      {
        ...item,
        [SUPPLIER_FIELD]: supplierName,
        [SUPPLIER_STATUS_FIELD]: supplierStatus,
        [MODE_FIELD]: Mode.show,
      },
    ];
  }, []);

  return (
    <Box position="relative">
      <KendoDataGrid<EditableVendor>
        className={classes.grid}
        fullWidth={false}
        filterable={false}
        hasBoxScrollbars
        schema={schema}
        data={vendorsList as unknown as EditableVendor[]}
      />
    </Box>
  );
};

export default PartVendorsTable;
