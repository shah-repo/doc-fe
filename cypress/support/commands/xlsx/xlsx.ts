
import fs from "fs";
import XLSX from "xlsx";


export const parseXlsx = ({ file, sheet }) => {
  const buf = fs.readFileSync(file);
  const workbook = XLSX.read(buf, { type: "buffer" });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  return rows;
};
