import LogtoClient from "@logto/node";
import { M2MClient } from "../middleware/1.logto.global";

export default defineEventHandler(async (event) => {
  const logto = event.context.logtoClient as LogtoClient | undefined;
  const user = event.context.logtoUser;
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
    const validateText =
      body.verificationText == user.email ||
      body.verificationText == user.username;

    if (!validateText) {
      setResponseStatus(event, 400);
      return {
        status: 400,
        body: "Invalid verification text",
      };
    }

    const deleteUser = await m2mLogto?.deleteUser(user.sub);
    if (deleteUser) {
      return {
        status: 200,
        body: "User deleted",
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
