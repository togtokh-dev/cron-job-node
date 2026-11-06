import { AxiosRequestConfig } from "axios";
/**
 * Нэг хуваарьт ажлын тодорхойлолт.
 *
 * - `id`         — давтагдашгүй тэмдэглэгээ (дахин илгээвэл шинэчилнэ)
 * - `config`     — axios хүсэлтийн тохиргоо (method, url, headers, data, ...)
 * - `job_time`   — cron илэрхийлэл, ж: "* * * * *" (минут тутам)
 * - `status`     — идэвхтэй эсэх
 * - `type_name`  — орчин: "prod" | "staging" | "test" | "dev"
 * - `log_enabled`— (сонголт) гүйцэтгэлийн log бичих эсэх
 */
export type CronJobItem = {
    id: string;
    config: AxiosRequestConfig | Record<string, any>;
    job_time: string;
    status: boolean;
    type_name: "prod" | "staging" | "test" | "dev";
    log_enabled?: boolean;
};
/** Ажлуудын жагсаалт */
export type CronJobNodeData = CronJobItem[];
/** @deprecated — `CronJobNodeData` ашиглана уу. Хуучин нэр хэвээр ажиллана. */
export type cronJobNodeDataT = CronJobNodeData;
/** Cron сервисийн host-ийг тохируулна. Ж: setHost("https://job.test.mn") */
export declare const setHost: (url: string) => void;
/**
 * API key тохируулна. Тохируулсан бол хүсэлт бүрд `x-api-key` header-ээр илгээнэ.
 * (Сервер талд API key заавал биш — хуучин хэрэглээ хэвээр ажиллана.)
 */
export declare const setApiKey: (key: string) => void;
/** Host / apiKey / timeout-ийг нэг дор тохируулах туслах */
export declare const configure: (opts: {
    host?: string;
    apiKey?: string;
    timeout?: number;
}) => void;
/**
 * Ажлуудын жагсаалтыг cron сервис рүү илгээж бүртгэнэ/шинэчилнэ.
 *
 * Буцаалт: амжилттай (2xx) бол `true`, эс бөгөөс `false`
 * (хуучин хувилбартай нийцтэй).
 *
 * @param data Ажлуудын жагсаалт
 * @param url  (сонголт) host-ийг түр дарж илгээх хаяг
 */
declare const main: (data: CronJobNodeData, url?: string) => Promise<boolean>;
export default main;
