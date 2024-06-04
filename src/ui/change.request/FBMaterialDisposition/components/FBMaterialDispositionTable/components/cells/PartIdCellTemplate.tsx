import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../../../common/intl';
import { DocumentRevision } from '../../../../../../../state/ducks/documentRevisions/types';
import { MODE_FIELD, Mode } from '../../../../../../components/KendoDataGrid/constants';
import { FormikField } from '../../../../../../components/forms/fields-next';
import { documentPreviewPath } from '../../../../../../document.revision/utils/paths';
import { FBAutocompleteAsyncOption } from '../../../../../../form.builder';
import { Colors } from '../../../../../../layout/theme-next';
import OverflowingContent from '../../../commonCells/OveflowContent';
import { CustomTemplateProps, EditableMDItem } from '../../types';
import AutocompleteAsync from './AutocompleteAsync';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { setFieldValue, getFieldProps, values } = useFormikContext<EditableMDItem>();
  const { userEnteredItemId } = dataItem;
  const isUserEnteredItemId = !isEmpty(userEnteredItemId);
  const classes = styles();

  const handleChange = (event: ChangeEvent<unknown>, value: DocumentRevision) => {
    setFieldValue('docId', value.document.docId);
    setFieldValue('docRevId', value.id);
    setFieldValue('displayRevision', value.displayRevision);
  };

  console.log({ values, field });

  const onInputChange = (
    event: React.FocusEvent<HTMLInputElement>,
    value: string,
    reason: string,
  ) => {
    if (reason === 'input') {
      setFieldValue('text', value);
    }
  };

  return (
    <FormikField name={isUserEnteredItemId ? 'userEnteredItemId' : 'partDocRevId'}>
      <AutocompleteAsync
        {...getFieldProps(isUserEnteredItemId ? 'userEnteredItemId' : 'partDocRevId')}
        blurOnSelect
        freeSolo
        forcePopupIcon
        disableClearable
        optionId={FBAutocompleteAsyncOption.allDocuments}
        onInputChange={onInputChange}
        classes={{
          paper: classes.paper,
        }}
        renderOption={(option) => {
          const label = translate('wo.displayRevision', { docId: option.document.docId, displayRevision: option?.displayRevision, name: option?.name });
          return <div className={classes.optionWrap}>{label}</div>;
        }}
        onChange={handleChange}
        placeholder={translate('common.select.or.enter.placeholder')}
        size="small"
      />
    </FormikField>
  );
};

export const PartIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = styles();
  const { dataItem, field, onClick } = props;

  const { partDocId, partDocRevId, userEnteredItemId } = dataItem;
  const fieldValue = dataItem[field];
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const isUserEnteredItemId = !isEmpty(userEnteredItemId);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  return (
    <OverflowingContent onClick={() => onClick?.({ dataItem })}>
      {fieldValue && <Tooltip title={fieldValue} placement="top-start" arrow>
        <Link
          to={documentPreviewPath(partDocRevId, partDocId)}
          target="_blank"
          className={classes.link}
        >
          {fieldValue}
        </Link>
      </Tooltip>}
      {isUserEnteredItemId && <Box display="flex" justifyContent="space-between">
        {userEnteredItemId}
        <span className={classes.nonEnlilDocInfoIcon}>
          <Tooltip
            arrow
            title={translate('approvalRequest.material.disposition.warning.non.enlil.doc')}
            placement="top"
          >
            <FontAwesomeIcon
              data-cy="non-enlil-doc"
              color={Colors.warning}
              icon={regular('circle-exclamation')}
            />
          </Tooltip>
        </span>
      </Box>
      }
    </OverflowingContent>
  );
};
