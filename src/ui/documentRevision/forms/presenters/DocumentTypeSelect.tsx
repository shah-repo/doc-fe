import { useFormikContext } from "formik";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { documentsActions } from "../../../../state/ducks/documents";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import SelectField, { SelectOption } from "../../../components/forms/fields/Select";
import { required, validator } from "../../../components/forms/fields/validators";
import FBDRStore from "../../../form.builder/stores/ui/FBDRStore";
import { OutputDocumentTypes } from "../../../form.builder/types/formik";

interface Props {
  isdocRevStatusDraft: boolean;
  type?: string;
  outputDocumentTypes?: OutputDocumentTypes[];
  savedocInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    isQms: boolean;
  }>>;
}

const DocumentTypeSelect: React.FunctionComponent<Props> = ({
  isdocRevStatusDraft,
  type,
  outputDocumentTypes = [],
  savedocInfo,
}) => {
  const formik = useFormikContext();
  const dispatch = useDispatch();
  const loadDocumentProposedId = (documentTypeId: string) =>
    dispatch(documentsActions.loadDocumentProposedId(documentTypeId));
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeFormOptions);
  const documentTypesById = useSelector(documentTypeSelectors.byId);
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const isDocTypeDisabled = type === "newVersion" || isdocRevStatusDraft;
  const options: SelectOption[] = React.useMemo(() => {
    if (type === "newOutput" && outputDocumentTypes) {
      return outputDocumentTypes.map((e) =>
        ({ value: e.id, text: e.documentTypeName })
      );
    }
    return documentTypes.map((doc) =>
      ({ value: doc.id, text: doc.documentTypeName })
    );
  }, [documentTypes, outputDocumentTypes, type]);
  const handleTypeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const typeId = event.target.value as string;
    const type = documentTypesById[typeId] || {};
    savedocInfo({ name: event.target.name || "", isQms: type.isQms });
    groupOptions.forEach((group) => {
      if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
        formik.setFieldValue("securityGroups", [
          { value: group.value, label: group.label },
        ]);
      }
    });
    if (loadDocumentProposedId) {
      formik.setFieldValue("retrain", type.defaultTraining);
      loadDocumentProposedId(type.id);
    }
    FBDRStore.setInitialFBMode(type);
    if (type.isQms) {
      groupOptions.forEach((group) => {
        if (group.tags?.includes(GroupTag.QMS_DEFAULT)) {
          formik.setFieldValue("securityGroups", [
            { value: group.value, label: group.label },
          ]);
        }
      });
    }
    if (!type.isQms) {
      formik.setFieldValue("securityGroups", []);
    }
    formik.handleChange(event);
  };

  return (
    <SelectField
      name="document.documentType.id"
      label="document.type"
      selectProps={{
        inputProps: { id: "documentType", disabled: isDocTypeDisabled },
        onChange: handleTypeChange,
      }}
      options={options}
      validate={validator(required)}
      includeEmpty={false}
    />
  );
};

export default DocumentTypeSelect;
