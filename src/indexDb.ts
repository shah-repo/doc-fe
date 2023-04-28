import Dexie from "dexie";

const databaseName = "Enlil";
const poTableName = "po";

const db = new Dexie(databaseName);

db.version(1).stores({
  po: "description, formInput",
});

export const getPOIndexDbInstance = () => db.table(poTableName);
