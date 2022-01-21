/* eslint-disable @typescript-eslint/camelcase */

import { createReadStream } from "fs";
import { Extract } from "unzipper";

export { unzip };

const unzip = ({ path, file }) => createReadStream(path + "/" + file)
  .pipe(Extract({ path: path + "/" + file.replace(".zip", "") }));
