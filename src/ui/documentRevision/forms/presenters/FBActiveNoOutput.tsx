import { Box, Button, Grid, createStyles, makeStyles, Theme } from "@material-ui/core";
import { FormikProps, useFormikContext } from "formik";
import { filter, get, includes, map, size } from "lodash";
import * as React from "react";
import cx from "classnames";
import { useSelector } from "react-redux";
import { ValueType } from "react-select";
import {
  DocumentRevisionSummaryHeader,
  DocumentRevisionFormProgressBar,
  SM,
  SMBox,
  SMTabs,
  SMTemplate,
} from "../../../../App";
import { Permission } from "../../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import {
  DocumentRevision,
  DocumentRevisionStatus, SmartReferenceType,
} from "../../../../state/ducks/documentRevisions/types";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import { required, validator } from "../../../components/forms/fields/validators";
import useGetHasPermission from "../../../hooks/useGetHasPermission";
import {
  checkIsDocumentLHR, checkIsDocumentMPIOutput,
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
  FBWorkspace,
  FBWorkspaceModeOptions,
  FBSchemaProps,
  FBEditorState,
} from "../../../form.builder";
import Text from "../../../components/Text";
import { ReactComponent as PreviewIcon } from "../../../../assets/images/preview.svg";
import Colors from "../../../layout/theme/utils/colors";
import { DocumentRevisionFormValues } from "../types";
import { Observer } from "mobx-react";
import {
  DOC_TYPE_GROUP,
  DocumentGroupType,
  TabInfo,
  TabTypeOptions,
} from "../../../../state/ducks/documentRevisions/documentType/types";
import DocumentRevisionFormPresenter from "../DocumentRevisionForm.presenter";
import AttachmentsField from "../../../document.revision/form/attachments";
import FBMaterialEqInfoContainer from "../../../form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container";
import FBTrainingInfoContainer
  from "../../../../App/Enlil/Features/DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container";
