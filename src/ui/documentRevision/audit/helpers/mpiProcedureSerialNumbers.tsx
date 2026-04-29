import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import { Audit } from '../../../../state/ducks/audit/types';
import Text from '../../../components/Text';

const MPI_PROCEDURE_SERIAL_NUMBERS_FIELD = 'serialsNumbers';

const FORM_INPUT_FIELD = 'formInput';
const MPI_PROCEDURE_SERIAL_NUMBERS_STATUS_FIELD = 'status';
const MPI_PROCEDURE_SERIAL_NUMBERS_USAGE_FIELD = 'usage';
const MPI_PROCEDURE_SERIAL_NUMBERS_NOTES_FIELD = 'notes';
const MPI_PROCEDURE_SERIAL_NUMBERS_ACCEPTED_STATUS = 'ACCEPTED';
const MPI_PROCEDURE_SERIAL_NUMBERS_REJECTED_STATUS = 'REJECTED';

type MpiProcedureSerialNumbersGroupedAction = 'accepted' | 'rejected';
type MpiProcedureSerialNumbersValueField = typeof MPI_PROCEDURE_SERIAL_NUMBERS_USAGE_FIELD | typeof MPI_PROCEDURE_SERIAL_NUMBERS_NOTES_FIELD;

interface MpiProcedureSerialNumbersAuditRow {
  key: string
  translation: string
  values?: Record<string, string>
  value: string
}

interface MpiProcedureSerialNumbersFieldInfo {
  procedureName: string
  serialNumberId?: string
  property?: string
}

interface MpiProcedureSerialNumberParts {
  prefix: string
  value: number
  width: number
}

interface MpiProcedureSerialNumbersAuditRowClasses {
  auditListItem: string
  auditKey: string
  auditValue: string
}

const MPI_PROCEDURE_SERIAL_NUMBERS_GROUPED_TRANSLATIONS: Record<MpiProcedureSerialNumbersGroupedAction, { single: string, multiple: string }> = {
  accepted: {
    single: 'documentRevision.audit.mpiProcedureSerialNumbers.status.ACCEPTED.single',
    multiple: 'documentRevision.audit.mpiProcedureSerialNumbers.status.ACCEPTED.multiple',
  },
  rejected: {
    single: 'documentRevision.audit.mpiProcedureSerialNumbers.status.REJECTED.single',
    multiple: 'documentRevision.audit.mpiProcedureSerialNumbers.status.REJECTED.multiple',
  },
};

const parseMpiProcedureSerialNumbersValue = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const getMpiProcedureSerialNumberParts = (serialNumber: string): MpiProcedureSerialNumberParts | null => {
  const match = /^(.*-)(\d+)$/.exec(serialNumber);
  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    value: parseInt(match[2], 10),
    width: match[2].length,
  };
};

const formatMpiProcedureSerialNumber = (prefix: string, value: number, width: number): string => (
  `${prefix}${String(value).padStart(width, '0')}`
);

const formatMpiProcedureSerialNumbers = (serialNumbers: string[]): string => {
  const serialsByPrefix = new Map<string, { width: number, values: number[] }>();
  const standaloneSerials: string[] = [];

  serialNumbers.forEach(serialNumber => {
    const normalizedSerialNumber = String(serialNumber).trim();
    if (!normalizedSerialNumber) {
      return;
    }

    const parts = getMpiProcedureSerialNumberParts(normalizedSerialNumber);
    if (!parts) {
      if (!standaloneSerials.includes(normalizedSerialNumber)) {
        standaloneSerials.push(normalizedSerialNumber);
      }
      return;
    }

    const serialsGroup = serialsByPrefix.get(parts.prefix) ?? { width: parts.width, values: [] };
    serialsGroup.width = Math.max(serialsGroup.width, parts.width);
    serialsGroup.values.push(parts.value);
    serialsByPrefix.set(parts.prefix, serialsGroup);
  });

  const formattedSerialNumbers: string[] = [];
  serialsByPrefix.forEach(({ width, values }, prefix) => {
    const uniqueSortedValues = Array.from(new Set(values)).sort((a, b) => a - b);
    let index = 0;

    while (index < uniqueSortedValues.length) {
      const start = uniqueSortedValues[index];
      let endIndex = index;

      while (endIndex + 1 < uniqueSortedValues.length && uniqueSortedValues[endIndex + 1] === uniqueSortedValues[endIndex] + 1) {
        endIndex++;
      }

      const end = uniqueSortedValues[endIndex];
      const formattedStart = formatMpiProcedureSerialNumber(prefix, start, width);
      const formattedEnd = formatMpiProcedureSerialNumber(prefix, end, width);
      formattedSerialNumbers.push(start === end ? formattedStart : `${formattedStart} – ${formattedEnd}`);
      index = endIndex + 1;
    }
  });

  return [...formattedSerialNumbers, ...standaloneSerials].join(', ');
};

