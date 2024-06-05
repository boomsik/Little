/**
 * (C) Copyright 2023, Scaleton Labs LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Address, Cell, ContractProvider } from '@ton/core';
import { SwapParams, SwapStep, Vault } from './Vault';
import { Asset, ReadinessStatus } from '../common';
import { PoolType } from '../pool';
export declare class VaultJetton extends Vault {
    readonly address: Address;
    static readonly DEPOSIT_LIQUIDITY = 1088489686;
    static readonly SWAP = 3818968194;
    protected constructor(address: Address);
    static createFromAddress(address: Address): VaultJetton;
    getReadinessStatus(provider: ContractProvider): Promise<ReadinessStatus>;
    static createDepositLiquidityPayload({ poolType, assets, minimalLpAmount, targetBalances, fulfillPayload, rejectPayload, }: {
        poolType: PoolType;
        assets: [Asset, Asset];
        minimalLpAmount?: bigint;
        targetBalances: [bigint, bigint];
        fulfillPayload?: Cell | null;
        rejectPayload?: Cell | null;
    }): Cell;
    static createSwapPayload({ poolAddress, limit, swapParams, next, }: {
        poolAddress: Address;
        limit?: bigint;
        swapParams?: SwapParams;
        next?: SwapStep;
    }): Cell;
}
