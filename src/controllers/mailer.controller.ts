import { Response, Request } from "express";
import logger from "../utils/logger";
import MailChimp from "@mailchimp/mailchimp_marketing";
import MailChimpTransactional from "@mailchimp/mailchimp_transactional";
import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import { CreateUserInput } from "../schema/user.schema";

//MAILCHIMP
const runMCCredentials = async () => {
  try {
    const mcTx = MailChimpTransactional(String(process.env.MC_TRANS_API_KEY));
    return mcTx;
  } catch (error) {
    logger.error(error);
  }
};

export const runMCPingTest = async (res: Response) => {
  try {
    const mcTx = await runMCCredentials();
    const callPing = async () => {
      const response = mcTx?.users.ping();
      return response;
    };
    const pingMessage = await callPing();
    return pingMessage;
  } catch (error: any) {
    logger.error(error.err.message);
    res.status(500).send(error.err);
  }
};

export const runMailChimpHealthCheck = async (res: Response) => {
  try {
    const response = await runMCPingTest(res);
    logger.info(response);
    res.status(200).send(response);
  } catch (error: any) {
    logger.error(error.err.message);
    res.status(500).send(error.err);
  }
};

export const getAllMailChimpLists = async (res: Response) => {
  try {
    runMCCredentials();
    const response = await MailChimp.lists.getAllLists();
    logger.info(response);
    res.status(200).send(response);
  } catch (error) {
    logger.error(error);
    res.status(200).send(error);
  }
};

export const getMyMailChimpList = async (res: Response) => {
  try {
    runMCCredentials();
    const response = await MailChimp.lists.getList("e73d7ac52c");
    logger.info(response);
    res.status(200).send(response);
  } catch (error) {
    logger.error(error);
    res.status(400).send(error);
  }
};

export const subscribeUserToMClist = async (
  res: Response,
  user: CreateUserInput
) => {
  const mcTx = await runMCCredentials();
  try {
    const { email, username } = user;

    const sendRegistrationEmail = async () => {
      const response = await mcTx?.messages.sendTemplate({
        template_name: "welcome_TTT",
        template_content: [],
        message: {
          from_email: "commandTTT@gmail.com",
          from_name: "Captain Wes Murphy",
          subject: "Welcome To the Titans!",
          to: [{ email, name: username }],
        },
      });
    };

    sendRegistrationEmail();
  } catch (error: any) {
    logger.error(error);
    res.status(error).send(error);
  }
};

//NODEMAILER

// const createTestCredentials = async () => {
//   const credentials = await nodemailer.createTestAccount();
//   console.log({ credentials });
// };

// createTestCredentials();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secureConnection: boolean;
}>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
  tls: {
    ciphers: "SSLv3",
  },
});
const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      logger.error(error, "Error sending email");
      return;
    }
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
