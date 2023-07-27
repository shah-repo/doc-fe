import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { CATEGORY, DOC_TYPE_GROUP_OPTION } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { Button } from '../../components/forms/fields-next';
import { documentRevisionQueryStatus } from '../../document.revision/utils/helpers';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { ActionsCell } from './components/ActionsCell';
import { MODE_FIELD, Mode } from './constants';
import vendorDataSchema from './schema';
import useStyles from './styles';
import { EditableVendorData, FBPartVendorsProps, VendorData, VendorDataEditEvent } from './types';
import { withFBPartVendors } from './wrap';

const FBPartVendors: React.FC<FBPartVendorsProps> = ({
  // items = [],
  vendors = [],
  vendorData = [],
  name,
  disabled,
  deleteVendorData,
  updateVendorData,
}) => {
  const notGroupOptions = [DOC_TYPE_GROUP_OPTION.SUPPLIER];
  const notIncategory = CATEGORY.WORKORDER_CATEGORY;
  const classes = useStyles();
  const isActive = !disabled;
  const [editedVendorData, setEditedVendorData] = React.useState<Partial<EditableVendorData>>();
  const [primaryVendorId, setPrimaryVendorId] = useState(vendorData.find(vendor => vendor.primary)?.id);
  const [statuses, saveStatuses] = useState<DocumentRevisionStatus[]>([]);
  const editVendorData = ({ dataItem }: VendorDataEditEvent) => setEditedVendorData(dataItem);
  const deleteTootltipText = translate('Delete');
  const isVendorDataAdded = editedVendorData?.[MODE_FIELD] === Mode.add;
  const handleRowClick = isActive ? editVendorData : undefined;

  // Formik

  const formik = useFormik<Partial<EditableVendorData>>({
    initialValues: {},
    validate: (values) => {
      const errors: Record<string, string> = {};

      return errors;
    },
    onSubmit: (values) => {
      const vendorDataToSave = omit(values, [MODE_FIELD]);
      updateVendorData?.(vendorDataToSave as VendorData);
      discardLotVendorData();
    },
  });

  const createDraftVendorData = () => setEditedVendorData({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

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
          onConfirm={formik.submitForm}
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

  const async = useAsync({
    onSuccess: (response: DocumentRevisionStatus[] = []) => {
      saveStatuses(response);
    },
  });
  const getStatusesAction = useActionCreator(
    documentRevisionsActions.getDocRevStatuses,
  );
  const getStatuses = () =>
    async.start(
      getStatusesAction,
      async,
      documentRevisionQueryStatus(),
      notGroupOptions,
      undefined,
      notIncategory,
    );

  useEffect(() => {
    getStatuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = vendorDataSchema({
    vendors,
    setPrimaryVendorId,
    onRowClick: handleRowClick,
    statuses,
  });

  const vendorDataList = vendorData.reduce((list, item) => {
    const isVendorDataEdited = editedVendorData && editedVendorData.id === item.id;
    return [
      ...list,
      {
        ...(isVendorDataEdited ? editedVendorData : item),
        primary: item.id === primaryVendorId,
        [MODE_FIELD]: isVendorDataEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isVendorDataAdded ? [editedVendorData] : []);

  return (
    <Box position="relative">
      <FBInput name={name}>
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
      <FormikProvider value={formik}>
        <KendoDataGrid<VendorData>
          fullWidth
          filterable
          hasBoxScrollbars
          schema={schema}
          data={vendorDataList}
          onRowClick={handleRowClick}
          rowRender={rowRender}
        />
      </FormikProvider>
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          onClick={createDraftVendorData}
        >
          {translate('form.builder.new.supplier.add')}
        </Button>
      )}
    </Box>
  );
};
export default withFBPartVendors(FBPartVendors);
