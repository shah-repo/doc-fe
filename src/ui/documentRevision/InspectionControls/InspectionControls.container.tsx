import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { DocumentRevision, documentRevisionsActions, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType";
import { toastError } from "../../components/notifications/index";
import { documentVersionPath } from "../../document.revision/utils/paths";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { checkCanTypeCreateInspection, checkIsTypeFaiInspection } from "../helpers/checkDocumentGroup";
import { isDocumentRevisionReleased } from "../helpers/documentRevisionStatus";
import InspectionControlsPresenter from "./InspectionControls.presenter";
import { CreateInspectionBody, DocTypeOptionType, FormOptionType, InspectionControlsContainerProps, OutputDocumentTypes } from "./InspectionControls.types";

/** Buttons for creating an inspection record - container.
 * @param documentRevision Document Revision that the inspection record will be created for.
 */
export const InspectionControlsContainer: React.FunctionComponent<InspectionControlsContainerProps> = ({
  documentRevision,
}) => {
  // MARK: @config
  const {
    id: docRevId,
    status: docRevStatus,
    document: { documentType: { groupOptions: docRevGroupOptions } },
  } = documentRevision;
  const canCreateInspection = checkCanTypeCreateInspection(docRevGroupOptions);
  const isDocumentReleased = isDocumentRevisionReleased(docRevStatus);
  const inspectionDialog = useDialog();
  const history = useHistory();

  // MARK: @state
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isDocTypeInputDisabled, setIsDocTypeInputDisabled] = useState<boolean>(true);
  const [formOptions, setFormOptions] = useState<FormOptionType[]>([]);
  const [docTypeOptions, setDocTypeOptions] = useState<DocTypeOptionType[]>([]);

  // MARK: @actions
  const fetchAvailableFormsAction = useActionCreator(documentRevisionsActions.fetchAvailableForms);
  const createInspectionAction = useActionCreator(documentRevisionsActions.createInspection);

  // MARK: @async
  const fetchAvailableFormsAsync = useAsync({
    onSuccess: (data?: DocumentRevision[]) => {
      setDisabled(false);
      if (!data) { return; }
      if (data.length === 1) {
        onFormSelect(data[0].id, data[0].formTemplate?.outputDocumentTypes as FBOutputDocumentType[] || []);
        return;
      }
      const options: FormOptionType[] = data.map((documentRevision) => ({
        label: `${documentRevision.document.docId} - ${documentRevision.name}`,
        value: documentRevision.id,
        outputDocumentTypes: documentRevision.formTemplate?.outputDocumentTypes as FBOutputDocumentType[] || [],
      }));
      setFormOptions(options);
      inspectionDialog.open();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });
  const createInspectionAsync = useAsync({
    onSuccess: (inspection?: DocumentRevision) => {
      inspectionDialog.close();
      if (!inspection) { return; }
      history.push({
        pathname: documentVersionPath(inspection.id, inspection.document.id),
      });
    },
    onError: (error) => {
      toastError(error as string);
    },
  });

  // MARK: @methods
  /** Method executed on FAI button click. */
  const onButtonClick = () => {
    setIsDocTypeInputDisabled(true);
    setDisabled(true);
    fetchAvailableFormsAsync.start(
      fetchAvailableFormsAction,
      DOC_TYPE_GROUP_OPTION.FAI_INSPECTION,
      fetchAvailableFormsAsync,
    );
  };

  /** Method executed when a form is selected from autocomplete.
   * @param formId Id of the selected form.
   * @param outputDocumentTypes Doc Types that can be output of the selected form.
   */
  const onFormSelect = (formId: string, outputDocumentTypes: OutputDocumentTypes) => {
    setIsDocTypeInputDisabled(true);
    const docTypeOptions: DocTypeOptionType[] = outputDocumentTypes
      .filter((type) => checkIsTypeFaiInspection(type.groupOptions))
      .map((type) => ({
        label: type.documentTypeName || "",
        value: type.id,
        formId,
      }));
    if (docTypeOptions.length === 1) {
      onDocTypeSelect(docTypeOptions[0].value, formId);
      return;
    }
    setDocTypeOptions(docTypeOptions);
    setIsDocTypeInputDisabled(false);
  };

  /** Creates a new Inspection after type selection.
  * @param typeId Selected type id.
  * @param formId Id of the form that will be used as a template for inspection.
  */
  const onDocTypeSelect = (typeId: string, formId: string) => {
    const createInspectionBody: CreateInspectionBody = {
      lot: { id: docRevId },
      documentType: { id: typeId },
      formDocument: { id: formId },
    };
    createInspectionAsync.start(
      createInspectionAction,
      createInspectionBody,
      createInspectionAsync,
    );
  };

  return (
    <InspectionControlsPresenter
      {...{
        canCreateInspection,
        isDocumentReleased,
        onButtonClick,
        disabled,
        inspectionDialog,
        formOptions,
        docTypeOptions,
        onFormSelect,
        onDocTypeSelect,
        isDocTypeInputDisabled,
      }}
    />
  );
};

export default InspectionControlsContainer;
