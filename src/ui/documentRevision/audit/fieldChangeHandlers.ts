import { translate } from '../../../common/intl';
import { Audit } from '../../../state/ducks/audit/types';

type SiteInformationFieldType = 'site' | 'contact';
type FBLabel = string | Record<string, unknown>;
export const CUSTOM_BOOLEAN_FIELD = 'custom_boolean_field';

export const handleSiteInformationChange = (change: Audit, fbLabel: FBLabel) => {
  const changeField = change.field.split('.');
  const field = changeField.at(-1) ?? '';
  const parentField = changeField.at(-2) ?? '';

  if (['id', 'isPrimary'].includes(field)) return;

  if (!['ARRAY_DELETED', 'ARRAY_NEW'].includes(change.type)) {
    const isSiteContact = parentField.startsWith('siteContact');
    const context = isSiteContact ? 'contact' : 'site';

    let fieldFullName = [
      'docId',
      'value',
      ...(isSiteContact ? [] : ['name']),
    ].includes(field)
      ? parentField
      : field;

    fieldFullName = getSiteOrContactFullName(fieldFullName, context);

    const headingKey = isSiteContact
      ? `form.builder.contact.grid.heading.${fieldFullName}`
      : `form.builder.site.information.grid.heading.${fieldFullName}`;
    const fieldName = translate(headingKey);

    const labelContext = isSiteContact ? 'Contact' : '';
    const auditKey = isSiteContact
      ? 'form.builder.contact.grid.heading.audit.item'
      : 'form.builder.site.information.grid.heading.audit.item';

    fbLabel = translate(auditKey, {
      label: `${fbLabel} ${labelContext}`.trim(),
      field: fieldName,
    });
  }

  if (['BOOLEAN_NEW', 'BOOLEAN_EDITED'].includes(change.type)) {
    change = {
      ...change,
      field: CUSTOM_BOOLEAN_FIELD,
    };
  }

  return { change, fbLabel };
};

export const handleSiteAddressChange = (change: Audit, fbLabel: FBLabel) => {
  const fieldMap: Record<string, string> = {
    _city: 'form.builder.site.information.grid.heading.city',
    _country: 'form.builder.site.information.grid.heading.country',
    _zip_code: 'form.builder.site.information.grid.heading.zip.code',
  };

  const fieldKey = Object.keys(fieldMap).find((key) =>
    change.field.endsWith(key),
  );
  if (fieldKey) {
    fbLabel = `${fbLabel} ${translate(fieldMap[fieldKey])}`;
  }

  return { change, fbLabel };
};

export const handleShippingAddressChange = (change: Audit) => {
  const changeFieldParts = change.field.split('.');
  const field = changeFieldParts.at(-1);

  if (
    field === 'id'
    || changeFieldParts.some((part) =>
      ['shipping_address_attention', 'shipping_address_contact'].includes(part),
    )
  ) {
    return null;
  }

  return { change };
};

const getSiteOrContactFullName = (
  field: string,
  type: SiteInformationFieldType,
): string => {
  const fieldMappings: Record<
  SiteInformationFieldType,
  Record<string, string>
  > = {
    site: {
      siteName: 'site.name',
      siteAddress: 'site.address',
      zipCode: 'zip.code',
      approvedToReceive: 'approved.to.receive',
      isSameAsHQ: 'same.as.hq',
    },
    contact: {
      phoneNumber: 'phone.number',
    },
  };

  return fieldMappings[type]?.[field] || field;
};

export const handleShippingItemsChange = (change: Audit, fbLabel: FBLabel) => {
  const changeField = change.field.split('.');
  const field = changeField.at(-1) ?? '';
  const parentField = changeField.at(-2) ?? '';

  if (['id', 'documentId'].includes(field)) return;

  if (!['ARRAY_DELETED', 'ARRAY_NEW'].includes(change.type)) {
    const fieldFullName = ['docId', 'value', 'name'].includes(field)
      ? parentField
      : field;
    const fieldName = translate(`form.builder.shipping.items.${fieldFullName}`);

    if (change.type === 'OBJECT_DELETED') {
      if (change.field.endsWith('part') || change.field.endsWith('lot')) {
        const value = JSON.parse(change.previousValue as string);
        const fieldLabel = change.field.endsWith('part')
          ? translate('Part')
          : translate('Lot');
        fbLabel = `${fbLabel} ${fieldLabel}`;
        change = {
          ...change,
          previousValue: value?.name,
        };
      }
    } else {
      fbLabel = `${fbLabel} ${fieldName}`;
    }
  }

  return { change, fbLabel };
};
