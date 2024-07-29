/* eslint-disable @typescript-eslint/no-unused-vars */
import { Grid } from '@material-ui/core';
import { DataResult, process, State } from '@progress/kendo-data-query';
import { getGroupIds, setExpandedState, setGroupIds } from '@progress/kendo-react-data-tools';
import { GridDataStateChangeEvent, GridItemChangeEvent, GridRowProps, GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { cloneDeep, last, pick, uniq } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../../../common/intl';
import { companyActions } from '../../../../../../../state/ducks/company';
import { DOC_TYPE_GROUP } from '../../../../../../../state/ducks/documentRevisions/documentType/types';
import AlertDialog from '../../../../../../app/alert.dialog/AlertDialog';
import { Button as AddButton } from '../../../../../../components/forms/fields-next';
import KendoDataGrid from '../../../../../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../../../components/notifications';
import useActionCreator from '../../../../../../hooks/useActionCreator';
import useAsync from '../../../../../../hooks/useAsync';
import useDialog from '../../../../../../hooks/useDialog';
import { withThemeNext } from '../../../../../../layout/theme-next';
import SettingsPanel from '../../../../components/SettingsPanel';
import { SettingsPanelProps } from '../../../../types';
import { AddPhase } from './cell.templates/AddPhase';
import { GroupHeaderCell } from './cell.templates/GroupHeaderCell';
import { ADD_GROUP_ID, ADD_GROUP_NAME, DATA_GROUP, DATA_ITEM_KEY, EDIT_FIELD, EXPAND_FIELD, initialDataState, LCP_KEYS, PARTS_GROUP_ID, REQUEST_PAYLOAD_KEYS } from './constants';
import { LCPSchema } from './schema';
import useStyles from './styles';
import { CustomGroupDataItem, CustomGroupOptions, EditableLCP, GroupDocTypes, LCP, LCPResponse } from './types';
import { processGroups, processRealData, sortGroups } from './utils';

const LCPGrid: React.FC<SettingsPanelProps> = (props) => {
  const [dataState, setDataState] = useState<State>(initialDataState);
  const [partGroups, setPartGroups] = useState<CustomGroupOptions[]>([]);
  const [data, setData] = useState<LCP[]>();
  const [prevData, setPrevData] = useState<LCP[]>();
  const [selectedDataItem, setSelectedDataItem] = useState<CustomGroupDataItem>();
  const [resultState, setResultState] = useState<DataResult>();
  const [collapsedState, setCollapsedState] = React.useState<string[]>([]);
  const [editGroup, setEditGroup] = useState<string>('');
  const [addNewPhase, setAddNewPhase] = useState<Partial<LCP>>();
  const confirmationDialog = useDialog();

  const [selectedDocTypes, setSelectedDocTypes] = useState<CustomGroupOptions[]>([]);
  const fetchLCPDocTypes = useActionCreator(companyActions.fetchLCPDocTypes);
  const fetchLCPPhases = useActionCreator(companyActions.fetchLCPPhasesByGroup);
  const classes = useStyles();
  const { setValues, values: formValues } = useFormikContext();

  const fetchLCPDocTypesAsync = useAsync({
    onSuccess: (data?: GroupDocTypes[]) => {
      data && setPartGroups(processGroups(data));
    },
    onError: toastError,
  });

  const fetchLCPPhasesAsync = useAsync({
    onSuccess: (newPhases?: LCP[]) => {
      const selectedGroudIds = selectedDocTypes.map(data => data.value);
      const category = uuidv4();
      newPhases = newPhases?.map(phase => {
        return {
          ...phase,
          documentTypeIdArr: selectedGroudIds,
          group: selectedDocTypes[0].category,
          category,
          [EDIT_FIELD]: true,
          isUserAdded: false,
          isUserModified: false,
        };
      });
      const updatedData = newPhases?.concat((data ?? []).filter((data: LCP) => getGroupIdByCategory(data.category) !== ADD_GROUP_ID));
      setEditGroup(getGroupIdByCategory(category));
      updateStateGridData(updatedData ?? [], false);
    },
    onError: toastError,
  });

  useEffect(() => {
    const data = processRealData(formValues?.lifecyclePhases?.categories as unknown as LCPResponse[]);
    updateStateGridData(data.phases);
    updateSettingsObj(data.phases);
    fetchLCPDocTypesAsync.start(
      fetchLCPDocTypes,
      fetchLCPDocTypesAsync,
    );
  }, [formValues?.lifecyclePhases]);

  const onDataStateChange = (event: GridDataStateChangeEvent): State => {
    const newDataState = processWithGroups(data ?? [], event.dataState);
    setDataState(event.dataState);
    setResultState(newDataState);
    return dataState;
  };

  const processWithGroups = (data: LCP[], dataState: State) => {
    const newDataState = process(data, dataState);
    setGroupIds({ data: newDataState.data, group: dataState.group });
    return newDataState;
  };

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden) ?? [];
  };

  const onExpandChange = React.useCallback(
    (dataItem: CustomGroupDataItem) => {
      if (dataItem.groupId) {
        const collapsedIds = !dataItem.expanded
          ? collapsedState.filter((groupId) => groupId !== dataItem.groupId)
          : [...collapsedState, dataItem.groupId];
        setCollapsedState(uniq(collapsedIds));
      }
    },
    [collapsedState],
  );

  const onEditGroup = (dataItem: CustomGroupDataItem) => {
    setPrevData(cloneDeep(data));
    setEditGroup(dataItem.groupId);
  };

  const onDiscardGroup = () => {
    setEditGroup('');
    updateStateGridData(prevData ?? []);
    setSelectedDataItem(undefined);
  };

  const getGroupIdByCategory = (category: string): string => {
    return `${category}${LCP_KEYS.category}`;
  };

  const updateStateGridData = (updatedData: LCP[], isToUpdatePrevData = true) => {
    setData(updatedData);
    if (isToUpdatePrevData) {
      setPrevData(updatedData);
    }
    setResultState(processWithGroups(updatedData, initialDataState));
  };

  const updateSettingsObj = (updatedData?: LCP[]) => {
    const payload = updatedData?.map((item) => {
      return { ...pick(item, REQUEST_PAYLOAD_KEYS) };
    });
    if (formValues) {
      formValues.lifecyclePhasesProcessedPayload = payload;
      setValues(formValues);
    }
  };

  const onDeleteGroup = (dataItem: CustomGroupDataItem) => {
    confirmationDialog.open();
    setSelectedDataItem(dataItem);
  };

  const onConfirmDeactivate = () => {
    const updatedData = (data ?? []).filter((data: LCP) => getGroupIdByCategory(data.category) !== selectedDataItem.groupId);
    updateStateGridData(updatedData);
    updateSettingsObj(updatedData);
    setSelectedDataItem(undefined);
    confirmationDialog.close();
  };

  const onCancelDeactivate = () => {
    onDiscardGroup();
    confirmationDialog.close();
  };

  const onGroupChange = (options: CustomGroupOptions[], groupId: string) => {
    const selectedGroudIds = options.map(data => data.value);

    if ([PARTS_GROUP_ID, ADD_GROUP_ID].includes(groupId)) {
      // new Add case
      setSelectedDocTypes(options);
      fetchLCPPhasesAsync.start(
        fetchLCPPhases,
        DOC_TYPE_GROUP.PART,
        fetchLCPPhasesAsync,
      );
    } else {
      // Edit case
      if (data) {
      data?.forEach(data => {
        if (getGroupIdByCategory(data.category) === groupId) {
          data.documentTypeIdArr = selectedGroudIds;
        }
        return data;
      });
      updateStateGridData(data);
      setEditGroup(groupId);
      }
    }
  };

  const onUpdateAddOrEditGroup = (dataItem: CustomGroupDataItem) => {
    setEditGroup('');
    updateSettingsObj(data);
  };

  const isLastGroupRow = (id: string, category: string) => {
    const group = resultState?.data.find((item: CustomGroupDataItem) => item.value === category) as CustomGroupDataItem;
    const lastItem = last(group?.items ?? []) as LCP;
    return lastItem?.id === id;
  };

  const addPhase = (dataItem: LCP) => {
    setPrevData(cloneDeep(data));
    const selectedPhaseCategory = data?.filter(phase => phase.category === dataItem.category);
    const enlilTypeOptions = uniq(selectedPhaseCategory?.map(phase => phase.internalType));
    const otherLabelOptions = selectedPhaseCategory?.map(phase => phase.displayLabel);
    const displayOrder = selectedPhaseCategory?.length ?? 0 + 1;
    const newPhase = {
      id: uuidv4(),
      group: dataItem.group,
      category: dataItem.category,
      enlilTypeOptions,
      otherLabelOptions,
      documentTypeIdArr: dataItem.documentTypeIdArr,
      internalType: '',
      displayLabel: '',
      isAllowedOnPO: 'NO',
      isAllowedOnLhrProd: 'NO',
      isAllowedToBuy: 'NO',
      isAddPhase: true,
      displayOrder,
      inEdit: false,
      isUserAdded: true,
      isUserModified: false,
    };
    const newData = [
      ...(data ?? []),
      newPhase,
    ];

    setData(newData);
    setAddNewPhase(newPhase);
    setResultState(processWithGroups(newData, initialDataState));
  };

  const onDeletePhase = (dataItem) => {
    const newData = data?.filter((phase) => phase.id !== dataItem.id) ?? [];
    setData(newData);
    setResultState(processWithGroups(newData, initialDataState));
  };

  const formik = useFormik<Partial<EditableLCP>>({
    initialValues: {},
    onSubmit: (values) => {
      delete values.enlilTypeOptions;
      const selectedEnlilInternalType = data?.filter(phase => phase.category === values.category && phase.internalType === values.internalType) ?? [{ order: 10 }];
      const updatedData = data?.map(phase => (phase.id === values.id) ? { ...values as EditableLCP, isAddPhase: false, order: selectedEnlilInternalType[0]?.order } : phase);
      setPrevData(updatedData);
      setAddNewPhase(undefined);
      setData(updatedData);
      setResultState(processWithGroups(updatedData ?? [], initialDataState));
      updateSettingsObj(updatedData);
    },
  });

  const { submitForm, resetForm } = formik;

  const onDiscardPhase = () => {
    setData(prevData);
    setResultState(processWithGroups(prevData ?? [], initialDataState));
  };

  const schema: Array<ColumnDefinition<LCP>> = LCPSchema({
    actionsClass: classes.actionsCell,
    onConfirm: submitForm,
    onDiscard: onDiscardPhase,
    onDeletePhase: onDeletePhase,
  });

  const [columns, setColumns] = React.useState<Array<ColumnDefinition<LCP>>>(schema);

  useEffect(() => {
    setColumns(schema);
  }, [addNewPhase, data]);

  useEffect(() => {
    resetForm({ values: addNewPhase ?? {} });
  }, [addNewPhase, resetForm]);

  const rowRender: DataGridProps<LCP>['rowRender'] = (row: React.ReactElement, rowProps: GridRowProps) => {
    if (rowProps.rowType === 'groupHeader') {
      const groupId = rowProps.dataItem.groupId as string;
      return React.cloneElement(row, {
        ...rowProps,
        className: cx(row.props.className, { updatingRow: editGroup === groupId }, { groupLastRow: groupId === ADD_GROUP_ID && rowProps.dataItem.items.length === 1 }),
        children: (
          <td colSpan={rowProps.dataItem.fieldCount ?? 7} className="groupHeader">
            <GroupHeaderCell
              {...rowProps}
              onExpandChange={onExpandChange}
              onEditGroup={onEditGroup}
              editGroup={editGroup}
              partGroups={partGroups}
              onDiscardGroup={onDiscardGroup}
              onUpdateAddOrEditGroup={onUpdateAddOrEditGroup}
              onDeleteGroup={onDeleteGroup}
              onGroupChange={onGroupChange} />
          </td>
        ),
      });
    }

    if (rowProps.dataItem.isAdd) {
      // hide other elements while adding the row
      return <></>;
    }

    const isGroupUpdating = editGroup === getGroupIdByCategory(rowProps.dataItem.category);
    const itemId = rowProps?.dataItem?.id;
    const itemCategory = rowProps?.dataItem?.category;

    if (rowProps.dataItem.isAddPhase) {
      return <FormikProvider value={formik}>
        {React.cloneElement(row, {
          ...rowProps,
          className: cx(row.props.className, 'addingPhaseRow'),
        })}
      </FormikProvider>;
    }

    if (isLastGroupRow(itemId, itemCategory) && !isGroupUpdating) {
      return [row,
        React.cloneElement(row, {
          ...rowProps,
          children: (
            <td colSpan={rowProps.dataItem.fieldCount ?? 7}>
              <AddPhase {...rowProps} addPhase={addPhase} />
            </td>
          ),
        }),
      ];
    }

    return React.cloneElement(row, {
      ...rowProps,
      className: cx(row.props.className, { updatingRow: isGroupUpdating }, { groupLastRow: isLastGroupRow(itemId, itemCategory) && isGroupUpdating }),
    });
  };

  const onGroupsToggle = React.useCallback((isExpandAll?) => {
    const dataStateWithoutPaging = processWithGroups((data ?? []), {
      group: dataState.group,
    });

    setCollapsedState(
      isExpandAll ? [] : getGroupIds({ data: dataStateWithoutPaging.data }),
    );
  }, [collapsedState, dataState]);

  const getUpdatedStateDataByEditInfo = React.useCallback((resultState?: DataResult) => {
    resultState?.data?.forEach((group: CustomGroupDataItem) => {
      group.items?.forEach((data) => {
        data[EDIT_FIELD] = group.groupId === editGroup;
        return data;
      });
      return group;
    });

    return sortGroups(resultState?.data ?? []);
  }, [editGroup, resultState]);

  const onItemChange = (e: GridItemChangeEvent) => {
    resultState?.data?.forEach((group: CustomGroupDataItem) => {
      if (group.groupId === getGroupIdByCategory(e.dataItem.category)) {
      group.items?.forEach((data) => {
        if (data.id === e.dataItem.id) {
          data.isUserModified = true;
          data[e.field || ''] = e.value;
        }
        return data;
      });
      }
      return group;
    });

    setResultState(resultState);
  };

  const addLCP = () => {
    setPrevData(cloneDeep(data));
    const newData = [
      ...(data ?? []),
      {
        id: uuidv4(),
        internalType: '',
        displayLabel: '',
        isAllowedOnPO: '',
        isAllowedOnLhrProd: '',
        category: ADD_GROUP_NAME,
        documentTypeIdArr: [],
        isAllowedToBuy: '',
        [EDIT_FIELD]: true,
        isAdd: true,
        isUserAdded: true,
        isUserModified: false,
      },
    ];
    setData(newData);
    setEditGroup(ADD_GROUP_ID);
    setResultState(processWithGroups(newData, initialDataState));
  };

  const newData = setExpandedState({
    data: getUpdatedStateDataByEditInfo(resultState),
    collapsedIds: collapsedState,
  });

  return <SettingsPanel {...props} title={translate('administration.general.settings.lcp')} onAddNew={addLCP}>
    <Grid item>
      <KendoDataGrid<EditableLCP>
        {...dataState}
        data={newData}
        schema={getColumns()}
        onDataStateChange={onDataStateChange}
        total={resultState?.total}
        group={DATA_GROUP}
        fullWidth
        className={classes.rootMDTable}
        hasBoxScrollbars
        dataItemKey={DATA_ITEM_KEY}
        skipDataProcessing
        filterable={true}
        groupable={true}
        navigatable={true}
        expandField={EXPAND_FIELD}
        rowRender={rowRender}
        loading={fetchLCPDocTypesAsync.isLoading}
        onItemChange={onItemChange}
      >
        <GridToolbar>
          <Grid container justify="flex-start"
            className={classes.toolbarContainer}
          >
            <Grid
              item
              data-cy="collapse-expand-collapse"
              className={classes.toggleExpandCollapse}
              alignItems="center"
              justify="center"
            >
              <span onClick={() => onGroupsToggle(true)}>
                {translate('common.expand.all')} /{' '}
              </span>
              <span onClick={() => onGroupsToggle()}>
                {translate('common.collapse.all')}
              </span>
            </Grid>
          </Grid>
        </GridToolbar>
      </KendoDataGrid>
    </Grid>
    <Grid item>
      <AddButton
        fullWidth
        attached
        kind="add"
        data-cy="add-lcp-button"
        onClick={addLCP}
      >
        {translate('form.builder.add.item')}
      </AddButton>
      {
        confirmationDialog.isOpen && <AlertDialog
          dialog={confirmationDialog}
          confirmAction={onConfirmDeactivate}
          cancelAction={onCancelDeactivate}
          message="administration.general.settings.lcp.deactivate.message"
        />}
    </Grid>
  </SettingsPanel>;
};

export default React.memo(withThemeNext(React.forwardRef(LCPGrid)));
