import { useFormikContext } from "formik";
import * as React from "react";
import { useSelector } from "react-redux";
import { SM } from "../../../../App";
import { authSelectors } from "../../../../state/ducks/auth";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentRevision, FBOutputDocumentType } from "../../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import SelectField, { SelectOption } from "../../../components/forms/fields/Select";
import { filterSecurityGroupsForQms } from "../../../documentType/list/helpers";
import { FBEditorPropertiesType, FBSchemaProps } from "../../../form.builder";
import { styles as FBAutoCompleteStyles } from "../../../form.builder/styles/FBAutocomplete.styles";
import { FBWorkspaceMode } from "../../../form.builder/types/workspace";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentTypeSelect } from "../../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { DocumentCloneType } from "../../Clone.container";
import { checkIsDocumentEditableSchema, checkIsDocumentForm, checkIsDocumentPart, checkIsDynamicForm, checkIsTypeMustBeOutput, checkIsTypeOnlyOnOutputs, hasDefaultNote } from "../../helpers/checkDocumentGroup";
import { getFBSchemeByDocType } from "../../helpers/getFBSchemeByDocType";
import { getActiveDocumentTypes } from "../transform";
import { styles } from "./styles/DocIdInput.styles";

interface Props {
  isDocRevStatusDraft: boolean;
  type?: DocumentCloneType;
  outputDocumentTypes?: FBOutputDocumentType[];
  isDisabled: boolean;
  documentTypeId?: string;
}

const schemaFieldsWithoutNormalisation = ["approvals", "section", "subsection", "stepsection", "teststep"];

const DocumentTypeSelect: React.FunctionComponent<Props> = ({
  isDocRevStatusDraft,
  type,
  outputDocumentTypes = [],
  isDisabled = false,
  documentTypeId,
}) => {
  const { isVisible, label, tooltipConfig, validation: validators } = useDocumentTypeSelect(documentTypeId);
  const { _formState, _documentRevisionFormState, _tabsState } = SM.useStores() || {};
  const formik = useFormikContext();
  const classes = styles();
  const loadProposedIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const asyncDocumentProposedId = useAsync({
    onSuccess: () => {
      _documentRevisionFormState?.setCreateDocumentDisabled(false);
    },

  });
  const loadDocumentProposedId = (id: string) => {
    // Disable create button sets the flag for temporary disabling
    // of create button until correct doc id is generated
    _documentRevisionFormState?.setCreateDocumentDisabled(true);
    asyncDocumentProposedId.start(loadProposedIdAction, id, asyncDocumentProposedId);
  };

  const currentUserTags = useSelector(authSelectors.currentEmployeeTags);
  const documentTypes = getActiveDocumentTypes(useSelector(documentTypeSelectors.getDocumentTypeFormOptions));
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  const isDocTypeDisabled = (type === "newVersion" || isDocRevStatusDraft) || isDisabled;
  const isNewOutput = type === "newOutput";

  const options: SelectOption[] = React.useMemo(() => {
    if (isNewOutput && outputDocumentTypes) {
      return (outputDocumentTypes.filter((type) => type.active)).map((e) =>
        ({ value: e.id, text: e.documentTypeName }) as SelectOption
      );
    }

    return documentTypes
      .filter((docType) => {
        if (checkIsTypeMustBeOutput(docType.groupOptions) ||
           (!isDocTypeDisabled && checkIsTypeOnlyOnOutputs(docType.groupOptions))) {
          return false;
        }
        // omit parts (ENC-6788) unless it is already selected as doc type via Parts module (ENC-7022 fix)
        if (checkIsDocumentPart(docType.groupOptions) && !isDocTypeDisabled) { return false; }
        if ((docType.hiddenForCreationForUsersWithoutTags?.length ?? 0) === 0) {
          return true;
        }
        return docType.hiddenForCreationForUsersWithoutTags?.some((tag) => currentUserTags.includes(tag));
      }
      ).map((docType) =>
        ({ value: docType.id, text: docType.documentTypeName })
      );
  }, [isNewOutput, outputDocumentTypes, documentTypes, isDocTypeDisabled, currentUserTags]);

  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const typeId = event.target.value as string;
    const type = documentTypesById[typeId] || {};
    const docTypeHasDefaultNote = hasDefaultNote(type.groupOptions);
    _documentRevisionFormState?.setDocInfo({
      name: event.target.name || "",
      isQms: type.isQms,
      needsSignature: type.needsSignature as boolean,
    });
    formik.setFieldValue("securityGroups", []);

    if (loadDocumentProposedId) {
      formik.setFieldValue("retrain", type.defaultTraining);
      loadDocumentProposedId(type.id);
    }
    // Security groups
    if (type.isQms) {
      const securityGroups = filterSecurityGroupsForQms(type.isQms, groupOptions);
      formik.setFieldValue("securityGroups", securityGroups);
    }
    formik.handleChange(event);

    // FB mode
    const mode: FBWorkspaceMode = isNewOutput ? "form" :
      checkIsDocumentForm(type.groupOptions) ? "design" : "none";
    let scheme: FBSchemaProps[] = [];
    if (mode === "design" && !checkIsDynamicForm(type.groupOptions)) {
      const formValues = {
        ...formik.values as Partial<DocumentRevision>,
        "document.documentType.id": typeId,
      };
      // TO DO: This needs clenaup
      scheme = getFBSchemeByDocType(
        formValues,
        documentTypesById,
        _documentRevisionFormState?.schema,
        _tabsState?.activeTabId
      );
    }
    _formState?.setMode(mode);
    if (isNewOutput) {
      return;
    }
    const predefinedSchema = scheme?.map((e) => {
      if (
        schemaFieldsWithoutNormalisation.includes(e.type as string)
        || !docTypeHasDefaultNote
        || (docTypeHasDefaultNote && e.editorProperties?.includes("includeNotes") && e.includeNotes)) {
        return e;
      }
      if (docTypeHasDefaultNote && e.editorProperties?.includes("includeNotes") && !e.includeNotes) {
        return {
          ...e,
          includeNotes: true,
        };
      }
      return {
        ...e,
        editorProperties: [
          ...e.editorProperties || [],
          "includeNotes" as FBEditorPropertiesType,
        ],
        includeNotes: true,
      };
    });
    if (checkIsDocumentEditableSchema(type.groupOptions)) {
      _formState?.setValue("schema", predefinedSchema);
    } else {
      _formState?.setValue("formTemplate.schema", predefinedSchema);
      if (predefinedSchema.length) {
        _documentRevisionFormState?.setFBSchema(predefinedSchema);
      }
    }
  };

  if (!isVisible && type !== "newOutput") {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <SelectField
        name="document.documentType.id"
        label={label}
        selectProps={{
          disabled: isDocTypeDisabled,
          inputProps: { id: "documentType", disabled: isDocTypeDisabled },
          onChange: handleTypeChange,
        }}
        options={options}
        validate={validators}
        includeEmpty={false}
        inputStyleProps={classes.input}
        labelProps={FBAutoCompleteStyles.labelStyle}
      />
    </CustomLabelTooltip>
  );
};

export default DocumentTypeSelect;
