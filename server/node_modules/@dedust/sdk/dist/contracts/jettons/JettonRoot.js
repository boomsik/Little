"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JettonRoot = void 0;
const core_1 = require("@ton/core");
const JettonWallet_1 = require("./JettonWallet");
class JettonRoot {
    address;
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new JettonRoot(address);
    }
    async getWalletAddress(provider, ownerAddress) {
        const result = await provider.get('get_wallet_address', [
            { type: 'slice', cell: (0, core_1.beginCell)().storeAddress(ownerAddress).endCell() },
        ]);
        return result.stack.readAddress();
    }
    async getWallet(provider, ownerAddress) {
        return JettonWallet_1.JettonWallet.createFromAddress(await this.getWalletAddress(provider, ownerAddress));
    }
    async getJettonData(provider) {
        const result = await provider.get('get_jetton_data', []);
        return {
            totalSupply: result.stack.readBigNumber(),
            isMintable: result.stack.readNumber() !== 0,
            adminAddress: result.stack.readAddressOpt(),
            content: result.stack.readCell(),
            walletCode: result.stack.readCell(),
        };
    }
}
exports.JettonRoot = JettonRoot;
//# sourceMappingURL=JettonRoot.js.map