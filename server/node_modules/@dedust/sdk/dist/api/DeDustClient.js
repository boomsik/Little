"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeDustClient = void 0;
const constants_1 = require("../constants");
const axios_1 = __importDefault(require("axios"));
const DEFAULT_TIMEOUT = 30000;
class DeDustClient {
    httpClient;
    constructor({ endpointUrl = constants_1.MAINNET_API_URL, timeout, }) {
        this.httpClient = axios_1.default.create({
            baseURL: endpointUrl,
            timeout: timeout ?? DEFAULT_TIMEOUT,
        });
    }
    async getAccountAssets(accountAddress) {
        const { data } = await this.httpClient.get(`/v2/accounts/${accountAddress.toString({ urlSafe: true })}/assets`);
        return data;
    }
    async getPools() {
        const { data } = await this.httpClient.get('/v2/pools');
        return data;
    }
    async getPoolTrades(poolAddress, { afterLT, pageSize } = {}) {
        const { data } = await this.httpClient.get(`/v2/pools/${poolAddress.toString({ urlSafe: true })}/trades`, {
            params: {
                page_size: pageSize,
                after_lt: afterLT,
            },
        });
        return data;
    }
}
exports.DeDustClient = DeDustClient;
//# sourceMappingURL=DeDustClient.js.map