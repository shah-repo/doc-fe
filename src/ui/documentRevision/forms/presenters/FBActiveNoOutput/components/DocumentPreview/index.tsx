import { Formik, FormikProps, useFormikContext } from "formik";
import { filter, get, includes, map, size } from "lodash";
import { Observer } from "mobx-react";
import * as React from "react";
import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormHeader, DocumentRevisionFormProgressBar, SM, SMBox, SMFormState, SMTabs, SMTabsState, SMTemplate } from "../../../../../../../App";
import FBTrainingInfoContainer from "../../../../../../../App/Enlil/Features/DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container";
import { withSMForm } from "../../../../../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { withSMTabs } from "../../../../../../../App/Shifamed/Components/SMTabs/SMTabs.hoc";
import { emptyFunction } from "../../../../../../../common/utils/helpers";
import { authSelectors } from "../../../../../../../state/ducks/auth";
import { documentTypeSelectors } from "../../../../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions } from "../../../../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, FBOutputDocumentType, SmartReferenceType } from "../../../../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../../../../state/reducers";
import { DocTypeGroups } from "../../../../../../dashboard.new/line.items/common/types";
import AttachmentsField from "../../../../../../document.revision/form/attachments";
import { FB, FBEditorState, FBSchemaProps, FBWorkspace, FBWorkspaceMode, FBWorkspaceModeOptions } from "../../../../../../form.builder";
import FBMaterialEqInfoContainer from "../../../../../../form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container";
import { DocumentCloneTypeOptions } from "../../../../../Clone.container";
import { isOperator } from "../../../../../DocumentRevisionDisplay.container";
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from "../../../../../helpers/checkDocumentGroup";
import DocumentRevisionFormPresenter from "../../../../DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "../../../../types";
import styles from "./styles";

interface ContainerProps {
  docRevId?: string;
  formPreview?: boolean;
  _tabsState?: SMTabsState;
  _formState?: SMFormState;
}

interface ComponentProps extends ContainerProps {
  formik: FormikProps<DocumentRevisionFormValues>;
}

