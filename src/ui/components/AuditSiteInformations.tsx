import React, { ReactNode } from 'react';
import { translate } from '../../common/intl';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import { siteContact } from '../form.builder/FBSiteInformation/SiteContact/types';
import { Site } from '../form.builder/FBSiteInformation/types';

interface Props {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

const AuditSiteInformations: React.FC<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => {
  const field = audit.field.split('.').at(-1) as string;
  const auditFieldFactory: Record<string, () => ReactNode> = {
    site_informations: () => {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string) as Site;
          if (data) {
            return translate('form.builder.site.inforation.grid.heading.audit.delete', {
              name: data.siteName || data.siteAddress,
            });
          }
        } catch (err) {
          return getAuditDefaultValue(auditValue);
        }
      }
    },
    siteContact: () => {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string) as siteContact;
          if (data) {
            return translate('form.builder.contact.grid.heading.audit.delete', {
              name: data.name || data.email,
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

export default AuditSiteInformations;
