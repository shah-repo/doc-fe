import { CircularProgress } from "@material-ui/core";
import { first, isString } from "lodash";
import { useObserver } from "mobx-react";
import React, { Fragment } from "react";
import { Audit } from "../../state/ducks/audit";
import { FB, FBFilesPresenterState } from "../form.builder";

interface OwnProps {
  audit: Audit;
  dataCy?: string;
  loading?: boolean;
}

export type Props = OwnProps;

export const AuditAttachment: React.FunctionComponent<Props> = ({
  audit, loading,
}) => {

  const attachmentState = FB.useRef(FBFilesPresenterState);
  const { nextValue, previousValue } = audit;
  let auditValue: any = nextValue;
  if (auditValue === "undefined") {
    auditValue = previousValue;
  }

  React.useEffect(() => {
    if (auditValue === "undefined") { return; }
    try {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      auditValue = JSON.parse(auditValue);
    } catch {
      if (isString(auditValue)) {
        auditValue = [auditValue];
      } else {
        auditValue.push(auditValue);
      }
    }
    attachmentState.getFiles(auditValue);
  }, []);

  useObserver(() => {
    loading = attachmentState.filesApi.loading;
  });

  return (
    <Fragment>
      {loading && <CircularProgress size={12} />}
      {!loading && <div>{first(attachmentState.filesApi.data)?.name}</div>}
    </Fragment>
  );
};

export default AuditAttachment;
