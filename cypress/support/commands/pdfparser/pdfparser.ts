const fs = require("fs");
const pdf = require("pdf-parse");

const pdfparser = ({ path, file }) => pdf(fs.readFileSync(path + "/" + file));
module.exports = {
  pdfparser,
};
