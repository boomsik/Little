/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Cell, Contract, ContractProvider, Sender } from '@ton/core';
import { Asset, ReadinessStatus } from '../common';
import { PoolType } from '../pool';
export declare class LiquidityDeposit implements Contract {
    readonly address: Address;
    static readonly CANCEL_DEPOSIT = 376237550;
    protected constructor(address: Address);
    static createFromAddress(address: Address): LiquidityDeposit;
    getOwnerAddress(provider: ContractProvider): Promise<Address>;
    getPoolAddress(provider: ContractProvider): Promise<Address>;
    getPoolParams(provider: ContractProvider): Promise<{
        poolType: PoolType;
        assets: [Asset, Asset];
    }>;
    getTargetBalances(provider: ContractProvider): Promise<[bigint, bigint]>;
    getBalances(provider: ContractProvider): Promise<[bigint, bigint]>;
    getIsProcessing(provider: ContractProvider): Promise<boolean>;
    getMinimalLPAmount(provider: ContractProvider): Promise<bigint>;
    getReadinessStatus(provider: ContractProvider): Promise<ReadinessStatus>;
    sendCancelDeposit(provider: ContractProvider, via: Sender, { queryId, payload }: {
        queryId?: number | bigint;
        payload?: Cell | null;
    }): Promise<void>;
}
