import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { documentRevisionsActions } from '../../../../../../state/ducks/documentRevisions';
import KendoDataGrid from '../../../../../components/KendoDataGrid/KendoDataGrid';
import { toastError } from '../../../../../components/notifications';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import { Mode } from '../../../../FBApprovalMatrixRoles/constants';
import { SUPPLIER_FIELD, SUPPLIER_STATUS_FIELD } from '../../../../FBPartVendors/constants';
import { buildSchema } from '../../../../FBPartVendors/schema';
import { EditableVendor, Vendor } from '../../../../FBPartVendors/types';
import { useOptions } from '../../../../FBPartVendors/utils';
import { MODE_FIELD } from '../../treelist/constants';
import { VendorTableProps } from './interface';
import useStyles from './styles';

const PartVendorsTable: React.FC<VendorTableProps> = ({
  parentNodeRevId,
}) => {
  const classes = useStyles();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const { suppliers, units, statuses } = useOptions();
  const fetchVendors = useActionCreator(
    documentRevisionsActions.fetchVendors,
  );

  const fetchVendorsAsync = useAsync({
    onSuccess: (response?: Vendor[]) => {
      setVendors(response ?? []);
    },
    onError: (response) => {
      toastError(response);
    },
  });

  useEffect(() => {
    if (!parentNodeRevId) {
      return;
    }
    fetchVendorsAsync.start(
      fetchVendors,
      parentNodeRevId,
      fetchVendorsAsync,
    );
  }, [parentNodeRevId]);

  const schema = buildSchema({
    units,
    statuses,
    suppliers,
    actionsClass: '',
    isActive: false,
    isInEditMode: false,
  });

  const vendorsList = vendors?.reduce((list, item) => {
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
        loading= {fetchVendorsAsync.isLoading}
        hasBoxScrollbars
        schema={schema}
        data={vendorsList as unknown as EditableVendor[]}
      />
    </Box>
  );
};

export default PartVendorsTable;
