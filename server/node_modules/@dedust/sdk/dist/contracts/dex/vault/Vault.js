"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vault = void 0;
const core_1 = require("@ton/core");
const common_1 = require("../common");
class Vault {
    address;
    constructor(address) {
        this.address = address;
    }
    async getAsset(provider) {
        const result = await provider.get('get_asset', []);
        return common_1.Asset.fromSlice(result.stack.readCell().asSlice());
    }
    static packSwapParams({ deadline, recipientAddress, referralAddress, fulfillPayload, rejectPayload, }) {
        return (0, core_1.beginCell)()
            .storeUint(deadline ?? 0, 32)
            .storeAddress(recipientAddress ?? null)
            .storeAddress(referralAddress ?? null)
            .storeMaybeRef(fulfillPayload)
            .storeMaybeRef(rejectPayload)
            .endCell();
    }
    static packSwapStep({ poolAddress, limit, next }) {
        return (0, core_1.beginCell)()
            .storeAddress(poolAddress)
            .storeUint(0, 1) // reserved
            .storeCoins(limit ?? 0n)
            .storeMaybeRef(next ? Vault.packSwapStep(next) : null)
            .endCell();
    }
}
exports.Vault = Vault;
//# sourceMappingURL=Vault.js.map