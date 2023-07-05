import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Popper } from '@material-ui/core';
import cx from 'classnames';
import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Button } from '../../components/forms/fields-next';
import InputFilter from '../FBApprovalMatrix/components/InputFilter';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import Actions, { ActionsProps } from './components/Actions';
import { ConversionCellTemplate } from './components/ConversionCellTemplate';
import { LeadTimeCellTemplate } from './components/LeadTimeCellTemplate';
import { SupplierCellTemplate } from './components/SupplierCellTemplate';
import { SupplierPartNumberCellTemplate } from './components/SupplierPartNumberCellTemplate';
import { SupplierStatusCellTemplate } from './components/SupplierStatusCellTemplate';
import { UnitCostCellTemplate } from './components/UnitCostCellTemplate';
import { UnitsBuyCellTemplate } from './components/UnitsBuyCellTemplate';
import { UnitsUseCellTemplate } from './components/UnitsUseCellTemplate';
import { MODE_FIELD, Mode } from './constants';
import useStyles from './styles';
import { EditableVendorData, VendorData, VendorDataEditEvent, VendorDataProps } from './types';
import { withFBVendorData } from './wrap';

interface SchemaOptions {
  vendors
}

const vendorDataSchema = (vendors: SchemaOptions) => ([
  {
    id: 'supplier',
    field: 'supplier',
    title: 'Supplier',
    filterCell: InputFilter,
    template: (props) => <SupplierCellTemplate {...props} vendors={vendors} />,
    width: 150,
  },
  {
    id: 'status',
    field: 'status',
    title: 'Supplier Status',
    filterCell: InputFilter,
    template: (props) => <SupplierStatusCellTemplate {...props} vendors={vendors} />,

    width: 150,
  },
  {
    id: 'cost',
    field: 'cost',
    title: 'Unit Cost',
    filterCell: InputFilter,
    template: UnitCostCellTemplate,
    width: 150,
  },
  {
    id: 'partNumber',
    field: 'partNumber',
    title: 'Supplier Part Number',
    filterCell: InputFilter,
    template: SupplierPartNumberCellTemplate,
    width: 150,
  },
  {
    id: 'unitsBuy',
    field: 'unitsBuy',
    title: 'Units(Buy)',
    filterCell: InputFilter,
    template: UnitsBuyCellTemplate,
    width: 150,
  },
  {
    id: 'conversion',
    field: 'conversion',
    title: 'Conversion',
    filterCell: InputFilter,
    template: ConversionCellTemplate,
    width: 150,
  },
  {
    id: 'unitsUse',
    field: 'unitsUse',
    title: 'Units(Use)',
    filterCell: InputFilter,
    template: UnitsUseCellTemplate,
    width: 150,
  },
  {
    id: 'leadTime',
    field: 'leadTime',
    title: 'Lead Time(Days)',
    filterCell: InputFilter,
    template: LeadTimeCellTemplate,
    width: 150,
  },

]);

const ActionsCell: React.FC<ActionsProps<EditableVendorData> & { rootClassName?: string }> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <div ref={ref} className={props.rootClassName} />
      <Popper
        open
        placement="bottom-end"
        anchorEl={ref.current}
      >
        <Actions
          scrollBehavior="smooth"
          {...props}
        />
      </Popper>
    </>
  );
};

const FBVendorDataTable: React.FC<VendorDataProps> = ({
  items = [],
  vendors = [],
  name,
  disabled,
  deleteVendorData,
  addVendorData,
}) => {
  const classes = useStyles();
  const [editedVendorData, setEditedVendorData] = React.useState<Partial<EditableVendorData>>();

  const isActive = true;

  const editVendorData = ({ dataItem }: VendorDataEditEvent) => setEditedVendorData(dataItem);

  const createDraftVendorData = () => setEditedVendorData({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  /// ///////////////////////////

  const discardLotVendorData = () => {
    setEditedVendorData(undefined);
  };
  const removeVendorData = () => {
    if (!editedVendorData) {
      return;
    }
    deleteVendorData?.(editedVendorData as VendorData);
    discardLotVendorData();
  };

  const submitForm = () => {
    console.log('submitForm');
  };

  const shouldDisableDelete = true;

  const deleteTootltipText
      = shouldDisableDelete
        ? translate('Delete')
        : undefined;

  const schema = vendorDataSchema(vendors);

  const rowRender: DataGridProps<EditableVendorData>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableVendorData;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }
    const actions = (
      <td className={classes.actionsCell}>
        <ActionsCell
          dataItem={item}
          onConfirm={submitForm}
          onDiscard={discardLotVendorData}
          onDelete={removeVendorData}
          deleteTooltipText={deleteTootltipText}
          isDeleteDisabled={false}
          rootClassName={classes.popperHolder}
        />
      </td>
    );
    return React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
    );
  };

  const isVendorDataAdded = editedVendorData?.[MODE_FIELD] === Mode.add;

  const vendorDataList = items.reduce((list, item) => {
    const isVendorDataEdited = editedVendorData && editedVendorData.id === item.id;
    return [
      ...list,
      {
        ...(isVendorDataEdited ? editedVendorData : item),
        [MODE_FIELD]: isVendorDataEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isVendorDataAdded ? [editedVendorData] : []);

  return (
    <Box position="relative">
      <FBInput type="vendorData" name={name}>
        <FBSection
          label="form.builder.new.supplier.add"
        >
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftVendorData}
            >
              {translate('form.builder.new.supplier.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>

      <KendoDataGrid<VendorData>
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={vendorDataList}
        onRowClick={isActive ? editVendorData : undefined}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          onClick={createDraftVendorData}
        >
          {translate('form.builder.new.supplier.add')}
        </Button>
      )}
    </Box>
  );
};
export default withFBVendorData(FBVendorDataTable);
