import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import logger from "./logger";

// const createTestCredentials = async () => {
//    const credentials = await nodemailer.createTestAccount();
//    console.log({ credentials });
// };

// createTestCredentials();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

export const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (error, info) => {
    if (error) {
      logger.error(error, "Error sending email");

      return;
    }
    logger.info("Email has been successfully sent");
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};
