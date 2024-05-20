import React, { ReactNode } from 'react';
import { translate } from '../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../common/utils/date';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import { FBFieldName } from '../form.builder';
import { Trainee } from '../form.builder/FBTraineeList/types';
import AuditAttachment from './AuditAttachment';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditTraineeList: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = audit.field.split('.').at(-1) as string;

  const auditFieldFactory: Record<string, () => ReactNode> = {
    trainingCompletionDate: () => getFormattedDateString(auditValue as string, MomentFormats.DateTimeComplete),
    attachmentIds () {
      return <AuditAttachment {...{ audit }} />;
    },
    [FBFieldName.GRPTTraineeList]: () => {
      if (audit.type !== 'ARRAY_DELETED') {
        return;
      }

      try {
        const data = JSON.parse(auditValue as string) as Trainee;
        if (data) {
          return translate('form.builder.trainee.list.deleted', {
            name: data?.employee?.name ?? '',
            docId: data?.trainingDocument?.docId ?? '',
          });
        }
      } catch (err) {
        return getAuditDefaultValue(auditValue);
      }
    },
    default: () => getAuditDefaultValue(auditValue),
  };

  const value = (auditFieldFactory[field] ?? auditFieldFactory.default)();

  return (
    <div data-cy={dataCy}>
      {value}
    </div>
  );
};

export default AuditTraineeList;
