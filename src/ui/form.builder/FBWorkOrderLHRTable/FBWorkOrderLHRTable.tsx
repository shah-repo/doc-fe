import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FBInputProps, FBSection, FBWorkspaceModeOptions } from '..';
import { translate } from '../../../common/intl';
import { Company } from '../../../state/ducks/company/types';
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
  const [lhrList, setLhrList] = useState<EditableLHRTableItem[]>([]);

  const schema = buildSchema();

  const formik = useFormik<DraftLhrTableItem>({
    initialValues: {},
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const { resetForm, setValues } = formik;

  const rowRender: DataGridProps<EditableLHRTableItem>['rowRender'] = (row, { dataItem }) => {
    console.log('Rendering Row');
    const item = (dataItem ?? {}) as EditableLHRTableItem;
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
    setLhrList([{
      lhrDetails: { docRevId: '1122', label: 'LHR-00100' },
      lhrTemplate: 'LHRT-00131',
      startQuantity: 100,
      partRev: {
        label: 'Catheter Part',
      },
      owner: {
        id: '1133',
        active: true,
        company: {} as Company,
        slackUserId: '',
        user: {
          name: 'Roshan Khandelwal',
          avatar: '',
          id: '1122',
          email: '',
          initialColor: '',
        },
      },
      lotId: 'LOT #23091701',
      displayStatus: 'Released',
      [MODE_FIELD]: Mode.add,
    }]);
  }, []);

  useEffect(() => {
    if (editedLHRItem) {
      setLhrList([...lhrList, editedLHRItem]);
      resetForm({ values: editedLHRItem ?? {} });
    }
  }, [editedLHRItem, setValues, resetForm]);

  return (
    <Box position="relative">
      <FBSection label={translate('form.builder.workOrder.lhr.section.heading')} />
      <FormikProvider value={formik}>
        <KendoDataGrid<EditableLHRTableItem>
          filterable={false}
          fullWidth
          hasBoxScrollbars
          data={lhrList }
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
