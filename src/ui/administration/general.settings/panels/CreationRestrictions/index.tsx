import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { groupBy, has, isArray, isEmpty, kebabCase, keyBy, omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { Employee, GeneralSettings } from '../../../../../state/ducks/company/types';
import { documentTypeSelectors } from '../../../../../state/ducks/documentRevisions/documentType';
import { DocumentType } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { userManagementSelectors } from '../../../../../state/ducks/userManagement';
import { LoadCompanyGroup } from '../../../../../state/ducks/userManagement/types';
import {
  Mode,
  MODE_FIELD,
} from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import { SettingsPanelProps } from '../../types';
import { EDIT_FIELDS, toSortedOptions } from './constants';
import { buildSchema } from './schema';
import {
  DocumentTypeRestriction,
  EditableDocumentTypeRestriction,
  OptionType,
} from './types';

const CreationRestrictions: React.FC<SettingsPanelProps> = (props) => {
  const { values: formValues } = useFormikContext<GeneralSettings>();
  const [restrictions, setRestrictions] = React.useState<DocumentTypeRestriction[]>();
  const [editedRestrictions, setEditedRestrictions] = React.useState<EditableDocumentTypeRestriction>();

  const allGroups: LoadCompanyGroup[] = Object.values(useSelector(userManagementSelectors.groupsById));
  const groupOptions = toSortedOptions(allGroups, (group) => group.id, (group) => group.name);
  const groupOptionsMap = { ...(keyBy(groupOptions, (group) => group.id)) };

  const allEmployees: Employee[] = useSelector(companySelectors.getActiveEmployees) as Employee[];
  const employeeOptions = toSortedOptions(allEmployees, (employee) => employee.id, (employee) => employee.user?.name ?? '');
  const employeeOptionsMap = { ...(keyBy(employeeOptions, (employee) => employee.id)) };

  let documentTypesAll: DocumentType[] = useSelector(documentTypeSelectors.getDocumentTypeList);
  documentTypesAll = documentTypesAll.filter(documentType => documentType.active);
  const documentTypeOptions = toSortedOptions(documentTypesAll,
    (documentType) => documentType.id,
    (documentType) => documentType.documentTypeName,
    (documentType) => ({ category: documentType.category }),
  );

  const discardRestrictions = () =>
    setEditedRestrictions(undefined);

  const updateCreationRestrictionsAction = useActionCreator(
    companyActions.updateGeneralSettings,
  );

  const async = useAsync({
    onError: (error) => {
      setRestrictions(restrictions);
      toastError(error);
    },
  });

  useEffect(() => {
    setRestrictions(formValues?.creationRestrictions);
  }, [formValues?.creationRestrictions]);

  const updateRestrictions = (
    updatedRestrictions: DocumentTypeRestriction[],
  ) => {
    setRestrictions(updatedRestrictions);
    if (formValues) {
      async.start(
        updateCreationRestrictionsAction,
        { ...formValues, creationRestrictions: updatedRestrictions },
        '',
        'POST',
        async,
      );
    }
  };

  const formik = useFormik<EditableDocumentTypeRestriction | Record<string, never>>({
    initialValues: {},
    validate: (values: Partial<EditableDocumentTypeRestriction>) => {
      const error: Record<string, string> = {};
      if (isEmpty(values.documentTypeName)) {
        error.text = 'validators.required';
      }
      return error;
    },
    onSubmit: (values: Partial<EditableDocumentTypeRestriction>) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const updatedValues = {
        ...omit(values, [MODE_FIELD, ...EDIT_FIELDS]),
        restrictedToUsers: (values.restrictedToUsers_edit ?? []).map(userOption => userOption.id),
        restrictedToGroups: (values.restrictedToGroups_edit ?? []).map(roleOption => roleOption.id),
      };
      const existingRestrictions = restrictions?.filter(restriction => restriction.documentTypeId === values.documentTypeId);
      if (isAddition && existingRestrictions?.length) {
        toastError(translate('administration.general.settings.creation.restrictions.duplicate.error.msg', { documentTypeName: values.documentTypeName }));
        return;
      }
      const updatedRestrictions = isAddition
        ? [...(restrictions ?? []), updatedValues]
        : restrictions?.map((restriction) => restriction.id === values.id ? updatedValues : restriction,
        );

      discardRestrictions();
      updateRestrictions((updatedRestrictions ?? []) as DocumentTypeRestriction[]);
    },
  });
  const { setValues, submitForm } = formik;

  useEffect(() => {
    setValues(editedRestrictions ?? {});
  }, [editedRestrictions, setValues]);

  const addRestriction = () => {
    setEditedRestrictions({
      id: uuidv4(),
      documentTypeId: '',
      documentTypeName: '',
      category: '',
      restrictedToGroups: [],
      restrictedToUsers: [],
      [MODE_FIELD]: Mode.add,
      restrictedToGroups_edit: [],
      restrictedToUsers_edit: [],
    });
  };

  const mappedRestrictions
    = restrictions?.map((restrictions: DocumentTypeRestriction) => {
      return {
        ...restrictions,
        [MODE_FIELD]:
          restrictions.id === editedRestrictions?.id ? Mode.edit : Mode.show,
      };
    }) ?? [];

  const restrictionsList = (
    editedRestrictions?.[MODE_FIELD] === Mode.add ? [...mappedRestrictions, editedRestrictions] : mappedRestrictions).map((restriction) => {
    const { restrictedToGroups, restrictedToUsers } = restriction;

    const restrictedToGroupsWithText = restrictedToGroups?.map((roleId: string) => (groupOptionsMap[roleId]))
      .filter((role): role is OptionType => role !== undefined);
    const restrictedToUsersWithText = restrictedToUsers?.map((userId: string) => (employeeOptionsMap[userId]))
      .filter((role): role is OptionType => role !== undefined);

    return {
      ...restriction,
      ...(isArray(restrictedToGroups) && {
        restrictedToGroups: restrictedToGroupsWithText?.map((item) => item.text).join(', '),
      }),
      ...(isArray(restrictedToUsers) && {
        restrictedToUsers: restrictedToUsersWithText?.map((item) => item.text).join(', '),
      }),
      restrictedToGroups_edit: restrictedToGroupsWithText,
      restrictedToUsers_edit: restrictedToUsersWithText,
    };
  });

  const dataCyGenerator = (documentTypeRestriction: EditableDocumentTypeRestriction) => ({
    'data-cy': `row-${kebabCase(documentTypeRestriction.documentTypeName)}`,
  });

  const deleteRestriction = (dataItem: EditableDocumentTypeRestriction) => {
    const updatedRestrictions = restrictions?.filter((config) => config.id !== dataItem.id);
    updateRestrictions(updatedRestrictions ?? []);
  };

  const schema = buildSchema({
    isActive: true,
    onEdit: setEditedRestrictions,
    onDiscard: discardRestrictions,
    onDelete: deleteRestriction,
    companyEmployees: employeeOptions,
    companyGroups: groupOptions,
    documentTypeList: documentTypeOptions,
    onConfirm: submitForm,
  });

  const restrictionsGroupByDocumentTypeId = groupBy(restrictionsList, 'documentTypeId');

  const newRestrictionsList = restrictionsList.reduce<EditableDocumentTypeRestriction[]>((sortedList, restriction) => {
    if (has(restrictionsGroupByDocumentTypeId, restriction.documentTypeId)) {
      sortedList.push(...restrictionsGroupByDocumentTypeId[restriction.documentTypeId] as EditableDocumentTypeRestriction[]);
      delete restrictionsGroupByDocumentTypeId[restriction.documentTypeId];
    }

    return sortedList;
  }, []);

  return (
    <SettingsPanel
      {...props}
      title={translate(props.title)}
      onAddNew={addRestriction}
    >
      <FormikProvider value={formik}>
        <SettingsTable
          data={newRestrictionsList as unknown as EditableDocumentTypeRestriction[]}
          isEditing={editedRestrictions !== undefined}
          schema={schema}
          addButtonLabel={translate('common.add.new')}
          onAdd={addRestriction}
          getRowProperties={dataCyGenerator}
          isFilterable
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default CreationRestrictions;
