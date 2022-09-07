import { Box, Grid, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Formik } from "formik";
import { flatten, includes, omit, set } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SM } from "../../../App";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { LINE_TYPES } from "../../../state/ducks/attachments/constants";
import { DataProps } from "../../../state/ducks/common/types";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { Document, DocumentRevision, DocumentRevisionStatus, FBOutputDocumentType } from "../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../state/ducks/documents";
import { ApplicationState } from "../../../state/reducers";
import SummaryField from "../../common/summary/base";
import SummaryInfo from "../../common/summary/SummaryInfo";
import { FormContext } from "../../components/forms/FormContext";
import Text from "../../components/Text";
import { getHighestRevision } from "../../documentRevision/forms/transform";
import { checkIsDocumentEB, checkIsDocumentPart, checkIsDocumentPO, checkIsDocumentRecord } from "../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionInStatus, isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";
import { isDocumentAlphaReleased } from "../../documentRevision/helpers/revisionStage";
import { styles as AutoCompleteStyles } from "../../form.builder/styles/FBAutocomplete.styles";
import { useTraining } from "../../hooks/docCustomization/useCustomization";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { Translation } from "../../translations/types";
import Attachment from "./attachment";
import BuildsContainer from "./builds.container";
import styles from "./styles";
import CompleteTraining from "./training/complete.training";
import TrainingControl from "./training/training.control";

interface OwnProps {
  canShowCreateVersionButton?: boolean;
  canChangeOwnerShip?: boolean;
}

type Props = OwnProps &
DataProps<DocumentRevision> &
WithStyles<typeof styles>;

const Presenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  dataProp: {
    id,
    document,
    attachments,
    status,
    name,
    retrain,
    referenceTo,
    deprecatedAt,
    trainingRecords,
    formTemplate,
    formDocument,
    parent,
    children,
    childrenParts,
    parentParts,
    displayRevision,
  },
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => {
  useScrollIntoView();
  const onSubmit = () => void 0;
  const { formInput } = dataProp || {};
  const docTypeId = dataProp?.document?.documentType?.id;
  const docDetails: Partial<DocumentRevision> = {
    docId: document.docId,
    name,
    displayRevision,
  };

  const { isVisible: isTrainingVisible } = useTraining(docTypeId);

  const isRecord = checkIsDocumentRecord(document?.documentType?.groupOptions);
  const isEB = checkIsDocumentEB(document.documentType.groupOptions);
  const isPO = checkIsDocumentPO(document.documentType.groupOptions);
  const { _tabsState } = SM.useStores();
  const isPart = checkIsDocumentPart(document?.documentType?.groupOptions);
  const [displayChildrenParts, setDisplayChildrenParts] = useState(childrenParts);
  const shouldRenderTrainingButton = isDocumentRevisionInStatus(
    [DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved],
    status);
  const isInlineApproval = isFormWithInlineApproval(formDocument?.formTemplate?.schema);
  const isFirstAlphaReleased = isDocumentAlphaReleased(dataProp?.revisionStage) && dataProp?.subRevision === 0;
  const outputDocumentTypeName = useSelector((state: ApplicationState) =>
    formTemplate ? (formTemplate.outputDocumentTypes as FBOutputDocumentType[]).map((i) =>
      documentTypeSelectors.getDocTypeName(state, i.id)).join(", ") : []);

  const renderTrainingControl = shouldRenderTrainingButton && (
    <TrainingControl
      dataProp={trainingRecords}
      documentRevisionId={id}
      docDetails={docDetails}
    />
  );

  const renderSelfTaughtTraining = shouldRenderTrainingButton && (
    <CompleteTraining
      {...{ trainingRecords, id, document, docDetails }}
    />
  );
  const containsRedline = (): boolean => {
    for (const attachment of attachments) {
      if (attachment.lineType === LINE_TYPES.RED_LINE) {
        return true;
      }
    }
    return false;
  };

  const getDocumentById = useActionCreator(documentsActions.getDocumentById);
  const docByIdAsync = useAsync({
    onSuccess: (data?: Document) => {
      const childPart = getHighestRevision(data?.documentRevisions || []);
      if (!childPart) { return; }
      set(childPart, "document", omit(data, "documentRevisions"));
      setDisplayChildrenParts([childPart]);
    },
  });

  useEffect(() => {
    const childrenPartsForRevise = formInput?.childrenPartsForRevise;
    if (!childrenParts?.length && childrenPartsForRevise?.[0]) {
      docByIdAsync.start(getDocumentById, childrenPartsForRevise[0].id, docByIdAsync);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderReleaseDetails = () => (
    <Box p={5} >
      <Typography variant="h6" style={{ paddingBottom: 8 }}>
        <Text translation="document.revision.release.details" />
      </Typography>
      <SummaryInfo
        label={"record.released.by"}
        value={dataProp.owner.user.name}
        dataCy={"releasedBy"}
      />
      <SummaryInfo
        label={"document.revision.released.date"}
        value={getFormattedDateString(dataProp.releasedAt, MomentFormats.MonthDateYear)}
        dataCy={"releasedDate"}
      />
    </Box>
  );

  const contentRenderer = () => (
    <Box minHeight={16} width="calc(100% - 8px)">
      <Grid container>
        {
          isTrainingVisible && !isRecord &&
          <SummaryField
            label="document.revision.trainingRequired"
            value={<Text translation={`common.${retrain}` as Translation} />}
            labelProps={AutoCompleteStyles.labelProps}
            labelFont={AutoCompleteStyles.labelFont}
          />
        }
        {formTemplate && (
          <SummaryField
            label="document.output.type"
            value={outputDocumentTypeName}
            labelProps={{ ...AutoCompleteStyles.labelProps }}
            labelFont={{ ...AutoCompleteStyles.labelFont, marginBottom: 14 }}
          />
        )}
        {isEB && parent && (
          <BuildsContainer dataProp={flatten([parent])} label="common.previous.build"
            labelProps={AutoCompleteStyles.labelProps}
            labelFont={AutoCompleteStyles.labelFont} docRevId={dataProp.id} />
        )}
        {isEB && children && (
          <BuildsContainer dataProp={children} label="common.next.build"
            labelProps={AutoCompleteStyles.labelProps} labelFont={AutoCompleteStyles.labelFont} />
        )}
        {isPart && parentParts && (
          <BuildsContainer dataProp={flatten([parentParts])} label="common.part.of"
            labelProps={AutoCompleteStyles.labelProps} labelFont={AutoCompleteStyles.labelFont} />
        )}
        {isEB && displayChildrenParts && (
          <BuildsContainer dataProp={flatten([displayChildrenParts])} label="form.builder.part"
            labelProps={AutoCompleteStyles.labelProps} labelFont={AutoCompleteStyles.labelFont} />
        )}
        {isPO || includes(outputDocumentTypeName, "Purchase Order")
          ? attachments && _tabsState?.tabID !== "details" && (
            <Attachment
              isAttachmentEmpty={attachments.length < 1}
              docRevId={id}
              containsRedline={containsRedline()}
              docRevStatus={status}
            />
          )
          : attachments && (
            <Attachment
              isAttachmentEmpty={attachments.length < 1}
              docRevId={id}
              containsRedline={containsRedline()}
              docRevStatus={status}
            />
          )}
        {renderTrainingControl}
        {renderSelfTaughtTraining}
      </Grid>
      {isRecord && isInlineApproval && isFirstAlphaReleased &&
        isDocumentRevisionReleased(dataProp?.status) && renderReleaseDetails()}
    </Box>
  );

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={dataProp}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {contentRenderer}
      </Formik>
    </FormContext.Provider>
  );
};

Presenter.displayName = "DocRevSummaryPresenter";

export default withStyles(styles)(Presenter);
