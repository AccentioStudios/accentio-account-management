import LogtoClient from "@logto/node";

export default defineEventHandler(async (event) => {
  const logto = event.context.logtoClient as LogtoClient | undefined;

  if (!logto) {
    throw new Error("Logto client not found in event context");
  }
  try {
    console.log("callback api");

    const url = getRequestURL(event);
    const queryParams = new URLSearchParams(url.search || "");
    console.log("query", queryParams);

    await logto?.handleSignInCallback(url.href);
    await sendRedirect(event, "/?logged=1");
    return;
  } catch (e) {
    console.error(e);
    await sendRedirect(event, "/sign-out?error=1");
  }
});
