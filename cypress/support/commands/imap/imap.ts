import * as imaps from "imap-simple";

const config = {
  imap: {
    user: process.env.CYPRESS_TEST_EMAIL,
    password: process.env.CYPRESS_TEST_EMAIL_PASSWORD,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
  },
};

export function getEmail(email) {
  return imaps.connect(config).then(function(connection) {

    return connection.openBox("INBOX").then(function() {
      const delay = 120 * 1000;
      let emailsSince = new Date();
      emailsSince.setTime(Date.now() - delay);
      emailsSince = emailsSince.toUTCString();
      const searchCriteria = ["ALL", ["TO", email], ["SENTSINCE", emailsSince]];

      const fetchOptions = {
        bodies: ["HEADER", "TEXT"],
        markSeen: true,
      };

      return connection.search(searchCriteria, fetchOptions).then(function(results) {
        const subjects = results.map(function(res) {
          return res.parts.filter(function(part) {
            return part.which === "HEADER";
          })[0].body;
        });
        return subjects;
      });
    });
  }).then((result) => result);
}
