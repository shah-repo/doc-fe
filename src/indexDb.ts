import Dexie from 'dexie';
import { DocumentRevision } from './state/ducks/documentRevisions/types';

const databaseName = 'Enlil';
const poTableName = 'po';

const db = new Dexie(databaseName);

db.version(1).stores({
  po: 'description, formInput, attachments',
});

export const getPOIndexDbInstance = () => db.table(poTableName);

export const getPOSavedInfo: () => Promise<DocumentRevision[]> = async () => await getPOIndexDbInstance().toArray();

export const clearPOSavedInfo: () => Promise<void> = async () => await getPOIndexDbInstance().clear();
