import { rename } from "fs";
import { allowedCharacters } from "../utils/context/constants";

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    test: () => 1,
  });
  on("after:screenshot", (details) => {

    const path = details.path.split("/").reverse();
    const newName = (path[0]).replace(allowedCharacters, "").replace(/[ ]+/g, " ");
    path[0] = newName;
    const newPath = path.reverse().join("/");
    return new Promise((resolve, reject) => {
      rename(details.path, newPath, (err) => {
        if (err) { return reject(err); }

        resolve({ path: newPath });
      });
    });
  });
};

