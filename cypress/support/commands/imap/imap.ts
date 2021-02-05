/* eslint-disable @typescript-eslint/camelcase */
import * as gmail from "gmail-tester";
import * as path from "path";

export async function getEmail(email) {
  let returnValue = null;
  const dateOffset = (5 * 60 * 1000);
  const myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  const mail = await gmail.check_inbox(
    path.resolve(__dirname, "../../../credentials/credentials.json"),
    path.resolve(__dirname, "../../../credentials/gmail_token.json"),
    {
      to: email,
      wait_time_sec: 5,
      max_wait_time_sec: 20,
      include_body: true,
      after: myDate,
    }
  );
  if (mail) {
    returnValue = mail[0].body.html;
  }

  return returnValue;
}

export async function getEmails(email, options?) {
  let mails = [];
  const dateOffset = (15 * 1000);
  const myDate = new Date();
  myDate.setTime(myDate.getTime() - dateOffset);
  const messages = await gmail.check_inbox(
    path.resolve(__dirname, "../../../credentials/credentials.json"),
    path.resolve(__dirname, "../../../credentials/gmail_token.json"),
    {
      to: email,
      wait_time_sec: 5,
      max_wait_time_sec: 20,
      include_body: true,
      after: myDate,
    }
  );
  if (messages) {
    mails = messages;
  }

  return mails;
}

