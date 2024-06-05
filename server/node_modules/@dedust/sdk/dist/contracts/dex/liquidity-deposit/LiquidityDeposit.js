"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityDeposit = void 0;
const core_1 = require("@ton/core");
const common_1 = require("../common");
class LiquidityDeposit {
    address;
    static CANCEL_DEPOSIT = 0x166cedee;
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new LiquidityDeposit(address);
    }
    async getOwnerAddress(provider) {
        const result = await provider.get('get_owner_addr', []);
        return result.stack.readAddress();
    }
    async getPoolAddress(provider) {
        const result = await provider.get('get_pool_addr', []);
        return result.stack.readAddress();
    }
    async getPoolParams(provider) {
        const result = await provider.get('get_pool_params', []);
        const poolType = result.stack.readNumber();
        const assets = [
            common_1.Asset.fromSlice(result.stack.readCell().asSlice()),
            common_1.Asset.fromSlice(result.stack.readCell().asSlice()),
        ];
        return {
            poolType,
            assets,
        };
    }
    async getTargetBalances(provider) {
        const result = await provider.get('get_target_balances', []);
        return [result.stack.readBigNumber(), result.stack.readBigNumber()];
    }
    async getBalances(provider) {
        const result = await provider.get('get_balances', []);
        return [result.stack.readBigNumber(), result.stack.readBigNumber()];
    }
    async getIsProcessing(provider) {
        const result = await provider.get('is_processing', []);
        return !!result.stack.readNumber();
    }
    async getMinimalLPAmount(provider) {
        const result = await provider.get('get_min_lp_amount', []);
        return result.stack.readBigNumber();
    }
    async getReadinessStatus(provider) {
        const state = await provider.getState();
        if (state.state.type !== 'active') {
            return common_1.ReadinessStatus.NOT_DEPLOYED;
        }
        return common_1.ReadinessStatus.READY;
    }
    async sendCancelDeposit(provider, via, { queryId, payload }) {
        await provider.internal(via, {
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)()
                .storeUint(LiquidityDeposit.CANCEL_DEPOSIT, 32)
                .storeUint(queryId ?? 0, 64)
                .storeMaybeRef(payload ?? null)
                .endCell(),
            value: (0, core_1.toNano)('0.5'),
        });
    }
}
exports.LiquidityDeposit = LiquidityDeposit;
//# sourceMappingURL=LiquidityDeposit.js.map