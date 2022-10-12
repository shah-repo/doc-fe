import { downloadFile } from "cypress-downloadfile/lib/addPlugin";
import { rename, rmdirSync, writeFileSync } from "fs";
import path from "path";
import { getEmails, GmailTesterOptions } from "../support/commands/imap/imap";
import { pdfparser } from "../support/commands/pdfparser/pdfparser";
import { unzip } from "../support/commands/unzip/unzip";
import { parseXlsx } from "../support/commands/xlsx/xlsx";
import { deleteJunitTestReports, deleteMochaTestReports } from "../support/deleteReports/deleteReranReports";
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
let shouldSkip = false;
export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    test: () => 1,
    resetShouldSkipFlag() {
      shouldSkip = false;
      return null;
    },
    shouldSkip(value) {
      if (value != null) { shouldSkip = value; }
      return shouldSkip;
    },
    gmailGetMails(params: {userEmail: string; options: GmailTesterOptions}) {
      return getEmails(params.userEmail, params.options);
    },
    downloadFile,
    deleteScreenshotsFolder(params: {CONFIG: any; specFileName: string}) {
      const { CONFIG, specFileName } = params;
      rmdirSync(`${CONFIG.SCREENSHOTS_DIR}/${specFileName}`, { recursive: true });
      return null;
    },
    deleteExistingReports(params: {CONFIG: any; specFileName: string}) {
      const { CONFIG, specFileName } = params;
      deleteMochaTestReports({ CONFIG, specFileName });
      deleteJunitTestReports({ CONFIG, specFileName });
      return null;
    },
    generateEnvInfo(params: {CONFIG: any; envInfo: string}) {
      writeFileSync(path.resolve(params.CONFIG.JSON_REPORTS_FOLDER, "envInfo.json"), JSON.stringify(params.envInfo));
      return null;
    },
  });

  on("task", {
    unzipFile: unzip,
    parseXlsx,
    pdfparseFile: pdfparser,
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

  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.isHeadless) {
      const width = 1280;
      const height = 960;

      if ((browser.name === "chrome" || browser.name === "chromium")) {
        launchOptions.args.push(`--window-size=${width},${height}`);
        launchOptions.args.push("--force-device-scale-factor=1");
      }

      if (browser.name === "electron") {
        launchOptions.preferences.width = width;
        launchOptions.preferences.height = height;
      }

      if (browser.name === "firefox") {
        launchOptions.args.push(`--width=${width}`);
        launchOptions.args.push(`--height=${height}`);
      }
    }
    launchOptions.args = launchOptions.args.filter((x) => x !== "--disable-dev-shm-usage");
    return launchOptions;
  });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("cypress-grep/src/plugin")(config);
};

