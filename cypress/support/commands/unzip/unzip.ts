/* eslint-disable @typescript-eslint/camelcase */

import { createReadStream } from "fs";
import path from "path";
import { Extract } from "unzipper";

export { unzip };

const unzip = ({ directory, fileName }) => createReadStream(path.join(directory + "/" + fileName))
  .pipe(Extract({ path: path.join(directory, fileName.replace(".zip", "")) }));
