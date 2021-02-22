import { Box, CircularProgress } from "@material-ui/core";
import { last } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { Audit } from "../../state/ducks/audit";
import { getAuditDefaultValue } from "../common/utils/audit";
import { FB, FBProcedureItemType, FBProcedureState } from "../form.builder";
import AuditAttachment from "./AuditAttachment";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
  auditValue?: string;
}

type Props = OwnProps;

const AuditProcedure: React.FunctionComponent<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => useObserver(() => {
  const procedureState = FB.useRef(FBProcedureState);
  let valueKey = last(audit.field.split(".")) ?? "";
  if (valueKey === "title") {
    valueKey = audit.field.split(".")[2].split("[")[0] ?? "";
  }
  if (audit.field.includes("attachments")) {
    valueKey = "attachments";
  }

  const el = {
    description() {
      return (
        <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: auditValue as string }}/>
      );
    },
    materials() {
      auditValue = procedureState.getItem(auditValue ?? "", FBProcedureItemType.materials);
      if (FB.isUUID(auditValue ?? "")) {
        return <CircularProgress size={12} />;
      }
      return (<div data-cy={dataCy}>{auditValue}</div>);
    },
    equipment() {
      auditValue = procedureState.getItem(auditValue ?? "", FBProcedureItemType.equipment);
      if (FB.isUUID(auditValue ?? "")) {
        return <CircularProgress size={12} />;
      }
      return (<div data-cy={dataCy}>{auditValue}</div>);
    },
    attachments() {
      return <AuditAttachment {...{ audit }} />;
    },
    default() { return (<div data-cy={dataCy}>{getAuditDefaultValue(auditValue)}</div>); },
  };

  return (
    <Box>
      {(el[valueKey] || el.default)()}
    </Box>
  );
});

export default AuditProcedure;