const DocumentPreview: React.FunctionComponent<ComponentProps> = ({
  docRevId,
  _tabsState,
  _formState,
  formik,
  formPreview = false,
}) => {
  const classes = styles();
  const { _documentRevisionFormState } = SM.useStores();
  const { workspaceState } = FB.useStores();

  const documentTypesById = useSelector(documentTypeSelectors.byId);

  // @todo: Mix between DocumentRevisionSummary and DocumentRevisionForm.
  // @todo: Move these elements to one component to reuse.
  // Create documentRevision and fill it
  const documentRevision = formik.values as unknown as DocumentRevision;
  const initialValues = formik.values as unknown as DocumentRevisionFormValues;

  const docTypeId = documentRevision?.document?.documentType?.id as string;
  const documentType = documentTypesById[docTypeId];
  const docTypeGroup = get(documentType, "group", DOC_TYPE_GROUP.OTHER);
  const templateOutputDocumentTypes = documentRevision?.formTemplate?.outputDocumentTypes?.[0] as FBOutputDocumentType;
  let schema = workspaceState?.schema ?? _documentRevisionFormState?.schema;

  const outputTypeId = (
    documentRevision?.outputDocumentTypes?.value
    ?? documentRevision?.outputDocumentTypes?.[0]?.value
    ?? templateOutputDocumentTypes?.id
  ) as string;
  const outputType = documentTypesById[outputTypeId];
  const outputTypeGroup = get(outputType, "group");

  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  const email = useSelector(authSelectors.currentUserEmail);
  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const isLHR = checkIsDocumentLHR(documentType.groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(documentType.groupOptions);
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const isCurrentUserOperator = useContext(isOperator);
  const isDisabledInput = formik.values.id !== undefined && isCurrentUserOperator && !isOwner;
  const isOutput = true;
  const showAdministrativeAndVoidChange = false;
  const type = DocumentCloneTypeOptions.none;
  const mode = FBWorkspaceModeOptions.FORM;

  const smartReferencesFrom = documentRevision?.smartReferencesFrom?.filter((ref) =>
    ref.active && ref.type === SmartReferenceType.HiddenPiInstance &&
    schema?.map((el) => el.name).filter((el) => el?.includes(ref.metadata.fieldId)));

  let tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));

  if (isLHR) {
    schema = (schema || []).map((schemaItem: FBSchemaProps, i, ro) => ({
      ...schemaItem,
      index: i,
      ...(includes(FBEditorState.pickStepIndex, schemaItem.type) && {
        stepIndex: size(
          filter(
            ro.slice(0, i + 1),
            (step) =>
              !step.deleted && includes(FBEditorState.pickStepIndex, step.type)
          )
        ),
      }),
    }));

    smartReferencesFrom?.forEach((ele) => {
      const obj = schema?.filter((el) => ele?.metadata?.fieldId === el.name);
      ele.stepIndex = obj?.[0]?.stepIndex;
    });
  }

  if (tabConfig && [DOC_TYPE_GROUP.LHR, DOC_TYPE_GROUP.LHRT, DOC_TYPE_GROUP.ENGINEERING_BUILD, DOC_TYPE_GROUP.PI]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [ ...tabConfig, {
      labelId: "tabId.materialsandequipment",
      tabId: TabTypeOptions.TABS_MEQ.toLowerCase(),
      type: TabTypeOptions.TABS_MEQ,
    }];
  }

  if (formik.values?.retrain && tabConfig) {
    tabConfig = [...tabConfig, {
      labelId: "tabId.training",
      tabId: TabTypeOptions.TRAINING.toLowerCase(),
      type: TabTypeOptions.TRAINING,
    }];
  }

  const prevMode = useRef<FBWorkspaceMode>();

  useEffect(() => {
    if (workspaceState?.mode) {
      prevMode.current = workspaceState?.mode;
    }

    _formState?.setValues(initialValues);
    _formState?.setMode(mode);
    workspaceState?.setMode(mode);

    return () => {
      if (prevMode.current) {
        workspaceState?.setMode(prevMode.current);
      }
    };
  }, [_formState, initialValues, workspaceState, mode]);

  return (
    <Observer>
      {() => (
        <SMTemplate
          templateBoxProps={{ stretchY: "100%" }}
          contentBoxProps={{
            height: "auto",
            minHeight: (((!isLHR && !isTypeMpiDoc) || isLHR) ? "20%" : "0px"),
          }}
          header={(!isLHR && !isTypeMpiDoc) && !formPreview && (
            <DocumentRevisionFormHeader type={type} documentTypeId={formik.values.document?.documentType?.id} />
          )}
          lhrSteps={isLHR && !formPreview && (
            <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />
          )}
        >
          <Observer>
            {() => (
              <SMTabs
                tabs={tabConfig}
                boxProps={{ px: 3.75, stretchY: "100%", display: "flex", flexDirection: "column" }}
                panelProps={{ flex: 1 }}
              >
                {map(tabConfig, (tabInfo: TabInfo) => {
                  const tabType = tabInfo.type;
                  const showTabContent = _tabsState?.isTabActive(tabInfo.tabId);

                  return (
                    <SMBox key={tabInfo.tabId} className={classes.previewTabContent}>
                      {tabType === TabTypeOptions.MIXED && <>
                        {!formPreview && <DocumentRevisionFormPresenter
                          {...formik}
                          isPreview={true}
                          redlineActive={false}
                          releasedDocRev={_documentRevisionFormState?.releasedDocRev}
                          documentRevision={documentRevision}
                          proposedDocId={docRevId}
                          documentTypesById={documentTypesById}
                          canChangeOwnerShip={false}
                          resetForm={emptyFunction}
                          {...{
                            type,
                            showAdministrativeAndVoidChange,
                            isOutput,
                            email,
                            isOwner,
                            mode,
                          }}
                        />}
                        {documentRevision && showTabContent && <FBWorkspace
                          withoutBottomBar
                          isPortal={false}
                          document={{
                            ...formik.values as unknown as DocumentRevision,
                            ...documentRevision as unknown as DocumentRevision,
                          }}
                          {... { workspaceState }}
                          initialValues={{}}
                          schema={schema}
                        />}
                      </>}
                      {tabType === TabTypeOptions.DYNAMIC && showTabContent
                        && _formState?.mode !== FBWorkspaceModeOptions.NONE && (
                        <>
                          {tabInfo.tabId === "lineitems" && (
                            <AttachmentsField
                              isDisabled={isDisabledInput}
                              isNewVersion={false}
                              docRevId={docRevId || ""}
                              isAttachmentEmpty={isAttachmentEmpty}
                              containsRedline={false}
                              docRevStatus={documentRevision?.status}
                              documentRevision={documentRevision}
                              documentTypeId={docTypeId || ""}
                              labeld={"Supporting Documents"}
                            />
                          )}
                          <FBWorkspace
                            withoutBottomBar
                            isPortal={false}
                            document={{
                              ...formik.values as unknown as DocumentRevision,
                              ...documentRevision as unknown as DocumentRevision,
                            }}
                            {... { workspaceState }}
                            initialValues={initialValues}
                            schema={schema}
                          />
                        </>
                      )}
                      {tabType === TabTypeOptions.TABS_MEQ && (
                        <FBMaterialEqInfoContainer
                          documentRevision={documentRevision}
                          inView={Boolean(_tabsState?.isTabActive(TabTypeOptions.TABS_MEQ))}
                        />
                      )}
                      {tabType === TabTypeOptions.TRAINING && _tabsState?.isTabActive(TabTypeOptions.TRAINING) && (
                        <FBTrainingInfoContainer
                          documentRevisionId={documentRevision?.id}
                          docRevStatus={documentRevision?.status}
                        />
                      )}
                    </SMBox>
                  );
                })}
              </SMTabs>
            )}
          </Observer>
        </SMTemplate>
      )}
    </Observer>
  );
};

const DocumentPreviewContainer: React.FunctionComponent<ContainerProps> = (props) => {
  const { workspaceState } = FB.useStores();

  const formik = useFormikContext<DocumentRevisionFormValues>();
  const initialValues = formik?.values ?? workspaceState?.document;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={emptyFunction}
    >
      {(formikProps) => <DocumentPreview {...props} formik={formikProps} />}
    </Formik>
  );
};

export default withSMForm(withSMTabs(DocumentPreviewContainer));
