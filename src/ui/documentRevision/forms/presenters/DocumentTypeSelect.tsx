import { useFormikContext } from "formik";
import * as React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { DocumentRevision, FBOutputDocumentType } from "../../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import SelectField, { SelectOption } from "../../../components/forms/fields/Select";
import { filterSecurityGroupsForQms } from "../../../documentType/list/helpers";
import { FB, FBSchemaProps } from "../../../form.builder";
import { FBWorkspaceMode } from "../../../form.builder/types/workspace";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentTypeSelect } from "../../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { DocumentCloneType } from "../../Clone.container";
import { checkIsDocumentForm, checkIsTypeMustBeOutput } from "../../helpers/checkDocumentGroup";
import { getFBSchemeByDocType } from "../../helpers/getFBSchemeByDocType";
import { getActiveDocumentTypes } from "../transform";

interface Props extends RouteComponentProps {
  isdocRevStatusDraft: boolean;
  type?: DocumentCloneType;
  outputDocumentTypes?: FBOutputDocumentType[];
  savedocInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    isQms: boolean;
  }>>;
  isDisabled: boolean;
  documentTypeId?: string;
  setDisableCreateButton: (value: boolean) => void;
}

const DocumentTypeSelect: React.FunctionComponent<Props> = ({
  isdocRevStatusDraft,
  type,
  outputDocumentTypes = [],
  savedocInfo,
  isDisabled = false,
  documentTypeId,
  setDisableCreateButton,
  match,
}) => {
  const [isVisible, label, tooltipConfig, validators] = useDocumentTypeSelect(documentTypeId);

  const { workspaceState } = FB.useStores();
  const formik = useFormikContext();
  const loadProposedIdAction = useActionCreator(documentsActions.loadDocumentProposedIdWithCallback);
  const asyncDocumentProposedId = useAsync({
    onSuccess: () => {
      setDisableCreateButton(false);
    },

  });
  const loadDocumentProposedId = (id: string) => {
    // Disable create button sets the flag for temporary disabling
    // of create button until correct doc id is generated
    setDisableCreateButton(true);
    asyncDocumentProposedId.start(loadProposedIdAction, id, asyncDocumentProposedId);
  };

  const currentUserTags = useSelector(authSelectors.currentEmployeeTags);
  const documentTypes = getActiveDocumentTypes(useSelector(documentTypeSelectors.getDocumentTypeFormOptions));
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  const isDocTypeDisabled = (type === "newVersion" || isdocRevStatusDraft) || isDisabled;
  const isNewOutput = type === "newOutput";
  const isCreateMaintenance = match.path.includes("create_maintenance");

  const options: SelectOption[] = React.useMemo(() => {
    if ((isNewOutput || isCreateMaintenance) && outputDocumentTypes) {
      return outputDocumentTypes.map((e) =>
        ({ value: e.id, text: e.documentTypeName }) as SelectOption
      );
    }

    return documentTypes
      .filter((docType) => {
        if (checkIsTypeMustBeOutput(docType.groupOptions)) {
          return false;
        }
        if ((docType.hiddenForCreationForUsersWithoutTags?.length ?? 0) === 0) {
          return true;
        }
        return docType.hiddenForCreationForUsersWithoutTags?.some((tag) => currentUserTags.includes(tag));
      }
      ).map((docType) =>
        ({ value: docType.id, text: docType.documentTypeName })
      );
  }, [isNewOutput, outputDocumentTypes, documentTypes, currentUserTags, isCreateMaintenance]);

  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const typeId = event.target.value as string;
    const type = documentTypesById[typeId] || {};
    savedocInfo({ name: event.target.name || "", isQms: type.isQms });
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
    if (mode === "design" && type.group !== "DYNAMIC_FORM") {
      const formValues = {
        ...formik.values as Partial<DocumentRevision>,
        "document.documentType.id": typeId,
      };
      // TO DO: This needs clenaup
      if (!isCreateMaintenance) { scheme = getFBSchemeByDocType(
        formValues,
        documentTypesById,
        workspaceState?.getSchema(),
      ); }
    }
    if (!isCreateMaintenance) { workspaceState?.setMode(mode);
    workspaceState?.setSchema(scheme); }
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
          inputProps: { id: "documentType", disabled: isDocTypeDisabled },
          onChange: handleTypeChange,
        }}
        options={options}
        validate={validators}
        includeEmpty={false}
      />
    </CustomLabelTooltip>
  );
};

export default withRouter(DocumentTypeSelect);