import { DocTypeGroups } from "../../../dashboard.new/line.items/common/types";
import { ApplicationState } from "../../../../state/reducers";
import { isOperator } from "../../DocumentRevisionDisplay.container";
import { useEffect } from "react";
import { authSelectors } from "../../../../state/ducks/auth";
import { DocumentCloneTypeOptions } from "../../Clone.container";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../constants/urls";

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
    previewButtonDisabled: {
      color: `${Colors.white} !important`,
      backgroundColor: `${Colors.dawn} !important`,
    },
    previewDialog: {
      backgroundColor: Colors.alabaster,
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
  const { _documentRevisionFormState, _tabsState, _formState } = SM.useStores();
  const { workspaceState, dialogState: existsDialogState } = FB.useStores();
  let schema = _documentRevisionFormState?.schema;
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
      schema,
      _tabsState?.tabID,
    );

    _documentRevisionFormState?.setFBSchema(scheme);
    workspaceState?.setSchema(scheme);
  };

  // @todo: Mix between DocumentRevisionSummary and DocumentRevisionForm.
  // @todo: Move these elements to one component to reuse.
  // Create documentRevision and fill it
  const documentRevision = get(formik, "values") as DocumentRevision;
  const formValues = formik as FormikProps<DocumentRevisionFormValues>;
  const initialValues = documentRevision as unknown as DocumentRevisionFormValues;

  const docTypeId = documentRevision?.document?.documentType?.id as string;
  const documentType = documentTypesById[docTypeId];
  const docTypeGroup = get(documentType, "group", DOC_TYPE_GROUP.OTHER);

  const outputTypeId = documentRevision?.outputDocumentTypes?.value as string;
  const outputType = documentTypesById[outputTypeId];
  const outputTypeGroup = get(outputType, "group");

  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  const email = useSelector(authSelectors.currentUserEmail);
  const isOwner = documentRevision?.owner ? documentRevision?.owner.user.email === email : true;
  const isLHR = checkIsDocumentLHR(documentType.groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(documentType.groupOptions);
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const isCurrentUserOperator = React.useContext(isOperator);
  const isDisabledInput = formValues.values.id !== undefined && isCurrentUserOperator && !isOwner;
  const isOutput = true;
  const showAdministrativeAndVoidChange = false;
  const type = DocumentCloneTypeOptions.none;
  const mode = FBWorkspaceModeOptions.FORMPREVIEW;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const resetForm = () => {};

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
      tabId: TabTypeOptions.TABS_MEQ,
      type: TabTypeOptions.TABS_MEQ,
    }];
  }

  if (formValues.values?.retrain) {
    tabConfig = tabConfig && [...tabConfig, {
      labelId: "tabId.training",
      tabId: TabTypeOptions.TRAINING,
      type: TabTypeOptions.TRAINING,
    } ];
  }

  const tabLabels: string[] = tabConfig?.map((tabInfo) => tabInfo.labelId);
  const trainingTabIndex = tabLabels?.findIndex((tab) => tab === "tabId.training");

  useEffect(() => {
    if (!tabConfig) {
      return;
    }
    _tabsState?.setTabID(tabConfig[_tabsState.value].tabId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabConfig]);

  const onTabChange = (_ev, newValue, tabConfig) => {
    if (!tabConfig) {
      return;
    }

    _tabsState?.setValue(newValue);
    _tabsState?.setTabID(tabConfig[newValue].tabId);
  };

  const dialogState = FB.useRef<FBDialogState>(FBDialogState);
  const handlePreview: React.MouseEventHandler = () => {
    dialogState?.config({
      open: true,
      maxWidth: "md",
      title: "form.builder.form.preview",
      classes: {
        paper: classes.previewDialog,
      },
      onClose: () => {
        dialogState.closeDialog();
        onTabChange(undefined, 0, tabConfig);
      },
      content: (
        <Box>
          <Observer>
            {() => (
              <SMTemplate
                templateBoxProps={{ stretchY: "100%" }}
                contentBoxProps={{ minHeight: (((!isLHR && !isTypeMpiDoc) || isLHR) ? "20%" : "0px"), height: "auto" }}
                header={(!isLHR && !isTypeMpiDoc) && <DocumentRevisionSummaryHeader {...{ documentRevision }} />}
                lhrSteps={isLHR && <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />}
              >
                <Observer>
                  {() => (
                    <SMTabs
                      onChange={(ev, newValue) => onTabChange(ev, newValue, tabConfig)}
                      tabs={tabLabels}
                      boxProps={{ px: 3.75, stretchY: "100%", display: "flex", flexDirection: "column" }}
                      panelProps={{ flex: 1 }}
                    >
                      {map(tabConfig, (tabInfo: TabInfo) => {
                        const tabType = tabInfo.type;
                        const showTabContent = _tabsState?.tabID === tabInfo.tabId;
                        return (
                          <SMBox key={tabInfo.tabId}>
                            {tabType === TabTypeOptions.MIXED && <>
                              <DocumentRevisionFormPresenter
                                {...formValues}
                                redlineActive={false}
                                releasedDocRev={_documentRevisionFormState?.releasedDocRev}
                                documentRevision={documentRevision}
                                proposedDocId={docRevId}
                                documentTypesById={documentTypesById}
                                canChangeOwnerShip={false}
                                resetForm={resetForm}
                                {...{
                                  type,
                                  showAdministrativeAndVoidChange,
                                  isOutput,
                                  isDisabled: true,
                                  email,
                                  isOwner,
                                  mode,
                                }}
                              />
                              {documentRevision && showTabContent &&  <FBWorkspace
                                withoutBottomBar
                                isPortal={false}
                                document={{
                                  ...formValues.values as unknown as DocumentRevision,
                                  ...documentRevision as unknown as DocumentRevision,
                                }}
                                {... { workspaceState }}
                                initialValues={initialValues}
                                schema={schema}
                              />}
                            </>}
                            {tabType === TabTypeOptions.DYNAMIC && showTabContent
                              && _formState?.mode !== FBWorkspaceModeOptions.NONE &&  (
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
                                    ...formValues.values as unknown as DocumentRevision,
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
                                documentRevisionId={documentRevision?.id}
                              />
                            )}
                            {tabType === TabTypeOptions.TRAINING &&
                            _tabsState?.value === trainingTabIndex && (
                              <FBTrainingInfoContainer
                                documentRevisionId={documentRevision?.id}
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
        </Box>
      ),
    });
  };

  const showPreview = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL) && !existsDialogState?.open;
  const disablePreview = !schema?.length;

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
        {canUpdateHTML && docRevId && <RenderHtmlField isDisabled={isDisabled}/>}
      </Box>
    </FBProvider>
  );
};

export default FBActiveNoOutput;
