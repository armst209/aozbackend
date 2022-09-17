export default {
  port: process.env.PORT || 5000,
  dbUri: process.env.MONGO_URI,
  saltWorkFactor: Number(process.env.SALT_ROUNDS), //number of rounds to salt password
  smtp: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
  },
};
