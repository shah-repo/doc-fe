import { CircularProgress } from '@material-ui/core';
import { isString } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { Fragment } from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { FB, FBFilesPresenterState } from '../form.builder';

interface OwnProps {
  audit: Audit
  dataCy?: string
  loading?: boolean
}

type Props = OwnProps;

const AuditAttachment: React.FunctionComponent<Props> = ({
  audit, loading,
}) => {
  const attachmentState = FB.useRef(FBFilesPresenterState);
  const { nextValue, previousValue } = audit;
  let auditValue: any = nextValue;
  if (auditValue === 'undefined') {
    auditValue = previousValue;
  }

  React.useEffect(() => {
    if (!auditValue || auditValue === 'undefined') { return; }

    try {
      const data = JSON.parse(auditValue);
      auditValue = data?.id ?? data;
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
      {!loading && (
        attachmentState.filesApi.data?.map(item => (
          <div key={item.id}>{`${item.name}.${item.type}`}</div>
        ))
      )}
    </Fragment>
  );
};

export default AuditAttachment;
