import generateApiKey from "generate-api-key";

const getApiKey = () => {
  const newApiKey = generateApiKey();
  console.log(newApiKey);
};

const verifyApiKey = (userApiKey: string) => {};
