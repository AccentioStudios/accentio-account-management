import LogtoClient from "@logto/node";
import { M2MClient } from "../middleware/1.logto.global";

export default defineEventHandler(async (event) => {
  const user = event.context.logtoUser;
  const logto = event.context.logtoClient as LogtoClient | undefined;
  const m2mLogto = event.context.m2mLogtoClient as M2MClient | undefined;

  const body = await readBody(event);

  if (!user) {
    setResponseStatus(event, 401);
    return {
      status: 401,
      body: "Unauthorized",
    };
  }

  if (await logto?.isAuthenticated()) {
    const verification = await m2mLogto?.verifyPassword(
      user.sub,
      body.password
    );
    if (
      verification != undefined &&
      verification !== null &&
      verification === true
    ) {
      // Set cookie to expiration on 30 minutes called "accentio-auth.passwordVerified"
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 30);
      setCookie(
        event,
        "accentio-auth.passwordVerified",
        Date.parse(expiration.toISOString()).toString(),
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/",
        }
      );

      setResponseStatus(event, 200);
      return {
        status: 200,
        body: {
          valid: true,
        },
      };
    } else {
      setResponseStatus(event, 401);
      return {
        status: 401,
        body: {
          valid: false,
        },
      };
    }
  }
  setResponseStatus(event, 401);
  return {
    status: 401,
    body: "Unauthorized",
  };
});
