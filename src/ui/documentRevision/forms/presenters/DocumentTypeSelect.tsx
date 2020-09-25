import { useFormikContext } from "formik";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { DocumentRevision, FBOutputDocumentType } from "../../../../state/ducks/documentRevisions";
import { DocumentGroupOptionsType, documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import SelectField, { SelectOption } from "../../../components/forms/fields/Select";
import { filterSecurityGroupsForQms } from "../../../documentType/list/helpers";
import { FB } from "../../../form.builder";
import { FBWorkspaceMode } from "../../../form.builder/types/workspace";
import { useDocumentTypeSelect } from "../../../hooks/docCustomization/useCustomization";
import { DocumentCloneType } from "../../Clone.container";
import { getFBSchemeByDocType } from "../../helpers";

interface Props {
  isdocRevStatusDraft: boolean;
  type?: DocumentCloneType;
  outputDocumentTypes?: FBOutputDocumentType[];
  savedocInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    isQms: boolean;
  }>>;
  isDisabled: boolean;
  documentTypeId?: string;
}

const DocumentTypeSelect: React.FunctionComponent<Props> = ({
  isdocRevStatusDraft,
  type,
  outputDocumentTypes = [],
  savedocInfo,
  isDisabled = false,
  documentTypeId,
}) => {
  const [isVisible, label, validators] = useDocumentTypeSelect(documentTypeId);

  const { workspaceState } = FB.useStores();
  const formik = useFormikContext();
  const dispatch = useDispatch();

  const loadDocumentProposedId = (documentTypeId: string) =>
    dispatch(documentsActions.loadDocumentProposedId(documentTypeId));

  const currentUserTags = useSelector(authSelectors.currentEmployeeTags);
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeFormOptions);
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);

  const isDocTypeDisabled = (type === "newVersion" || isdocRevStatusDraft) || isDisabled;
  const isNewOutput = type === "newOutput";

  const options: SelectOption[] = React.useMemo(() => {
    if (type === "newOutput" && outputDocumentTypes) {
      return outputDocumentTypes.map((e) =>
        ({ value: e.id, text: e.documentTypeName }) as SelectOption
      );
    }
    return documentTypes
      .filter((docType) => {
        if (docType.groupOptions?.includes("MUST_BE_OUTPUT")) {
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
  }, [type, outputDocumentTypes, documentTypes, currentUserTags]);

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

    // FB mode
    const formOption: DocumentGroupOptionsType = "FORM";
    const mode: FBWorkspaceMode = isNewOutput ? "form" :
      type.groupOptions?.includes(formOption) ? "design" : "none";
    workspaceState?.setMode(mode);
    formik.handleChange(event);
    if (mode === "design") {
      const formValues = {
        ...formik.values as Partial<DocumentRevision>,
        "document.documentType.id": typeId,
      };
      const scheme = getFBSchemeByDocType(
        formValues,
        documentTypesById,
        workspaceState?.getSchema(),
      );
      workspaceState?.setSchema(scheme);
    }
  };

  if (!isVisible && type !== "newOutput") {
    return null;
  }

  return (
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
  );
};

export default DocumentTypeSelect;
