import { Box, CircularProgress } from '@material-ui/core';
import { last } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { Audit } from '../../state/ducks/audit/types';
import { getAuditDefaultValue } from '../common/utils/audit';
import { FB, FBProcedureItemType, FBProcedureState } from '../form.builder';
import AuditAttachment from './AuditAttachment';

interface OwnProps {
  audit: Audit
  dataCy?: string
  auditValue?: string
}

type Props = OwnProps;

const AuditProcedure: React.FunctionComponent<Props> = ({
  audit,
  dataCy,
  auditValue,
}) => useObserver(() => {
  const procedureState = FB.useRef(FBProcedureState);
  let valueKey = last(audit.field.split('.')) ?? '';
  if (valueKey === 'title') {
    valueKey = audit.field.split('.')[2].split('[')[0] ?? '';
  }
  if (audit.field.includes('attachments')) {
    valueKey = 'attachments';
  }

  const renderLotValue = (value?: string) => {
    const result = procedureState.getLot(value ?? '');
    if (!result) {
      return <div data-cy={dataCy}>{getAuditDefaultValue(value)}</div>;
    }
    return renderWithLoader(result);
  };

  const renderPartValue = (value?: string) => {
    const result = procedureState.getItem(value ?? '', FBProcedureItemType.materials);
    return renderWithLoader(result ?? '');
  };

  const renderWithLoader = (value: string) => {
    if (FB.isUUID(value ?? '')) {
      return <CircularProgress size={12} />;
    }
    return <div data-cy={dataCy}>{value}</div>;
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
    attachments () {
      return <AuditAttachment {...{ audit }} />;
    },
    plannedId () {
      return renderPartValue(auditValue);
    },
    actualId() {
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
    assignedLots() {
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
    default () { return (<div data-cy={dataCy}>{getAuditDefaultValue(auditValue)}</div>); },
  };

  return (
    <Box>
      {(el[valueKey] || el.default)()}
    </Box>
  );
});

export default AuditProcedure;
