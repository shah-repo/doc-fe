import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { isEmpty, kebabCase, omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../common/intl';
import { getHasPermission } from '../../../../../../common/utils/selectors';
import { Permission } from '../../../../../../state/ducks/auth/types';
import { companyActions } from '../../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../../state/ducks/company/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../../components/notifications';
import useActionCreator from '../../../../../hooks/useActionCreator';
import useAsync from '../../../../../hooks/useAsync';
import SettingsPanel from '../../../components/SettingsPanel';
import SettingsTable from '../../../components/SettingsTable';
import { SettingsPanelProps } from '../../../types';
import { buildSchema } from './schema';
import { ASLStatus, ASLSTATUS_KEYS, EditableASLStatus } from './types';

const ASLStatusSettings: React.FC<SettingsPanelProps> = (props) => {
  const isActive = useSelector(getHasPermission(Permission.EDIT_SUPPLIER_CONFIG));
  const [ASLStastusList, setASLStastusList] = React.useState<ASLStatus[]>();
  const [editedASLStatus, setEditedASLStatus]
    = React.useState<EditableASLStatus>();
  const discardASLStatus = () => setEditedASLStatus(undefined);
  const { values: formValues } = useFormikContext<GeneralSettings>();
  const [types, setTypes] = React.useState<ASLStatus[]>();
  const fetchASLTypes = useActionCreator(companyActions.fetchASLOptions);
  const updateASLStatusSettings = useActionCreator(
    companyActions.updateGeneralSettings,
  );

  const supplierTypesAsync = useAsync<ASLStatus[]>({
    onSuccess: setTypes,
    onError: toastError,
  });

  useEffect(() => {
    setASLStastusList(sortStatusByDisplayOrder(formValues?.aslStatusConfig));
  }, [formValues?.aslStatusConfig]);

  useEffect(() => {
    supplierTypesAsync.start(fetchASLTypes, supplierTypesAsync);
  }, []);

  const sortStatusByDisplayOrder = (statusList?: ASLStatus[]): ASLStatus[] => {
    if (!statusList?.length) return [];

    return [...statusList].sort((status1, status2) => {
      const orderComparison
        = (status1[ASLSTATUS_KEYS.order] ?? 0)
        - (status2[ASLSTATUS_KEYS.order] ?? 0);
      if (orderComparison !== 0) return orderComparison;

      return (
        (status1[ASLSTATUS_KEYS.displayOrder] ?? 0)
        - (status2[ASLSTATUS_KEYS.displayOrder] ?? 0)
      );
    });
  };

  const async = useAsync({
    onError: (error) => {
      setASLStastusList(ASLStastusList);
      toastError(error);
    },
  });

  const updateASLStatusList = (updatedASLStatusList: ASLStatus[]) => {
    setASLStastusList(updatedASLStatusList);
    if (formValues) {
      async.start(
        updateASLStatusSettings,
        { ...formValues, aslStatusConfig: updatedASLStatusList },
        '',
        'POST',
        async,
      );
    }
  };

  const formik = useFormik<EditableASLStatus | Record<string, never>>({
    initialValues: {},
    validate: (values: Partial<EditableASLStatus>) => {
      const error: Record<string, string> = {};
      if (isEmpty(values.internalType)) {
        error.name = 'validators.required';
      }

      if ((values?.displayLabel?.length ?? 0) > 255) {
        error.displayLabel = 'validator.asl.status.displayLabel.char.limit';
      }

      return error;
    },
    onSubmit: (values: EditableASLStatus | Record<string, never>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const updatedValues = omit(values, MODE_FIELD);
      const updatedData = isAddition
        ? [...(ASLStastusList ?? []), { ...updatedValues, isUserAdded: true }]
        : ASLStastusList?.map((aslStatus) =>
          aslStatus.id === values.id ? { ...updatedValues, isUserModified: true } : aslStatus,
        );

      const sortedItems = updatedData?.sort(
        (status1, status2) =>
          status1[ASLSTATUS_KEYS.order] - status2[ASLSTATUS_KEYS.order],
      );

      sortedItems?.forEach((item, index) => {
        item[ASLSTATUS_KEYS.displayOrder] = index + 1;
      });

      const displayOrderMap = (sortedItems)?.reduce((acc, item) => {
        acc[item.id] = item[ASLSTATUS_KEYS.displayOrder];
        return acc;
      }, {});

      const displayOrderUpdatedData = updatedData?.map((status) => ({
        ...status,
        displayOrder: displayOrderMap?.[status?.id] ?? status.displayOrder,
      }));

      discardASLStatus();
      updateASLStatusList(sortStatusByDisplayOrder(displayOrderUpdatedData));
    },
  });
  const { setValues, submitForm } = formik;

  const changeASLActiveState = (
    aslStatus: EditableASLStatus,
    isActive: boolean,
  ) => {
    const updatedList = ASLStastusList?.map((item) =>
      item.id === aslStatus.id ? { ...item, isActive, isUserModified: true } : item,
    );
    updateASLStatusList(updatedList ?? []);
  };

  useEffect(() => {
    setValues(editedASLStatus ?? {});
  }, [editedASLStatus, setValues]);

  const addASLStatus = () => {
    setEditedASLStatus({
      id: uuidv4(),
      internalType: '',
      displayLabel: '',
      isActive: true,
      order: 10,
      displayOrder: 10,
      [MODE_FIELD]: Mode.add,
    });
  };

  const mappedASLStatusList
    = ASLStastusList?.map((aslStatus) => {
      return {
        ...aslStatus,
        [MODE_FIELD]:
          aslStatus.id === editedASLStatus?.id ? Mode.edit : Mode.show,
      };
    }) ?? [];

  const aslList
    = editedASLStatus?.[MODE_FIELD] === Mode.add
      ? [...mappedASLStatusList, editedASLStatus]
      : mappedASLStatusList;

  const dataCyGenerator = (aslStatus: EditableASLStatus) => ({
    'data-cy': `row-${kebabCase(aslStatus.internalType)}-${
      aslStatus.displayOrder
    }`,
  });

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedASLStatus : undefined,
    onActiveStateChange: isActive ? changeASLActiveState : undefined,
    onDiscard: discardASLStatus,
    types,
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
          data={aslList}
          isEditing={editedASLStatus !== undefined}
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
