import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Mode, MODE_FIELD } from '../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableShippingItem, FBShippingItemsProps, ShippingItemEditEvent } from './types';
import { withFBShippingItems } from './wrap';

const FBShippingItems: React.FC<FBShippingItemsProps> = ({
  label = 'form.builder.record.shipping.items.label',
  name = '',
  disabled,
  shippingItems = [],
  setShippingItems,
  ...props
}) => {
  const classes = useStyles();
  const isActive = !disabled;
  const [editedShippingItem, setEditedShippingItem] = useState<Partial<EditableShippingItem>>();
  const isShippingItemAdded = editedShippingItem?.[MODE_FIELD] === Mode.add;
  const editShippingItem = ({ dataItem }: ShippingItemEditEvent) => setEditedShippingItem(dataItem);
  const isInEditMode = editedShippingItem !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editShippingItem : undefined;

  const formik = useFormik<Partial<EditableShippingItem>>({
    initialValues: {},
    onSubmit: (values) => {
      // TO DO
      discardShippingItem();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedShippingItem ?? {} });
  }, [editedShippingItem, setValues, resetForm]);

  const createDraftShippingItem = () => setEditedShippingItem({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const discardShippingItem = () => setEditedShippingItem(undefined);

  const removeShippingItem = (dataItem: EditableShippingItem) => {
    if (!editedShippingItem) return;
    // TO DO
    discardShippingItem();
  };

  const rowRender: DataGridProps<EditableShippingItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableShippingItem;
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
    onDiscard: discardShippingItem,
    onDelete: removeShippingItem,
  });

  const shippingItemList = shippingItems.reduce((list, item) => {
    const isShippingItemEdited = editedShippingItem && editedShippingItem.id === item.id;

    return [
      ...list,
      {
        ...(isShippingItemEdited ? editedShippingItem : item),
        [MODE_FIELD]: isShippingItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isShippingItemAdded ? [editedShippingItem] : []);

  return (
    <Box className={classes.root} data-cy="shipping-items">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="shippingItems" name={name}>
        <FBSection label={label} />
      </FBInput>
      <KendoDataGrid<EditableShippingItem>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={shippingItemList as EditableShippingItem[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftShippingItem}
          data-cy="add-button"
        >
          {translate('form.builder.add.item')}
        </Button>
      )}
    </Box>
  );
};

export default withFBShippingItems(FBShippingItems);
