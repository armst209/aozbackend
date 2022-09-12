export default {
   port: process.env.PORT || 5000,
   dbUri: process.env.MONGO_URI,
   saltWorkFactor: 15, //number of rounds to salt password
};
