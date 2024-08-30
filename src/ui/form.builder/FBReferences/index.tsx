import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { pick } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import DocumentRevisionDialog from '../../components/common/dialogs/DocumentRevisionDialog';
import { Button } from '../../components/forms/fields-next';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import useDialog from '../../hooks/useDialog';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { FB } from '../helpers';
import { FIELDS_TO_PICK } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableReference, FBReferenceProps, Reference, ReferenceEditEvent } from './types';
import { withFBReferences } from './wrap';

const FBReferences: React.FC<FBReferenceProps> = ({
  label = 'common.references',
  name = '',
  disabled,
  references = [],
  setReferences,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const isActive = !disabled;
  const [editedReference, setEditedReference] = useState<Partial<EditableReference>>();
  const [selectedDataItem, setSelectedDataItem] = useState<EditableReference>();
  const quickViewDialog = useDialog();
  const isReferenceAdded = editedReference?.[MODE_FIELD] === Mode.add;
  const editReference = ({ dataItem }: ReferenceEditEvent) => setEditedReference(dataItem);
  const isInEditMode = editedReference !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editReference : undefined;

  const formik = useFormik<Partial<EditableReference>>({
    initialValues: {},
    onSubmit: (values) => {
      const isAddition = values[MODE_FIELD] === Mode.add;
      const updatedReferences = isAddition
        ? [...references, values]
        : references.map((reference) =>
          reference.id === values.id
            ? values
            : reference,
        );

      const payload = updatedReferences
        .map((contact) => pick(contact, FIELDS_TO_PICK));

    formState?.setFieldValue(name, updatedReferences);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      [name]: payload,
    });
    setReferences(updatedReferences as Reference[]);
    discardReference();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedReference ?? {} });
  }, [editedReference, setValues, resetForm]);

  const createDraftReference = () => setEditedReference({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const discardReference = () => setEditedReference(undefined);

  const removeReference = (dataItem: EditableReference) => {
    if (!editedReference) return;

    const referenceWithCompleteData = references
      .filter((contact) =>
        contact.id !== dataItem.id,
      );
    const updatedReferences = referenceWithCompleteData
      .map((contact) => pick(contact, FIELDS_TO_PICK));

    setReferences(referenceWithCompleteData);
    formState?.setFieldValue(name, updatedReferences);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      [name]: updatedReferences,
    });

    discardReference();
  };

  const openQuickView = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, dataItem: EditableReference) => {
    setSelectedDataItem(dataItem);
    quickViewDialog.open();
    event.preventDefault();
    event.stopPropagation();
  };

  const rowRender: DataGridProps<EditableReference>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableReference;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
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

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardReference,
    onDelete: removeReference,
    onOpenQuickView: openQuickView,
  });

  const referencesList = references.reduce((list, item) => {
    const isReferenceEdited = editedReference && editedReference.id === item.id;

    return [
      ...list,
      {
        ...(isReferenceEdited ? editedReference : item),
        [MODE_FIELD]: isReferenceEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isReferenceAdded ? [editedReference] : []);

  return (
    <Box className={classes.root} data-cy="references">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="references" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              disabled={isInEditMode}
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftReference}
              data-cy="add-link"
            >
              {translate('form.builder.supplier.references.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <KendoDataGrid<EditableReference>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={referencesList as EditableReference[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftReference}
          data-cy="add-button"
        >
          {translate('form.builder.supplier.references.add')}
        </Button>
      )}
      <DocumentRevisionDialog dialog={quickViewDialog} {...{ docRevId: selectedDataItem?.referenceRevId, parentRevId: workspaceState?.id }} />
    </Box>
  );
};

export default withFBReferences(FBReferences);
