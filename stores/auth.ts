import type { UserInfoResponse } from "@logto/browser";
import { defineStore } from "pinia";
import type { User } from "~/utils/constants";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    loading: false,
    userData: {
      id: "",
      name: "",
      primaryEmail: "",
      picture: "",
      username: "",
    },
    accessToken: "",
    passwordVerified: 0,
  }),
  actions: {
    async storePasswordVerified(verified: number) {
      this.passwordVerified = verified;
    },
    setLoadingState(state: boolean) {
      this.loading = state;
    },
    async storeUserData(data: User | undefined) {
      const wtf = data;
      this.userData = {
        id: data?.id || "",
        name: data?.name || "",
        primaryEmail: data?.primaryEmail || "",
        picture: data?.picture || "",
        username: data?.username || "",
      };
    },
    async postUserChanges(currentData: any) {
      const response = await $fetch(`/api/user`, {
        method: "POST",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify(currentData),
      });
      return response;
    },

    async verifyPassword(password: string) {
      return $fetch(`/api/verifyPassword`, {
        method: "POST",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify({
          password,
        }),
      });
    },

    async deleteAccount(verificationText: string) {
      return $fetch(`/api/user`, {
        method: "DELETE",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify({ verificationText }),
      });
    },

    async postChangePassword(currentData: any) {
      if (!currentData.password) {
        throw new Error("Password is required.");
      }

      if (!currentData.confirmPassword) {
        throw new Error("Password confirmation is required.");
      }

      if (currentData.password !== currentData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      return $fetch(`/api/password`, {
        method: "POST",
        headers: useRequestHeaders(["cookie"]),
        body: JSON.stringify({
          password: currentData.password,
        }),
      });
    },
  },
});
