import type { Pinia } from "pinia";

export default defineNuxtPlugin(async (nuxtApp) => {
  const passwordVerified = cookieFromRequestHeaders(
    "accentio-auth.passwordVerified"
  );

  if (passwordVerified) {
    const auth = useAuthStore(nuxtApp.$pinia as Pinia);
    await auth.storePasswordVerified(parseInt(passwordVerified));
  }
});

function cookieFromRequestHeaders(key: string) {
  const headers = useRequestHeaders(["cookie"]);
  if (headers === undefined) return "";
  if (headers.cookie === undefined) return "";

  if ("cookie" in headers) {
    const cookie = headers.cookie
      .split(";")
      .find((c) => c.trim().startsWith(`${key}=`));
    if (cookie) {
      return cookie.split("=")[1];
    }
  }
  return "";
}
