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
import { CertificationEditEvent, EditableCertification, FBCertificationProps } from './types';
import { withFBCertifications } from './wrap';

const FBCertifications: React.FC<FBCertificationProps> = ({
  label = 'form.builder.supplier.certifications.title',
  name = '',
  disabled,
  certifications = [],
  deleteCertification,
  updateCertification,
  ...props
}) => {
  const classes = useStyles();
  const isActive = !disabled;
  const [editedCertification, setEditedCertification] = useState<Partial<EditableCertification>>();

  const isCertificationAdded = editedCertification?.[MODE_FIELD] === Mode.add;
  const editCertification = ({ dataItem }: CertificationEditEvent) => setEditedCertification(dataItem);
  const isInEditMode = editedCertification !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editCertification : undefined;

  const formik = useFormik<Partial<EditableCertification>>({
    initialValues: {},
    onSubmit: (values) => {
      const certificationToSave = omit(values, FIELDS_TO_OMIT);
      console.log({ certificationToSave });
      // TO DO Save/Update

      discardCertification();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedCertification ?? {} });
  }, [editedCertification, setValues, resetForm]);

  const createDraftCertification = () => setEditedCertification({
    id: uuidv4(),
    [MODE_FIELD]: Mode.add,
  });

  const discardCertification = () => setEditedCertification(undefined);

  const removeCertification = () => {
    if (!editedCertification) return;
    // TO DO DELETE the certification
    discardCertification();
  };

  const rowRender: DataGridProps<EditableCertification>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableCertification;
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
    onDiscard: discardCertification,
    onDelete: removeCertification,
  });

  const certificationsList = certifications.reduce((list, item) => {
    const isCertificationEdited = editedCertification && editedCertification.id === item.id;

    return [
      ...list,
      {
        ...(isCertificationEdited ? editedCertification : item),
        [MODE_FIELD]: isCertificationEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isCertificationAdded ? [editedCertification] : []);

  return (
    <Box className={classes.root} data-cy="certifications">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="certifications" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              disabled={isInEditMode}
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftCertification}
              data-cy="add-link"
            >
              {translate('form.builder.add.item')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <KendoDataGrid<EditableCertification>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        hasBoxScrollbars
        schema={schema}
        data={certificationsList as EditableCertification[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftCertification}
          data-cy="add-button"
        >
          {translate('form.builder.add.item')}
        </Button>
      )}
    </Box>
  );
};

export default withFBCertifications(FBCertifications);
