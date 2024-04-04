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
    const update = await m2mLogto?.changePassword(user.sub, body.password);
    if (update) {
      return {
        status: 200,
        body: "Password updated",
      };
    }
    setResponseStatus(event, 500);
    return {
      status: 500,
      body: "Internal Server Error",
    };
  } else {
    setResponseStatus(event, 401);
    return {
      status: 401,
      body: "Unauthorized",
    };
  }
});
