/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */

import "moment-timezone";
import moment from "moment-timezone";
import path from "path";
import { CONFIG } from "../../config";

/* eslint-disable @typescript-eslint/no-namespace */
export { };

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      exportVerifyEmail(params: { status: string; filename: string; pdfStatus?: string; type?: string }): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add("exportVerifyEmail", (params: { status: string; filename: string; pdfStatus?: string; type?: string}) => {
  let recordId;
  let dateAfterEmailShouldArrive;
  let downloadUrl;
  let fileId;
  let downloadFile;
  const dateOffset = (5 * 1000);

  cy.get("#HeaderInfo-status").should("have.text", params.status);
  cy.get("#HeaderInfo-docId").then(($x) => {
    recordId = $x.text();
    cy.sendToEmail();
    cy.checkToastMessageContains({
      message: "File will be sent to your email shortly.",
    });
    dateAfterEmailShouldArrive = new Date(new Date().getTime() - dateOffset);

    const getEmailSetting =  {
      to: CONFIG.TEST_EMAIL,
      // eslint-disable-next-line @typescript-eslint/camelcase
      wait_time_sec: 5,
      // eslint-disable-next-line @typescript-eslint/camelcase
      max_wait_time_sec: 50,
      // eslint-disable-next-line @typescript-eslint/camelcase
      include_body: true,
      after: dateAfterEmailShouldArrive,
      subject: `Export for ${params.type ? params.type : "document"} ${recordId}`,
    };

    cy.imapGetMails({ userEmail: CONFIG.TEST_EMAIL, options: getEmailSetting }).should((emails) => {
      if (emails) {
        expect(emails[0].body.text).match(/Download URL:\s+(.*\/exported_file_download\?fileId=.*)\s+/);
        downloadUrl = emails[0].body.text.match(/Download URL:\s+(.*)\s+/)[1];
      }
      else {
        assert.fail("No email found");
      }
    }).then((response) => {
      expect(downloadUrl).contains("exported_file_download");
      fileId = downloadUrl.match(/exported_file_download\?fileId=(.*)/)[1];

      cy.request(`${CONFIG.BE_URL}/api/v1/short_url/${fileId}`).then((res) => {
        if (res.body !== "") {
          downloadUrl = res.body.url;
          const filetime = moment().tz("America/Los_Angeles").format("_YYYY-MMM-DD_HH-MM-SS");
          downloadFile  =  `${recordId}${filetime}_closed.zip`;
          cy.downloadFile({
            url: downloadUrl,
            directory: CONFIG.DOWNLOADS_DIR,
            fileName: downloadFile,
          });
        }
      }).then((response) => {

        cy.unzipFile({
          directory: CONFIG.DOWNLOADS_DIR,
          fileName: downloadFile,
        });

        cy.pdfparseFile({
          directory: path.join(CONFIG.DOWNLOADS_DIR, downloadFile.replace(".zip", "")),
          fileName: `${recordId.replace(" #", "-")}${params.filename}.pdf`,
        }).then((cdata) => {
          expect(cdata.text).to.have.string(params.pdfStatus ? params.pdfStatus : params.status);
          if (params.type !== "approval request") {
            expect(cdata.text).match(/Attachments\nNone/);
          }
        });
      });
    });
  });

});