const getMpiProcedureSerialNumberDisplayValue = (value: unknown): string => {
  const parsedValue = parseMpiProcedureSerialNumbersValue(value);

  if (parsedValue === null || parsedValue === undefined || parsedValue === 'null' || parsedValue === 'undefined') {
    return '';
  }

  return String(parsedValue);
};

const getMpiProcedureSerialNumbersValueDisplayValue = (field: MpiProcedureSerialNumbersValueField, value: unknown): string => {
  const displayValue = getMpiProcedureSerialNumberDisplayValue(value);

  if (field !== MPI_PROCEDURE_SERIAL_NUMBERS_USAGE_FIELD) {
    return displayValue;
  }

  switch (displayValue) {
    case 'DO_NOT_USE':
      return translate('form.builder.serials.usage.do.not.use');
    case 'R&D':
      return translate('form.builder.serials.usage.rnd');
    default:
      return displayValue;
  }
};

const getMpiProcedureSerialNumbersFieldInfo = (field: string): MpiProcedureSerialNumbersFieldInfo | null => {
  const [root, procedureName, serialsField, serialNumberId, ...propertyParts] = field.split('.');

  if (root !== FORM_INPUT_FIELD || !procedureName || serialsField !== MPI_PROCEDURE_SERIAL_NUMBERS_FIELD) {
    return null;
  }

  return {
    procedureName,
    serialNumberId,
    property: propertyParts.join('.') || undefined,
  };
};

export const isMpiProcedureSerialNumbersAuditField = (field: string): boolean => (
  getMpiProcedureSerialNumbersFieldInfo(field) !== null
);

const getMpiProcedureSerialNumbersStatusAction = (status: unknown): MpiProcedureSerialNumbersGroupedAction | null => {
  switch (getMpiProcedureSerialNumberDisplayValue(status)) {
    case MPI_PROCEDURE_SERIAL_NUMBERS_ACCEPTED_STATUS:
      return 'accepted';
    case MPI_PROCEDURE_SERIAL_NUMBERS_REJECTED_STATUS:
      return 'rejected';
    default:
      return null;
  }
};

const getSerialNumberLabelFromValue = (value: unknown): string | undefined => {
  const parsedValue = parseMpiProcedureSerialNumbersValue(value);

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    return undefined;
  }

  const serialNumberValue = parsedValue as {
    serialNumber?: unknown
    serial?: unknown
    name?: unknown
    value?: unknown
  };

  const label = serialNumberValue.serialNumber
    ?? serialNumberValue.serial
    ?? serialNumberValue.name
    ?? serialNumberValue.value;

  if (label === null || label === undefined) {
    return undefined;
  }

  const displayLabel = String(label).trim();
  return displayLabel || undefined;
};

const getSerialNumberLabelsById = (mpiProcedureSerials: Audit[]): Record<string, string> => {
  return mpiProcedureSerials.reduce<Record<string, string>>((labelsById, change) => {
    const fieldInfo = getMpiProcedureSerialNumbersFieldInfo(change.field);
    if (!fieldInfo?.serialNumberId || labelsById[fieldInfo.serialNumberId]) {
      return labelsById;
    }

    const label = getSerialNumberLabelFromValue(change.nextValue)
      ?? getSerialNumberLabelFromValue(change.previousValue);

    if (label) {
      labelsById[fieldInfo.serialNumberId] = label;
    }

    return labelsById;
  }, {});
};

const getSerialNumberLabel = (serialNumberId: string, labelsById: Record<string, string>): string => (
  labelsById[serialNumberId] ?? serialNumberId
);

