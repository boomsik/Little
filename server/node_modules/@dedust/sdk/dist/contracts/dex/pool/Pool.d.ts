/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Contract, ContractProvider } from '@ton/core';
import { Asset, ReadinessStatus } from '../common';
import { PoolType } from './PoolType';
import { JettonWallet } from '../../jettons';
export declare class Pool implements Contract {
    readonly address: Address;
    protected constructor(address: Address);
    static createFromAddress(address: Address): Pool;
    getReadinessStatus(provider: ContractProvider): Promise<ReadinessStatus>;
    getPoolType(provider: ContractProvider): Promise<PoolType>;
    getAssets(provider: ContractProvider): Promise<[Asset, Asset]>;
    getEstimatedSwapOut(provider: ContractProvider, { assetIn, amountIn, }: {
        assetIn: Asset;
        amountIn: bigint;
    }): Promise<{
        assetOut: Asset;
        amountOut: bigint;
        tradeFee: bigint;
    }>;
    getEstimateDepositOut(provider: ContractProvider, amounts: [bigint, bigint]): Promise<{
        deposits: [bigint, bigint];
        fairSupply: bigint;
    }>;
    getReserves(provider: ContractProvider): Promise<[bigint, bigint]>;
    getTradeFee(provider: ContractProvider): Promise<number>;
    getWalletAddress(provider: ContractProvider, ownerAddress: Address): Promise<Address>;
    getWallet(provider: ContractProvider, ownerAddress: Address): Promise<JettonWallet>;
}
