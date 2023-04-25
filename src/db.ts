import Dexie from "dexie";

const DATABASE_NAME = "Enlil";
export const PO_TABLE_NAME = "po";
export const db = new Dexie(DATABASE_NAME);

db.version(1).stores({
  po: "description, formInput",
});
