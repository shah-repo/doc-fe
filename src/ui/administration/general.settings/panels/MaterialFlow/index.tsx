import { FormikProvider, useFormik, useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { materialFlowAction } from '../../../../../state/ducks/materialFlowAcl';
import { MaterialFlowAclRule } from '../../../../../state/ducks/materialFlowAcl/types';
import { userManagementSelectors } from '../../../../../state/ducks/userManagement';
import { AlertDialog } from '../../../../components/dialogs';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import { LotTransferType } from '../../../../form.builder/FBLotTransfers/types';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import useDialog from '../../../../hooks/useDialog';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsPanelSection from '../../components/SettingsPanelSection';
import SettingsTable from '../../components/SettingsTable';
import SwitchControl from '../../components/SwitchControl';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';
import { EditableMaterialFlowAclRule } from './types';

const PANEL_FIELD = 'materialFlowAcl';
const STATUS_FIELD = 'materialFlowAclEnabled';

const INITIAL_VALUES = {
  groups: [],
  id: '_initial',
  [MODE_FIELD]: Mode.show,
};

const MaterialFlowSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { submitForm: submitSettingsForm, getFieldProps } = useFormikContext<GeneralSettings>();
  const switchProps = getFieldProps<boolean>(STATUS_FIELD);
  const rules = getFieldProps<MaterialFlowAclRule[]>(PANEL_FIELD).value;
  const locations = useSelector(companySelectors.getAllLocations) ?? [];
  const groups = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
    id: group.value,
    name: group.label,
  }));
  const [rulesData, setRulesData] = React.useState<MaterialFlowAclRule[]>(rules);
  const [editedRule, setEditedRule] = React.useState<EditableMaterialFlowAclRule>();
  const ruleToDelete = useRef<EditableMaterialFlowAclRule>();
  const addRuleAction = useActionCreator(materialFlowAction.addRule);
  const updateRuleAction = useActionCreator(materialFlowAction.updateRule);
  const deleteRuleAction = useActionCreator(materialFlowAction.deleteRule);
  const deleteConfirmationDialog = useDialog();
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));

  const async = useAsync({
    onSuccess: async () => {
      await submitSettingsForm();
      discardRule();
    },
    onError: (error) => {
      setRulesData(rules);
      toastError(error);
    },
  });

  const discardRule = () => {
    setEditedRule(undefined);
    formik.resetForm();
  };

  const formik = useFormik<EditableMaterialFlowAclRule>({
    initialValues: INITIAL_VALUES,
    onSubmit: (values) => {
      const isAdding = values[MODE_FIELD] === Mode.add;
      const isScrapAction = values.action === LotTransferType.Scrap;

      if (values.action) {
        const payload = ({
          action: values.action,
          from: values.from?.id ?? null,
          to: isScrapAction ? null : values.to?.id ?? null,
          groups: values.groups.map(group => group.id),
        });

        isAdding
          ? async.start(addRuleAction, payload, async)
          : async.start(updateRuleAction, values.id, payload, async);
      }
    },
  });

  const addRule = () => {
    const values = {
      id: uuidv4(),
      from: undefined,
      to: undefined,
      groups: [],
      action: undefined,
      [MODE_FIELD]: Mode.add,
    };
    setEditedRule(values);
    formik.setValues(values);
  };

  useEffect(() => {
    setRulesData(rules);
  }, [rules]);

  const confirmRuleDeletion = (rule: EditableMaterialFlowAclRule) => {
    ruleToDelete.current = rule;
    deleteConfirmationDialog.open();
  };

  const deleteRule = () => {
    deleteConfirmationDialog.close();

    if (!ruleToDelete.current) {
      return;
    }

    async.start(deleteRuleAction, ruleToDelete.current.id, async);
  };

  const discardDelete = () => {
    ruleToDelete.current = undefined;
    deleteConfirmationDialog.close();
  };

  const editRule = (rule: EditableMaterialFlowAclRule) => {
    formik.setValues({
      ...rule,
      [MODE_FIELD]: Mode.edit,
    });
    setEditedRule(rule);
  };

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? editRule : undefined,
    onDelete: isActive ? confirmRuleDeletion : undefined,
    onDiscard: discardRule,
    onConfirm: formik.submitForm,
    locations,
    groups,
  });

  const mappedRules = rulesData?.map((rule) => {
    return {
      ...rule,
      from: locations.find(it => it.id === rule.from),
      to: locations.find(it => it.id === rule.to),
      [MODE_FIELD]: rule.id === editedRule?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const rulesList
    = editedRule?.[MODE_FIELD] === Mode.add
      ? [...mappedRules, editedRule]
      : mappedRules;

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.material.flow')}
      onAddNew={isActive ? addRule : undefined}
    >
      <SwitchControl
        {...switchProps}
        checked={switchProps.value}
        disabled={!isActive}
        label={translate('administration.general.settings.material.flow.enabled')}
      />
      <SettingsPanelSection>
        <Text message="administration.general.settings.material.flow.rules" />
      </SettingsPanelSection>
      <FormikProvider value={formik}>
        <SettingsTable
          isActive={isActive}
          data={rulesList}
          isEditing={editedRule !== undefined}
          schema={schema}
          addButtonLabel={translate('common.add.new')}
          onAdd={addRule}
        />
      </FormikProvider>
      <AlertDialog
        handler={deleteConfirmationDialog}
        onConfirm={deleteRule}
        onCancel={discardDelete}
      >
        {translate('administration.general.settings.material.flow.delete.confirmation')}
      </AlertDialog>
    </SettingsPanel>
  );
};

export default MaterialFlowSettingsPanel;
