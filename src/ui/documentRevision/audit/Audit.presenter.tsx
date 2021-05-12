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

      if (renderChanges(audit[groupId], key).props.children[0].length === 0) {
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
      const isSmartRef = change.field.split(".").includes("smartRefs");
      const {
        label,
        placeholder = "",
        type: fbType,
        stepIndex:
        number = 1,
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
        const valueKey = change.field.split(".")[1].split("-");
        let label = "";
        const stepLabel = intl.formatMessage({ id: "form.builder.step.number" }, { number });
        if (!valueKey.includes("quantity")) {
          return;
        }
        if (valueKey.includes("quantity")) {
          label = intl.formatMessage({ id: `form.builder.${valueKey[2]}.quantity` });
        }
        fbLabel = `${label} for ${stepLabel}`;
      }
      // MPIPROCEDURE
      const valueKey = change.field.split(".");
      if (fbType === "mpiprocedure") {
        if (!change.field.split(".").includes("editorConfig")) {
          return;
        }
        const stepLabel = intl.formatMessage({ id: "form.builder.step.number" }, { number });
        const regex = /materials/g;
        const isMaterial = !isEmpty(change.field.match(regex));
        const isAttachment = !isEmpty(change.field.match(/attachments/g));
        const fieldType = isMaterial ? intl.formatMessage({ id: "form.builder.materials|s" }) :
          intl.formatMessage({ id: "form.builder.equipment|s" });
        // skip audit values
        if (
          (last(valueKey) === "id" ||
          last(valueKey) === "attachments" || last(valueKey) === "quantity") && (
            (change.type === "STRING_NEW" && !isAttachment) ||
            change.type === "NUMBER_DELETED")) {
          return;
        }
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
        // adding more equipment or material to the list
        if (change.type === "STRING_NEW" || change.type === "NUMBER_NEW") {
          if (last(valueKey) === "title") {
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
          if (last(valueKey) === "unit" || last(valueKey) === "quantity") {
            const { document, name, displayRevision } = change.relatedEntity || {};
            const material = `${document?.docId} - ${name} - rev ${displayRevision}`;
            fbLabel = intl.formatMessage({ id: "form.builder.audit.field.step" },
              {
                fieldType: intl.formatMessage({ id: `form.builder.${last(valueKey)}` }),
                stepLabel: material,
              });
          }
        }
        // editing material or equipment
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
            const { document, name, displayRevision } = change.relatedEntity || {};
            const material = `${document?.docId} - ${name} - rev ${displayRevision}`;
            fbLabel = intl.formatMessage({ id: "form.builder.audit.relations" },
              {
                fieldType: intl.formatMessage({ id: `form.builder.${last(valueKey)}` }),
                previousValue: change.previousValue as string,
                relation: material,
              });
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
      } else if (change.field === "schema" && change.type === "ARRAY_NEW") {
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
        if (change.field.split(".").includes("smartRefs")) {
          if (change.type === "STRING_NEW" || change.type === "NUMBER_NEW") {
            return;
          }
          if (change.type === "BOOLEAN_NEW" || change.type === "BOOLEAN_EDITED") {
            const stepIndex = schema?.find((e) => e.name === change.reference?.metadata.fieldId)?.stepIndex;
            const { quantity, unit, lotPart, lotDocId, materialId } = change.reference?.metadata || {};
            const value = documentRevisions.find((e) => {
              if (change.reference?.metadata.materialId) {
                return e.id === change.reference?.metadata?.materialId;
              }
              return e.id === change.reference?.metadata?.equipmentId;
            }
            );
            const nextValue = materialId ? `${lotDocId} | ${lotPart} | ${quantity} ${unit}` :
              `${change.reference?.toDocRev?.document.docId}`;
            change = {
              ...change,
              field: "smartRefs",
              type: `${change.reference?.type}.${change.type}` as unknown as Audit["type"],
              nextValue,
            };
            fbLabel = intl.formatMessage({ id: "form.builder.audit.replacement" },
              {
                type: (change.type === "LOT_USAGE.BOOLEAN_NEW" as unknown as Audit["type"] ||
                change.type === "LOT_USAGE.BOOLEAN_EDITED" as unknown as Audit["type"])  ?
                  intl.formatMessage({ id: "form.builder.materials|s" }) :
                  intl.formatMessage({ id: "form.builder.equipment|s" }),
                value: value?.document.docId,
                step: stepIndex,
              });
          }
        }
        singleFields.push((
          <Box mb={1} key={`${change.groupId}-${index}`}>
            <Box>
              {!isFBField && !isSmartRef && (
                <Text
                  dataCy={`change-key-${groupKey}-${key}`}
                  message={`documentRevision.audit.${change.field}.${change.type}`}
                />
              )}
              {(isFBField || isSmartRef) && (
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
