"use strict";
/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
const core_1 = require("@ton/core");
const pool_1 = require("../pool");
const common_1 = require("../common");
const vault_1 = require("../vault");
const liquidity_deposit_1 = require("../liquidity-deposit");
class Factory {
    address;
    static CREATE_VAULT = 0x21cfe02b;
    static CREATE_VOLATILE_POOL = 0x97d51f2f;
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new Factory(address);
    }
    async sendCreateVault(provider, via, { queryId, asset }) {
        await provider.internal(via, {
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)()
                .storeUint(Factory.CREATE_VAULT, 32)
                .storeUint(queryId ?? 0, 64)
                .storeSlice(asset.toSlice())
                .endCell(),
            value: (0, core_1.toNano)('0.1'),
        });
    }
    async getVaultAddress(provider, asset) {
        const result = await provider.get('get_vault_address', [
            { type: 'slice', cell: asset.toSlice().asCell() },
        ]);
        return result.stack.readAddress();
    }
    async getNativeVault(provider) {
        const nativeVaultAddress = await this.getVaultAddress(provider, common_1.Asset.native());
        return vault_1.VaultNative.createFromAddress(nativeVaultAddress);
    }
    async getJettonVault(provider, jettonRoot) {
        const jettonVaultAddress = await this.getVaultAddress(provider, common_1.Asset.jetton(jettonRoot));
        return vault_1.VaultJetton.createFromAddress(jettonVaultAddress);
    }
    async sendCreateVolatilePool(provider, via, { queryId, assets }) {
        await provider.internal(via, {
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            body: (0, core_1.beginCell)()
                .storeUint(Factory.CREATE_VOLATILE_POOL, 32)
                .storeUint(queryId ?? 0, 64)
                .storeSlice(assets[0].toSlice())
                .storeSlice(assets[1].toSlice())
                .endCell(),
            value: (0, core_1.toNano)('0.25'),
        });
    }
    async getPoolAddress(provider, { poolType, assets, }) {
        const result = await provider.get('get_pool_address', [
            { type: 'int', value: BigInt(poolType) },
            { type: 'slice', cell: assets[0].toSlice().asCell() },
            { type: 'slice', cell: assets[1].toSlice().asCell() },
        ]);
        return result.stack.readAddress();
    }
    async getPool(provider, poolType, assets) {
        const poolAddress = await this.getPoolAddress(provider, {
            poolType,
            assets,
        });
        return pool_1.Pool.createFromAddress(poolAddress);
    }
    async getLiquidityDepositAddress(provider, { ownerAddress, poolType, assets, }) {
        const result = await provider.get('get_liquidity_deposit_address', [
            {
                type: 'slice',
                cell: (0, core_1.beginCell)().storeAddress(ownerAddress).asCell(),
            },
            { type: 'int', value: BigInt(poolType) },
            { type: 'slice', cell: assets[0].toSlice().asCell() },
            { type: 'slice', cell: assets[1].toSlice().asCell() },
        ]);
        return result.stack.readAddress();
    }
    async getLiquidityDeposit(provider, { ownerAddress, poolType, assets, }) {
        const liquidityDepositAddress = await this.getLiquidityDepositAddress(provider, {
            ownerAddress,
            poolType,
            assets,
        });
        return liquidity_deposit_1.LiquidityDeposit.createFromAddress(liquidityDepositAddress);
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map