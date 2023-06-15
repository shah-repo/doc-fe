import { Box, Button, Grid } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { ValueType } from 'react-select';
import { SM } from '../../../../../App';
import { ReactComponent as PreviewIcon } from '../../../../../assets/images/preview.svg';
import { Permission } from '../../../../../state/ducks/auth/types';
import { documentTypeSelectors } from '../../../../../state/ducks/documentRevisions/documentType';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import AutocompleteField from '../../../../components/forms/fields/Autocomplete/Autocomplete';
import { OptionType } from '../../../../components/forms/fields/Autocomplete/types';
import { required, validator } from '../../../../components/forms/fields/validators';
import Text from '../../../../components/Text';
import { DOCUMENT_REVISION_CREATE_URL } from '../../../../constants/urls';
import { FB, FBDialog, FBDialogState, FBProvider } from '../../../../form.builder';
import useGetHasPermission from '../../../../hooks/useGetHasPermission';
import { checkIsTypeCanBeOutput, checkIsTypeMustBeOutput } from '../../../helpers/checkDocumentGroup';
import { isDocumentRevisionInDraft } from '../../../helpers/documentRevisionStatus';
import { getFBSchemeByDocType } from '../../../helpers/getFBSchemeByDocType';
import { getActiveDocumentTypes } from '../../transform';
import RenderHtmlField from '../RenderHtmlField';
import DocumentPreview from './components/DocumentPreview';
import styles from './styles';

interface Props {
  status: DocumentRevisionStatus
  version: number
  docRevId?: string
  isDisabled: boolean
  outputDocs: OptionType[]
}

const FBActiveNoOutput: React.FunctionComponent<Props> = ({
  status,
  version,
  docRevId,
  isDisabled = false,
  outputDocs,
}) => {
  const classes = styles();
  const formik = useFormikContext();
  const { _documentRevisionFormState, _tabsState } = SM.useStores();
  const { workspaceState, dialogState: existsDialogState } = FB.useStores();
  const [selectedValues, setSelectedValues] = React.useState<any>([]);

  const disabled: boolean = (docRevId !== undefined) || isDisabled;
  const isdocRevStatusDraft
    = isDocumentRevisionInDraft(status);
  const isdocRevVersionOne = version === 1;
  const outputDocEnabled: boolean
    = (isdocRevVersionOne && isdocRevStatusDraft) || !disabled;

  const documentTypes = getActiveDocumentTypes(useSelector(documentTypeSelectors.getDocumentTypeFormOptions));
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);

  React.useEffect(() => {
    setSelectedValues(get(formik.values, 'outputDocumentTypes', []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outputDocumentTypeOptions: OptionType[] = React.useMemo(
    () =>
      documentTypes.reduce((acc: OptionType[], document) => {
        if (checkIsTypeMustBeOutput(document.groupOptions) || checkIsTypeCanBeOutput(document.groupOptions)) {
          acc.push({ value: document.id, label: document.documentTypeName });
        }
        return acc;
      }, []),
    [documentTypes],
  );

  const handleTypeChange = (value: ValueType<OptionType>) => {
    setSelectedValues(value ?? []);
    const formValue = {
      ...formik.values as Partial<DocumentRevision>,
      outputDocumentTypes: [value] as OptionType[],
    };
    const scheme = getFBSchemeByDocType(
      formValue,
      documentTypesById,
      _documentRevisionFormState?.schema,
      _tabsState?.activeTabId,
    );

    _documentRevisionFormState?.setFBSchema(scheme);
    workspaceState?.setSchema(scheme);
  };

  const dialogState = FB.useRef<FBDialogState>(FBDialogState);
  const handlePreview: React.MouseEventHandler = () => {
    dialogState?.config({
      open: true,
      maxWidth: 'md',
      title: 'form.builder.form.preview',
      classes: {
        paper: classes.previewDialog,
      },
      content: (
        <DocumentPreview docRevId={docRevId} />
      ),
    });
  };

  const showPreview = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL) && !existsDialogState?.open;
  const disablePreview = isEmpty(selectedValues);

  return (
    <FBProvider dialogState={dialogState}>
      <FBDialog />
      <Box>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs>
            <AutocompleteField
              name="outputDocumentTypes"
              label="document.output.type"
              autocompleteProps={{
                id: 'formTemplate.outputDocumentTypes',
                isMulti: false,
                closeMenuOnSelect: true,
                className: !outputDocEnabled ? classes.outputGrey : '',
                isOptionDisabled: () => selectedValues?.length >= 1,
              }}
              options={outputDocumentTypeOptions}
              validate={validator(required)}
              isDisabled={isDisabled}
              onChange={handleTypeChange}
              portal={true}
            />
          </Grid>
          {showPreview && (
            <Grid item xs className={classes.previewColumn}>
              <Button
                className={cx(classes.previewButton, { [classes.previewButtonDisabled]: disablePreview })}
                color="primary"
                onClick={handlePreview}
                disabled={disablePreview}
              >
                <PreviewIcon />
                <Text message="form.builder.layout.preview" />
              </Button>
            </Grid>
          )}
        </Grid>
        {canUpdateHTML && docRevId && <RenderHtmlField isDisabled={isDisabled} />}
      </Box>
    </FBProvider>
  );
};

export default FBActiveNoOutput;
