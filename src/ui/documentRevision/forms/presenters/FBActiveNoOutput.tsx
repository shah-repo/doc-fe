import { Box, Button, Grid, createStyles, makeStyles, Theme } from "@material-ui/core";
import { useFormikContext } from "formik";
import { filter, get, includes, map, size } from "lodash";
import * as React from "react";
import { useSelector } from "react-redux";
import { ValueType } from "react-select";
import { SM, SMBox, SMTabs } from "../../../../App";
import { Permission } from "../../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import {
  DocumentRevision,
  DocumentRevisionStatus,
  SmartReferenceType,
} from "../../../../state/ducks/documentRevisions/types";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../components/forms/fields/Autocomplete/types";
import { required, validator } from "../../../components/forms/fields/validators";
import useGetHasPermission from "../../../hooks/useGetHasPermission";
import {
  checkIsDocumentLHR,
  // checkIsDocumentMPIOutput,
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
  FBWorkspace, FBSchemaProps, FBEditorState,
} from "../../../form.builder";
import Text from "../../../components/Text";
import { ReactComponent as PreviewIcon } from "../../../../assets/images/preview.svg";
import Colors from "../../../layout/theme/utils/colors";
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
import { Observer } from "mobx-react";
import { DocTypeGroups } from "../../../dashboard.new/line.items/common/types";
import { ApplicationState } from "../../../../state/reducers";
import { isOperator } from "../../DocumentRevisionDisplay.container";
import { useEffect } from "react";

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
  const documentRevision = _documentRevisionFormState?.documentRevision;
  let schema = revisionFormSchema;

  const docTypeGroup = get(documentRevision?.document?.documentType, "group", "OTHER");
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], "group");
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isLHR = checkIsDocumentLHR(groupOptions);
  // const isTypeMpiDoc = checkIsDocumentMPIOutput(groupOptions);
  const smartReferencesFrom = documentRevision?.smartReferencesFrom?.filter((ref) =>
    ref.active && ref.type === SmartReferenceType.HiddenPiInstance &&
    schema?.map((el) => el.name).filter((el) => el?.includes(ref.metadata.fieldId)));
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  let tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));
  const documentTypeId = formValues.values.document?.documentType?.id || "";
  // const docRevId = documentRevision?.id;
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const isCurrentUserOperator = React.useContext(isOperator);
  const isDisabledInput = formValues.values.id !== undefined && isCurrentUserOperator && !isOwner;

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

    smartReferencesFrom?.forEach((ele, i) => {
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
      tabId: "training",
      type: "TRAINING",
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

  // Temp
  const isOwner = true;
  const onTabChange = (_ev, newValue, tabConfig) => {
    _tabsState?.setValue(newValue);
    _tabsState?.setTabID(tabConfig[newValue].tabId);
  };

  const dialogState = FB.useRef<FBDialogState>(FBDialogState);
  const handlePreview: React.MouseEventHandler = () => {
    dialogState?.config({
      open: true,
      maxWidth: "md",
      title: "form.builder.form.preview",
      content: (
        <Box mx={8}>
          <Observer>
            {() => (
              <SMTabs
                onChange={(ev, newValue) => onTabChange?.(ev, newValue, tabConfig)}
                tabs={tabLabels}
                boxProps={{ px: 3.75, stretchY: "100%", display: "flex", flexDirection: "column" }}
                panelProps={{ flex: 1 }}
              >
                {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                  const tabType = tabInfo.type;
                  const showTabContent = _tabsState?.tabID === tabInfo.tabId;
                  return (
                    <SMBox
                      key={index}
                    >
                      {tabType === "MIXED" && <>
                        <DocumentRevisionFormPresenter
                          {...formValues}
                          releasedDocRev={_documentRevisionFormState?.releasedDocRev}
                          {...{
                            documentRevisions,
                            documentRevision,
                            showRevisionTypeChange,
                            proposedDocId,
                            setDocId,
                            doNotPrompt,
                            onDirtyFlagChange,
                            documentTypesById,
                            canChangeOwnerShip,
                            type,
                            isNewVersion,
                            bannerPortal,
                            showAdministrativeAndVoidChange,
                            pmFormId,
                            redlineActive,
                            isOutput,
                            lastSavedTimestamp,
                            isDisabled,
                            email,
                            isOwner,
                            mode,
                          }}
                        />
                        {documentRevision && showTabContent &&  <FBWorkspace
                          isPortal={false}
                          document={{
                            ...formValues.values as unknown as DocumentRevision,
                            ...documentRevision as unknown as DocumentRevision,
                          }}
                          {... { autosaveEnabled, workspaceState }}
                          initialValues={formInput}
                          schema={schema}
                        />}
                      </>}
                      {tabType === "DYNAMIC" && showTabContent && _formState?.mode !== "none" &&  (
                        <>
                          {tabInfo.tabId === "lineitems" && (
                            <AttachmentsField
                              isDisabled={isDisabledInput}
                              isNewVersion={false}
                              docRevId={docRevId}
                              isAttachmentEmpty={isAttachmentEmpty}
                              containsRedline={false}
                              docRevStatus={documentRevision?.status}
                              documentRevision={documentRevision}
                              documentTypeId={documentTypeId || ""}
                              labeld={"Supporting Documents"}
                            />
                          )}
                          <FBWorkspace
                            isPortal={false}
                            document={{
                              ...formValues.values as unknown as DocumentRevision,
                              ...documentRevision as unknown as DocumentRevision,
                            }}
                            {... { autosaveEnabled, workspaceState }}
                            initialValues={formInput}
                            schema={schema}
                          />
                        </>
                      )}
                      {tabType === TabTypeOptions.TABS_MEQ && (
                        <FBMaterialEqInfoContainer
                          documentRevisionId={documentRevision?.id}
                        />
                      )}
                      {tabType === "TRAINING" &&
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
