/** The keys used to store the Logto state in `useState()`. */
export enum LogtoStateKey {
  /** The key used to store the Logto user information. */
  User = "logto.user",
}

export type User = {
  id: string;
  primaryEmail: string;
  name: string;
  username: string;
  picture: string;
};
