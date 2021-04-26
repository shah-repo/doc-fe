import { Box, List, Typography } from "@material-ui/core";
import { has, isEmpty, last, orderBy } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import striptags from "striptags";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { Audit, AuditGroupType } from "../../../state/ducks/audit/types";
import { ApprovalStatus } from "../../../state/ducks/common/types";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import AuditFactory from "../../components/AuditFactory";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { FBApprovalAuditState, FBSchemaProps, FBText } from "../../form.builder";
import { isTranslation } from "../../translations/types";
import { styles } from "./Audit.presenter.styles";

interface OwnProps {
  audit: AuditGroupType;
  statusLabel: string;
  versionNumber: string;
  isStatusVisible: boolean;
  schema: FBSchemaProps[];
}

type AuditPresenterProps = OwnProps;

const AuditPresenter: React.FunctionComponent<AuditPresenterProps> = ({
  audit,
  statusLabel,
  versionNumber,
  isStatusVisible,
  schema,
}) => {
  const classes = styles();
  const intl = useIntl();
  const documentRevisions = useSelector(documentRevisionsSelectors.getDocumentRevisionsList);

  const renderAuditGroup = () =>
    Object.keys(audit).map((groupId, key) => {
      const change = audit[groupId][0];
      const { owner, ownerUser, ownerThirdParty } = change;
      const name = ((owner && owner.user) || ownerUser || ownerThirdParty)?.name;

      if (audit[groupId].filter((change) =>
        change.field !== "approvals.status" || change.nextValue !== ApprovalStatus.Abandoned
      ).length === 0) {
        return null;
      }

      return (
        <Box key={groupId} className={classes.changeContainer}>
          <div className={classes.dateContainer}>
            <div className={classes.owner} data-cy={`owner-${key}`}>{name}</div>
            <DateTime value={change.timestamp} format={MomentFormats.DateTime} data-cy={`time-${key}`}/>
          </div>
          {renderChanges(audit[groupId], key)}
        </Box>
      );
    });

  const renderChanges = (audits: Audit[], groupKey?: number) => {
    const newReferences: Audit[] = [];
    const deletedReferences: Audit[] = [];
    const attachments: Audit[] = [];
    const singleFields: JSX.Element[] = [];
    let key = 0;

    orderBy(audits, ["field"]).forEach((change: Audit, index) => {
      change.groupKey = groupKey;
      const isFBField = has(change, "fbSchemaItem");
      const {
        label,
        placeholder = "",
        type: fbType,
        stepIndex:
        number = 1,
        name,
      } = change.fbSchemaItem || {};
      let fbLabel = label || placeholder;
      const isOmittedFB = (
        isFBField &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        !FBApprovalAuditState.docAudit.includes(change.fbSchemaItem?.type!)
      );
      if (isOmittedFB) { return; }

      if (isFBField) {
        const { nextValue, previousValue } = change;
        let auditValue: any = nextValue;
        if (nextValue === "undefined"  || nextValue === "[]" || nextValue === "{}") {
          auditValue = previousValue;
        }
        if (auditValue === "undefined"  || auditValue === "[]" || auditValue === "{}") {
          return;
        }
      }
      // PROCEDURE
      if (fbType === "procedure") {
        let valueKey = last(change.field.split("."));
        let valueKeyType = "";
        if (valueKey === "id" && !change.field.includes("attachments")) { return; }
        if (valueKey === "title") {
          valueKey = change.field.split(".")[2].split("[")[0];
        }
        if (valueKey !== "materials" && change.field.includes("materials")) {
          valueKeyType = "materials";
        } else if (valueKey !== "equipment" && change.field.includes("equipment")) {
          valueKeyType = "equipment";
        }
        if (change.field.includes("attachments")) {
          valueKey = "attachments";
        }
        const stepLabel = intl.formatMessage({ id: "form.builder.step.number" }, { number });
        let keyLabel = "";
        if (isTranslation(`form.builder.${valueKeyType}`)) {
          keyLabel = intl.formatMessage({ id: `form.builder.${valueKeyType}` }) + ": ";
        }
        if (isTranslation(`form.builder.${valueKey}`)) {
          keyLabel += intl.formatMessage({ id: `form.builder.${valueKey}` });
        }
        fbLabel = `${stepLabel} ${keyLabel}`;
      }
      // LHRSTEP
      if (fbType === "lhrstep") {
        const LHRschemaGroupedInSections: any[] = [];
        schema.forEach((element) => {
          if (element.type === "stepsection") {
            LHRschemaGroupedInSections.push([]);
          }
          if (element.type === "lhrstep" || element.type === "stepsection") {
            LHRschemaGroupedInSections[LHRschemaGroupedInSections.length - 1]?.push(element);
          }
        });
        const valueKey = change.field.split(".")[1].split("-");
        const stepLHRNumber = LHRschemaGroupedInSections.filter((e) =>
          e.find((i) => i.name === name)).flat().find((e) => e.type === "stepsection");
        let label = "";
        const stepLabel = intl.formatMessage({ id: "form.builder.step.number" }, { number: stepLHRNumber.stepIndex });
        if (!valueKey.includes("quantity")) {
          return;
        }
        if (valueKey.includes("quantity")) {
          label = intl.formatMessage({ id: `form.builder.${valueKey[2]}.quantity` });
        }
        fbLabel = `${label} for ${stepLabel}`;
      }
      // MPIPROCEDURE
      if (fbType === "mpiprocedure") {
        if (!change.field.split(".").includes("editorConfig")) {
          return;
        }
        const valueKey = change.field.split(".");
        const stepLabel = intl.formatMessage({ id: "form.builder.step.number" }, { number });
        const regex = /materials/g;
        const isMaterial = !isEmpty(change.field.match(regex));
        const isAttachment = !isEmpty(change.field.match(/attachments/g));
        const fieldType = isMaterial ? intl.formatMessage({ id: "form.builder.materials|s" }) :
          intl.formatMessage({ id: "form.builder.equipment|s" });
        // changes on description step field
        if (last(valueKey) === "description") {
          fbLabel = `${intl.formatMessage({ id: "form.builder.step.description" })} for ${stepLabel}`;
          const value = change.nextValue as string;
          const formattedValue = striptags(value);
          change = {
            ...change,
            nextValue: formattedValue,
          };
        }
        // skip audit values
        if (
          (last(valueKey) === "id" ||
          last(valueKey) === "unit" ||
          last(valueKey) === "quantity" ||
          last(valueKey) === "attachments") && (
            (change.type === "STRING_NEW" && !isAttachment) ||
            change.type === "NUMBER_NEW" ||
            change.type === "NUMBER_DELETED")) {
          return;
        }
        // adding more equipment or material to the list
        if (last(valueKey) === "title" && !isAttachment && change.type === "STRING_NEW") {
          const value = documentRevisions.find((e) => e.id === change.nextValue);
          fbLabel = intl.formatMessage({ id: "form.builder.audit.field.step" },
            {
              fieldType,
              stepLabel,
            });
          change = {
            ...change,
            nextValue: `${value?.document.docId} - ${value?.name} - rev
                      ${value?.displayRevision}`,
          };
        }
        // editing material or equipment
        // for now we are going to turn off the changes for quantity and units on material
        if (change.type === "STRING_EDITED" || change.type === "NUMBER_EDITED") {
          let nextMaterial;
          let previousMaterial;

          if (last(valueKey) === "title") {
            nextMaterial = documentRevisions.find((e) => e.id === change.nextValue);
            previousMaterial = documentRevisions.find((e) => e.id === change.previousValue);
            change = {
              ...change,
              nextValue: `${nextMaterial?.document.docId} - ${nextMaterial?.name} - rev ${nextMaterial?.displayRevision}`,
            };
            fbLabel = intl.formatMessage({ id: "form.builder.audit.value" },
              {
                field: fieldType,
                docId: previousMaterial?.document.docId,
                name: previousMaterial?.name,
                displayRevision: previousMaterial?.displayRevision,
                stepLabel,
              });
          }
          if (last(valueKey) === "unit" || last(valueKey) === "quantity") {
            return;
          }
        }
        // delete equipment or material or add/delete attachments
        if (change.type === "STRING_DELETED" || (change.type === "STRING_NEW" && isAttachment)) {
          if (last(valueKey) !== "title" && !isAttachment) {
            return;
          }
          fbLabel = intl.formatMessage({ id: "form.builder.audit.field.step" },
            {
              fieldType: isAttachment ? intl.formatMessage({ id: "common.attachment" }) : fieldType,
              stepLabel,
            });
        }
      }

      if (!isFBField && change.field.includes("attachments")) {
        if (change.field.endsWith("s3link") && change.type === "STRING_EDITED") {
          singleFields.push(
            <Box mb={1} key={`${change.groupId}-${index}`}>
              <Box>
                <Text
                  dataCy={`change-key-${groupKey}-${key}`}
                  message="documentRevision.audit.s3link.change"
                />
              </Box>
              <div className={classes.auditValue}>
                <AuditFactory audit={change} dataCy={`change-value-${groupKey}-${key}`} />
              </div>
            </Box>
          );
          return;
        }
        attachments.push(change);
      } else if (change.field.includes("referenceTo") && change.type === "ARRAY_NEW") {
        newReferences.push(change);
      } else if (change.field.includes("referenceTo") && change.type === "ARRAY_DELETED") {
        deletedReferences.push(change);
      } else if (change.field === "approvals.status" && change.nextValue === ApprovalStatus.Abandoned) {
        return;
      } else {
        // HACK for ENC-7509
        const regex = new RegExp(`^formInput\\.(?:${change.fbSchemaItem?.name})\\[[a-zA-Z0-z\-]+\\]\\.id$`);
        if (change.fbSchemaItem?.type === "fileupload" && !regex.test(change.field)) { return; }
        if (change.field === "redline") {
          change = {
            ...change,
            nextValue: `${getFormattedDateString(change.timestamp, MomentFormats.DateTime)} - ${change.owner.user.name}`,
          };
        }
        singleFields.push((
          <Box mb={1} key={`${change.groupId}-${index}`}>
            <Box>
              {!isFBField && (
                <Text
                  dataCy={`change-key-${groupKey}-${key}`}
                  message={`documentRevision.audit.${change.field}.${change.type}`}
                />
              )}
              {isFBField && (
                <FBText
                  locale={`form.builder.audit.${change.type}`}
                  values={{ label: fbLabel }}
                />
              )}
            </Box>
            <div className={classes.auditValue}>
              <AuditFactory audit={change} dataCy={`change-value-${groupKey}-${key}`} />
            </div>
          </Box>
        ));
        key++;
      }
    });

    // This key is added to keep sequential data-cy identifier in the history
    attachments.forEach((change) => {
      change.index = key++;
    });
    newReferences.forEach((change) => {
      change.index = key++;
    });
    deletedReferences.forEach((change) => {
      change.index = key++;
    });

    return (
      <Box>
        {singleFields}
        {attachments.length > 0 && renderGroupChanges(attachments)}
        {newReferences.length > 0 && renderGroupChanges(newReferences)}
        {deletedReferences.length > 0 && renderGroupChanges(deletedReferences)}
      </Box>
    );
  };

  const renderGroupChanges = (auditGroup: Audit[]) => {
    const field = auditGroup[0].field;
    const type = auditGroup[0].type;
    const parentGroupKey = auditGroup[0].groupKey;
    const parentIndex = auditGroup[0].index;

    return (
      <Box mb={1} key={`${auditGroup[0].groupId}`}>
        <Box>
          <Text dataCy={`change-key-${parentGroupKey}-${parentIndex}`}
            message={`documentRevision.audit.${field}.${type}`} />
        </Box>
        {auditGroup.map((change, index) => (
          <div
            key={change.groupId + `-${index}`}
            className={classes.auditValue}
          >
            <AuditFactory audit={change} dataCy={`change-value-${change.groupKey}-${change.index}`} />
          </div>
        ))}
      </Box>
    );
  };

  return (
    <div className={classes.container}>
      {audit && <Box className={classes.revisionContainer}>
        <Typography variant="subtitle1" className={classes.title}>
          <Text message={"common.revision"} />
          &nbsp;
          {versionNumber}
          {
            isStatusVisible &&
            <>
              &nbsp; - <Text message={statusLabel} />
            </>
          }
        </Typography>
      </Box>}
      <List className={classes.list}>{audit && renderAuditGroup()}</List>
    </div>
  );
};

export default AuditPresenter;
