import * as imaps from "imap-simple";

const config = {
  imap: {
    user: "enlil.testmail@gmail.com",
    password: "shifamed123",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 15 * 1000,
  },
};

export function getEmail(email) {
  return imaps.connect(config).then((connection) => connection.openBox("INBOX").then(() => {
    const emailsSince = new Date();
    emailsSince.setTime(Date.now());
    const searchCriteria = ["ALL", ["TO", email], ["SENTSINCE", emailsSince.toISOString()]];

    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: true,
    };

    return connection.search(searchCriteria, fetchOptions).then((results) => {
      const emailText = results.map((res) => res.parts.filter((part) => part.which === "TEXT")[0].body);
      return emailText[emailText.length - 1];
    });
  })).then((result) => result);
}

