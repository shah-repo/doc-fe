import React, { ReactNode } from 'react';
import { translate } from '../../common/intl';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import { Vendor } from '../form.builder/FBPartVendors/types';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditPartVendors: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = audit.field.split('.').at(-1) as string;

  const auditFieldFactory: Record<string, () => ReactNode> = {
    'part-vendors': () => {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const transfer = JSON.parse(auditValue as string) as Vendor;
          if (transfer) {
            return translate('form.builder.part.vendors.audit.delete', {
              name: transfer.vendor.name,
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

export default AuditPartVendors;
