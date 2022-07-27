import { Box, Button, Grid, createStyles, makeStyles, Theme } from "@material-ui/core";
import { useFormikContext } from "formik";
import { get } from "lodash";
import * as React from "react";
import { useSelector } from "react-redux";
import { ValueType } from "react-select";
import DocumentRevisionForm from "../DocumentRevisionForm.container";
import { SM } from "../../../../App";
import { Permission } from "../../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import {
  DocumentRevision,
  DocumentRevisionStatus,
} from "../../../../state/ducks/documentRevisions/types";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import { required, validator } from "../../../components/forms/fields/validators";
import useGetHasPermission from "../../../hooks/useGetHasPermission";
import {
  checkIsTypeCanBeOutput,
  checkIsTypeMustBeOutput,
} from "../../helpers/checkDocumentGroup";
import { isDocumentRevisionInDraft } from "../../helpers/documentRevisionStatus";
import { getFBSchemeByDocType } from "../../helpers/getFBSchemeByDocType";
import { getActiveDocumentTypes } from "../transform";
import RenderHtmlField from "./RenderHtmlField";
import {
  FBProvider,
  FBDialog,
  FB,
  FBDialogState,
  FBForm,
  FBWorkspaceModeOptions,
} from "../../../form.builder";
import Text from "../../../components/Text";
import { ReactComponent as PreviewIcon } from "../../../../assets/images/preview.svg";
import Colors from "../../../layout/theme/utils/colors";
import useAsync from "../../../hooks/useAsync";
import { DocumentRevisionFormValues } from "../types";

interface Props {
  status: DocumentRevisionStatus;
  version: number;
  docRevId?: string;
  isDisabled: boolean;
  outputDocs: OptionType[];
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    outputGrey: {
      color: `${theme.palette.text.disabled}`,
    },
    previewColumn: {
      flex: "0 0 auto",
    },
    previewButton: {
      "height": 40,
      "padding": "10px 20px",
      "margin": "0 0 20px 0",
      "borderRadius": 100,
      "color": Colors.white,
      "&, &:hover": {
        backgroundColor: Colors.navy,
      },
      "& svg": {
        marginRight: 10,
      },
    },
  }),
);
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
  const revisionFormSchema = _documentRevisionFormState?.schema;
  const [selectedValues, setSelectedValues] = React.useState<any>([]);

  const disabled: boolean = (docRevId !== undefined) || isDisabled;
  const isdocRevStatusDraft =
    isDocumentRevisionInDraft(status);
  const isdocRevVersionOne = version === 1;
  const outputDocEnabled: boolean =
    (isdocRevVersionOne && isdocRevStatusDraft) || !disabled;

  const documentTypes = getActiveDocumentTypes(useSelector(documentTypeSelectors.getDocumentTypeFormOptions));
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const canUpdateHTML = useGetHasPermission(Permission.HTML_UPDATE);

  React.useEffect(() => {
    setSelectedValues(get(formik.values, "outputDocumentTypes", []));
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
      revisionFormSchema,
      _tabsState?.tabID,
    );

    _documentRevisionFormState?.setFBSchema(scheme);
  };

  // Temp
  const documentRevision = get(formik, "values") as DocumentRevision;
  documentRevision.schema = revisionFormSchema;

  // const documentRevision = _documentRevisionFormState?.documentRevision;
  const initialValues = documentRevision as unknown as DocumentRevisionFormValues;
  const async = useAsync<DocumentRevision>({});

  const dialogState = FB.useRef<FBDialogState>(FBDialogState);
  const handlePreview: React.MouseEventHandler = () => {
    dialogState?.config({
      open: true,
      maxWidth: "md",
      title: "form.builder.form.preview",
      content: (
        <Box mx={8}>
          <DocumentRevisionForm
            doNotPrompt={true}
            asyncState={async.asyncState}
            onSubmit={console.log}
            initialValues={initialValues}
            onDirtyFlagChange={console.log}
            documentRevision={documentRevision}
            canChangeOwnerShip={false}
            showRevisionTypeChange
            isNewVersion={true}
          />
          <FBForm
            schema={revisionFormSchema}
            initialValidation={true}
            workspaceMode={FBWorkspaceModeOptions.FORM}
          />
        </Box>
      ),
    });
  };

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
                id: "formTemplate.outputDocumentTypes",
                isMulti: false,
                closeMenuOnSelect: true,
                className: !outputDocEnabled ? classes.outputGrey : "",
                isOptionDisabled: () => selectedValues?.length >= 1,
              }}
              options={outputDocumentTypeOptions}
              validate={validator(required)}
              isDisabled={isDisabled}
              onChange={handleTypeChange}
              portal={true}
            />
          </Grid>
          <Grid item xs className={classes.previewColumn}>
            <Button
              className={classes.previewButton}
              color="primary"
              onClick={handlePreview}
              disabled={!revisionFormSchema}
            >
              <PreviewIcon />
              <Text message="form.builder.layout.preview" />
            </Button>
          </Grid>
        </Grid>
        {canUpdateHTML && docRevId && <RenderHtmlField isDisabled={isDisabled}/>}
      </Box>
    </FBProvider>
  );
};

export default FBActiveNoOutput;
