/* eslint-disable @typescript-eslint/camelcase */
import { integer } from "aws-sdk/clients/cloudfront";
import * as gmail from "gmail-tester";
import * as path from "path";

export interface IMAPEmail{
  body: {
    html: string;
    text: string;
  };
  date: string;
  from: string;
  receiver: string;
  subject: string;
}

export interface GmailTesterOptions {
  from?: string;
  to?: string;
  subject?: string;
  include_body?: boolean;
  include_attachments?: boolean;
  before?: Date;
  after?: Date;
  label?: string;
  wait_time_sec?: integer;
  max_wait_time_sec?: integer;
}

export async function getEmails(email: string, options: GmailTesterOptions = {}) {
  const settings: gmail.CheckInboxOptions = {
    label: "INBOX",
    to: email,
    wait_time_sec: 5,
    max_wait_time_sec: 60,
    include_body: true,
    after: new Date(Date.now() - 25 * 1000),
    ...options,
  };

  const messages = await gmail.check_inbox(
    path.resolve(__dirname, "../../../credentials/credentials.json"),
    path.resolve(__dirname, "../../../credentials/gmail_token.json"),
    settings
  );

  return messages;
}

