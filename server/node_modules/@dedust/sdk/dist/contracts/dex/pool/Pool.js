"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const core_1 = require("@ton/core");
const common_1 = require("../common");
const jettons_1 = require("../../jettons");
class Pool {
    address;
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new Pool(address);
    }
    async getReadinessStatus(provider) {
        const state = await provider.getState();
        if (state.state.type !== 'active') {
            return common_1.ReadinessStatus.NOT_DEPLOYED;
        }
        const reserves = await this.getReserves(provider);
        return reserves[0] > 0n && reserves[1] > 0n ? common_1.ReadinessStatus.READY : common_1.ReadinessStatus.NOT_READY;
    }
    async getPoolType(provider) {
        const result = await provider.get('is_stable', []);
        return result.stack.readNumber();
    }
    async getAssets(provider) {
        const result = await provider.get('get_assets', []);
        return [
            common_1.Asset.fromSlice(result.stack.readCell().asSlice()),
            common_1.Asset.fromSlice(result.stack.readCell().asSlice()),
        ];
    }
    async getEstimatedSwapOut(provider, { assetIn, amountIn, }) {
        const result = await provider.get('estimate_swap_out', [
            {
                type: 'slice',
                cell: assetIn.toSlice().asCell(),
            },
            {
                type: 'int',
                value: amountIn,
            },
        ]);
        return {
            assetOut: common_1.Asset.fromSlice(result.stack.readCell().asSlice()),
            amountOut: result.stack.readBigNumber(),
            tradeFee: result.stack.readBigNumber(),
        };
    }
    async getEstimateDepositOut(provider, amounts) {
        const result = await provider.get('estimate_deposit_out', [
            {
                type: 'int',
                value: amounts[0],
            },
            {
                type: 'int',
                value: amounts[1],
            },
        ]);
        return {
            deposits: [result.stack.readBigNumber(), result.stack.readBigNumber()],
            fairSupply: result.stack.readBigNumber(),
        };
    }
    async getReserves(provider) {
        const result = await provider.get('get_reserves', []);
        return [result.stack.readBigNumber(), result.stack.readBigNumber()];
    }
    async getTradeFee(provider) {
        const result = await provider.get('get_trade_fee', []);
        const numerator = result.stack.readNumber();
        const denominator = result.stack.readNumber();
        return numerator / denominator;
    }
    async getWalletAddress(provider, ownerAddress) {
        const result = await provider.get('get_wallet_address', [
            { type: 'slice', cell: (0, core_1.beginCell)().storeAddress(ownerAddress).endCell() },
        ]);
        return result.stack.readAddress();
    }
    async getWallet(provider, ownerAddress) {
        return jettons_1.JettonWallet.createFromAddress(await this.getWalletAddress(provider, ownerAddress));
    }
}
exports.Pool = Pool;
//# sourceMappingURL=Pool.js.map