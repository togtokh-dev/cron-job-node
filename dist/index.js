"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHost = void 0;
const axios_master_1 = require("axios-master");
let host = "";
const main = async (data, url) => {
    try {
        const result = await (0, axios_master_1.axiosMasterLogger)({
            method: "POST",
            url: encodeURI(`${url || host}/cron-job/v1/list`),
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        }, {
            name: "create-and-update",
        });
        if (result) {
            return true;
        }
        else {
            console.log(result);
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
const setHost = (url) => {
    host = url;
};
exports.setHost = setHost;
exports.default = main;
