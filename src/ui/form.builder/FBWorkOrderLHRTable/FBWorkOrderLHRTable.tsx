import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FBInputProps, FBWorkspaceModeOptions } from '..';
import { translate } from '../../../common/intl';
import NoDataFound from '../../components/common/kendo/NoDataFound';
import { Button } from '../../components/forms/fields-next';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { FB } from '../helpers';
import { Mode, MODE_FIELD } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { DraftLhrTableItem, EditableLHRTableItem } from './types';

const FBWorkOrderLHRTable: React.FC<FBInputProps> = ({
  name = '',
  label,
  ...props
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();

  const isPreview = formState?.workspaceMode === FBWorkspaceModeOptions.PREVIEW;
  const isActive = !isPreview;
  // const cyName = kebabCase(name);

  const [editedLHRItem, setEditedLHRItem] = useState<EditableLHRTableItem>();
  const [lhrList, setLhrList] = useState<EditableLHRTableItem[]>();

  const schema = buildSchema();

  const formik = useFormik<DraftLhrTableItem>({
    initialValues: {},
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const rowRender: DataGridProps<EditableLHRTableItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLHRTableItem;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);

    if (!isUpdating) {
      return row;
    }

    return React.cloneElement(row, {
      className: cx(row.props.className, classes.updatingRow),
    });
  };

  const handleAddLHR = () => setEditedLHRItem({
    [MODE_FIELD]: Mode.add,
  });

  useEffect(() => {
    const lhrIds = workspaceState?.formInputSync.get(name) ?? [];
    console.log(lhrIds);
    setLhrList([]);
  }, []);

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableLHRTableItem>
          filterable={false}
          fullWidth
          hasBoxScrollbars
          data={lhrList as EditableLHRTableItem[]}
          schema={schema}
          rowRender={rowRender}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
          // loading= {fetchLhrList.isLoading}
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
