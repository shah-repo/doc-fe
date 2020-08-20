import csv from "csvtojson";
import fs from "fs";

const INPUT =  "list.csv";
const OUTPUT = "cache/generated.json";

const REQ_HEADER_TEXT = "REQ #";
csv()
  .fromFile([__dirname, INPUT].join("/"))
  .then((jsonObj) => {
    const result = {};
    jsonObj.forEach((item) => {
      if (result[item[REQ_HEADER_TEXT]]) {
        throw new Error("Found duplicate: " + item[REQ_HEADER_TEXT]);
      }
      result[item[REQ_HEADER_TEXT]] = item;
    });
    fs.writeFileSync(
      [__dirname, "..",OUTPUT].join("/"),
      JSON.stringify(result, null, 2),
      { encoding: "UTF-8" }
    );
  });
