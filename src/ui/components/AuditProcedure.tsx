import { Box } from "@material-ui/core";
import { last } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { Audit } from "../../state/ducks/audit";
import { getAuditDefaultValue } from "../common/utils/audit";
import { FBProcedureValue } from "../form.builder";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
  auditValue?: string;
}

export type Props = OwnProps;

export const AuditProcedure: React.FunctionComponent<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => useObserver(() => {
  const valueKey = last(audit.field.split(".")) as keyof FBProcedureValue;

  const el = {
    description() {
      return (
        <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: auditValue as string }}/>
      );
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
