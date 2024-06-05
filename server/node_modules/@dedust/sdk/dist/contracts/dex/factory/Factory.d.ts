/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Contract, ContractProvider, Sender } from '@ton/core';
import { Pool, PoolType } from '../pool';
import { Asset } from '../common';
import { VaultJetton, VaultNative } from '../vault';
import { LiquidityDeposit } from '../liquidity-deposit';
export declare class Factory implements Contract {
    readonly address: Address;
    static readonly CREATE_VAULT = 567271467;
    static readonly CREATE_VOLATILE_POOL = 2547326767;
    protected constructor(address: Address);
    static createFromAddress(address: Address): Factory;
    sendCreateVault(provider: ContractProvider, via: Sender, { queryId, asset }: {
        queryId?: number | bigint;
        asset: Asset;
    }): Promise<void>;
    getVaultAddress(provider: ContractProvider, asset: Asset): Promise<Address>;
    getNativeVault(provider: ContractProvider): Promise<VaultNative>;
    getJettonVault(provider: ContractProvider, jettonRoot: Address): Promise<VaultJetton>;
    sendCreateVolatilePool(provider: ContractProvider, via: Sender, { queryId, assets }: {
        queryId?: number | bigint;
        assets: [Asset, Asset];
    }): Promise<void>;
    getPoolAddress(provider: ContractProvider, { poolType, assets, }: {
        poolType: PoolType;
        assets: [Asset, Asset];
    }): Promise<Address>;
    getPool(provider: ContractProvider, poolType: PoolType, assets: [Asset, Asset]): Promise<Pool>;
    getLiquidityDepositAddress(provider: ContractProvider, { ownerAddress, poolType, assets, }: {
        ownerAddress: Address;
        poolType: PoolType;
        assets: [Asset, Asset];
    }): Promise<Address>;
    getLiquidityDeposit(provider: ContractProvider, { ownerAddress, poolType, assets, }: {
        ownerAddress: Address;
        poolType: PoolType;
        assets: [Asset, Asset];
    }): Promise<LiquidityDeposit>;
}
