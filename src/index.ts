import axios, { AxiosRequestConfig } from "axios";
import * as https from "https";

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
  // хуучин хэрэглэгчидтэй нийцүүлэхийн тулд сул төрөл
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/* ------------------------------------------------------------------ */
/* Тохиргоо (модуль хэмжээнд)                                          */
/* ------------------------------------------------------------------ */

let host = "";
let apiKey = "";
let requestTimeout = 60_000;

/** Cron сервисийн host-ийг тохируулна. Ж: setHost("https://job.test.mn") */
export const setHost = (url: string): void => {
  host = url;
};

/**
 * API key тохируулна. Тохируулсан бол хүсэлт бүрд `x-api-key` header-ээр илгээнэ.
 * (Сервер талд API key заавал биш — хуучин хэрэглээ хэвээр ажиллана.)
 */
export const setApiKey = (key: string): void => {
  apiKey = key;
};

/** Host / apiKey / timeout-ийг нэг дор тохируулах туслах */
export const configure = (opts: {
  host?: string;
  apiKey?: string;
  timeout?: number;
}): void => {
  if (opts.host !== undefined) host = opts.host;
  if (opts.apiKey !== undefined) apiKey = opts.apiKey;
  if (opts.timeout !== undefined) requestTimeout = opts.timeout;
};

/* ------------------------------------------------------------------ */
/* Үндсэн функц                                                       */
/* ------------------------------------------------------------------ */

/**
 * Ажлуудын жагсаалтыг cron сервис рүү илгээж бүртгэнэ/шинэчилнэ.
 *
 * Буцаалт: амжилттай (2xx) бол `true`, эс бөгөөс `false`
 * (хуучин хувилбартай нийцтэй).
 *
 * @param data Ажлуудын жагсаалт
 * @param url  (сонголт) host-ийг түр дарж илгээх хаяг
 */
const main = async (data: CronJobNodeData, url?: string): Promise<boolean> => {
  try {
    const base = url || host;
    if (!base) {
      throw new Error(
        "cron-job-node: host тохируулаагүй байна. setHost(url) эсвэл main(list, url) ашиглана уу."
      );
    }

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers["x-api-key"] = apiKey;

    const config: AxiosRequestConfig = {
      httpsAgent,
      method: "POST",
      url: encodeURI(`${base}/cron-job/v1/list`),
      headers,
      timeout: requestTimeout,
      data: JSON.stringify(data)
    };

    const result = await axios(config);
    return Boolean(result) && result.status >= 200 && result.status < 300;
  } catch {
    return false;
  }
};

export default main;
