"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = exports.setApiKey = exports.setHost = void 0;
const axios_1 = require("axios");
const https = require("https");
/* ------------------------------------------------------------------ */
/* Тохиргоо (модуль хэмжээнд)                                          */
/* ------------------------------------------------------------------ */
let host = "";
let apiKey = "";
let requestTimeout = 60_000;
/** Cron сервисийн host-ийг тохируулна. Ж: setHost("https://job.test.mn") */
const setHost = (url) => {
    host = url;
};
exports.setHost = setHost;
/**
 * API key тохируулна. Тохируулсан бол хүсэлт бүрд `x-api-key` header-ээр илгээнэ.
 * (Сервер талд API key заавал биш — хуучин хэрэглээ хэвээр ажиллана.)
 */
const setApiKey = (key) => {
    apiKey = key;
};
exports.setApiKey = setApiKey;
/** Host / apiKey / timeout-ийг нэг дор тохируулах туслах */
const configure = (opts) => {
    if (opts.host !== undefined)
        host = opts.host;
    if (opts.apiKey !== undefined)
        apiKey = opts.apiKey;
    if (opts.timeout !== undefined)
        requestTimeout = opts.timeout;
};
exports.configure = configure;
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
const main = async (data, url) => {
    try {
        const base = url || host;
        if (!base) {
            throw new Error("cron-job-node: host тохируулаагүй байна. setHost(url) эсвэл main(list, url) ашиглана уу.");
        }
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const headers = { "Content-Type": "application/json" };
        if (apiKey)
            headers["x-api-key"] = apiKey;
        const config = {
            httpsAgent,
            method: "POST",
            url: encodeURI(`${base}/cron-job/v1/list`),
            headers,
            timeout: requestTimeout,
            data: JSON.stringify(data)
        };
        const result = await (0, axios_1.default)(config);
        return Boolean(result) && result.status >= 200 && result.status < 300;
    }
    catch {
        return false;
    }
};
exports.default = main;
