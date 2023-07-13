import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { translate } from '../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../common/utils/date';
import { Audit } from '../../state/ducks/audit/types';
import { companySelectors } from '../../state/ducks/company';
import { getAuditDefaultValue } from '../common/utils/audit';
import { LotTransfer } from '../form.builder/FBLotTransfers/types';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditLotTransfer: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = audit.field.split('.').at(-1) as string;
  const locations = useSelector(companySelectors.getAllLocations);
  const employees = useSelector(companySelectors.getAllEmployees);

  const locationAuditValue = (id: string) => locations.find(location => location.id === id)?.name ?? translate('common.not.applicable');

  const auditFieldFactory: Record<string, () => ReactNode> = {
    type: () => translate(`form.builder.lot.transfers.type.${String(auditValue)}`),
    by: () => employees?.find(employee => employee.id === auditValue)?.user?.name ?? translate('common.not.applicable'),
    date: () => getFormattedDateString(auditValue as string, MomentFormats.MonthDateYear),
    from: () => locationAuditValue(auditValue as string),
    to: () => locationAuditValue(auditValue as string),
    lot_transfers: () => {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const transfer = JSON.parse(auditValue as string) as LotTransfer;
          if (transfer) {
            return translate('form.builder.lot.transfers.audit.transfer', {
              type: translate(`form.builder.lot.transfers.type.${transfer.type}`),
              quantity: transfer.quantity,
              from: locations.find(location => location.id === transfer.from)?.name ?? translate('common.not.applicable'),
              to: locations.find(location => location.id === transfer.to)?.name ?? translate('common.not.applicable'),
              date: getFormattedDateString(transfer.date, MomentFormats.MonthDateYear),
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

export default AuditLotTransfer;
