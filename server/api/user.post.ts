import LogtoClient from "@logto/node";
import { useLogtoClient } from "~/composables/use-logto-client";
import useLogtoUser from "~/composables/use-logto-user";
import { M2MClient } from "../middleware/1.logto.global";
import { User } from "~/utils/constants";

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
    const changedUser = {
      id: user?.sub,
      primaryEmail: body.primaryEmail.toLowerCase(),
      name: body.name,
      username: body.username,
    } as User;

    const update = await m2mLogto?.updateUser(changedUser);
    if (update) {
      return {
        status: 200,
        body: update,
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
