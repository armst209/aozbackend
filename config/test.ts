export default {
  environment: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  dbUri: process.env.MONGO_URI,
  saltWorkFactor: Number(process.env.SALT_ROUNDS), //number of rounds to salt password
  jwtRefreshTokenExpireTime: process.env.JWT_REFRESH_EXPIRE,
  jwtAccessTokenExpireTime: process.env.JWT_ACCESS_EXPIRE,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  smtp: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: process.env.SMTP_SECURE,
  },
};
