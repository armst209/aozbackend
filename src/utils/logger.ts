import pino from "pino"; //logger

const logger = pino({
   transport: {
      target: "pino-pretty",
      options: {
         errorLikeObjectKeys: ["err", "error"],

         translateTime: "mm/dd/yyyy, h:mm:ss",
      },
   },
});

export default logger;
