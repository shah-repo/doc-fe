import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { HAS_SERIALIZATION_VALUES, PART_SERIALIZATION_KEY, PART_SERIALIZATION_TYPE_KEY, SERIALIZATION_MANUAL_VALUES, SERIALIZATION_SYSTEM_GENERATED_VALUES } from './consts';

export const normalizeSerial = (serial: string): string => serial.trim().toLowerCase();

export const sanitizeSerials = (serials: string[]): string[] => serials.map(serial => serial.trim()).filter(Boolean);

export const splitSerials = (text: string): string[] => sanitizeSerials(text.split(/[,;\n]/));

export const getRepeatedSerialKeys = (serials: string[]): Set<string> => {
  const counts = serials.reduce<Record<string, number>>((acc, serial) => {
    const key = normalizeSerial(serial);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return new Set(Object.keys(counts).filter(key => counts[key] > 1));
};

const isSerializationManual = (serializationType: string): boolean => {
  return SERIALIZATION_MANUAL_VALUES.includes(serializationType);
};

const isSerializationSystemGenerated = (serializationType: string): boolean => {
  return SERIALIZATION_SYSTEM_GENERATED_VALUES.includes(serializationType);
};

export const isPartSerializationManual = (part?: DocumentRevision): boolean => {
  const serializationType = String(part?.formInput?.[PART_SERIALIZATION_TYPE_KEY]);
  return isSerializationManual(serializationType);
};

export const isPartSerializationSystemGenerated = (part?: DocumentRevision): boolean => {
  const serializationType = String(part?.formInput?.[PART_SERIALIZATION_TYPE_KEY]);
  return isSerializationSystemGenerated(serializationType);
};

export const isPartHasSerialization = (part?: DocumentRevision): boolean => {
  const hasSerialization = String(part?.formInput?.[PART_SERIALIZATION_KEY]);
  return HAS_SERIALIZATION_VALUES.includes(hasSerialization);
};
