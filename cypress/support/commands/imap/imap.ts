import * as imaps from "imap-simple";

const config = {
  imap: {
    user: "test@gmail.com",
    password: "test",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 3000,
  },
};

export function getEmail() {
  return imaps.connect(config).then(function(connection) {

    return connection.openBox("INBOX").then(function() {
      const searchCriteria = ["FLAGGED", ["TO", "enlil.testmail+cy2@gmail.com"]];

      const fetchOptions = {
        bodies: ["HEADER", "TEXT"],
        markSeen: false,
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
