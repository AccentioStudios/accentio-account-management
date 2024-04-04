import { Issuer } from "openid-client";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const appId = runtimeConfig.oidc.appId;
  const appSecret = runtimeConfig.oidc.appSecret;
  const cookieEncryptionKey = runtimeConfig.oidc.cookieEncryptionKey;
  const endpoint = runtimeConfig.oidc.endpoint;
  const discoverUrl = `${endpoint}/oidc/.well-known/openid-configuration`;
  const oidc = await Issuer.discover(discoverUrl);
  const tokenUrl = oidc.metadata.token_endpoint ?? "";
  const query = await getQuery(event);
  const code = query.code?.toString() || "";
  const state = query.state?.toString() || "";
  try {
    // fetch token
    const fetching = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: runtimeConfig.oidc.postCallbackRedirectUri,
      }),
    });

    if (!fetching.ok) {
      setResponseStatus(event, 401);
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const tokenSet = await fetching.json();
    const jsonStringCookie = JSON.stringify(tokenSet);

    const cookie = encryptCookie(jsonStringCookie, cookieEncryptionKey);
    setCookie(event, "accentio-auth.session", cookie);
    sendRedirect(event, "/", 200);
  } catch (error) {
    console.error("authorization code flow", error);
    setResponseStatus(event, 401);
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
});

function encryptCookie(cookie: any, key: string) {
  const bufferCookie = Buffer.from(cookie);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encryptedCookie = Buffer.concat([
    Buffer.from("v10"), // prefix
    iv, // 12 bytes nonce
    cipher.update(bufferCookie), // cookie data
    cipher.final(),
    cipher.getAuthTag(), // 16 bytes authentication
  ]);
  // convert buffer to base64
  return encryptedCookie.toString("base64");
}
