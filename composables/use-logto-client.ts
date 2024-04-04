import type LogtoClient from "@logto/node";
import type { M2MClient } from "~/server/middleware/1.logto.global";
/**
 * Get the Logto client instance in the current context. Returns `undefined` if the client is not
 * available.
 *
 * Note: This composable only works in the server side and relies on the SSR context which is
 * filled by the Logto event handler.
 *
 * @returns The Logto client instance if available, otherwise `undefined`.
 *
 * @example
 * ```ts
 * const client = useLogtoClient();
 *
 * if (client) {
 *   const token = await client.getAccessToken();
 * }
 * ```
 */
export const useLogtoClient = () => {
  const nuxtApp = useNuxtApp();
  const client: unknown = nuxtApp.ssrContext?.event.context.logtoClient;
  // eslint-disable-next-line no-restricted-syntax -- `instanceof` doesn't work here (returns false)
  return client as LogtoClient | undefined;
};

export const useLogtoM2MClient = () => {
  const nuxtApp = useNuxtApp();
  const client: unknown = nuxtApp.ssrContext?.event.context.m2mLogtoClient;
  // eslint-disable-next-line no-restricted-syntax -- `instanceof` doesn't work here (returns false)
  return client as M2MClient | undefined;
};
