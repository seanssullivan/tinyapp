// services.js

const generateRandomString = function() {
  const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * alphaChars.length);
    randomString += alphaChars[index]
  }
  return randomString;
};

module.exports = {
  generateRandomString
};
