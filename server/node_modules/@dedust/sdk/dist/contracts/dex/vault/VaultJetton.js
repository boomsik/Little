"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultJetton = void 0;
const core_1 = require("@ton/core");
const Vault_1 = require("./Vault");
const common_1 = require("../common");
class VaultJetton extends Vault_1.Vault {
    address;
    static DEPOSIT_LIQUIDITY = 0x40e108d6;
    static SWAP = 0xe3a0d482;
    constructor(address) {
        super(address);
        this.address = address;
    }
    static createFromAddress(address) {
        return new VaultJetton(address);
    }
    async getReadinessStatus(provider) {
        const state = await provider.getState();
        if (state.state.type !== 'active') {
            return common_1.ReadinessStatus.NOT_DEPLOYED;
        }
        const { stack } = await provider.get('is_ready', []);
        return stack.readBoolean() ? common_1.ReadinessStatus.READY : common_1.ReadinessStatus.NOT_READY;
    }
    static createDepositLiquidityPayload({ poolType, assets, minimalLpAmount, targetBalances, fulfillPayload, rejectPayload, }) {
        return (0, core_1.beginCell)()
            .storeUint(VaultJetton.DEPOSIT_LIQUIDITY, 32)
            .storeUint(poolType, 1)
            .storeSlice(assets[0].toSlice())
            .storeSlice(assets[1].toSlice())
            .storeCoins(minimalLpAmount ?? 0)
            .storeCoins(targetBalances[0])
            .storeCoins(targetBalances[1])
            .storeMaybeRef(fulfillPayload)
            .storeMaybeRef(rejectPayload)
            .endCell();
    }
    static createSwapPayload({ poolAddress, limit, swapParams, next, }) {
        return (0, core_1.beginCell)()
            .storeUint(VaultJetton.SWAP, 32)
            .storeAddress(poolAddress)
            .storeUint(0, 1) // reserved
            .storeCoins(limit ?? 0)
            .storeMaybeRef(next ? Vault_1.Vault.packSwapStep(next) : null)
            .storeRef(Vault_1.Vault.packSwapParams(swapParams ?? {}))
            .endCell();
    }
}
exports.VaultJetton = VaultJetton;
//# sourceMappingURL=VaultJetton.js.map