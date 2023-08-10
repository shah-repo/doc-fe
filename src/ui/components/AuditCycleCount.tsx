import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../common/utils/date';
import { Audit } from '../../state/ducks/audit/types';
import { companySelectors } from '../../state/ducks/company';
import { getAuditDefaultValue } from '../common/utils/audit';
import { LOT_CYCLE_COUNT_KEY } from '../form.builder/FBCycleCount/constants';
import { CycleCount } from '../form.builder/FBCycleCount/types';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditCycleCount: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = audit.field.split('.').at(-1) as string;
  const employees = useSelector(companySelectors.getAllEmployees);

  const auditFieldFactory: Record<string, () => ReactNode> = {
    by: () => employees?.find(employee => employee.id === auditValue)?.user?.name ?? translate('common.not.applicable'),
    date: () => getFormattedDateString(auditValue as string, MomentFormats.DateTimeComplete),
    [LOT_CYCLE_COUNT_KEY]: () => {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string) as CycleCount;
          if (data) {
            return translate('form.builder.cycle.count.deleted', {
              count: data.count,
              date: getFormattedDateString(data.date, MomentFormats.DateTimeComplete),
            });
          }
        } catch (err) {
          return getAuditDefaultValue(auditValue);
        }
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

export default AuditCycleCount;
