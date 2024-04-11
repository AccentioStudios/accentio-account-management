import LogtoClient, { CookieStorage } from "@logto/node";
import {
  defineEventHandler,
  getRequestURL,
  getCookie,
  setCookie,
  sendRedirect,
} from "h3";

import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const logtoConfig = config.oidc;
  const {
    cookieName,
    cookieEncryptionKey,
    fetchUserInfo,
    pathnames,
    postCallbackRedirectUri,
    postLogoutRedirectUri,
    ...clientConfig
  } = logtoConfig;

  const url = getRequestURL(event);
  const storage = new CookieStorage(
    {
      cookieKey: cookieName,
      encryptionKey: cookieEncryptionKey,
      getCookie: (name) => getCookie(event, name),
      setCookie: (name, value, options) => {
        setCookie(event, name, value, options);
      },
    },
    { headers: event.headers, url: url.href }
  );

  await storage.init();

  const logto = new LogtoClient(clientConfig, {
    navigate: async (url) => {
      await sendRedirect(event, url, 302);
    },
    storage,
  });

  const isAuthenticated = await logto?.isAuthenticated();
  if (!isAuthenticated) {
    // verify if the request is for an API endpoint "/api"
    if (url.pathname.startsWith("/api")) {
      setResponseStatus(event, 401);
      return {
        status: 401,
        body: "Unauthorized",
      };
    }

    sendRedirect(event, pathnames.signIn);
    // await logto.signIn(new URL(pathnames.callback, url).href);
  }
});
