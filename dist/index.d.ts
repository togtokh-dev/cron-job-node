import { AxiosRequestConfig } from "axios";
export type cronJobNodeDataT = {
    id: string;
    config: any | AxiosRequestConfig;
    job_time: string;
    status: boolean;
    type_name: "prod" | "staging" | "dev";
}[];
declare const main: (data: cronJobNodeDataT, url?: string) => Promise<boolean>;
export declare const setHost: (url: string) => void;
export default main;
