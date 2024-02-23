import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid } from '@material-ui/core';
import { ExcelExport, ExcelExportColumnProps } from '@progress/kendo-react-excel-export';
import { GridToolbar } from '@progress/kendo-react-grid';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { differenceBy, isEmpty, map, uniqBy } from 'lodash';
import { reaction } from 'mobx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FBInputProps, FBSection, FBWorkspaceModeOptions } from '..';
import { SM } from '../../../App';
import { translate } from '../../../common/intl';
import { authSelectors } from '../../../state/ducks/auth';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import NoDataFound from '../../components/common/kendo/NoDataFound';
import ColumnShowHideTreeMenu from '../../components/common/treelist/ColumnShowHideTreeMenu';
import { CustomTreeListColumnProps } from '../../components/common/treelist/types';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { ColumnDefinition, DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { StyleTooltip } from '../../dashboard.new/line.items/common/StyleTooltip';
import { checkIsDocumentForm } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { withFBInput } from '../FBInput/FBInput.wrap';
import FBStore from '../FBStore/FBStore';
import { FB } from '../helpers';
import { ActionsCell } from './components/ActionsCell';
import { CustomColumnMenu, LHRTableColumnMenuContext } from './components/CustomColumnMenu';
import { EXCEL_FILE_NAME, Mode, MODE_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { DraftLhrTableItem, EditableLHRTableItem, ILHRTableItem, LHRTableItemEditEvent } from './types';

const FBWorkOrderLHRTable: React.FC<FBInputProps> = ({
  name = '',
  label,
  disabled,
  hidden,
  ...props
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { _formState } = SM.useStores();
  const { formState, workspaceState } = FB.useStores();

  const isPreview = formState?.workspaceMode === FBWorkspaceModeOptions.PREVIEW;
  const isActive = disabled ? !disabled : !isPreview;
  // const cyName = kebabCase(name);

  const [editedLHRItem, setEditedLHRItem] = useState<EditableLHRTableItem>();
  const [lhrList, setLhrList] = useState<EditableLHRTableItem[]>([]);

  const { document } = workspaceState?.document ?? { version: 0 };
  const isForm = checkIsDocumentForm(document?.documentType?.groupOptions);
  const currentUserId = useSelector(authSelectors.currentUserId);
  const isOwner = workspaceState?.document?.owner?.user?.id === currentUserId;
  const canEditAsOwner = !disabled && isOwner;

  const isEditable = !isForm && canEditAsOwner;

  const editLhrItem = ({ dataItem }: LHRTableItemEditEvent) => setEditedLHRItem(dataItem);
  const handleRowClick = isActive && !editedLHRItem ? editLhrItem : undefined;

  const isLhrItemAdded = editedLHRItem?.[MODE_FIELD] === Mode.add;
  const lhrListToUse = lhrList?.reduce((list, lhrItem) => {
    const isLhrItemEdited = editedLHRItem && editedLHRItem.lhrDetails?.docRevId === lhrItem.lhrDetails?.docRevId;

    return [
      {
        ...(isLhrItemEdited ? editedLHRItem : lhrItem),
        [MODE_FIELD]: isLhrItemEdited ? Mode.edit : Mode.show,
      },
      ...list,
    ];
  }, isLhrItemAdded ? [editedLHRItem] : []);

  const schema = buildSchema({
    onRowClick: handleRowClick,
  });

  const fetchLhrsDetailsAction = useActionCreator(documentRevisionsActions.fetchSelectedLHR);
  const fetchSelectedLhrAsync = useAsync<ILHRTableItem>({
    onSuccess: (data) => {
      if (!Array.isArray(data) || !data.length) {
        return;
      }
      setLhrList(data);
    },
  });

  const updateState = (updatedLhrs: ILHRTableItem[]) => {
    const dataToPersist = updatedLhrs.map(lhr => lhr.lhrDetails?.docRevId)
      .filter(docRevIds => docRevIds !== null);
    formState?.setFieldValue(name, dataToPersist);
    formState?.setFieldAutosave(name);

    if (!disabled || isEditable) {
      _formState?.setLoading(true);
      Promise.resolve(
        workspaceState?.updateDocRevById({ formInput: { ...formState?.getValues(), [name]: dataToPersist } }, workspaceState?.id),
      ).then(() => {
        workspaceState?.setFormInputSync(name, dataToPersist);
        if (workspaceState?.id && FBStore?.isHistoryTabSelected) {
          dispatch(documentRevisionsActions.loadAudit(workspaceState?.id));
        }

        setLhrList(updatedLhrs.map(lhr => ({ ...lhr, [MODE_FIELD]: Mode.show })));
      }).finally(() => {
        _formState?.setLoading(false);
        if (editedLHRItem) {
          discardLhrItem();
        }
      });
    }
  };

  const formik = useFormik<DraftLhrTableItem>({
    initialValues: {},
    onSubmit: (values) => {
      const updatedLhrs = uniqBy([...lhrList, values], 'lotId');
      updateState(updatedLhrs);
    },
  });

  const discardLhrItem = () => {
    setEditedLHRItem(undefined);
    formik.resetForm();
  };

  const removeLhrItem = () => {
    if (!editedLHRItem) {
      return;
    }
    deleteLhrItem(editedLHRItem as ILHRTableItem);
    discardLhrItem();
  };

  const deleteLhrItem = (editedLHRItem: ILHRTableItem) => {
    const updatedLhrs = differenceBy(lhrList, [editedLHRItem], 'lotId');
    updateState(updatedLhrs);
  };

  const rowRender: DataGridProps<EditableLHRTableItem>['rowRender'] = (row, { dataItem }) => {
    const item = (dataItem ?? {}) as EditableLHRTableItem;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    console.log(isUpdating);

    if (!isUpdating) {
      return row;
    }

    const actions = (
      <td className={classes.actionsCell} key="actions">
        <ActionsCell
          dataItem={item}
          onConfirm={formik.submitForm}
          onDiscard={discardLhrItem}
          onDelete={removeLhrItem}
          rootClassName={classes.popperHolder}
        />
      </td>
    );

    return React.cloneElement(row, {
      className: cx(row.props.className, classes.updatingRow),
    },
    [row.props.children, actions]);
  };

  const handleAddLHR = () => setEditedLHRItem({
    [MODE_FIELD]: Mode.add,
  });

  useEffect(() => {
    const lhrRevIds = workspaceState?.formInputSync.get(name) ?? [];
    const lhrRevIdsToUse: string[] = lhrRevIds.filter(lhrRevId => lhrRevId !== null);
    if (!isEmpty(lhrRevIdsToUse)) {
      fetchSelectedLhrAsync.start(fetchLhrsDetailsAction, [lhrRevIdsToUse], fetchSelectedLhrAsync);
    }
  }, []);

  useEffect(() => {
    reaction(
      () => workspaceState?.formInputSync.get(name),
      (value) => {
        if (isEmpty(value)) {
          setLhrList([]);
        }
      },
      { fireImmediately: true },
    );
  }, []);

  const [columns, setColumns]
  = React.useState<Array<ColumnDefinition<EditableLHRTableItem>>>(schema);

  const getColumns = () => {
    return columns.filter(({ isHidden }) => !isHidden);
  };

  const onLock = React.useCallback(
    ({
      field,
      locked,
    }: CustomTreeListColumnProps) => {
      const index = columns.findIndex((c) => c.field === field);
      const column = columns[index];
      if (column) {
        const newColumns = [...columns];
        newColumns.splice(index, 1, {
          ...column,
          locked: !locked,
          reorderable: locked,
          orderIndex: !locked ? 0 : undefined,
        });
        setColumns(newColumns);
      }
    },
    [columns],
  );

  const onColumnShowHide = ({ field }: CustomTreeListColumnProps) => {
    const dataColumns = map(columns, (column: CustomTreeListColumnProps) => {
      if (column.field === field) {
        column.isHidden = !column.isHidden;
      }
      return column;
    });
    setColumns(dataColumns as unknown as Array<ColumnDefinition<EditableLHRTableItem>>);
  };

  const renderToolbar = (
    <GridToolbar>
      <Grid
        container
        justify="flex-end"
        className={classes.toolbarContainer}
      >
        <Grid
          item
          data-cy="excel-export"
          className={cx({ [classes.disabled]: !isActive })}
        >
          <StyleTooltip
            title={translate('common.download')}
            placement="top"
            arrow
          >
            <FontAwesomeIcon
              data-cy="excel-download"
              className={classes.exportExcelIcon}
              onClick={() => exportToExcel()}
              icon={solid('arrow-down-to-line')}
            />
          </StyleTooltip>
        </Grid>
        <Grid
          item
          data-cy="show-hide-columns"
          className={cx({ [classes.disabled]: !isActive })}
        >
          <ColumnShowHideTreeMenu
            columnDefinition={columns as CustomTreeListColumnProps[] }
            onChange={onColumnShowHide}
          />
        </Grid>
      </Grid>
    </GridToolbar>
  );

  const _export = React.useRef<ExcelExport | null>(null);

  const exportToExcel = () => {
    if (_export.current !== null) {
      _export.current.save(lhrListToUse, getColumns() as ExcelExportColumnProps[]);
    }
  };

  return (
    <>
      {!hidden && (
        <Box position="relative">
          <FBSection label={label ?? translate('form.builder.workOrder.lhr.section.heading')} />
          <LHRTableColumnMenuContext.Provider
            value={{
              columns,
              onLock,
              onColumnShowHide,
            }}
          >
            <FormikProvider value={formik}>
              <ExcelExport
                ref={(exporter) => {
                  if (exporter) {
                    _export.current = exporter;
                  }
                }}
                fileName={EXCEL_FILE_NAME}
              >
                <KendoDataGrid<EditableLHRTableItem>
                  filterable={false}
                  fullWidth
                  hasBoxScrollbars
                  data={lhrListToUse}
                  schema={getColumns()}
                  columnMenu={(props) => (
                    <CustomColumnMenu
                      {...props}
                      columns={getColumns()}
                      onColumnShowHide={onColumnShowHide}
                      {...{
                        onLock,
                      }}
                    />
                  )
                  }
                  rowRender={rowRender}
                  className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
                  onRowClick={handleRowClick}
                  // loading= {_formState?.loading}
                  fallback={<NoDataFound />}
                >
                  {renderToolbar}
                </KendoDataGrid>
              </ExcelExport>
            </FormikProvider>
          </LHRTableColumnMenuContext.Provider>
          {isActive && <Button
            kind="add"
            fullWidth
            onClick={handleAddLHR}
            data-cy="add-button"
          >
            {translate('form.builder.workOrder.lhr.add')}
          </Button> }
        </Box>
      )}
    </>
  );
};

export default withFBInput(FBWorkOrderLHRTable);
