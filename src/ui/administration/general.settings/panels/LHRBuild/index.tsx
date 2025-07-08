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
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { toastError } from '../../../../components/notifications';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import SettingsPanel from '../../components/SettingsPanel';
import SettingsTable from '../../components/SettingsTable';
import { SettingsPanelProps } from '../../types';
import { buildSchema } from './schema';
import { EditableLHRBuild, LHRBuild } from './types';

const LHRBuildSettingsPanel: React.FC<SettingsPanelProps> = (props) => {
  const { values } = useFormikContext<GeneralSettings>();
  const settings = useSelector(companySelectors.getGeneralSettings);
  const isActive = useSelector(getHasPermission(Permission.COMPANY_UPDATE_LOCATIONS));
  const LHRBuilds = settings.lhrBuildTypeConfig;

  const [LHRBuildsData, setLHRBuildData] = React.useState<LHRBuild[]>(LHRBuilds ?? []);
  const [editedLHRBuild, setEditedLHRBuild] = React.useState<EditableLHRBuild>();

  const discardLHRBuild = () => setEditedLHRBuild(undefined);
  const updateLHRBuildsSettings = useActionCreator(companyActions.updateGeneralSettings);

  const async = useAsync({
    onError: (error) => {
      setLHRBuildData(LHRBuilds ?? []);
      toastError(error);
    },
  });

  const updateLHRBuilds = (updatedLHRBuilds: LHRBuild[]) => {
    setLHRBuildData(updatedLHRBuilds);
    async.start(updateLHRBuildsSettings, { ...values, lhrBuildTypeConfig: updatedLHRBuilds }, '', 'POST', async);
  };

  const formik = useFormik<EditableLHRBuild | Record<string, never>>({
    initialValues: {},
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = LHRBuilds?.some(({ internalType, id }) => internalType.toLowerCase() === values?.internalType?.toLowerCase().trim() && id !== values.id);
      if (isEmpty(values.internalType)) {
        error.internalType = 'validators.required';
      }
      if (isEmpty(values.displayLabel)) {
        error.displayLabel = 'validators.required';
      }
      if (values.internalType && isDuplicate) {
        error.internalType = 'validator.lhr.build.same.internal.exist';
      }
      return error;
    },
    onSubmit: (values) => {
      const updatedLHRBuilds = unionBy([omit(values, MODE_FIELD)], LHRBuilds, 'id');
      discardLHRBuild();
      updateLHRBuilds(updatedLHRBuilds);
    },
  });
  const { setValues, submitForm } = formik;

  const changeLHRBuildActiveState = (LHRBuild: EditableLHRBuild, state: boolean) => {
    const updatedLHRBuilds = LHRBuilds
      ?.map(it => it.id === LHRBuild.id ? { ...it, isActive: state } : it)
      ?? [];
      updateLHRBuilds(updatedLHRBuilds);
  };

  useEffect(() => {
    setValues(editedLHRBuild ?? {});
  }, [editedLHRBuild, setValues]);

  useEffect(() => {
    setLHRBuildData(LHRBuilds ?? []);
  }, [LHRBuilds]);

  const addLHRBuild = () => {
    setEditedLHRBuild({
      id: uuidv4(),
      internalType: '',
      displayLabel: '',
      isActive: true,
      [MODE_FIELD]: Mode.add,
    });
  };

  const mappedLHRBuilds = LHRBuildsData?.map((LHRBuild) => {
    return {
      ...LHRBuild,
      [MODE_FIELD]: LHRBuild.id === editedLHRBuild?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const LHRBuildsList
    = editedLHRBuild?.[MODE_FIELD] === Mode.add
      ? [...mappedLHRBuilds, editedLHRBuild]
      : mappedLHRBuilds;

  const dataCyGenerator = (LHRBuild: EditableLHRBuild) => ({
    'data-cy': `row-${kebabCase(LHRBuild.internalType)}`,
  });

  const schema = buildSchema({
    isActive,
    onEdit: isActive ? setEditedLHRBuild : undefined,
    onActiveStateChange: isActive ? changeLHRBuildActiveState : undefined,
    onDiscard: discardLHRBuild,
    onConfirm: submitForm,
  });

  return (
    <SettingsPanel
      {...props}
      title={translate('administration.general.settings.lhr.build.tab')}
      onAddNew={isActive ? addLHRBuild : undefined}
    >
      <FormikProvider value={formik}>
        <SettingsTable
          isActive={isActive}
          data={LHRBuildsList}
          isEditing={editedLHRBuild !== undefined}
          schema={schema}
          addButtonLabel={translate('common.add.new')}
          onAdd={addLHRBuild}
          getRowProperties={dataCyGenerator}
        />
      </FormikProvider>
    </SettingsPanel>
  );
};
export default LHRBuildSettingsPanel;
