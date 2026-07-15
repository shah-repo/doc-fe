import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { authSelectors } from '../../../state/ducks/auth';
import { ChangeRequestStatus } from '../../../state/ducks/changeRequest/types';
import { DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import { Button } from '../../components/forms/fields-next';
import { useFormContext } from '../../components/forms/FormContext';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FB, FBSection } from '../../form.builder';
import { buildSchema } from './schema';
import useStyles from './styles';
import { AffectedSerialNumber, ASNEditEvent, EditableASN } from './types';
import { useOptions } from './utils';

interface props {
  partOfId?: string
  state?: ChangeRequestStatus | DocumentRevisionStatus
  isShowOnly?: boolean
  disabled?: boolean
  label?: string
  isAdditionalColumnsShown?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBAffectedSerialNumberTable: React.FunctionComponent<props> = (
  { partOfId, label, state, isShowOnly = false, isAdditionalColumnsShown, setDoNotPrompt, disabled }) => {
  const classes = useStyles();
  isShowOnly = (isShowOnly || disabled) ?? false;
  const { workspaceState } = FB.useStores();
  const [editedASN, setEditedASNItem] = React.useState<Partial<EditableASN>>();
  const isASNAdded = editedASN?.[MODE_FIELD] === Mode.add;
  const [data, setData] = React.useState<EditableASN[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const discardASNItem = () => setEditedASNItem(undefined);
  const formContext = useFormContext();
  const { lots, isLotsloading } = useOptions();
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const isDocRevOwner = workspaceState?.changeRequest?.owner?.id ?? workspaceState?.document?.owner?.id;
  const isOwner = isDocRevOwner === currentUserId;

  const editTLItem = ({ dataItem }: ASNEditEvent) => {
    const canEdit = isShowOnly || formik.dirty;
    if (canEdit) {
      return;
    }

    setEditedASNItem(dataItem);
  };

  useEffect(() => {
    // TODO...
    setData([]);
  }, []);

  const formik = useFormik<Partial<EditableASN>>({
    initialValues: {},
    onSubmit: (values) => {
      if (values[MODE_FIELD] === Mode.add) {
        // TODO...
      }
      discardASNItem();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedASN ?? {} });
  }, [editedASN, setValues, resetForm]);

  const createDraftTLItem = () => setEditedASNItem({
    lotId: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const deleteASNItem = () => {
    if (!editedASN?.lotId) {
      return;
    }
    discardASNItem();
  };

  const isDisabled = DocumentRevisionStatus.Voided === workspaceState?.document?.status;
  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editTLItem,
    onConfirm: submitForm,
    onDiscard: discardASNItem,
    onDelete: deleteASNItem,
    isDisabled,
    lots,
    isLotsloading,
  });

  const getColumns = () => {
    return schema.filter(({ show }) => show || isAdditionalColumnsShown);
  };

  const rowRender: DataGridProps<AffectedSerialNumber>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as AffectedSerialNumber;
    const isUpdating = [Mode.edit, Mode.add].includes(item[MODE_FIELD]);

    if (isShowOnly) {
      return (
        <FormikProvider value={formik}>
          {row}
        </FormikProvider>
      );
    }

    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const MDItemList = data.reduce<Array<Partial<EditableASN>>>((list, item, index) => {
    const isMDItemEdited = editedASN && editedASN.lotId === item.lotId;
    return [
      ...list,
      {
        ...(isMDItemEdited ? editedASN : item),
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isASNAdded ? [editedASN] : []);

  const canAddASNItem = (isAdditionalColumnsShown && isOwner) || (!isShowOnly && !formContext?.isEditing);

  return (
    <div ref={containerRef} className={classes.root} data-cy="affected-serial-num-table">
      <FBSection label={label ?? translate('form.builder.affected.serial.numbers.section.heading')} />
      <KendoDataGrid<EditableASN>
        data={MDItemList as EditableASN[]}
        schema={getColumns()}
        fullWidth
        className={classes.rootASNTable}
        hasBoxScrollbars
        onRowClick={editTLItem}
        rowRender={rowRender}
        containerRef={containerRef}
        resizable={true}
      />
      {canAddASNItem && (
        <Button kind="add" fullWidth attached onClick={createDraftTLItem} data-cy="add-affected-serial-num">
          {translate('approvalRequest.tasks.list.add')}
        </Button>
      )}
    </div>
  );
};

export default FBAffectedSerialNumberTable;
