import { FormikProvider, useFormik } from 'formik';
import { isEmpty, kebabCase, omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../common/intl';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import SettingsPanel from '../../../components/SettingsPanel';
import SettingsTable from '../../../components/SettingsTable';
import { SettingsPanelProps } from '../../../types';
import { buildSchema } from './schema';
import { ASLInternalType, ASLStatus, EditableASLStatus } from './types';

const ASLStatusSettings: React.FC<SettingsPanelProps> = (props) => {
  // const { submitForm: submitSettingsForm } = useFormikContext<GeneralSettings>();
  const isActive = true; // useSelector(getHasPermission(Permission.EDIT_SUPPLIER_STATUS));
  const ASLStastusListSampleData = [
    { id: '1', internalType: ASLInternalType.Approved, displayLabel: 'Approved', active: true },
    { id: '2', internalType: ASLInternalType.PendingEvaluation, displayLabel: 'Pending Evalution', active: true },
    { id: '3', internalType: ASLInternalType.Disqualify, displayLabel: 'Disqualify', active: true },
    { id: '4', internalType: ASLInternalType.Inactive, displayLabel: 'Inactive', active: true },
  ];

  const [ASLStastusList, setASLStastusList] = React.useState<ASLStatus[]>(ASLStastusListSampleData);
  const [editedLocation, setEditedLocation] = React.useState<EditableASLStatus>();

  const discardLocation = () => setEditedLocation(undefined);
  // const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  // const async = useAsync({
  //   onSuccess: submitSettingsForm,
  //   onError: (error) => {
  //     setASLStastusList(ASLStastusList);
  //     toastError(error);
  //   },
  // });

  const updateLocations = (updatedLocations: ASLStatus[]) => {
    setASLStastusList(updatedLocations);
    // async.start(changeCompanyAction, { locations: updatedLocations }, async);
  };

  const formik = useFormik<EditableASLStatus | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      if (isEmpty(values.internalType)) {
        error.name = 'validators.required';
      }
      return error;
    },
    onSubmit: (values) => {
      const updatedLocations = unionBy([omit(values, MODE_FIELD)], ASLStastusList, 'id');
      discardLocation();
      updateLocations(updatedLocations);
    },
  });
  const { setValues, submitForm } = formik;

  const changeLocationActiveState = (location: EditableASLStatus, state: boolean) => {
    const updatedLocations = ASLStastusList.map(it => it.id === location.id ? { ...it, active: state } : it);
    updateLocations(updatedLocations);
  };

  useEffect(() => {
    setValues(editedLocation ?? {});
  }, [editedLocation, setValues]);

  // useEffect(() => {
  //   setASLStastusList(locations);
  // }, [locations]);

  const addASLStatus = () => {
    setEditedLocation({
      id: uuidv4(),
      internalType: undefined,
      displayLabel: '',
      active: true,
      [MODE_FIELD]: Mode.add,
    });
  };

  const mappedLocations = ASLStastusList?.map((location) => {
    return {
      ...location,
      [MODE_FIELD]: location.id === editedLocation?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const locationsList
    = editedLocation?.[MODE_FIELD] === Mode.add
      ? [...mappedLocations, editedLocation]
      : mappedLocations;

  const dataCyGenerator = (aslStatus: EditableASLStatus) => ({
    'data-cy': `row-${kebabCase(aslStatus.internalType)}`,
  });

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedLocation : undefined,
    onActiveStateChange: isActive ? changeLocationActiveState : undefined,
    onDiscard: discardLocation,
    onConfirm: submitForm,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate(props.title)}
      onAddNew={isActive ? addASLStatus : undefined}
    >
      <FormikProvider value={formik}>
        <SettingsTable
          isActive={isActive}
          data={locationsList}
          isEditing={editedLocation !== undefined}
          schema={schema}
          addButtonLabel={translate('common.add.new')}
          onAdd={addASLStatus}
          getRowProperties={dataCyGenerator}
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default ASLStatusSettings;
