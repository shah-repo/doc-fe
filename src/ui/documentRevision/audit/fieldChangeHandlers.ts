import { intl, translate } from '../../../common/intl';
import { Audit } from '../../../state/ducks/audit/types';
import { SHIPPING_ADDRESS_FIELDS } from '../../form.builder/FBShippingInfo/constants';

type SiteInformationFieldType = 'site' | 'contact';
type FBLabel = string | Record<string, unknown>;
export const CUSTOM_BOOLEAN_FIELD = 'custom_boolean_field';

interface ChangeFieldType {
  change: Audit
  fbLabel: FBLabel
}

export const handleSiteInformationChange = (change: Audit, fbLabel: FBLabel): ChangeFieldType | undefined => {
  const changeField = change.field.split('.');
  const field = changeField.at(-1) ?? '';
  const parentField = changeField.at(-2) ?? '';

  if (field === 'id') return;

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

    const labelContext = isSiteContact ? translate('form.builder.customer.contact.audit.label') : '';
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

  if (change.type === 'OBJECT_EDITED' && change.field === 'formInput.siteInformation') {
    fbLabel = translate('form.builder.site.information.grid.heading.siteInformation');
    change = {
      ...change,
      type: 'OBJECT_DELETED',
    };
  }

  return { change, fbLabel };
};

export const handleSiteAddressChange = (change: Audit, fbLabel: FBLabel): ChangeFieldType => {
  const fieldMap: Record<string, string> = {
    City: 'form.builder.site.information.grid.heading.city',
    Country: 'form.builder.site.information.grid.heading.country',
    ZipCode: 'form.builder.site.information.grid.heading.zip.code',
    State: 'form.builder.customer.state.label',
  };

  const fieldKey = Object.keys(fieldMap).find((key) =>
    change.field.endsWith(key),
  );
  if (fieldKey) {
    fbLabel = `${fbLabel} ${translate(fieldMap[fieldKey])}`;
  }

  return { change, fbLabel };
};

export const handleShippingAddressChange = (change: Audit): {
  change: Audit
} | null => {
  const changeFieldParts = change.field.split('.');
  const field = changeFieldParts.at(-1);

  if (
    field === 'id'
    || changeFieldParts.some((part) =>
      [SHIPPING_ADDRESS_FIELDS.ATTENTION, SHIPPING_ADDRESS_FIELDS.CONTACT].includes(part),
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

export const handleShippingItemsChange = (change: Audit, fbLabel: FBLabel): ChangeFieldType | undefined => {
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
          ? translate('form.builder.part')
          : translate('form.builder.lot');
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

export const getMaterialRelacmentAuditLabel = (
  field: string, fieldType: string, stepIndex?: number, meta: any = {},
): string => {
  const { lotPart, lotDocId, materialId } = meta;
  let type = '';
  if (materialId) {
    if (fieldType === 'BOOLEAN_NEW') {
      type = (field === 'qunatity') ? 'assinged to' : 'added to';
    }
    if (fieldType === 'BOOLEAN_EDITED') {
      type = 'deleted for';
    }
    if (fieldType === 'NUMBER_EDITED') {
      type = field === 'quantity' ? 'updated' : 'added to';
    }
    if (fieldType === 'STRING_EDITED') {
      type = field === 'unit' ? 'updated' : 'added to';
    }
  } else {
    type = fieldType === 'BOOLEAN_NEW' ? 'added' : 'deleted';
  }

  let label = '';
  if (field === 'lot') {
    label = intl.formatMessage({ id: 'form.builder.audit.MATERIAL_REPLACEMENT' },
      {
        step: stepIndex,
        value: lotPart,
        field: 'Lot',
        type,
      });
  } else if (field === 'quantity') {
    const lotDocIdUpdated = fieldType === 'NUMBER_EDITED' ? '' : lotDocId;
    label = intl.formatMessage({ id: 'form.builder.audit.MATERIAL_REPLACEMENT' },
      {
        step: stepIndex,
        value: lotDocIdUpdated,
        field: 'Quanity',
        type,
      });
  } else if (field === 'unit') {
    const lotDocIdUpdated = fieldType === 'STRING_EDITED' ? '' : lotDocId;
    label = intl.formatMessage({ id: 'form.builder.audit.MATERIAL_REPLACEMENT' },
      {
        step: stepIndex,
        value: lotDocIdUpdated,
        field: 'Unit',
        type,
      });
  } else if (field === 'actualId') {
    label = intl.formatMessage({ id: 'form.builder.audit.EQUIPMENT_REPLACEMENT' },
      {
        step: stepIndex,
        field: 'Equipment',
        type,
      });
  }
  return label;
};
