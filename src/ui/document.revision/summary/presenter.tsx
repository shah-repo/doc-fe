import { Box, Grid, Typography, WithStyles, withStyles } from "@material-ui/core";
import { Formik } from "formik";
import { flatten, isEmpty } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { LINE_TYPES } from "../../../state/ducks/attachments/constants";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision, DocumentRevisionStatus, FBOutputDocumentType } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../../state/reducers";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import SummaryInfo from "../../common/summary/SummaryInfo";
import { FormContext } from "../../components/forms/FormContext";
import Text from "../../components/Text";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import { checkIsDocumentEB, checkIsDocumentPart, checkIsDocumentRecord } from "../../documentRevision/helpers/checkDocumentGroup";
import { FBSchemaProps, FBWorkspace } from "../../form.builder";
import { useCRLink, useTitle, useTraining } from "../../hooks/docCustomization/useCustomization";
import useDescription from "../../hooks/docCustomization/useDescription";
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
  const [isTitleVisible, titleLabel] = useTitle(docTypeId);
  const [isCRLinkVisible] = useCRLink(docTypeId);
  const docTypeAcronym = dataProp?.document?.documentType?.documentTypeAcronym;
  const isRecord = checkIsDocumentRecord(document?.documentType?.groupOptions);
  const isEB = checkIsDocumentEB(document.documentType.group);
  const isPart = checkIsDocumentPart(document?.documentType?.groupOptions);
  const inlineApprovalFields = formDocument?.formTemplate?.schema
  .filter((field) => (field.type === "inlineapproval" as string));

  const isInlineApproval = Boolean(inlineApprovalFields && inlineApprovalFields.length > 0);

  const outputDocumentTypeName = useSelector((state: ApplicationState) =>
    formTemplate ? (formTemplate.outputDocumentTypes as FBOutputDocumentType[]).map((i) =>
      documentTypeSelectors.getDocTypeName(state, i.id)).join(", ") : []);

  const renderTrainingControl = (status === DocumentRevisionStatus.Released ||
    status === DocumentRevisionStatus.Approved) && (
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

  const renderReleaseDetails = () => (
    <Box p={5} >
      <Typography variant="h6" style={{ paddingBottom: 8 }}>
        <Text message="Release Details" />
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
          <SummaryField label={titleLabel} value={name} />
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
          <BuildsContainer dataProp={flatten([parent])} label="common.previous.build" />
        )}
        {isEB && children && (
          <BuildsContainer dataProp={children} label="common.next.build" />
        )}
        {isPart && parentParts && (
          <BuildsContainer dataProp={flatten([parentParts])} label="common.part.of" />
        )}
        {isEB && childrenParts && (
          <BuildsContainer dataProp={flatten([childrenParts])} label="form.builder.part" />
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
      {isRecord && isInlineApproval && renderReleaseDetails()}
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
