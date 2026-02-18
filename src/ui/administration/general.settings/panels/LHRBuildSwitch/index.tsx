import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { isEmpty, kebabCase, omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
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
// import { useStyles } from './styles';

const LHRBuildSwitchSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const { values } = useFormikContext<GeneralSettings>();
  const settings = useSelector(companySelectors.getGeneralSettings);
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const LHRBuildSwitch = settings.lhrBuildTypeSwitchConfigApproval;
  // const classes = useStyles();
  const [LHRBuildSwitchData, setLHRBuildSwitchData] = React.useState<LHRBuildSwitch[]>(LHRBuildSwitch ?? []);
  const [editedLHRBuildSwitch, setEditedLHRBuildSwitch] = React.useState<EditableLHRBuildSwitch>();
  const groups = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
    id: group.value,
    name: group.label,
  }));

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
    async.start(updateLHRBuildSwitchSettings, { ...values, LHRBuildSwitchTypeConfig: updatedLHRBuildSwitch }, '', 'POST', async);
  };

  const formik = useFormik<EditableLHRBuildSwitch | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = LHRBuildSwitch?.some(({ from, to, id }) => from.toLowerCase() === values?.from?.toLowerCase().trim() && to.toLowerCase() === values?.to?.toLowerCase().trim() && id !== values.id);
      if (isEmpty(values.from)) {
        error.from = 'validators.required';
      }
      if (isEmpty(values.to)) {
        error.to = 'validators.required';
      }
      if (values.from && values.to && isDuplicate) {
        error.from = 'validator.lhr.build.same.internal.exist';
        error.to = 'validator.lhr.build.same.internal.exist';
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

  const addLHRBuildSwitch = () => {
    setEditedLHRBuildSwitch({
      id: uuidv4(),
      isActive: true,
      // internalType: '',
      // displayLabel: '',
      from: '',
      to: '',
      approvalGroup: [],
      [MODE_FIELD]: Mode.add,
    });
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

  const getRowAttributes = (LHRBuildSwitch: EditableLHRBuildSwitch) => ({
    'data-cy': `row-${kebabCase(LHRBuildSwitch.internalType)}`,
  });

  const schema = buildSchema({
    isActive,
    groups,
    onEdit: setEditedLHRBuildSwitch,
    onDiscard: discardLHRBuildSwitch,
    onConfirm: submitForm,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.lhr.build.switch.tab')}
      onAddNew={addLHRBuildSwitch}
    >
      <Text message={translate('administration.general.settings.lhr.build.switch.sub.title')} />
      <FormikProvider value={formik}>
          <SettingsTable
            isActive={true}
            data={LHRBuildSwitchList}
            isEditing={editedLHRBuildSwitch !== undefined}
            schema={schema}
            addButtonLabel={translate('common.add.new')}
            onAdd={addLHRBuildSwitch}
            getRowProperties={getRowAttributes}
            scrollable="scrollable"
          />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default LHRBuildSwitchSettingsPanel;
