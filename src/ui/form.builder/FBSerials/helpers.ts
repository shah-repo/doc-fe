import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { HAS_SERIALIZATION_VALUES, PART_SERIALIZATION_KEY, PART_SERIALIZATION_TYPE_KEY, SERIALIZATION_MANUAL_VALUES, SERIALIZATION_SYSTEM_GENERATED_VALUES } from './consts';

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
