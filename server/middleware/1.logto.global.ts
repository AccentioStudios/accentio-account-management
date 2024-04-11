import LogtoClient, { CookieStorage } from "@logto/node";
import { Issuer, IssuerMetadata } from "openid-client";
import {
  defineEventHandler,
  getRequestURL,
  getCookie,
  setCookie,
  sendRedirect,
} from "h3";

import { useRuntimeConfig } from "#imports";
import { User } from "~/utils/constants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  // eslint-disable-next-line no-restricted-syntax -- Optional fields are not inferred
  const logtoConfig = config.oidc;
  const {
    cookieName,
    cookieEncryptionKey,
    fetchUserInfo,
    pathnames,
    postCallbackRedirectUri,
    postLogoutRedirectUri,
    ...clientConfig
  } = logtoConfig;

  const url = getRequestURL(event);
  const storage = new CookieStorage(
    {
      cookieKey: cookieName,
      encryptionKey: cookieEncryptionKey,
      getCookie: (name) => getCookie(event, name),
      setCookie: (name, value, options) => {
        setCookie(event, name, value, options);
      },
    },
    { headers: event.headers, url: url.href }
  );

  await storage.init();

  const logto = new LogtoClient(clientConfig, {
    navigate: async (url) => {
      await sendRedirect(event, url, 302);
    },
    storage,
  });

  ////////////
  const m2mDiscoverUrl = `${logtoConfig.m2m.endpoint}/oidc/.well-known/openid-configuration`;
  const m2mDiscover = await Issuer.discover(m2mDiscoverUrl);
  event.context.m2mLogtoEndpoints = m2mDiscover.metadata as IssuerMetadata;
  const m2mLogto = new M2MClient(logtoConfig, m2mDiscover.metadata);

  if (url.pathname === pathnames.signIn) {
    console.log("signIn");
    await logto.signIn(new URL(pathnames.callback, url).href);
    return;
  }

  if (url.pathname === pathnames.signOut) {
    await logto.signOut(postLogoutRedirectUri);
    return;
  }

  if (url.pathname === pathnames.callback) {
    await logto.handleSignInCallback(url.href);
    await sendRedirect(event, postCallbackRedirectUri, 302);
    return;
  }

  // eslint-disable-next-line @silverhand/fp/no-mutation
  event.context.logtoClient = logto;
  await m2mLogto.setM2MToken();
  event.context.m2mLogtoClient = m2mLogto;

  // eslint-disable-next-line @silverhand/fp/no-mutation
  event.context.logtoUser = (await logto.isAuthenticated())
    ? await (fetchUserInfo
        ? await logto.fetchUserInfo()
        : logto.getIdTokenClaims())
    : undefined;
});

export class M2MClient {
  constructor(config: any, endpoints: IssuerMetadata) {
    this.config = config;
    this.endpoints = JSON.parse(JSON.stringify(endpoints)) as IssuerMetadata;
  }
  readonly config: any;
  readonly endpoints: IssuerMetadata;
  private fetchTokenTries = 0;
  private fetchTokenMaxTries = 3;
  private storage: M2MClientStorage = {
    accessToken: "",
    refreshToken: "",
  };

  async setM2MToken() {
    // fetch the token sending in the body data the grand_type, resource. and the authorization basic with the client_id and client_secret
    if (this.endpoints.token_endpoint) {
      return fetch(this.endpoints.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${this.config.m2m.appId}:${this.config.m2m.appSecret}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          resource: this.config.m2m.apiResource,
          scope: this.config.m2m.scope,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.storage.accessToken = data.access_token;
          if (data.refresh_token)
            this.storage.refreshToken = data.refresh_token;
          return data;
        });
    } else {
      throw new Error("Token endpoint is undefined.");
    }
  }

  async changePassword(userId: string, newPassword: string) {
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/;
    if (!newPassword || !regexPassword.test(newPassword)) {
      throw new Error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number."
      );
    }
    const request = await fetch(
      `${this.config.m2m.endpoint}/api/users/${userId}/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.storage.accessToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    if (request.ok) {
      this.fetchTokenTries = 0;
      return true;
    } else {
      if (request.status === 401 || request.status === 403) {
        if (this.fetchTokenTries <= this.fetchTokenMaxTries) {
          this.fetchTokenTries++;
          this.setM2MToken().then(() =>
            this.changePassword(userId, newPassword)
          );
        } else {
          throw new Error("Token is expired and can't be refreshed.");
        }
      }
    }
  }

  async verifyPassword(userId: string, password: string) {
    const request = await fetch(
      `${this.config.m2m.endpoint}/api/users/${userId}/password/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.storage.accessToken}`,
        },
        body: JSON.stringify({ password }),
      }
    );

    if (request.ok) {
      this.fetchTokenTries = 0;
      return true;
    } else {
      if (request.status === 401 || request.status === 403) {
        if (this.fetchTokenTries <= this.fetchTokenMaxTries) {
          this.fetchTokenTries++;
          this.setM2MToken().then(() => this.verifyPassword(userId, password));
        } else {
          throw new Error("Token is expired and can't be refreshed.");
        }
      } else if (request.status === 422) {
        this.fetchTokenTries = 0;
        return false;
      }
    }
  }

  async deleteUser(userId: string) {
    const request = await fetch(
      `${this.config.m2m.endpoint}/api/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.storage.accessToken}`,
        },
      }
    );

    if (request.ok) {
      this.fetchTokenTries = 0;
      return true;
    } else {
      if (request.status === 401 || request.status === 403) {
        if (this.fetchTokenTries <= this.fetchTokenMaxTries) {
          this.fetchTokenTries++;
          this.setM2MToken().then(() => this.deleteUser(userId));
        } else {
          throw new Error("Token is expired and can't be refreshed.");
        }
      }
    }
  }

  async updateUser(user: User) {
    // Validate each data of user
    const regexEmail = /^\S+@\S+\.\S+$/;
    const regexUsername = /^[A-Z_a-z]\w*$/;
    if (!user.id) {
      throw new Error("User ID is required.");
    }
    if (!user.primaryEmail || !regexEmail.test(user.primaryEmail)) {
      throw new Error("Invalid email.");
    }
    if (!user.username && !regexUsername.test(user.username)) {
      throw new Error("Invalid username.");
    }

    const request = await fetch(
      `${this.config.m2m.endpoint}/api/users/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.storage.accessToken}`,
        },
        body: JSON.stringify(user),
      }
    );

    if (request.ok) {
      this.fetchTokenTries = 0;
      const userResponse = await request.json();
      return {
        id: userResponse.id,
        primaryEmail: userResponse.primaryEmail,
        name: userResponse.name,
        username: userResponse.username,
        picture: userResponse.picture,
      } as User;
    } else {
      if (request.status === 401 || request.status === 403) {
        if (this.fetchTokenTries <= this.fetchTokenMaxTries) {
          this.fetchTokenTries++;
          this.setM2MToken().then(() => this.updateUser(user));
        } else {
          throw new Error("Token is expired and can't be refreshed.");
        }
      }
    }
  }
}

type M2MClientStorage = {
  accessToken: string;
  refreshToken: string;
};
