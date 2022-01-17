/* eslint-disable @typescript-eslint/camelcase */
const unzipper = require("unzipper");
const fs = require("fs");
const unzip = ({ path, file }) => fs.createReadStream(path + "/" + file)
  .pipe(unzipper.Extract({ path: path + "/" + file.replace(".zip", "") }));

module.exports = {
  unzip,
};
