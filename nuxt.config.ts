// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: "page",
    },
  },
  routeRules: {
    "/**": { static: true, cache: false },
    "/api/**": { static: false, cache: false },
  },
  nitro: {
    noExternals: false,
    preset: "vercel",
  },
  modules: [
    "nuxt-headlessui",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "nuxt-gravatar",
  ],
  googleFonts: {
    families: {
      Inter: "200..700",
      Montserrat: "200..700",
    },
  },
  runtimeConfig: {
    oidc: {
      pathnames: {
        signIn: "/sign-in",
        signOut: "/sign-out",
        callback: "/callback",
      },
      cookieName: process.env.AUTH_COOKIE_NAME,
      appId: process.env.AUTH_APP_ID,
      appSecret: process.env.AUTH_APP_SECRET,
      cookieEncryptionKey: process.env.AUTH_COOKIE_ENCRYPTION_KEY,
      endpoint: process.env.AUTH_ENDPOINT,
      postLogoutRedirectUri: process.env.AUTH_POST_LOGOUT_REDIRECT_URI,
      postCallbackRedirectUri: process.env.AUTH_POST_CALLBACK_REDIRECT_URI,
      callbackRedirectUri: process.env.AUTH_CALLBACK_REDIRECT_URI,
      fetchUserInfo: true,
      scopes: process.env.AUTH_SCOPES?.split(" ") || [
        "openid",
        "profile",
        "email",
      ],
      m2m: {
        appId: process.env.M2M_IDENTITY_PROVIDER_APP_ID,
        endpoint: process.env.M2M_IDENTITY_PROVIDER_ENDPOINT,
        appSecret: process.env.M2M_IDENTITY_PROVIDER_APP_SECRET,
        apiResource: process.env.M2M_IDENTITY_PROVIDER_API_RESOURCE,
        scope: process.env.M2M_IDENTITY_PROVIDER_API_SCOPE,
      },
    },
  },
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
