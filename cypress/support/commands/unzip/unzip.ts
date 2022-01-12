/* eslint-disable @typescript-eslint/camelcase */

const decompress = require("decompress");

const unzip = ({ path, file }) => decompress(path + "/" + file, path + "/" + file.replace(".zip", ""));

module.exports = {
  unzip,
};
