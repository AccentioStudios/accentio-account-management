export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("verifyPassword");
  const passwordVerified = useAuthStore().passwordVerified;
  if (to.path === "/verify-password") {
    return;
  }

  if (!passwordVerified) {
    return navigateTo({
      path: "/verify-password",
      query: { to: to.fullPath },
    });
  }

  const cookieExpirationDate = new Date(passwordVerified!);
  if (!cookieExpirationDate) {
    return navigateTo({
      path: "/verify-password",
      query: { to: to.fullPath },
    });
  }
  const isExpired = cookieExpirationDate < new Date();
  //   console.log("isExpired", isExpired);
  if (isExpired === false) {
    console.log("Continue...");
    return;
  } else {
    console.log("Need validate password...");
    return navigateTo({
      path: "/verify-password",
      query: { to: to.fullPath },
    });
  }
});
