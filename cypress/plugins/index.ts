import { rename } from "fs";

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
const allowedCharacters = /[^a-zA-Z0-9()\- ']/;

export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    test: () => 1,
  });
  on('after:screenshot', (details) => {

    const path = details.path.split("/").reverse();
    console.log({pathBefore: details.path})
    const newName = (path[0]).replace(/[^a-zA-Z0-9()\-. ']/g, "")
    path[0] = newName;
    const newPath = path.reverse().join("/")
    console.log({details, newPath, path, newName}) // print all details to terminal
    console.log({pathAfter: newPath})

    return new Promise((resolve, reject) => {
      // fs.rename moves the file to the existing directory 'new/path/to'
      // and renames the image to 'screenshot.png'
      rename(details.path, newPath, (err) => {
        if (err) return reject(err)

        console.log({pathChanged: newPath})
        // because we renamed and moved the image, resolve with the new path
        // so it is accurate in the test results
        resolve({ path: newPath })
      })
    })
  })
};

