import { CircularProgress } from "@material-ui/core";
import { first } from "lodash";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { Audit } from "../../state/ducks/audit";
import { FB, FBFileUploadState } from "../form.builder";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
  loading?: boolean;
}

export type Props = OwnProps;

export const AuditAttachment: React.FunctionComponent<Props> = ({
  audit, loading,
}) => {

  const attachmentState = FB.useRef(FBFileUploadState);
  const { nextValue, previousValue } = audit;
  let auditValue: any = nextValue;
  if (auditValue === "undefined") {
    auditValue = previousValue;
  }

  React.useEffect(() => {
    if (auditValue === "undefined") { return; }
    try {
      auditValue = JSON.parse(auditValue);
    } catch {
      auditValue.push(auditValue);
    }
    attachmentState.getAttachments(auditValue);
  }, []);

  useObserver(() => {
    loading = attachmentState.attachmentApi.loading;
  });

  return (
    <Fragment>
      {loading && <CircularProgress size={12} />}
      {!loading && <div>{first(attachmentState.fetchedFiles)?.name}</div>}
    </Fragment>
  );
};

export default AuditAttachment;
