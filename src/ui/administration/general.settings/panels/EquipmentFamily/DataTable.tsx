import { useFormik, useFormikContext } from 'formik';
import { omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { EquipmentLocation, GeneralSettings } from '../../../../../state/ducks/company/types';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { DataGridRowClickEvent } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import LocationsSetting from '../../../../components/LocationsSetting';
import { buildSchema } from '../../../../components/LocationsSetting/schema';
import useStyles from '../../../../components/LocationsSetting/styles';
import { EditableLocation } from '../../../../components/LocationsSetting/types';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { EquipmentFamily } from '../../constants';

interface DataTableProps {
data: EquipmentLocation[]
field: EquipmentFamily
}

const DataTable: React.FC<DataTableProps> = ({
  data = [],
  field,
}) => {
  const classes = useStyles();
  const { values: formValues } = useFormikContext<GeneralSettings>();
  const settingsId = useSelector(companySelectors.getGeneralSettingsId);
  const onRowClick = ({ dataItem }: DataGridRowClickEvent<EditableLocation>) => setEditedData(dataItem);
  const discardData = () => setEditedData(undefined);
  const [tableData, setTableData] = React.useState<EquipmentLocation[]>(data);

  const async = useAsync({
    onError: (error) => {
      setTableData(data);
      toastError(error);
    },
  });

  const updateEquipmentDataAction = useActionCreator(companyActions.updateGeneralSettings);
  const [editedData, setEditedData] = React.useState<EditableLocation>();

  const formik = useFormik<EditableLocation | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = data.some(({ name, id }) => name.toLowerCase() === values.name.toLowerCase() && id !== values.id);
      if (values.name && isDuplicate) {
        error.name = 'validator.location.same.name.exist';
      }
      return error;
    },
    onSubmit: (values) => {
      const isAdding = values[MODE_FIELD] === Mode.add;
      const updatedTableData = isAdding
        ? [...data, omit(values, MODE_FIELD)] // add
        : data.map(item => item.id === values.id ? { ...item, ...omit(values, MODE_FIELD) } : item); // edit
      setTableData(updatedTableData);
      formValues.equipmentFamily[field] = updatedTableData;
      discardData();
      async.start(updateEquipmentDataAction, formValues, settingsId, 'PUT', async);
    },
  });

  const addData = () => {
    setEditedData({
      id: uuidv4(),
      name: '',
      active: true,
      [MODE_FIELD]: Mode.add,
    });
  };

  const { setValues, submitForm } = formik;

  useEffect(() => {
    setValues(editedData ?? {});
  }, [editedData, setValues]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const schema = buildSchema({
    isActive: true,
    actionsClass: classes.actionsCell,
    onDiscard: discardData,
    onConfirm: submitForm,
    isNameDisable: EquipmentFamily.Statuses === field,
  });

  const mappedData = tableData?.map((item) => {
    return {
      ...item,
      [MODE_FIELD]: item.id === editedData?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const dataList
    = editedData?.[MODE_FIELD] === Mode.add
      ? [...mappedData, editedData]
      : mappedData;

  return (
    <LocationsSetting {...{ formik, schema, onRowClick }}
    locationsList={dataList}
    editedLocation={editedData}
    addLocation={EquipmentFamily.Locations === field ? addData : undefined} />
  );
};

export default DataTable;
