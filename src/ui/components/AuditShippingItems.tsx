import React, { ReactNode } from 'react';
import { translate } from '../../common/intl';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditShippingItems: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = audit.field.split('.').at(-1) as string;

  const auditFieldFactory: Record<string, () => ReactNode> = {
    shipping_items: () => {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string);
          if (data) {
            return translate('form.builder.shipping.items.audit.delete', {
              name: data?.part?.name || data?.lot?.name,
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

export default AuditShippingItems;
