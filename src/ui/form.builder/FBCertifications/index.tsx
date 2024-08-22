import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
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
import FB from '../helpers/FB';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { Certification, CertificationEditEvent, EditableCertification, FBCertificationProps } from './types';
import { withFBCertifications } from './wrap';

const FBCertifications: React.FC<FBCertificationProps> = ({
  label = 'form.builder.supplier.certifications.title',
  name = '',
  disabled,
  certifications = [],
  setCertifications,
  ...props
}) => {
  const classes = useStyles();
  const isActive = !disabled;
  const { formState, workspaceState } = FB.useStores();
  const [editedCertification, setEditedCertification] = useState<Partial<EditableCertification>>();

  const isCertificationAdded = editedCertification?.[MODE_FIELD] === Mode.add;
  const editCertification = ({ dataItem }: CertificationEditEvent) => setEditedCertification(dataItem);
  const isInEditMode = editedCertification !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editCertification : undefined;

  const formik = useFormik<Partial<EditableCertification>>({
    initialValues: {},
    onSubmit: (values: Partial<EditableCertification>) => {
      const updatedCertification = omit(values, FIELDS_TO_OMIT);
      const isAddition = values[MODE_FIELD] === Mode.add;
      const certifications: EditableCertification[]
        = workspaceState?.formInput?.[name] ?? [];
      console.log({ updatedCertification });
      const updatedCertifications = isAddition
        ? [...certifications, updatedCertification]
        : certifications.map((certification) =>
          certification.id === values.id
            ? updatedCertification
            : certification,
        );
      formState?.setFieldValue(name, updatedCertifications);
      workspaceState?.saveDocRev({
        ...workspaceState?.formInput,
        [name]: updatedCertifications,
      });
      setCertifications(updatedCertifications as Certification[]);

      discardCertification();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedCertification ?? {} });
  }, [editedCertification, setValues, resetForm]);

  const createDraftCertification = () => setEditedCertification({
    id: uuidv4(),
    expiryDate: null,
    [MODE_FIELD]: Mode.add,
  });

  const discardCertification = () => setEditedCertification(undefined);

  const removeCertification = (dataItem: EditableCertification) => {
    if (!editedCertification) return;

    const updatedCertifications = certifications.filter((contact) =>
      contact.id !== dataItem.id,
    );
    setCertifications(updatedCertifications);
    formState?.setFieldValue(name, updatedCertifications);
    workspaceState?.saveDocRev({
      ...workspaceState?.formInput,
      [name]: updatedCertifications,
    });
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
