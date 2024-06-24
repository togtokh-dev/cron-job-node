import { axiosMasterLogger } from "axios-master";
import { AxiosRequestConfig } from "axios";
export type cronJobNodeDataT = {
  id: string;
  config: any | AxiosRequestConfig;
  job_time: string;
  status: boolean;
  type_name: "prod" | "staging" | "dev";
}[];
let host = "";
const main = async (data: cronJobNodeDataT, url?: string): Promise<boolean> => {
  try {
    const result = await axiosMasterLogger(
      {
        method: "POST",
        url: encodeURI(url || host),
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      },
      {
        name: "create-and-update",
      }
    );
    if (result) {
      return true;
    } else {
      console.log(result);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const setHost = (url: string): void => {
  host = url;
};
export default main;