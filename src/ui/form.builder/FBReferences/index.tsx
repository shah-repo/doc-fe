import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Button } from '../../components/forms/fields-next';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableReference, FBReferenceProps, ReferenceEditEvent } from './types';
import { withFBReferences } from './wrap';

const FBReferences: React.FC<FBReferenceProps> = ({
  label = 'common.references',
  name = '',
  disabled,
  references = [],
  deleteReference,
  updateReference,
  ...props
}) => {
  const classes = useStyles();
  const isActive = !disabled;
  const [editedReference, setEditedReference] = useState<Partial<EditableReference>>();

  const isReferenceAdded = editedReference?.[MODE_FIELD] === Mode.add;
  const editReference = ({ dataItem }: ReferenceEditEvent) => setEditedReference(dataItem);
  const isInEditMode = editedReference !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editReference : undefined;

  const formik = useFormik<Partial<EditableReference>>({
    initialValues: {},
    onSubmit: (values) => {
      const referenceToSave = omit(values, FIELDS_TO_OMIT);
      console.log({ referenceToSave });
      // TO DO Save/Update

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

  const removeReference = () => {
    if (!editedReference) return;
    // TO DO DELETE the Reference
    discardReference();
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
    isActive,
    isInEditMode,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardReference,
    onDelete: removeReference,
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
    </Box>
  );
};

export default withFBReferences(FBReferences);
