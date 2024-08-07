import * as Yup from 'yup';
import { SystemHeaderEntity } from '../../../../state/ducks/bulkImport/types';

// Function to generate validation schema
export const createValidationSchema = (fields: SystemHeaderEntity[]) => {
  return Yup.object().shape(
    fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.id] = Yup.string().required('common.required');
      }
      return acc;
    }, {}),
  );
};

const docIdRegexPattern = (docType: string) => new RegExp(`^(${docType}\\d{3,8})-?\\d{0,5}?$`);

export const getBaseDocId = (docID: string, docTypes: string[]): string => {
  // const match = str.match(/^([A-Za-z]{1,5}-?\d{0,7})-?\d{0,4}?$/);
  const docTypeId = docTypes.filter((d) => docID.startsWith(d));
  if (!docTypeId.length) return '';
  if (docTypeId.length === 1) {
    const match = docIdRegexPattern(docTypeId[0]).exec(docID);
    return match?.[match.length - 1] || '';
  } else {
    let matched = '';
    for (const docType of docTypeId) {
      const match = docIdRegexPattern(docType).exec(docID);
      if (match && match[match.length - 1] && match[match.length - 1].length > matched.length) {
        matched = match[match.length - 1];
      }
    }
    return matched;
  }
};

export const isValidBaseDocIdPart = (docId: string, baseDocId: string): boolean => {
  const partNumber = docId?.replace(`${baseDocId}-`, '');
  // at the end if docId is replaced with baseDocId the last values should be numeric. if they are numeric should be valid
  const isNumeric = /^\d+$/.test(partNumber);
  return partNumber === baseDocId || partNumber === '00' || isNumeric;
};
