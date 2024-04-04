import axios from "axios";

type AxiosInstanceType = typeof AxiosInstance

export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
  }
}