import { Box, Grid, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Formik } from "formik";
import { flatten, isEmpty, omit, set } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { LINE_TYPES } from "../../../state/ducks/attachments/constants";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { Document } from "../../../state/ducks/documentRevisions/types";
import { documentsActions } from "../../../state/ducks/documents";
import { ApplicationState } from "../../../state/reducers";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import SummaryInfo from "../../common/summary/SummaryInfo";
import { FormContext } from "../../components/forms/FormContext";
import Text from "../../components/Text";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import { getHighestRevision } from "../../documentRevision/forms/transform";
import { checkIsDocumentEB, checkIsDocumentPart, checkIsDocumentRecord } from "../../documentRevision/helpers/checkDocumentGroup";
import { isDocumentRevisionInStatus, isDocumentRevisionReleased } from "../../documentRevision/helpers/documentRevisionStatus";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";
import { isDocumentAlphaReleased } from "../../documentRevision/helpers/revisionStage";
import { FBSchemaProps, FBWorkspace } from "../../form.builder";
import CustomLabelTooltip from "../../hooks/docCustomization/CustomLabelTooltip";
import { useCRLink, useTitle, useTraining } from "../../hooks/docCustomization/useCustomization";
import useDescription from "../../hooks/docCustomization/useDescription";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { Translation } from "../../translations/types";
import SummaryHeader from "../header/SummaryHeader";
import Attachment from "./attachment";
import BuildsContainer from "./builds.container";
import ChangeRequestLink from "./changeRequestLink";
import ReferencedByContainer from "./referencedBy.container";
import ReferenceToContainer from "./referenceTo.container";
import styles from "./styles";
import TrainingControl from "./training.control";

interface OwnProps {
  canShowCreateVersionButton?: boolean;
  canChangeOwnerShip?: boolean;
}

export type Props = OwnProps &
DataProps<DocumentRevision> &
WithStyles<typeof styles>;

export const Presenter: React.FunctionComponent<Props> = ({
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
    description,
    trainingRecords,
    formTemplate,
    formDocument,
    parent,
    children,
    childrenParts,
    parentParts,
  },
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => {
  useScrollIntoView();
  const onSubmit = () => void 0;
  const { formInput } = dataProp || {};
  let { schema } = formTemplate || formDocument?.formTemplate || {};
  schema = dataProp.schema || schema;
  const { docId } = formDocument?.document || {};
  const FBIsOutput = Boolean(docId && !isEmpty(docId));
  const FBIsActive = formInput || formTemplate || formDocument;
  const docTypeId = dataProp?.document?.documentType?.id;
  const [isTrainingVisible] = useTraining(docTypeId);
  const [isDescriptionVisible] = useDescription(docTypeId);
  const [isTitleVisible, titleLabel, tooltipConfig] = useTitle(docTypeId);
  const [isCRLinkVisible] = useCRLink(docTypeId);
  const docTypeAcronym = dataProp?.document?.documentType?.documentTypeAcronym;
  const isRecord = checkIsDocumentRecord(document?.documentType?.groupOptions);
  const isEB = checkIsDocumentEB(document.documentType.groupOptions);
  const isPart = checkIsDocumentPart(document?.documentType?.groupOptions);
  const [displayChildrenParts, setDisplayChildrenParts] = useState(childrenParts);

  const isInlineApproval = isFormWithInlineApproval(formDocument?.formTemplate?.schema);
  const isFirstAlphaReleased = isDocumentAlphaReleased(dataProp?.revisionStage) && dataProp?.subRevision === 0;

  const outputDocumentTypeName = useSelector((state: ApplicationState) =>
    formTemplate ? (formTemplate.outputDocumentTypes as FBOutputDocumentType[]).map((i) =>
      documentTypeSelectors.getDocTypeName(state, i.id)).join(", ") : []);

  const renderTrainingControl =
  isDocumentRevisionInStatus([DocumentRevisionStatus.Released, DocumentRevisionStatus.Approved], status) && (
    <TrainingControl
      dataProp={trainingRecords}
      classes={classes}
      documentRevisionId={id}
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
      />
      <SummaryInfo
        label={"document.revision.released.date"}
        value={getFormattedDateString(dataProp.releasedAt, MomentFormats.MonthDateYear)}
      />
    </Box>
  );

  const contentRenderer = () => (
    <Box className={classes.boxContainer}>
      <SummaryHeader
        documentRevision={dataProp}
        canChangeOwnerShip={canChangeOwnerShip}
        canShowCreateVersionButton={canShowCreateVersionButton}
      />
      <Grid
        container={true}
        className={classes.previewBox}
        spacing={4}
        direction="column"
      >
        {
          isCRLinkVisible &&
          <ChangeRequestLink dataProp={dataProp} />
        }
        {
          isTitleVisible &&
          <CustomLabelTooltip {...{ tooltipConfig }}>
            <SummaryField label={titleLabel} value={name} />
          </CustomLabelTooltip>
        }
        {
          isTrainingVisible && !isRecord &&
          <SummaryField
            label="document.revision.trainingRequired"
            value={<Text translation={`common.${retrain}` as Translation} />}
          />
        }
        {
          isDescriptionVisible &&
          <SummaryFieldWithHtml label={`common.description.${docTypeAcronym}`} value={description} />
        }
        {formTemplate && (
          <SummaryField
            label="document.output.type"
            value={outputDocumentTypeName}
          />
        )}
        {referenceTo && (
          <ReferenceToContainer
            dataProp={referenceTo}
            status={status}
            deprecatedAt={deprecatedAt}
          />
        )}
        {document.referencedBy && (
          <ReferencedByContainer dataProp={document.referencedBy} />
        )}
        {isEB && parent && (
          <BuildsContainer dataProp={flatten([parent])} label="common.previous.build" docRevId={dataProp.id} />
        )}
        {isEB && children && (
          <BuildsContainer dataProp={children} label="common.next.build" />
        )}
        {isPart && parentParts && (
          <BuildsContainer dataProp={flatten([parentParts])} label="common.part.of" />
        )}
        {isEB && displayChildrenParts && (
          <BuildsContainer dataProp={flatten([displayChildrenParts])} label="form.builder.part" />
        )}
        {attachments && <Attachment
          isAttachmentEmpty={attachments.length < 1}
          docRevId = {id}
          containsRedline = {containsRedline()}
          docRevStatus={status}/>}{/* Need to put actual check here*/}
        {renderTrainingControl}
      </Grid>

      {FBIsActive && (
        <Box px={5} mt={4} id="Presenter-FBWorkspace">
          <FBWorkspace
            document={dataProp}
            initialValues={dataProp.formInput}
            schema={schema as FBSchemaProps[]}
            mode={dataProp.document.documentType.group === "FORM" ?
              "formPreview" : "preview"}
          />
        </Box>
      )}
      {isRecord && isInlineApproval && isFirstAlphaReleased &&
        isDocumentRevisionReleased(dataProp?.status) && renderReleaseDetails()}
      {FBIsOutput && (
        <DocumentRevisionOutputInfo formDocument={dataProp?.formDocument} />
      )}
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
