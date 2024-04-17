import LogtoClient from "@logto/node";

export default defineEventHandler(async (event) => {
  console.log("Callback event handler");
  const logto = event.context.logtoClient as LogtoClient | undefined;

  if (!logto) {
    throw new Error("Logto client not found in event context");
  }
  try {
    const url = getRequestURL(event);
    const queryParams = new URLSearchParams(url.search || "");
    console.log("callback full url ", url.href);
    console.log("query callback url", queryParams);

    const wtf = await logto?.handleSignInCallback(url.href);
    console.log("wtf", wtf);
    await sendRedirect(event, "https://accounts.accentiostudios.com/?logged=1");
    return;
  } catch (e) {
    console.error(e);
    console.log("Error callback");
    console.info("Error in callback", e);
    await sendRedirect(event, "/error?error=1");
  }
});
