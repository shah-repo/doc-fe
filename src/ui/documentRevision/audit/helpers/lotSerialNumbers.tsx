import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import { Audit } from '../../../../state/ducks/audit/types';
import Text from '../../../components/Text';

export const LOT_SERIAL_NUMBERS_FIELD = 'lotSerialNumbers';

const LOT_SERIAL_NUMBERS_STATUS_FIELD = 'status';
const LOT_SERIAL_NUMBERS_USAGE_FIELD = 'usage';
const LOT_SERIAL_NUMBERS_NOTES_FIELD = 'notes';
const LOT_SERIAL_NUMBERS_ACCEPTED_STATUS = 'ACCEPTED';
const LOT_SERIAL_NUMBERS_REJECTED_STATUS = 'REJECTED';

type LotSerialNumbersGroupedAction = 'added' | 'deleted' | 'accepted' | 'rejected';
type LotSerialNumbersValueField = typeof LOT_SERIAL_NUMBERS_USAGE_FIELD | typeof LOT_SERIAL_NUMBERS_NOTES_FIELD;
type LotSerialNumbersAuditValue = string | string[] | { from?: string, to?: string };

interface LotSerialNumbersAuditRow {
  key: string
  translation: string
  values?: Record<string, string>
  value: string
}

interface LotSerialNumbersFieldInfo {
  property: string
  serialNumber: string
}

interface LotSerialNumberParts {
  prefix: string
  value: number
  width: number
}

interface LotSerialNumbersAuditRowClasses {
  auditListItem: string
  auditKey: string
  auditValue: string
}

const LOT_SERIAL_NUMBERS_GROUPED_TRANSLATIONS: Record<LotSerialNumbersGroupedAction, { single: string, multiple: string }> = {
  added: {
    single: 'documentRevision.audit.lotSerialNumbers.OBJECT_NEW.single',
    multiple: 'documentRevision.audit.lotSerialNumbers.OBJECT_NEW.multiple',
  },
  deleted: {
    single: 'documentRevision.audit.lotSerialNumbers.OBJECT_DELETED.single',
    multiple: 'documentRevision.audit.lotSerialNumbers.OBJECT_DELETED.multiple',
  },
  accepted: {
    single: 'documentRevision.audit.lotSerialNumbers.status.ACCEPTED.single',
    multiple: 'documentRevision.audit.lotSerialNumbers.status.ACCEPTED.multiple',
  },
  rejected: {
    single: 'documentRevision.audit.lotSerialNumbers.status.REJECTED.single',
    multiple: 'documentRevision.audit.lotSerialNumbers.status.REJECTED.multiple',
  },
};

const getLotSerialNumberParts = (serialNumber: string): LotSerialNumberParts | null => {
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

const formatLotSerialNumber = (prefix: string, value: number, width: number): string => (
  `${prefix}${String(value).padStart(width, '0')}`
);

const expandLotSerialNumberRange = (from?: string, to?: string): string[] => {
  if (!from && !to) {
    return [];
  }

  if (!from || !to || from === to) {
    return [from ?? to].filter(Boolean) as string[];
  }

  const fromParts = getLotSerialNumberParts(from);
  const toParts = getLotSerialNumberParts(to);

  if (!fromParts || !toParts || fromParts.prefix !== toParts.prefix || fromParts.value > toParts.value) {
    return [from, to];
  }

  const width = Math.max(fromParts.width, toParts.width);
  const serialNumbers: string[] = [];
  for (let value = fromParts.value; value <= toParts.value; value++) {
    serialNumbers.push(formatLotSerialNumber(fromParts.prefix, value, width));
  }

  return serialNumbers;
};

export const parseLotSerialNumbersValue = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const getLotSerialNumbersFromValue = (value: unknown): string[] => {
  const parsedValue = parseLotSerialNumbersValue(value);

  if (!parsedValue || parsedValue === 'undefined' || parsedValue === 'null') {
    return [];
  }

  if (typeof parsedValue === 'string') {
    return [parsedValue];
  }

  if (Array.isArray(parsedValue)) {
    return parsedValue.reduce<string[]>((serialNumbers, item) => [
      ...serialNumbers,
      ...getLotSerialNumbersFromValue(item),
    ], []);
  }

  if (typeof parsedValue === 'object') {
    const { from, to, serialNumbers } = parsedValue as {
      from?: string
      to?: string
      serialNumbers?: LotSerialNumbersAuditValue[]
    };

    if (Array.isArray(serialNumbers)) {
      return serialNumbers.reduce<string[]>((items, item) => [
        ...items,
        ...getLotSerialNumbersFromValue(item),
      ], []);
    }

    return expandLotSerialNumberRange(from, to);
  }

  return [];
};

const getLotSerialNumbersFromObjectChange = (change: Audit): string[] => {
  const nextValueSerialNumbers = getLotSerialNumbersFromValue(change.nextValue);
  if (nextValueSerialNumbers.length > 0) {
    return nextValueSerialNumbers;
  }

  return getLotSerialNumbersFromValue(change.previousValue);
};

const formatLotSerialNumbers = (serialNumbers: string[]): string => {
  const serialsByPrefix = new Map<string, { width: number, values: number[] }>();
  const standaloneSerials: string[] = [];

  serialNumbers.forEach(serialNumber => {
    const normalizedSerialNumber = String(serialNumber).trim();
    if (!normalizedSerialNumber) {
      return;
    }

    const parts = getLotSerialNumberParts(normalizedSerialNumber);
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
      const formattedStart = formatLotSerialNumber(prefix, start, width);
      const formattedEnd = formatLotSerialNumber(prefix, end, width);
      formattedSerialNumbers.push(start === end ? formattedStart : `${formattedStart} – ${formattedEnd}`);
      index = endIndex + 1;
    }
  });

  return [...formattedSerialNumbers, ...standaloneSerials].join(', ');
};

const getLotSerialNumberDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return '';
  }

  return String(value);
};

const getLotSerialNumbersValueDisplayValue = (field: LotSerialNumbersValueField, value: unknown): string => {
  const displayValue = getLotSerialNumberDisplayValue(value);

  if (field !== LOT_SERIAL_NUMBERS_USAGE_FIELD) {
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

const getLotSerialNumbersFieldInfo = (field: string): LotSerialNumbersFieldInfo | null => {
  const [root, property, ...serialNumberParts] = field.split('.');

  if (root !== LOT_SERIAL_NUMBERS_FIELD || !property || serialNumberParts.length === 0) {
    return null;
  }

  return {
    property,
    serialNumber: serialNumberParts.join('.'),
  };
};

const getLotSerialNumbersStatusAction = (status: unknown): LotSerialNumbersGroupedAction | null => {
  switch (getLotSerialNumberDisplayValue(status)) {
    case LOT_SERIAL_NUMBERS_ACCEPTED_STATUS:
      return 'accepted';
    case LOT_SERIAL_NUMBERS_REJECTED_STATUS:
      return 'rejected';
    default:
      return null;
  }
};

export const buildLotSerialNumbersAuditRows = (lotSerials: Audit[]): LotSerialNumbersAuditRow[] => {
  const groupedActions = new Map<LotSerialNumbersGroupedAction, string[]>();
  const valueRows: LotSerialNumbersAuditRow[] = [];

  const addGroupedAction = (action: LotSerialNumbersGroupedAction, serialNumbers: string[]) => {
    const normalizedSerialNumbers = serialNumbers.filter(Boolean);
    if (normalizedSerialNumbers.length === 0) {
      return;
    }

    const currentSerialNumbers = groupedActions.get(action) ?? [];
    groupedActions.set(action, [...currentSerialNumbers, ...normalizedSerialNumbers]);
  };

  lotSerials.forEach((change, index) => {
    if (change.field === LOT_SERIAL_NUMBERS_FIELD) {
      if (change.type === 'OBJECT_NEW') {
        addGroupedAction('added', getLotSerialNumbersFromObjectChange(change));
      }

      if (change.type === 'OBJECT_DELETED') {
        addGroupedAction('deleted', getLotSerialNumbersFromObjectChange(change));
      }

      return;
    }

    const fieldInfo = getLotSerialNumbersFieldInfo(change.field);
    if (!fieldInfo) {
      return;
    }

    if (fieldInfo.property === LOT_SERIAL_NUMBERS_STATUS_FIELD) {
      const action = getLotSerialNumbersStatusAction(change.nextValue);
      if (action) {
        addGroupedAction(action, [fieldInfo.serialNumber]);
      }

      return;
    }

    const isValueField = fieldInfo.property === LOT_SERIAL_NUMBERS_USAGE_FIELD
      || fieldInfo.property === LOT_SERIAL_NUMBERS_NOTES_FIELD;
    const isSupportedValueChange = ['STRING_NEW', 'STRING_EDITED', 'STRING_DELETED'].includes(change.type);

    if (!isValueField || !isSupportedValueChange) {
      return;
    }

    const valueField = fieldInfo.property as LotSerialNumbersValueField;
    const value = change.type === 'STRING_DELETED' ? change.previousValue : change.nextValue;
    const displayValue = getLotSerialNumbersValueDisplayValue(valueField, value);

    valueRows.push({
      key: `${change.groupId}-${change.field}-${change.type}-${index}`,
      translation: `documentRevision.audit.lotSerialNumbers.${valueField}.${change.type}`,
      values: { serialNumber: fieldInfo.serialNumber },
      value: displayValue,
    });
  });

  const groupedRows = Array.from(groupedActions.entries()).map(([action, serialNumbers]) => {
    const uniqueSerialNumbers = Array.from(new Set(serialNumbers.filter(Boolean)));
    const translations = LOT_SERIAL_NUMBERS_GROUPED_TRANSLATIONS[action];

    return {
      key: `lot-serial-${action}-${uniqueSerialNumbers.join('-')}`,
      translation: uniqueSerialNumbers.length === 1 ? translations.single : translations.multiple,
      value: formatLotSerialNumbers(uniqueSerialNumbers),
    };
  });

  return [...groupedRows, ...valueRows];
};

export const renderLotSerialNumbersAuditRow = (
  row: LotSerialNumbersAuditRow,
  groupKey: number | undefined,
  key: number,
  classes: LotSerialNumbersAuditRowClasses,
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
