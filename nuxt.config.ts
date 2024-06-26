// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: {
      name: "page",
    },
  },

  // routeRules: {
  //   "/**": { static: true, cache: false },
  //   // disable vercel cache for api routes
  //   "/api/**": { static: false },

  //   // disable vercel cache for auth routes
  //   "/sign-in": { static: false },
  //   "/sign-out": { static: false },

  //   // // disable vercel cache for auth routes
  //   // "/api/verifyPassword": { static: false },
  //   // "/api/user": { static: false },

  //   // disable cache for Vercel
  //   "/_nuxt/**": { static: false, cache: false },
  //   "/_content/**": { static: false, cache: false },
  //   "/_loading/**": { static: false, cache: false },
  //   "/_middleware/**": { static: false, cache: false },
  // },
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
      fetchUserInfo: true,
      redirectUri: process.env.AUTH_REDIRECT_URI,
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
