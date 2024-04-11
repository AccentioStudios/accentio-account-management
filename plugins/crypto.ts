export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    const crypto = require("crypto");
    global.crypto = crypto;
  }
});