export const buildMpiProcedureSerialNumbersAuditRows = (
  mpiProcedureSerials: Audit[],
  serialNumberLabelsByIdFromState: Record<string, string> = {},
): MpiProcedureSerialNumbersAuditRow[] => {
  const serialNumberLabelsById = {
    ...getSerialNumberLabelsById(mpiProcedureSerials),
    ...serialNumberLabelsByIdFromState,
  };
  const groupedActions = new Map<MpiProcedureSerialNumbersGroupedAction, string[]>();
  const valueRows: MpiProcedureSerialNumbersAuditRow[] = [];

  const addGroupedAction = (action: MpiProcedureSerialNumbersGroupedAction, serialNumberIds: string[]) => {
    const normalizedSerialNumberIds = serialNumberIds.filter(Boolean);
    if (normalizedSerialNumberIds.length === 0) {
      return;
    }

    const currentSerialNumberIds = groupedActions.get(action) ?? [];
    groupedActions.set(action, [...currentSerialNumberIds, ...normalizedSerialNumberIds]);
  };

  mpiProcedureSerials.forEach((change, index) => {
    const fieldInfo = getMpiProcedureSerialNumbersFieldInfo(change.field);
    if (!fieldInfo?.serialNumberId || !fieldInfo.property) {
      return;
    }

    const serialNumberLabel = getSerialNumberLabel(fieldInfo.serialNumberId, serialNumberLabelsById);

    if (fieldInfo.property === MPI_PROCEDURE_SERIAL_NUMBERS_STATUS_FIELD) {
      const action = getMpiProcedureSerialNumbersStatusAction(change.nextValue);
      if (action) {
        addGroupedAction(action, [fieldInfo.serialNumberId]);
      }

      return;
    }

    const isValueField = fieldInfo.property === MPI_PROCEDURE_SERIAL_NUMBERS_USAGE_FIELD
      || fieldInfo.property === MPI_PROCEDURE_SERIAL_NUMBERS_NOTES_FIELD;
    const isSupportedValueChange = ['STRING_NEW', 'STRING_EDITED', 'STRING_DELETED'].includes(change.type);

    if (!isValueField || !isSupportedValueChange) {
      return;
    }

    const valueField = fieldInfo.property as MpiProcedureSerialNumbersValueField;
    const value = change.type === 'STRING_DELETED' ? change.previousValue : change.nextValue;
    const displayValue = getMpiProcedureSerialNumbersValueDisplayValue(valueField, value);

    valueRows.push({
      key: `${change.groupId}-${change.field}-${change.type}-${index}`,
      translation: `documentRevision.audit.mpiProcedureSerialNumbers.${valueField}.${change.type}`,
      values: { serialNumber: serialNumberLabel },
      value: displayValue,
    });
  });

  const groupedRows = Array.from(groupedActions.entries()).map(([action, serialNumberIds]) => {
    const uniqueSerialNumberIds = Array.from(new Set(serialNumberIds.filter(Boolean)));
    const serialNumberLabels = uniqueSerialNumberIds.map(serialNumberId => getSerialNumberLabel(serialNumberId, serialNumberLabelsById));
    const uniqueSerialNumberLabels = Array.from(new Set(serialNumberLabels.filter(Boolean)));
    const translations = MPI_PROCEDURE_SERIAL_NUMBERS_GROUPED_TRANSLATIONS[action];

    return {
      key: `mpi-procedure-serial-${action}-${uniqueSerialNumberIds.join('-')}`,
      translation: uniqueSerialNumberLabels.length === 1 ? translations.single : translations.multiple,
      value: formatMpiProcedureSerialNumbers(uniqueSerialNumberLabels),
    };
  });

  return [...groupedRows, ...valueRows];
};

export const renderMpiProcedureSerialNumbersAuditRow = (
  row: MpiProcedureSerialNumbersAuditRow,
  groupKey: number | undefined,
  key: number,
  classes: MpiProcedureSerialNumbersAuditRowClasses,
): JSX.Element => {
  const dataCyKey = `${String(groupKey ?? '')}-${key}`;

  return (
    <Box
      mb={1}
      key={row.key}
      data-cy="no-padding-margin"
      className={classes.auditListItem}
    >
      <Typography variant="subtitle1" className={classes.auditKey}>
        <Text
          dataCy={`change-key-${dataCyKey}`}
          message={row.translation}
          values={row.values}
        />
      </Typography>
      <div className={classes.auditValue}>
        <div data-cy={`change-value-${dataCyKey}`}>{row.value}</div>
      </div>
    </Box>
  );
};
