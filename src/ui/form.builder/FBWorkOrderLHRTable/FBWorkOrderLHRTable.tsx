import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { differenceBy, isEmpty, uniqBy } from 'lodash';
import { reaction } from 'mobx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FBInputProps, FBSection, FBWorkspaceModeOptions } from '..';
import { SM } from '../../../App';
import { translate } from '../../../common/intl';
import { authSelectors } from '../../../state/ducks/auth';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import NoDataFound from '../../components/common/kendo/NoDataFound';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { checkIsDocumentForm } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import FBStore from '../FBStore/FBStore';
import { FB } from '../helpers';
import { ActionsCell } from './components/ActionsCell';
import { Mode, MODE_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { DraftLhrTableItem, EditableLHRTableItem, ILHRTableItem, LHRTableItemEditEvent } from './types';

const FBWorkOrderLHRTable: React.FC<FBInputProps> = ({
  name = '',
  label,
  disabled,
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

  reaction(
    () => workspaceState?.formInputSync.get(name),
    (value) => {
      if (isEmpty(value)) {
        setLhrList([]);
      }
    },
    { fireImmediately: true },
  );

  return (
    <Box position="relative">
      <FBSection label={translate('form.builder.workOrder.lhr.section.heading')} />
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableLHRTableItem>
          filterable={false}
          fullWidth
          hasBoxScrollbars
          data={lhrListToUse}
          schema={schema}
          rowRender={rowRender}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
          onRowClick={handleRowClick}
          // loading= {_formState?.loading}
          fallback={<NoDataFound />}
        />
      </FormikProvider>
      {isActive && <Button
        kind="add"
        fullWidth
        onClick={handleAddLHR}
        data-cy="add-button"
      >
        {translate('form.builder.workOrder.lhr.add')}
      </Button> }
    </Box>
  );
};

export default FBWorkOrderLHRTable;
