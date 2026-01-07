import { Box, CircularProgress, Typography } from '@material-ui/core';
import { last } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { ReactNode } from 'react';
import { intl } from '../../common/intl';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import { styles } from '../documentRevision/audit/Audit.presenter.styles.new';
import { getMaterialReplacementAuditField } from '../documentRevision/audit/fieldChangeHandlers';
import { FB, FBProcedureItemType, FBProcedureState } from '../form.builder';
import { isTranslation } from '../translations/types';
import AuditAttachment from './AuditAttachment';

interface OwnProps {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

type Props = OwnProps;

interface AuditItem {
  key: string
  current?: string|number|null|Attachment[]
  previous?: string|number|null|Attachment[]
}

interface Attachment {
  id: string
}

interface IMaterial {
  title: string
  quantity: number
  unit?: string|null
  assignedLots: IAssignLot[]
  attachments: Attachment[]
}

interface IAssignLot {
  lotId: string
  quantity: number
  unit?: string|null
  serialNumber?: string
}

const AuditProcedure: React.FunctionComponent<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => useObserver(() => {
  const procedureState = FB.useRef(FBProcedureState);
  const classes = styles();

  const renderPartValue = (value?: string) => {
    const result = procedureState.getItem(value ?? '', FBProcedureItemType.materials);
    return renderWithLoader(result ?? '');
  };

  const renderWithLoader = (value: string) => {
    if (FB.isUUID(value)) {
      return <CircularProgress size={12} />;
    }
    return <div data-cy={dataCy}>{value}</div>;
  };

  const renderLotValue = (value?: string) => {
    const result = procedureState.getLot(value ?? '');
    if (!result) {
      return <div data-cy={dataCy}>{getAuditDefaultValue(value)}</div>;
    }
    return renderWithLoader(result);
  };

  const renderUpdatedMaterialProcedureAudit = (
    field: AuditItem,
    number: number,
    innerKey: number,
    isNested = false,
  ): ReactNode => {
    const fbLabel = getUpdatedMaterialProcedureAuditLabel(field, number, isNested);

    const { key, current, previous }: AuditItem = field;
    let value: number | string | null | undefined | ReactNode = !current && previous ? previous : current;
    if (key === 'title') {
      value = renderPartValue(current as string);
    } else if (key === 'lotId') {
      value = renderLotValue(current as string);
    } else if (key === 'attachments') {
      const getAttachmentIds = (data) => Array.isArray(data) ? data.map((item) => item?.id) : data?.id;

      const isRemoval = Array.isArray(previous) && previous?.length && !current;
      const auditAttachment = {
        ...audit,
        previousValue: isRemoval ? getAttachmentIds(previous) : 'undefined',
        nextValue: !isRemoval ? getAttachmentIds(current) : 'undefined',
      };
      value = <AuditAttachment audit={auditAttachment} />;
    }

    return (
      <React.Fragment key={key}>
        <Typography className={classes.auditKey}>
          <span data-cy={`change-key-${key}-${innerKey}`}>
            {fbLabel}
          </span>
        </Typography>
        <div data-cy={`change-key-${key}-${innerKey}`}>
          {value}
        </div>
      </React.Fragment>
    );
  };

  const getUpdatedMaterialProcedureAuditLabel = (
    { key, current, previous }: AuditItem,
    number: number,
    isNested: boolean,
  ): string|null => {
    let action = getMaterialReplacementAuditField('added');
    if (current && !previous) {
      action = getMaterialReplacementAuditField('added');
    } else if (current !== previous && current && previous) {
      action = getMaterialReplacementAuditField('updated');
    } else if (!current && previous) {
      action = getMaterialReplacementAuditField('deleted');
    } else if (!current && !previous) {
      return null;
    }

    let fbLabel = key;
    const keyLabelType = intl.formatMessage({ id: 'form.builder.materials' }) + ': ';
    const keyLabel = isTranslation(`form.builder.${key}`)
      ? intl.formatMessage({ id: `form.builder.${key}` })
      : '';
    const stepLabel = intl.formatMessage({ id: 'form.builder.step.number' }, { number });

    if (isNested && key !== 'serialNumber') {
      fbLabel = intl.formatMessage({
        id: 'form.builder.assigned.lots.label',
      }, {
        stepLabel,
        keyLabelType,
        keyLabel,
      });
    } else {
      fbLabel = `${stepLabel} ${keyLabelType} ${keyLabel}`;
    }
    return `${fbLabel} ${action}`;
  };

  if (audit.type === 'OBJECT_EDITED' && audit.field.includes('materials')) {
    const auditValueToUse = auditValue ?? '{}';
    let parsedValue;
    if (typeof auditValueToUse === 'string') {
      try {
        parsedValue = JSON.parse(auditValueToUse.trim()) as IMaterial;
      } catch (e) {
        console.error('Failed to parse audit JSON:', e);
        parsedValue = auditValueToUse;
      }
    } else {
      parsedValue = auditValueToUse;
    }

    const { title, unit, quantity, assignedLots, attachments } = parsedValue;

    const previousValueToUse = audit.previousValue ?? '{}';
    const {
      title: prevTitle, unit: prevUnit, quantity: prevQuantity, assignedLots: prevAssignedLots, attachments: prevAttachments,
    } = (typeof previousValueToUse === 'string' ? JSON.parse(previousValueToUse) : previousValueToUse) as IMaterial;

    const fieldsToCompare = [
      { key: 'title', current: title, previous: prevTitle },
      { key: 'quantity', current: quantity, previous: prevQuantity },
      { key: 'unit', current: unit, previous: prevUnit },
      { key: 'attachments', current: attachments, previous: prevAttachments },
    ];

    const assignedLotCurrent = assignedLots?.[0];
    const assignedLotPrevious = prevAssignedLots?.[0];

    const nestedFieldsToCompare = [
      { key: 'lotId', current: assignedLotCurrent?.lotId, previous: assignedLotPrevious?.lotId },
      { key: 'serialNumber', current: assignedLotCurrent?.serialNumber, previous: assignedLotPrevious?.serialNumber },
      { key: 'quantity', current: assignedLotCurrent?.quantity, previous: assignedLotPrevious?.quantity },
      { key: 'unit', current: assignedLotCurrent?.unit, previous: assignedLotPrevious?.unit },
    ];

    let innerKey = 0;
    let fieldsToRender;
    const number = audit?.fbSchemaItem?.stepIndex ?? 1;
    if (assignedLots) {
      fieldsToRender = nestedFieldsToCompare.map((field) =>
        renderUpdatedMaterialProcedureAudit(field, number, innerKey++, true),
      );
    } else {
      fieldsToRender = fieldsToCompare.map((field) =>
        renderUpdatedMaterialProcedureAudit(field, number, innerKey++),
      );
    }
    return (
      <>
        {fieldsToRender}
      </>
    );
  }

  let valueKey = last(audit.field.split('.')) ?? '';

  if (valueKey === 'title') {
    valueKey = audit.field.split('.')[2].split('[')[0] ?? '';
  }
  if (audit.field.includes('attachments')) {
    valueKey = 'attachments';
  }

  const renderEquipmentValue = (value?: string) => {
    const result = procedureState.getItem(value ?? '', FBProcedureItemType.equipment);
    if (!result) {
      return <div data-cy={dataCy}>{getAuditDefaultValue(value)}</div>;
    }
    return renderWithLoader(result);
  };

  const el = {
    description () {
      return (
        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: auditValue as string }} />
      );
    },
    partLot () {
      auditValue = procedureState.getLot(auditValue ?? '');
      if (FB.isUUID(auditValue ?? '')) {
        return <CircularProgress size={12} />;
      }
      return (<div data-cy={dataCy}>{auditValue}</div>);
    },
    materials () {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string);
          if (data && data.plannedId) {
            return renderPartValue(data.plannedId);
          }
        } catch (err) {
          return getAuditDefaultValue(auditValue);
        }
      } else {
        auditValue = procedureState.getItem(auditValue ?? '', FBProcedureItemType.materials);
        if (FB.isUUID(auditValue ?? '')) {
          return <CircularProgress size={12} />;
        }
        return (<div data-cy={dataCy}>{auditValue}</div>);
      }
    },
    equipment () {
      auditValue = procedureState.getItem(auditValue ?? '', FBProcedureItemType.equipment);
      if (FB.isUUID(auditValue ?? '')) {
        return <CircularProgress size={12} />;
      }
      return (<div data-cy={dataCy}>{auditValue}</div>);
    },
    equipmentId () {
      return renderEquipmentValue(auditValue);
    },
    attachments () {
      return <AuditAttachment {...{ audit }} />;
    },
    plannedId () {
      return renderPartValue(auditValue);
    },
    actualId () {
      if (!FB.isUUID(auditValue ?? '')) {
        return getAuditDefaultValue(auditValue);
      } else {
        auditValue = procedureState.getItem(auditValue ?? '', FBProcedureItemType.materials);
        return (<div data-cy={dataCy}>{auditValue}</div>);
      }
    },
    lotId () {
      return renderLotValue(auditValue);
    },
    assignedLots () {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string);
          if (data && data.lotId) {
            return renderLotValue(data.lotId);
          }
        } catch (err) {
          return getAuditDefaultValue(auditValue);
        }
      }
    },
    assignedEquipments () {
      if (audit.type === 'ARRAY_DELETED') {
        try {
          const data = JSON.parse(auditValue as string);
          if (data && data.equipmentId) {
            return renderEquipmentValue(data.equipmentId);
          }
        } catch (err) {
          return getAuditDefaultValue(auditValue);
        }
      }
    },
    default () { return (<div data-cy={dataCy}>{getAuditDefaultValue(auditValue)}</div>); },
  };

  return (
    <Box>
      {(el[valueKey] || el.default)()}
    </Box>
  );
});

export default AuditProcedure;
