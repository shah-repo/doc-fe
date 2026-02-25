import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { isEmpty, omit, unionBy } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { getHasPermission } from '../../../../../common/utils/selectors';
import { Permission } from '../../../../../state/ducks/auth/types';
import { companyActions, companySelectors } from '../../../../../state/ducks/company';
import { GeneralSettings } from '../../../../../state/ducks/company/types';
import { userManagementSelectors } from '../../../../../state/ducks/userManagement';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import Text from '../../../../components/Text';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';
import { EditableLHRBuildSwitch, LHRBuildSwitch } from './types';
import { useStyles } from './styles';
import { Box } from '@material-ui/core';
import { AlertDialog } from '../../../../components/dialogs';
import useDialog from '../../../../hooks/useDialog';

const LHRBuildSwitchSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const { values } = useFormikContext<GeneralSettings>();
  const settings = useSelector(companySelectors.getGeneralSettings);
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const LHRBuildSwitch = settings.lhrBuildTypeSwitchConfigApproval;
  const LHRBuild = settings.lhrBuildTypeConfig;
  const classes = useStyles();
  const [LHRBuildSwitchData, setLHRBuildSwitchData] = React.useState<LHRBuildSwitch[]>(LHRBuildSwitch ?? []);
  const [editedLHRBuildSwitch, setEditedLHRBuildSwitch] = React.useState<EditableLHRBuildSwitch>();
  const approvalGroups = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
    id: group.value,
    name: group.label,
  }));
  const newRuleId = useRef<string>();
  const deleteConfirmationDialog = useDialog();
  const ruleToDelete = useRef<EditableLHRBuildSwitch>();

  const discardLHRBuildSwitch = () => setEditedLHRBuildSwitch(undefined);
  const updateLHRBuildSwitchSettings = useActionCreator(companyActions.updateGeneralSettings);

  const async = useAsync({
    onError: (error) => {
      setLHRBuildSwitchData(LHRBuildSwitch ?? []);
      toastError(error);
    },
  });

  const updateLHRBuildSwitch = (updatedLHRBuildSwitch: LHRBuildSwitch[]) => {
    setLHRBuildSwitchData(updatedLHRBuildSwitch);
    async.start(updateLHRBuildSwitchSettings, { ...values, lhrBuildTypeSwitchConfigApproval: updatedLHRBuildSwitch }, '', 'POST', async);
  };

  const formik = useFormik<EditableLHRBuildSwitch | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = LHRBuildSwitch?.some(({ from, to, id }) => from?.toLowerCase() === values?.from?.trim() && to?.toLowerCase() === values?.to?.trim() && id !== values.id);
      if (isEmpty(values.from)) {
        error.from = 'validators.required';
      }
      if (isEmpty(values.to)) {
        error.to = 'validators.required';
      }
      if (isEmpty(values.approvalGroups)) {
        error.approvalGroups = 'validators.required';
      }
      if (values.from && values.to && isDuplicate) {
        error.from = 'validator.lhr.build.same.rule.exist';
        error.to = 'validator.lhr.build.same.rule.exist';
      }
      return error;
    },
    onSubmit: (values) => {
      const updatedLHRBuildSwitch = unionBy([omit(values, MODE_FIELD)], LHRBuildSwitch, 'id');
      discardLHRBuildSwitch();
      updateLHRBuildSwitch(updatedLHRBuildSwitch);
    },
  });
  const { setValues, submitForm } = formik;

  useEffect(() => {
    setValues(editedLHRBuildSwitch ?? {});
  }, [editedLHRBuildSwitch, setValues]);

  useEffect(() => {
    setLHRBuildSwitchData(LHRBuildSwitch ?? []);
  }, [LHRBuildSwitch]);

  const confirmRuleDeletion = (rule: EditableLHRBuildSwitch) => {
    ruleToDelete.current = rule;
    deleteConfirmationDialog.open();
  };

  const deleteRule = () => {
    deleteConfirmationDialog.close();

    if (!ruleToDelete.current) {
      return;
    }
    const updatedLHRBuildSwitch = LHRBuildSwitchData.filter(item => item.id !== ruleToDelete.current?.id);
    async.start(updateLHRBuildSwitchSettings, { ...values, lhrBuildTypeSwitchConfigApproval: updatedLHRBuildSwitch }, '', 'POST', async);
  };

  const discardDelete = () => {
    ruleToDelete.current = undefined;
    deleteConfirmationDialog.close();
  };

  const addLHRBuildSwitch = () => {
    setEditedLHRBuildSwitch({
      id: uuidv4(),
      from: '',
      to: '',
      approvalGroups: [],
      [MODE_FIELD]: Mode.add,
    });
    newRuleId.current = undefined;
  };

  const mappedLHRBuildSwitch = LHRBuildSwitchData?.map((LHRBuildSwitch) => {
    return {
      ...LHRBuildSwitch,
      [MODE_FIELD]: LHRBuildSwitch.id === editedLHRBuildSwitch?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const LHRBuildSwitchList
    = editedLHRBuildSwitch?.[MODE_FIELD] === Mode.add
      ? [...mappedLHRBuildSwitch, editedLHRBuildSwitch]
      : mappedLHRBuildSwitch;

  const newRuleRowRef = (node: HTMLDivElement | null) => {
    if (node) {
      setTimeout(() => {
        requestAnimationFrame(() => node.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }, 0);
    }
  };

  const getRowAttributes = (LHRBuildSwitch: EditableLHRBuildSwitch) => {
    if (LHRBuildSwitch.id === newRuleId.current) {
      return {
        className: classes.newRow,
        ref: newRuleRowRef,
      };
    }
  };

  const schema = buildSchema({
    isActive,
    approvalGroups,
    LHRBuild: LHRBuild ?? [],
    onEdit: setEditedLHRBuildSwitch,
    onDiscard: discardLHRBuildSwitch,
    onConfirm: submitForm,
    onDelete: confirmRuleDeletion,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.lhr.build.switch.tab')}
      onAddNew={addLHRBuildSwitch}
      addButtonLabel={translate('common.add.rule')}
    >
      <Box className={classes.subTitle}>
        <Text message={translate('administration.general.settings.lhr.build.switch.sub.title')} />
      </Box>
      <FormikProvider value={formik}>
          <SettingsTable
            isActive={true}
            data={LHRBuildSwitchList}
            isEditing={editedLHRBuildSwitch !== undefined}
            schema={schema}
            addButtonLabel={translate('common.add.rule')}
            onAdd={addLHRBuildSwitch}
            getRowProperties={getRowAttributes}
            scrollable="scrollable"
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
export default LHRBuildSwitchSettingsPanel;
